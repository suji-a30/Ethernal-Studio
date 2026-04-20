import { Undo, Redo, Upload, Download, Maximize, Palette, Focus, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useState } from 'react';

export default function EditorView() {
  const [opacity, setOpacity] = useState(100);
  const [blendMode, setBlendMode] = useState('normal');
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [showProperties, setShowProperties] = useState(true);
  
  return (
    <div className="flex flex-1 h-full relative overflow-hidden">
      {/* Canvas Area */}
      <main className="flex-1 bg-slate-100 p-4 md:p-8 flex items-center justify-center overflow-auto">
        <div 
            className="bg-white rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden transition-all duration-300"
            style={{ 
                width: Math.min(size.w / 2, 400), 
                height: Math.min(size.h / 2, 300), 
                opacity: opacity / 100,
                mixBlendMode: blendMode as any
            }}
        >
            <span className="text-slate-400 font-headline font-bold">Canvas</span>
        </div>
      </main>

      {/* Properties Panel (Collapsible) */}
      <aside className={`bg-white border-l transition-all duration-300 absolute md:relative right-0 top-0 h-full w-[280px] z-20 ${showProperties ? 'translate-x-0' : 'translate-x-full md:w-0 md:border-l-0'}`}>
        <button className="absolute -left-10 top-4 p-2 bg-white rounded-l-lg shadow-sm" onClick={() => setShowProperties(!showProperties)}>
            {showProperties ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
        </button>
        <div className="p-6 overflow-y-auto h-full">
            <h3 className="font-headline font-bold text-lg mb-6">Properties</h3>
            <div className="space-y-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 font-semibold text-sm text-slate-700">
                        <Maximize size={16} /> Size
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input type="number" className="p-2 border rounded-md text-sm" value={size.w} onChange={e => setSize({...size, w: parseInt(e.target.value)})} placeholder="Width" />
                        <input type="number" className="p-2 border rounded-md text-sm" value={size.h} onChange={e => setSize({...size, h: parseInt(e.target.value)})} placeholder="Height" />
                    </div>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-center gap-2 font-semibold text-sm text-slate-700">
                        <Palette size={16} /> Appearance
                    </div>
                    <label className="text-xs text-slate-500">Opacity: {opacity}%</label>
                    <input type="range" className="w-full" min="0" max="100" value={opacity} onChange={e => setOpacity(parseInt(e.target.value))} />
                    
                    <label className="text-xs text-slate-500">Blend Mode</label>
                    <select className="w-full p-2 border rounded-md text-sm" value={blendMode} onChange={e => setBlendMode(e.target.value)}>
                        <option value="normal">Normal</option>
                        <option value="multiply">Multiply</option>
                        <option value="screen">Screen</option>
                    </select>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-center gap-2 font-semibold text-sm text-slate-700">
                        <Focus size={16} /> Effects
                    </div>
                    <p className="text-xs text-slate-500">No effects active.</p>
                </div>
            </div>
        </div>
      </aside>
    </div>
  )
}
