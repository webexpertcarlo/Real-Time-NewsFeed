import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const ws = useRef(null);

  useEffect(() => {
    // Established connection when component mounts
    ws.current = new WebSocket('ws://echo.websocket.events');

    // Log when the connection is open
    ws.current.onopen = () => {
      console.log('WebSocket connection established.');
    };

    //incoming message to be handled
    ws.current.onmessage = (event) => {
      console.log('Received:', event.data);
      const newMessage = {
        text: event.data,
        timestamp: new Date().toLocaleTimeString()
      };
        setMessages(prev => [newMessage, ...prev]);
    };

    ws.current.onerror = (error) => {
      // WebSocket Error Handling
      console.error('WebSocket Error:', error);
    };

    
    ws.current.onclose = () => {
  // Log for connection closing
        console.log('WebSocket connection closed.');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Function to send a message
  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && inputMessage.trim()) {
      ws.current.send(inputMessage);
      setInputMessage('');
    }
  };

  // Clear all messages
  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Real-Time Newsfeed</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 py-1"
        >
          Send Message
        </button>
      </div>

      <button
        onClick={clearMessages}
        className="bg-red-500 text-white px-3 py-1 mb-4"
      >
        Clear Messages
      </button>

      <ul>
        {messages.map((msg, index) => (
          <li key={index} className="mb-2 border p-2 rounded">
            <div className="text-gray-600 text-sm">{msg.timestamp}</div>
            <div>{msg.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
