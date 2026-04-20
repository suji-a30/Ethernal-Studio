import { Image, Type, PenTool, Mic, Plus } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: any) => void;
}

export default function Sidebar({ currentView, setView }: SidebarProps) {
  const navItems = [
    { id: 'tools', label: 'Image Editing', icon: <Image size={20} /> },
    { id: 'text', label: 'Text', icon: <Type size={20} /> },
    { id: 'design', label: 'Graphic Design', icon: <PenTool size={20} /> },
    { id: 'audio', label: 'Audio', icon: <Mic size={20} /> },
  ];

  return (
    <nav className="w-[260px] flex-shrink-0 bg-[#f6f6ff] border-r border-[#eef0ff] flex flex-col py-6 relative z-10 transition-all duration-300">
      <div className="px-6 mb-8 cursor-pointer" onClick={() => setView('home')}>
        <h2 className="font-headline font-black text-[#8319da] text-[22px] tracking-tight">Creative Suite</h2>
        <p className="text-slate-500 text-xs mt-1">Toolkit</p>
      </div>
      
      <div className="flex-1 flex flex-col gap-1.5 px-4 font-medium">
        {navItems.map((item) => {
          const isActive = currentView === item.id || (currentView === 'editor' && item.id === 'tools');
          return (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
              }}
              className={`flex items-center gap-3.5 px-5 py-3.5 rounded-full transition-all duration-200 text-[15px] ${
                isActive 
                  ? 'bg-white text-[#8319da] shadow-sm font-semibold' 
                  : 'text-slate-500 hover:text-[#8319da] hover:bg-white/40'
              }`}
            >
              <div className={isActive ? "text-[#8319da]" : "text-slate-400"}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
      
      <div className="px-6 mt-auto">
        <button className="w-full h-12 bg-[#a052e6] hover:bg-[#9241da] text-white rounded-full font-semibold shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2">
          New Project
        </button>
      </div>
    </nav>
  )
}
