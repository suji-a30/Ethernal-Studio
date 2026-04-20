import { Search, Moon, Sun, Bell, Undo, Redo, Upload, Download, Menu } from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';

interface TopBarProps {
  currentView: string;
  setView: (view: any) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  toggleMobileMenu?: () => void;
}

export default function TopBar({ currentView, setView, searchQuery, setSearchQuery, toggleMobileMenu }: TopBarProps) {
  const { undo, redo, triggerUpload, download, isDarkMode, toggleDarkMode } = useCanvasStore();

  return (
    <header className="h-[72px] flex-shrink-0 bg-white/70 backdrop-blur-xl flex items-center justify-between px-8 border-b border-white shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('home')}>
          <span className="text-[22px] font-headline font-bold bg-gradient-to-br from-[#8319da] to-[#c285ff] bg-clip-text text-transparent tracking-tight">
            Ethereal Studio
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {currentView === 'editor' && (
          <div className="flex items-center gap-3">
            <button onClick={undo} className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
              <Undo size={18} />
            </button>
            <button onClick={redo} className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
              <Redo size={18} />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button onClick={triggerUpload} className="h-10 px-5 rounded-full bg-[#9bdaff] text-[#004d6a] hover:bg-opacity-80 transition-colors font-medium text-[15px] flex items-center gap-2">
              <Upload size={16} /> Upload
            </button>
            <button onClick={download} className="h-10 px-6 rounded-full bg-[#a052e6] text-white hover:bg-[#9241da] font-medium text-[15px] flex items-center gap-2 shadow-sm">
              <Download size={16} /> Download
            </button>
          </div>
        )}

        {currentView !== 'editor' && (
          <div className="flex-1 max-w-[480px] mx-8">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search tools..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                className="w-full bg-[#eef0ff] border-none rounded-full py-2.5 pl-11 pr-4 text-[15px] text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#c285ff]/50 focus:outline-none transition-all"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleDarkMode}
            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {currentView !== 'editor' && (
            <>
              <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-[8px] right-[10px] w-2 h-2 bg-pink-500 rounded-full border border-white"></span>
              </button>
              <div className="w-9 h-9 rounded-full ml-2 border border-slate-200 overflow-hidden cursor-pointer">
                <img src="https://ui-avatars.com/api/?name=User&background=c285ff&color=fff" className="w-full h-full object-cover" alt="User" />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
