import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Scissors, Volume2, Save, Upload } from 'lucide-react';

interface AudioEditorViewProps {
  setView: (view: string) => void;
}

export default function AudioEditorView({ setView }: AudioEditorViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (containerRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#c285ff',
        progressColor: '#8319da',
        cursorColor: '#8319da',
        barWidth: 2,
        barRadius: 3,
        height: 200,
      });

      wavesurferRef.current.on('play', () => setIsPlaying(true));
      wavesurferRef.current.on('pause', () => setIsPlaying(false));
    }

    return () => {
      wavesurferRef.current?.destroy();
      wavesurferRef.current = null;
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && wavesurferRef.current) {
      wavesurferRef.current.loadBlob(file);
    }
  };

  const togglePlay = () => wavesurferRef.current?.playPause();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Audio Master</h1>
          <p className="text-slate-500 mt-1">Professional audio mastering and visualization.</p>
        </div>
        <label className="flex items-center gap-2 px-5 py-2.5 bg-[#8319da] text-white rounded-xl text-sm font-bold cursor-pointer hover:bg-[#7215bc] transition-all">
          <Upload size={18} /> Import Audio
          <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-white relative overflow-hidden">
        <div ref={containerRef} className="w-full" />
        
        <div className="mt-8 flex items-center justify-center gap-6">
          <button 
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center bg-[#8319da] text-white rounded-full hover:scale-105 transition-all shadow-lg shadow-purple-200"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             <Volume2 size={12} /> Master Volume
           </p>
           <input 
             type="range" 
             min="0" max="1" step="0.1" 
             value={volume}
             onChange={(e) => {
               const v = parseFloat(e.target.value);
               setVolume(v);
               wavesurferRef.current?.setVolume(v);
             }}
             className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#a052e6]" 
           />
        </div>
        
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             <Scissors size={12} /> Quick Trim
           </p>
           <button className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
             Trim Selection
           </button>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
             <Save size={12} /> AI Mastering
           </p>
           <button className="w-full py-2 bg-[#8319da] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all">
             Apply AI Magic
           </button>
        </div>
      </div>
    </div>
  );
}
