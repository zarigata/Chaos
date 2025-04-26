import React from 'react';
import Chat from './Chat';
import StartPage from './StartPage';
import Layout from './Layout';
import { useState } from 'react';

const App: React.FC = () => {
  // State to toggle between start page and chat interface
  const [started, setStarted] = useState(false);
  return (
    <>
      {started ? (
        <Layout />
      ) : (
        <StartPage onStart={() => setStarted(true)} />
      )}
    </>
  );
};

export default App;
