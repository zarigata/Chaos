import React from 'react';

const MainPanel: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-white" style={{ backgroundImage: 'url(/assets/images/wallpaper-placeholder.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <div className="text-center bg-black bg-opacity-70 rounded-lg p-8 shadow-lg">
      <h2 className="text-2xl mb-2 font-mono">A nostalgic blend of MSN Messenger and Discord</h2>
      <p className="mb-4 font-mono">Bringing back the 2000s vibe with modern features.</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-gray-800 rounded-lg">Chat with Friends<br /><span className="text-xs text-gray-400">Send messages, emoticons, and work just like the good old days!</span></div>
        <div className="p-4 bg-gray-800 rounded-lg">Voice Channels<br /><span className="text-xs text-gray-400">Create and join voice channels for real-time communication.</span></div>
        <div className="p-4 bg-gray-800 rounded-lg">Bot Integration<br /><span className="text-xs text-gray-400">Add bots for music, games, and moderation tools.</span></div>
        <div className="p-4 bg-gray-800 rounded-lg">Play Games<br /><span className="text-xs text-gray-400">Challenge friends to classic games right in the app.</span></div>
      </div>
      <p className="text-xs mt-2">Select a contact from the sidebar to start chatting</p>
      <div className="mt-2 animate-bounce">⬇️</div>
    </div>
  </div>
);

export default MainPanel;
