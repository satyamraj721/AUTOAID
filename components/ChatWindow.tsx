
import React, { useState, useRef, useEffect } from 'react';

interface ChatProps {
  recipientName: string;
  onClose: () => void;
  currentUserRole: 'CUSTOMER' | 'MECHANIC';
}

interface IMessage {
  id: string;
  text: string;
  sender: 'ME' | 'THEM';
  time: string;
}

export const ChatWindow: React.FC<ChatProps> = ({ recipientName, onClose, currentUserRole }) => {
  const [messages, setMessages] = useState<IMessage[]>([
    { id: '1', text: 'Hi there!', sender: 'THEM', time: 'Now' }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const newMessage: IMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'ME',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate reply
    setTimeout(() => {
      const reply: IMessage = {
        id: (Date.now() + 1).toString(),
        text: currentUserRole === 'CUSTOMER' 
          ? "I'm on my way! About 5 mins out." 
          : "Okay, I see your location. Please stay safe.",
        sender: 'THEM',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">
            {recipientName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-sm">{recipientName}</h3>
            <p className="text-xs text-green-400">Online</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 h-80 overflow-y-auto p-4 bg-gray-50 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'ME' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-xl text-sm shadow-sm ${msg.sender === 'ME' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.sender === 'ME' ? 'text-blue-200' : 'text-gray-400'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
        <input 
          type="text" 
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
          <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
        </button>
      </form>
    </div>
  );
};
