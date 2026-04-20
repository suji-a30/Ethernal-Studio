/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HomeView from './components/HomeView';
import ToolsView from './components/ToolsView';
import EditorView from './components/EditorView';

export default function App() {
  const [view, setView] = useState('home');

  const renderView = () => {
    switch(view) {
      case 'home': return <HomeView setView={setView} />;
      case 'tools': return <ToolsView setView={setView} />;
      case 'editor': return <EditorView />;
      default: return <HomeView setView={setView} />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f6ff]">
      <Sidebar currentView={view} setView={setView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar currentView={view} setView={setView} />
        <main className="flex-1 overflow-y-auto pt-[72px]">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
