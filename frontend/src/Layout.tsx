// CODEX: Layout component for the C.H.A.O.S. chat app
// Combines Sidebar and MainPanel, ready for dynamic routing and future expansion
import React from 'react';
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';

const Layout: React.FC = () => (
  <div className="flex h-screen w-screen overflow-hidden">
    <Sidebar />
    <MainPanel />
  </div>
);

export default Layout;
