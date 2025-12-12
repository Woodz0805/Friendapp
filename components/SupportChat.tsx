import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendSupportMessage } from '../services/geminiService';
import { Send, Headphones } from 'lucide-react';

export const SupportChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'system',
      text: '您好！我是銀髮緣的客服小幫手。請問有什麼我可以幫您的嗎？您可以問我如何使用App，或者如何參加活動。',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    
    const replyText = await sendSupportMessage(history, userMsg.text);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: replyText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="bg-primary p-4 text-white shadow-md flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-full">
            <Headphones className="w-8 h-8" />
        </div>
        <div>
            <h2 className="text-2xl font-bold">線上客服</h2>
            <p className="text-white/80">我們隨時在這裡為您服務</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-surface">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-5 text-xl leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-secondary text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-full px-6 py-3 text-gray-500 animate-pulse text-lg">
              正在輸入中...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200 pb-24">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="請在此輸入您的問題..."
            className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-4 text-xl focus:border-primary focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading || !inputText.trim()}
            className="bg-primary text-white p-4 rounded-xl disabled:opacity-50 hover:bg-teal-700 transition"
          >
            <Send className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};
