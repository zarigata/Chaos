import React from 'react';

interface StartPageProps {
  onStart: () => void;
}

const StartPage: React.FC<StartPageProps> = ({ onStart }) => (
  <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
    <img src="/assets/images/logo.png" alt="C.H.A.O.S Logo" className="w-48 h-48 mb-4 animate-pulse" />
    <h1 className="text-6xl font-mono mb-2">C.H.A.O.S</h1>
    <p className="text-lg mb-6 font-mono">Embrace the chaos of real-time chat</p>
    <button
      onClick={onStart}
      className="px-6 py-3 bg-red-600 rounded hover:bg-red-700 transition font-mono"
    >
      Enter the Abyss
    </button>
  </div>
);

export default StartPage;
