import React from 'react';
import ChatView from './components/chat/ChatView';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <ChatView />
    </div>
  );
};

export default App;
