import { UploadCloud, Sparkles, Crop, SlidersHorizontal, ImageMinus } from 'lucide-react';

export default function ToolsView({ setView }: { setView: (v: string) => void }) {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col pb-24 md:pb-20">
      <div className="mb-6 md:mb-10">
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-slate-800">Image Editing Tools</h1>
      </div>

      <div onClick={() => setView('editor')} className="mb-8 md:mb-10 border-2 border-dashed border-purple-300 rounded-2xl md:rounded-[32px] p-6 md:p-12 text-center cursor-pointer hover:bg-white/50 bg-white/30 backdrop-blur-sm min-h-[200px] flex flex-col items-center justify-center">
        <UploadCloud size={32} className="text-purple-600 mb-4" />
        <h3 className="font-headline text-lg md:text-xl font-bold text-slate-800">Drag & drop an image here</h3>
        <p className="text-slate-500 text-sm md:text-base">or click to browse files.</p>
      </div>

      {/* Grid: 1 col mobile, 2 col tablet, 3-4 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: <Sparkles />, title: 'AI Upscaler' },
          { icon: <Crop />, title: 'Crop & Resize' },
          { icon: <SlidersHorizontal />, title: 'Color Grading' },
          { icon: <ImageMinus />, title: 'Remove BG' }
        ].map((item, idx) => (
          <div key={idx} onClick={() => setView('editor')} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0">
            <div className="text-purple-600 sm:mb-4 bg-purple-50 p-3 rounded-xl">{item.icon}</div>
            <h4 className="font-headline font-bold text-slate-800">{item.title}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}
