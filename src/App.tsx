import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HomeView from './components/HomeView';
import ToolsView from './components/ToolsView';
import EditorView from './components/EditorView';
import AudioEditorView from './components/AudioEditorView';

export default function App() {
  const [view, setView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('ethereal-dark') === 'true';
    if (isDark) document.body.classList.add('is-dark');
  }, []);

  const renderView = () => {
    switch(view) {
      case 'home': return <HomeView setView={setView} searchQuery={searchQuery} />;
      case 'tools': return <ToolsView setView={setView} />;
      case 'audio': return <AudioEditorView setView={setView} />;
      case 'text':
      case 'design':
      case 'editor': return <EditorView />;
      default: return <HomeView setView={setView} searchQuery={searchQuery} />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f6ff]">
      <div className={`fixed inset-0 z-40 lg:relative lg:z-auto transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar currentView={view} setView={(v) => { setView(v); setIsMobileMenuOpen(false); }} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar 
          currentView={view} 
          setView={setView} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="flex-1 overflow-y-auto pt-[0px]">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
