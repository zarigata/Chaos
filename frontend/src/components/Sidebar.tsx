import React from 'react';

const mockFriends = [
  { name: 'Alex Johnson', status: 'online', message: 'Working from home today' },
  { name: 'Sam Taylor', status: 'gaming', message: 'Gaming all day!' },
  { name: 'Jamie Smith', status: 'away', message: 'At the gym' },
  { name: 'Riley Cooper', status: 'busy', message: 'In a meeting' },
  { name: 'Casey Morgan', status: 'online', message: 'Available for chat' },
];

const Sidebar: React.FC = () => (
  <aside className="w-72 bg-black border-r border-gray-800 flex flex-col h-full">
    {/* Profile */}
    <div className="flex items-center space-x-3 p-4 border-b border-gray-800">
      <img src="/assets/images/avatar-placeholder.png" alt="avatar" className="w-10 h-10 rounded-full bg-gray-700" />
      <div>
        <div className="font-bold text-white">YourNickname</div>
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
    {/* Friends list */}
    <div className="flex-1 overflow-y-auto">
      {mockFriends.map((f, i) => (
        <div key={i} className="flex items-center px-4 py-2 hover:bg-gray-800 cursor-pointer">
          <span className="inline-block w-3 h-3 rounded-full mr-3" style={{ background: f.status === 'online' ? '#4ade80' : f.status === 'gaming' ? '#facc15' : f.status === 'away' ? '#f87171' : '#38bdf8' }}></span>
          <div>
            <div className="text-white font-semibold text-sm">{f.name}</div>
            <div className="text-xs text-gray-400">{f.message}</div>
          </div>
        </div>
      ))}
      <button className="w-full p-2 text-left text-white bg-gray-900 border-t border-gray-800 hover:bg-gray-800">➕ Add New Contact</button>
    </div>
  </aside>
);

export default Sidebar;
