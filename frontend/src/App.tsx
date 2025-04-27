import React from 'react';
import Chat from './Chat';
import StartPage from './StartPage';
import { useState } from 'react';

const App: React.FC = () => {
  // State to toggle between start page and chat interface
  const [started, setStarted] = useState(false);
  return (
    <>
      {started ? (
        <Chat />
      ) : (
        <StartPage onStart={() => setStarted(true)} />
      )}
    </>
  );
};

export default App;
