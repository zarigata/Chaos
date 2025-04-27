import React from 'react';

// CODEX: Prop types
interface Guild { id: string; name: string; }
interface User { id: string; username: string; email: string; }
interface SidebarProps {
  user: User | null;
  guilds: Guild[];
  currentGuild: Guild | null;
  onSelectGuild: (guild: Guild) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, guilds, currentGuild, onSelectGuild }) => (
  <aside className="w-72 bg-black border-r border-gray-800 flex flex-col h-full">
    {/* Profile */}
    <div className="flex items-center space-x-3 p-4 border-b border-gray-800">
      <img src="/assets/images/avatar-placeholder.png" alt="avatar" className="w-10 h-10 rounded-full bg-gray-700" />
      <div>
        <div className="font-bold text-white">{user?.username || 'Guest'}</div>
        <div className="text-xs text-green-400">● Online</div>
      </div>
      <div className="ml-auto flex space-x-2">
        <button title="Settings" className="text-gray-400 hover:text-white">⚙️</button>
      </div>
    </div>
    {/* Tabs */}
    <div className="flex justify-around py-2 border-b border-gray-800 bg-gray-900">
      <button title="Friends" className="text-white">👥</button>
      <button title="Messages" className="text-white">💬</button>
      <button title="Voice" className="text-white">📞</button>
      <button title="Groups" className="text-white">👪</button>
      <button title="Bots" className="text-white">🤖</button>
      <button title="Games" className="text-white">🎮</button>
    </div>
    {/* Search */}
    <div className="p-2">
      <input type="text" placeholder="Search contacts..." className="w-full p-2 rounded bg-gray-800 text-white" />
    </div>
    {/* Guilds list */}
    <div className="flex-1 overflow-y-auto">
      {guilds.map(g => (
        <div
          key={g.id}
          onClick={() => onSelectGuild(g)}
          className={`flex items-center px-4 py-2 hover:bg-gray-800 cursor-pointer ${currentGuild?.id === g.id ? 'bg-gray-700' : ''}`}
        >
          <span className="inline-block w-3 h-3 rounded-full mr-3 bg-blue-500"></span>
          <div>
            <div className="text-white font-semibold text-sm">{g.name}</div>
          </div>
        </div>
      ))}
      <button onClick={() => alert('Create Guild not implemented')}
        className="w-full p-2 text-left text-white bg-gray-900 border-t border-gray-800 hover:bg-gray-800">
        ➕ Create Guild
      </button>
    </div>
  </aside>
);

export default Sidebar;
