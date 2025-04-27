import React, { useState } from 'react';
import MainPanel from './MainPanel';

interface Guild { id: string; name: string; }
interface User { id: string; username: string; email: string; }
interface Message { id: string; content: string; author: User; guild: Guild; createdAt: string; }

interface ChatPanelProps {
  user: User | null;
  guild: Guild | null;
  messages: Message[];
  onSend: (content: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ user, guild, messages, onSend }) => {
  const [message, setMessage] = useState('');
  if (!guild) return <MainPanel />;
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white flex-1">
      <div className="p-4 flex items-center space-x-4 bg-gray-800">
        <h2 className="text-lg font-semibold">{guild.name}</h2>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {messages.map(m => (
          <div key={m.id} className="mb-2">
            <span className="font-bold text-red-500">{m.author.username}</span>: {m.content}
            <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-800">
        <div className="flex space-x-2">
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 p-2 bg-gray-700 rounded text-white"
          />
          <button
            onClick={() => {
              if (message.trim()) {
                onSend(message);
                setMessage('');
              }
            }}
            className="p-2 bg-red-600 rounded"
          >Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
