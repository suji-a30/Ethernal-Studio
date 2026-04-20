import { Undo, Redo, Upload, Download, Maximize, Palette, Focus, PanelRightClose, PanelRightOpen, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as fabric from 'fabric';
import { useDropzone } from 'react-dropzone';
import { useCanvasStore } from '../store/canvasStore';
import { saveAs } from 'file-saver';
import { removeBackground } from '@imgly/background-removal';

export default function EditorView() {
  const [opacity, setOpacity] = useState(100);
  const [blendMode, setBlendMode] = useState('normal');
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [showProperties, setShowProperties] = useState(true);
  const [isCropping, setIsCropping] = useState(false);
  const cropRectRef = useRef<fabric.Rect | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvas, canvas, setTriggerUpload, activeObject, isDrawingMode, setDrawingMode } = useCanvasStore();

  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: size.w,
        height: size.h,
        backgroundColor: '#ffffff',
      });
      setCanvas(fabricCanvas);
    }

    return () => {
      if (canvas) {
        canvas.dispose();
        setCanvas(null);
      }
    };
  }, [canvasRef, size.w, size.h]);

  useEffect(() => {
    if (canvas) {
      canvas.setDimensions({ width: size.w, height: size.h });
      canvas.renderAll();
    }
  }, [size, canvas]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (f) => {
        const data = f.target?.result as string;
        fabric.FabricImage.fromURL(data).then((img) => {
          img.scaleToWidth(canvas.width! / 2);
          canvas.add(img);
          canvas.centerObject(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        });
      };
      reader.readAsDataURL(file);
    }
  }, [canvas]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ 
    onDrop,
    noClick: true,
    multiple: false,
    accept: { 'image/*': [] }
  } as any);

  useEffect(() => {
    setTriggerUpload(open);
  }, [open]);

  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleRemoveBackground = async () => {
    if (!activeObject || activeObject.type !== 'image' || !canvas) return;
    
    setIsProcessing(true);
    try {
      const img = activeObject as fabric.FabricImage;
      const dataUrl = img.toDataURL();
      const blob = await (await fetch(dataUrl)).blob();
      
      const resultBlob = await removeBackground(blob);
      const url = URL.createObjectURL(resultBlob);
      
      fabric.FabricImage.fromURL(url).then((newImg) => {
        newImg.set({
          left: img.left,
          top: img.top,
          scaleX: img.scaleX,
          scaleY: img.scaleY,
        });
        canvas.remove(img);
        canvas.add(newImg);
        canvas.setActiveObject(newImg);
        canvas.renderAll();
        setIsProcessing(false);
      });
    } catch (err) {
      console.error("BG Removal failed:", err);
      setIsProcessing(false);
    }
  };

  const startCrop = () => {
    if (!activeObject || activeObject.type !== 'image' || !canvas) return;
    setIsCropping(true);
    
    const img = activeObject as fabric.FabricImage;
    const rect = new fabric.Rect({
      left: img.left,
      top: img.top,
      width: img.getScaledWidth(),
      height: img.getScaledHeight(),
      fill: 'rgba(0,0,0,0.3)',
      stroke: '#8319da',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      cornerColor: '#8319da',
      cornerSize: 10,
      transparentCorners: false,
    });
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    cropRectRef.current = rect;
    canvas.renderAll();
  };

  const confirmCrop = () => {
    if (!canvas || !activeObject || activeObject.type !== 'image' || !cropRectRef.current) return;
    
    const img = activeObject as fabric.FabricImage;
    const rect = cropRectRef.current;
    
    // Calculate relative crop coordinates
    const scaleX = img.scaleX || 1;
    const scaleY = img.scaleY || 1;
    
    const relativeLeft = (rect.left! - img.left!) / scaleX;
    const relativeTop = (rect.top! - img.top!) / scaleY;
    const relativeWidth = rect.getScaledWidth() / scaleX;
    const relativeHeight = rect.getScaledHeight() / scaleY;
    
    img.set({
      cropX: (img.cropX || 0) + relativeLeft,
      cropY: (img.cropY || 0) + relativeTop,
      width: relativeWidth,
      height: relativeHeight
    });
    
    canvas.remove(rect);
    cropRectRef.current = null;
    setIsCropping(false);
    canvas.renderAll();
  };

  const handleMagicEnhance = async () => {
    if (!activeObject || activeObject.type !== 'image' || !canvas) return;
    
    try {
      const img = activeObject as fabric.FabricImage;
      const dataUrl = img.toDataURL({ format: 'png' });
      
      const { enhanceImageWithAI } = await import('../services/aiService');
      const analysis = await enhanceImageWithAI(dataUrl);
      
      alert("AI Analysis Complete: " + analysis.substring(0, 200) + "...");
      
      // For now, we apply a "Magic" filter combo
      img.filters = [
        new fabric.filters.Brightness({ brightness: 0.1 }),
        new fabric.filters.Contrast({ contrast: 0.15 })
      ];
      img.applyFilters();
      canvas.renderAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-1 h-full relative overflow-hidden" {...getRootProps()}>
      <input {...getInputProps()} />
      
      {/* Canvas Area */}
      <main className="flex-1 bg-slate-100 p-4 md:p-8 flex items-center justify-center overflow-auto relative">
        {isProcessing && (
           <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex items-center justify-center">
             <div className="flex flex-col items-center">
               <Loader2 size={48} className="text-[#8319da] animate-spin mb-4" />
               <p className="text-xl font-bold text-slate-800">Processing AI Model...</p>
               <p className="text-sm text-slate-500">Removing background. This may take a few seconds.</p>
             </div>
           </div>
        )}
        {isDragActive && (
          <div className="absolute inset-0 z-50 bg-[#8319da]/10 backdrop-blur-sm flex items-center justify-center border-4 border-dashed border-[#8319da]">
            <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center animate-bounce">
              <ImageIcon size={48} className="text-[#8319da] mb-4" />
              <p className="text-xl font-bold text-[#8319da]">Drop image to edit</p>
            </div>
          </div>
        )}
        
        <div className="shadow-2xl rounded-sm overflow-hidden bg-white">
          <canvas ref={canvasRef} />
        </div>
      </main>

      {/* Properties Panel (Collapsible) */}
      <aside className={`bg-white border-l transition-all duration-300 absolute md:relative right-0 top-0 h-full w-[280px] z-20 ${showProperties ? 'translate-x-0' : 'translate-x-full md:w-0 md:border-l-0'}`}>
        <button className="absolute -left-10 top-4 p-2 bg-white rounded-l-lg shadow-sm border border-r-0 border-slate-200" onClick={() => setShowProperties(!showProperties)}>
            {showProperties ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
        </button>
        <div className="p-6 overflow-y-auto h-full">
            <h3 className="font-headline font-bold text-lg mb-6 text-slate-800">Canvas Properties</h3>
            <div className="space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 font-semibold text-[13px] uppercase tracking-wider text-slate-400">
                        <Maximize size={14} /> Dimensions
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-500 font-medium">Width</label>
                          <input type="number" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all" value={size.w} onChange={e => setSize({...size, w: parseInt(e.target.value) || 0})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] text-slate-500 font-medium">Height</label>
                          <input type="number" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all" value={size.h} onChange={e => setSize({...size, h: parseInt(e.target.value) || 0})} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 font-semibold text-[13px] uppercase tracking-wider text-slate-400">
                        <Palette size={14} /> Background
                    </div>
                    <div className="flex gap-2">
                       {[ '#ffffff', '#000000', '#f1f5f9', '#8319da' ].map(color => (
                         <button 
                           key={color}
                           onClick={() => {
                             if (canvas) {
                               canvas.backgroundColor = color;
                               canvas.renderAll();
                             }
                           }}
                           className="w-8 h-8 rounded-full border border-slate-200 shadow-sm transition-transform hover:scale-110 active:scale-95"
                           style={{ backgroundColor: color }}
                         />
                       ))}
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-2 font-semibold text-[13px] uppercase tracking-wider text-slate-400">
                        <Palette size={14} /> Global Styling
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-slate-600 font-medium">Canvas Opacity</label>
                        <span className="text-[11px] font-bold text-slate-400">{opacity}%</span>
                      </div>
                      <input type="range" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#a052e6]" min="0" max="100" value={opacity} onChange={e => setOpacity(parseInt(e.target.value))} />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs text-slate-600 font-medium">Global Blend Mode</label>
                      <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all" value={blendMode} onChange={e => setBlendMode(e.target.value)}>
                          <option value="normal">Normal</option>
                          <option value="multiply">Multiply</option>
                          <option value="screen">Screen</option>
                          <option value="overlay">Overlay</option>
                      </select>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-2 font-semibold text-[13px] uppercase tracking-wider text-slate-400">
                        <Focus size={14} /> {activeObject ? 'Layer Properties' : 'Active Layer'}
                    </div>
                    {activeObject ? (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-600 font-medium">Brightness</label>
                          <input 
                            type="range" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#a052e6]" 
                            min="-1" max="1" step="0.01" defaultValue="0" 
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (activeObject && activeObject.type === 'image') {
                                const img = activeObject as fabric.FabricImage;
                                let brightnessFilter = img.filters.find(f => f.type === 'Brightness') as any;
                                if (!brightnessFilter) {
                                  brightnessFilter = new fabric.filters.Brightness({ brightness: val });
                                  img.filters.push(brightnessFilter);
                                } else {
                                  brightnessFilter.brightness = val;
                                }
                                img.applyFilters();
                                canvas?.renderAll();
                              }
                            }} 
                          />
                        </div>

                        {activeObject.type === 'i-text' && (
                          <div className="space-y-4 pt-4 border-t border-slate-100">
                             <div className="space-y-1">
                               <label className="text-xs text-slate-600 font-medium">Font Family</label>
                               <select 
                                 className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                                 onChange={(e) => {
                                   if (activeObject) {
                                      (activeObject as any).set('fontFamily', e.target.value);
                                      canvas?.renderAll();
                                   }
                                 }}
                               >
                                 <option value="Inter">Inter (Sans)</option>
                                 <option value="Roboto">Roboto</option>
                                 <option value="Playfair Display">Playfair Display (Serif)</option>
                                 <option value="Courier New">Courier New (Mono)</option>
                               </select>
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs text-slate-600 font-medium">Text Color</label>
                                <div className="flex gap-2">
                                   {['#333333', '#ffffff', '#8319da', '#ef4444', '#10b981'].map(color => (
                                     <button 
                                       key={color}
                                       onClick={() => {
                                         if (activeObject) {
                                           (activeObject as any).set('fill', color);
                                           canvas?.renderAll();
                                         }
                                       }}
                                       className="w-6 h-6 rounded-full border border-slate-200"
                                       style={{ backgroundColor: color }}
                                     />
                                   ))}
                                </div>
                             </div>
                          </div>
                        )}
                        <div className="space-y-1">
                          <label className="text-xs text-slate-600 font-medium">Contrast</label>
                          <input 
                            type="range" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#a052e6]" 
                            min="-1" max="1" step="0.01" defaultValue="0" 
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (activeObject && activeObject.type === 'image') {
                                const img = activeObject as fabric.FabricImage;
                                let contrastFilter = img.filters.find(f => f.type === 'Contrast') as any;
                                if (!contrastFilter) {
                                  contrastFilter = new fabric.filters.Contrast({ contrast: val });
                                  img.filters.push(contrastFilter);
                                } else {
                                  contrastFilter.contrast = val;
                                }
                                img.applyFilters();
                                canvas?.renderAll();
                              }
                            }} 
                          />
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Presets</p>
                          <div className="grid grid-cols-3 gap-2">
                             <button 
                               onClick={() => {
                                 if (activeObject && activeObject.type === 'image') {
                                   const img = activeObject as fabric.FabricImage;
                                   img.filters = [new fabric.filters.Grayscale()];
                                   img.applyFilters();
                                   canvas?.renderAll();
                                 }
                               }}
                               className="py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold hover:bg-slate-100 transition-all"
                             >BW</button>
                             <button 
                               onClick={() => {
                                 if (activeObject && activeObject.type === 'image') {
                                   const img = activeObject as fabric.FabricImage;
                                   img.filters = [new fabric.filters.Sepia()];
                                   img.applyFilters();
                                   canvas?.renderAll();
                                 }
                               }}
                               className="py-2 bg-[#fdf6e3] border border-[#eee8d5] text-[#b58900] rounded-lg text-[10px] font-bold hover:bg-opacity-80 transition-all"
                             >Sepia</button>
                             <button 
                               onClick={() => {
                                 if (activeObject && activeObject.type === 'image') {
                                   const img = activeObject as fabric.FabricImage;
                                   img.filters = [new fabric.filters.Invert()];
                                   img.applyFilters();
                                   canvas?.renderAll();
                                 }
                               }}
                               className="py-2 bg-black text-white rounded-lg text-[10px] font-bold hover:bg-opacity-80 transition-all"
                             >Invert</button>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex gap-2">
                           {!isCropping ? (
                             <button 
                               onClick={startCrop}
                               className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                             >
                               Crop Image
                             </button>
                           ) : (
                             <button 
                               onClick={confirmCrop}
                               className="flex-1 py-2.5 bg-[#8319da] text-white rounded-xl text-xs font-bold hover:bg-[#7215bc] transition-colors"
                             >
                               Confirm Crop
                             </button>
                           )}
                        </div>
                        
                        <div className="pt-2 border-t border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">AI Magic Filters</p>
                          <div className="grid grid-cols-2 gap-2">
                             <button 
                               onClick={handleRemoveBackground}
                               className="py-2.5 bg-purple-50 text-purple-700 rounded-xl text-[11px] font-bold hover:bg-purple-100 transition-colors flex flex-col items-center gap-1"
                             >
                                <Zap size={14} /> Remove BG
                             </button>
                             <button 
                               onClick={handleMagicEnhance}
                               className="py-2.5 bg-blue-50 text-blue-700 rounded-xl text-[11px] font-bold hover:bg-blue-100 transition-colors flex flex-col items-center gap-1"
                             >
                                <Zap size={14} /> Magic Enhance
                             </button>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            if (activeObject) {
                              canvas?.remove(activeObject);
                              canvas?.discardActiveObject();
                              canvas?.renderAll();
                            }
                          }}
                          className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors mt-2"
                        >
                          Delete Layer
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                          <p className="text-[11px] text-slate-400">Select an object on the canvas to edit its properties.</p>
                        </div>
                        
                        <div className="space-y-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add Elements</p>
                          <div className="grid grid-cols-2 gap-3">
                            <button 
                              onClick={() => useCanvasStore.getState().addText('New Design')}
                              className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-purple-300 hover:bg-purple-50 transition-all group"
                            >
                              <ImageIcon size={20} className="text-slate-400 group-hover:text-purple-500 mb-2" />
                              <span className="text-xs font-semibold text-slate-600">Add Text</span>
                            </button>
                            <button 
                              onClick={() => {
                                const circle = new fabric.Circle({ radius: 50, fill: '#8319da', left: 100, top: 100 });
                                canvas?.add(circle);
                                canvas?.setActiveObject(circle);
                                canvas?.renderAll();
                              }}
                              className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-purple-300 hover:bg-purple-50 transition-all group"
                            >
                              <Focus size={20} className="text-slate-400 group-hover:text-purple-500 mb-2" />
                              <span className="text-xs font-semibold text-slate-600">Add Shape</span>
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => setDrawingMode(!isDrawingMode)}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${isDrawingMode ? 'bg-[#8319da] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                          >
                            <PenTool size={14} /> {isDrawingMode ? 'Drawing (Click to Stop)' : 'Brush Tool'}
                          </button>
                          
                          {isDrawingMode && (
                            <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
                               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brush Size</label>
                               <input 
                                 type="range" 
                                 min="1" max="50" 
                                 defaultValue="5"
                                 onChange={(e) => {
                                   if (canvas && canvas.freeDrawingBrush) {
                                     canvas.freeDrawingBrush.width = parseInt(e.target.value);
                                   }
                                 }}
                                 className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#a052e6]" 
                               />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>
            </div>
        </div>
      </aside>
    </div>
  )
}

