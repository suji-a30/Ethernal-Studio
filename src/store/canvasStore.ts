import { create } from 'zustand';
import * as fabric from 'fabric';
import { saveAs } from 'file-saver';

interface CanvasState {
  canvas: fabric.Canvas | null;
  activeObject: fabric.FabricObject | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  setActiveObject: (obj: fabric.FabricObject | null) => void;
  isDrawingMode: boolean;
  setDrawingMode: (mode: boolean) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  download: () => void;
  triggerUpload: () => void;
  setTriggerUpload: (fn: () => void) => void;
  addText: (text: string) => void;
  setFontFamily: (font: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => {
  const historyLimit = 20;
  let historyPath: string[] = [];
  let historyIndex = -1;

  const saveHistory = () => {
    const canvas = get().canvas;
    if (!canvas) return;

    const json = JSON.stringify(canvas.toJSON());
    if (historyPath[historyIndex] === json) return;

    // Save to persistence
    localStorage.setItem('ethereal-project-current', json);

    // Cut off future if we're in the middle of history and make a new change
    historyPath = historyPath.slice(0, historyIndex + 1);
    historyPath.push(json);

    if (historyPath.length > historyLimit) {
      historyPath.shift();
    } else {
      historyIndex++;
    }
  };

  return {
    canvas: null,
    activeObject: null,
    setCanvas: (canvas) => {
      set({ canvas });
      if (canvas) {
        canvas.on('object:added', saveHistory);
        canvas.on('object:modified', saveHistory);
        canvas.on('object:removed', saveHistory);
        
        canvas.on('selection:created', (e) => set({ activeObject: e.selected[0] }));
        canvas.on('selection:updated', (e) => set({ activeObject: e.selected[0] }));
        canvas.on('selection:cleared', () => set({ activeObject: null }));

        // Initial state & Load persistence
        const saved = localStorage.getItem('ethereal-project-current');
        if (saved) {
          canvas.loadFromJSON(JSON.parse(saved)).then(() => {
            canvas.renderAll();
            const json = JSON.stringify(canvas.toJSON());
            historyPath = [json];
            historyIndex = 0;
          });
        } else {
          const json = JSON.stringify(canvas.toJSON());
          historyPath = [json];
          historyIndex = 0;
        }
      }
    },
    setActiveObject: (activeObject) => set({ activeObject }),
    isDrawingMode: false,
    setDrawingMode: (isDrawingMode) => {
      const canvas = get().canvas;
      if (canvas) {
        canvas.isDrawingMode = isDrawingMode;
        if (isDrawingMode) {
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
          canvas.freeDrawingBrush.width = 5;
          canvas.freeDrawingBrush.color = '#8319da';
        }
      }
      set({ isDrawingMode });
    },
    triggerUpload: () => {},
    setTriggerUpload: (triggerUpload) => set({ triggerUpload }),
    undo: () => {
      const canvas = get().canvas;
      if (canvas && historyIndex > 0) {
        historyIndex--;
        canvas.loadFromJSON(JSON.parse(historyPath[historyIndex])).then(() => {
          canvas.renderAll();
        });
      }
    },
    redo: () => {
      const canvas = get().canvas;
      if (canvas && historyIndex < historyPath.length - 1) {
        historyIndex++;
        canvas.loadFromJSON(JSON.parse(historyPath[historyIndex])).then(() => {
          canvas.renderAll();
        });
      }
    },
    clear: () => {
      const canvas = get().canvas;
      if (canvas) {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
        saveHistory();
      }
    },
    download: () => {
      const canvas = get().canvas;
      if (canvas) {
        const dataURL = canvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 1
        });
        saveAs(dataURL, 'ethereal-studio-export.png');
      }
    },
    addText: (text) => {
      const canvas = get().canvas;
      if (canvas) {
        const textObj = new fabric.IText(text, {
          left: canvas.width! / 2,
          top: canvas.height! / 2,
          fontSize: 60,
          fontFamily: 'Inter',
          fill: '#333333',
        });
        canvas.add(textObj);
        canvas.centerObject(textObj);
        canvas.setActiveObject(textObj);
        canvas.renderAll();
      }
    },
    setFontFamily: (font) => {
      const { canvas, activeObject } = get();
      if (activeObject && 'fontFamily' in activeObject) {
         (activeObject as any).set('fontFamily', font);
         canvas?.renderAll();
      }
    },
    isDarkMode: localStorage.getItem('ethereal-dark') === 'true',
    toggleDarkMode: () => {
      const newMode = !get().isDarkMode;
      set({ isDarkMode: newMode });
      localStorage.setItem('ethereal-dark', String(newMode));
      document.body.classList.toggle('is-dark', newMode);
    }
  };
});

