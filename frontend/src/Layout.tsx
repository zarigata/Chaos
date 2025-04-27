// CODEX: Layout component for the C.H.A.O.S. chat app
// Combines Sidebar and MainPanel, ready for dynamic routing and future expansion
import React from 'react';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';

// CODEX: prop types for Layout
interface Guild { id: string; name: string; }
interface User { id: string; username: string; email: string; }
interface Message { id: string; content: string; author: User; guild: Guild; createdAt: string; }

interface LayoutProps {
  user: User | null;
  guilds: Guild[];
  currentGuild: Guild | null;
  messages: Message[];
  onSelectGuild: (guild: Guild) => void;
  onSend: (content: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, guilds, currentGuild, messages, onSelectGuild, onSend }) => (
  <div className="flex h-screen w-screen overflow-hidden">
    <Sidebar user={user} guilds={guilds} currentGuild={currentGuild} onSelectGuild={onSelectGuild} />
    <ChatPanel user={user} guild={currentGuild} messages={messages} onSend={onSend} />
  </div>
);

export default Layout;
