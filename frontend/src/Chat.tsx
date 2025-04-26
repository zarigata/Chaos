import React, { useState, useEffect, FormEvent } from 'react';
import { io, Socket } from 'socket.io-client';

interface Guild { id: string; name: string; }
interface User { id: string; username: string; email: string; }
interface Message { id: string; content: string; author: User; guild: Guild; createdAt: string; }

const Chat: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [currentGuild, setCurrentGuild] = useState<Guild | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [isForgot, setIsForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(0);
  const [forgotEmail, setForgotEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/auth${isRegister ? '/register' : '/login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isRegister ? { username, email, password } : { email, password }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const errorsList = errBody.errors ?? [];
        const errMsg = errorsList.length
          ? errorsList.join(', ')
          : errBody.message ?? `${isRegister ? 'Registration' : 'Login'} failed`;
        console.error('Auth error:', errBody);
        alert(errMsg);
        return;
      }
      const data = await res.json();
      // Persist auth data for other components
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      console.error(err);
      alert(`${isRegister ? 'Registration' : 'Login'} error`);
    }
  };

  const handleForgotSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Failed to fetch security question');
        return;
      }
      const data = await res.json();
      setSecurityQuestion(data.question);
      setForgotStep(1);
    } catch (err) {
      console.error(err);
      alert('Error fetching security question');
    }
  };

  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, securityAnswer, newPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Password reset failed');
        return;
      }
      alert('Password reset successful. Please log in.');
      setIsForgot(false); setForgotStep(0);
      setEmail(''); setPassword('');
    } catch (err) {
      console.error(err);
      alert('Error resetting password');
    }
  };

  useEffect(() => {
    if (token) {
      const s = io('http://localhost:3000', { auth: { token } });
      setSocket(s);
      fetch('http://localhost:3000/guilds', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(setGuilds)
        .catch(console.error);
      return () => { s.disconnect(); };
    }
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.on('guild:message', (msg: Message) => {
        if (currentGuild?.id === msg.guild.id) {
          setMessages(prev => [...prev, msg]);
        }
      });
      socket.on('error', (err: any) => console.error(err));
    }
  }, [socket, currentGuild]);

  const sendMessage = () => {
    if (socket && currentGuild && message.trim()) {
      socket.emit('guild:sendMessage', { guildId: currentGuild.id, content: message });
      setMessage('');
    }
  };

  if (!token) {
    if (isForgot) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
          {forgotStep === 0 ? (
            <form onSubmit={handleForgotSubmit} className="space-y-4 bg-gray-800 p-6 rounded">
              <h2 className="text-2xl">Forgot Password</h2>
              <input type="email" placeholder="Email" value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)} className="p-2 bg-gray-700 rounded w-full" required />
              <button type="submit" className="w-full p-2 bg-red-600 rounded">Get Question</button>
              <div className="text-center text-sm mt-2">
                <button type="button" onClick={() => { setIsForgot(false); setForgotStep(0); }} className="underline">Back to Login</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4 bg-gray-800 p-6 rounded">
              <h2 className="text-2xl">Reset Password</h2>
              <p className="bg-gray-700 p-2 rounded">{securityQuestion}</p>
              <input type="text" placeholder="Answer" value={securityAnswer}
                onChange={e => setSecurityAnswer(e.target.value)} className="p-2 bg-gray-700 rounded w-full" required />
              <input type="password" placeholder="New Password" value={newPassword}
                onChange={e => setNewPassword(e.target.value)} className="p-2 bg-gray-700 rounded w-full" required />
              <button type="submit" className="w-full p-2 bg-red-600 rounded">Reset Password</button>
              <div className="text-center text-sm mt-2">
                <button type="button" onClick={() => { setIsForgot(false); setForgotStep(0); }} className="underline">Back to Login</button>
              </div>
            </form>
          )}
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <form onSubmit={handleAuth} className="space-y-4 bg-gray-800 p-6 rounded">
          <h2 className="text-2xl">{isRegister ? 'Register' : 'Login'}</h2>
          {isRegister && (
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="p-2 bg-gray-700 rounded w-full" required />
          )}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="p-2 bg-gray-700 rounded w-full" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="p-2 bg-gray-700 rounded w-full" required />
          <button type="submit" className="w-full p-2 bg-red-600 rounded">{isRegister ? 'Register' : 'Login'}</button>
          {!isRegister && (
            <div className="text-center text-sm mt-2">
              <button type="button" onClick={() => setIsForgot(true)} className="underline">Forgot Password?</button>
            </div>
          )}
          <div className="text-center text-sm mt-2">
            {isRegister ? (
              <span>Have an account? <button type="button" onClick={() => setIsRegister(false)} className="underline">Login</button></span>
            ) : (
              <span>No account? <button type="button" onClick={() => setIsRegister(true)} className="underline">Register</button></span>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="h-screen grid grid-rows-[auto,1fr] bg-gray-900 text-white">
      <div className="p-4 flex items-center space-x-4 bg-gray-800">
        <span>Logged in as {user?.username}</span>
        <select value={currentGuild?.id || ''} onChange={e => {
          const g = guilds.find(g => g.id === e.target.value) || null;
          setCurrentGuild(g);
          setMessages([]);
        }} className="bg-gray-700 p-2 rounded">
          <option value="">Select Guild</option>
          {guilds.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>
      <div className="flex flex-col">
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
            <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message"
              className="flex-1 p-2 bg-gray-700 rounded" />
            <button onClick={sendMessage} className="p-2 bg-red-600 rounded">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
