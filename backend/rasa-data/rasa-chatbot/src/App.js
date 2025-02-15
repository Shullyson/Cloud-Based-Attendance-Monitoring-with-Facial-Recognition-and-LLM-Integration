import React, { useState } from 'react';
import ChatBot from './chat';
import './App.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="App">
      <button className="chat-button" onClick={toggleChat}>
        💬 Chat
      </button>
      {isOpen && <ChatBot />}
    </div>
  );
}

export default App;
