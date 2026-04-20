import { Image as ImageIcon, PenTool, Type, Mic, ArrowRight } from 'lucide-react';

export default function HomeView({ setView }: { setView: (v: string) => void }) {
  const tools = [
    { id: 'remover', icon: <ImageIcon size={22} className="text-[#8319da]" />, title: 'Background Remover', desc: 'Instantly remove backgrounds from any image with AI-powered precision.', color: 'bg-[#e2e7ff]' },
    { id: 'svg', icon: <PenTool size={22} className="text-[#006286]" />, title: 'SVG Editor', desc: 'Create and edit scalable vector graphics with intuitive path tools.', color: 'bg-[#b6e3ff]' },
    { id: 'typo', icon: <Type size={22} className="text-[#a02d70]" />, title: 'Typography Stylist', desc: 'Pair fonts, adjust kerning, and apply premium text effects instantly.', color: 'bg-[#ffcce7]' },
    { id: 'audio', icon: <Mic size={22} className="text-[#7500c8]" />, title: 'Audio Enhancer', desc: 'Clean up voice recordings and add subtle ambient mastering effects.', color: 'bg-[#e8d2ff]' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      {/* Hero */}
      <div className="bg-[#eef0ff] rounded-[32px] p-12 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden mb-12 flex-shrink-0">
         <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#c285ff] rounded-full mix-blend-multiply filter blur-[60px] opacity-30"></div>
         <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-[#ff8bc5] rounded-full mix-blend-multiply filter blur-[60px] opacity-20"></div>
         
         <div className="relative z-10 max-w-xl">
           <span className="text-xs font-bold tracking-[0.15em] uppercase text-[#8319da] mb-4 block">Welcome back</span>
           <h1 className="text-[52px] font-headline font-extrabold text-slate-800 tracking-tight leading-[1.1] mb-6">
              All-in-One <br/>
              <span className="bg-gradient-to-r from-[#8319da] to-[#c285ff] bg-clip-text text-transparent">Creative Toolkit</span>
           </h1>
           <p className="text-slate-600 text-lg mb-8 leading-relaxed font-normal">
             Edit images, design graphics, style text, and enhance audio — all in one place. Your ultimate editorial workspace awaits.
           </p>
           <div className="flex gap-4">
             <button onClick={() => setView('editor')} className="bg-[#a052e6] hover:bg-[#9241da] text-white px-8 py-3.5 rounded-full font-semibold text-[15px] shadow-lg shadow-purple-500/20 transition-all">
                Start Creating
             </button>
             <button className="bg-[#e2e7ff] text-slate-700 px-8 py-3.5 rounded-full font-semibold text-[15px] hover:bg-[#d9e2ff] transition-colors">
                Explore Tools
             </button>
           </div>
         </div>
         
         <div className="relative z-10 hidden lg:block mr-8">
           <div className="w-[320px] h-[320px] bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center border border-slate-700/50 mix-blend-screen">
                <div className="text-pink-200 opacity-50 mb-4 scale-150">
                   <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                     <path d="M12 2L2 12l10 10 10-10L12 2zM12 8l4 4-4 4-4-4 4-4z" />
                   </svg>
                </div>
                <h3 className="font-headline text-slate-300 tracking-[0.3em] font-light text-xl mt-4">CREATIVE</h3>
                <h4 className="font-headline text-yellow-600/60 tracking-[0.3em] font-light text-sm mt-2">SAFE WORK</h4>
             </div>
             <div className="absolute inset-0 bg-gradient-to-tr from-[#ff8bc5]/20 to-[#c285ff]/20 opacity-50 blur-[50px]"></div>
           </div>
         </div>
      </div>

      {/* Tools Grid */}
      <div className="flex-1 pb-10">
        <div className="mb-6">
          <h2 className="text-[26px] font-headline font-bold text-slate-800 tracking-tight">Your Workspace</h2>
          <p className="text-[15px] text-slate-500 mt-1">Quick access to your most used tools.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, idx) => (
            <div key={idx} className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-md transition-all group flex flex-col cursor-pointer" onClick={() => setView('editor')}>
              <div className={`w-12 h-12 rounded-full ${tool.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {tool.icon}
              </div>
              <h3 className="text-[18px] font-headline font-bold text-slate-800 mb-2">{tool.title}</h3>
              <p className="text-[14px] text-slate-500 mb-6 flex-1 leading-relaxed">{tool.desc}</p>
              <button className="w-full py-3 rounded-full bg-[#f6f6ff] text-slate-700 text-sm font-semibold group-hover:bg-[#eef0ff] transition-colors flex items-center justify-center gap-2">
                Open Tool <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
