import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { ArrowLeft, Phone, Send, Mic, Clock, ShieldAlert, X } from 'lucide-react';
import { transcribeAudio } from '../services/geminiService';

interface ChatInterfaceProps {
  partner: UserProfile;
  onBack: () => void;
  updateLastMessage: (text: string) => void;
}

const RECOMMENDED_STARTERS = [
  "你好！很高興認識你。",
  "看你的照片覺得很親切，想跟你打聲招呼！",
  "最近天氣不錯，有沒有去哪裡走走呢？"
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ partner, onBack, updateLastMessage }) => {
  const [messages, setMessages] = useState<{id: string, text: string, sender: 'me'|'partner', read?: boolean}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  
  // Call State
  const [isCallActive, setIsCallActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  // Safety Warning State
  const [showSafetyWarning, setShowSafetyWarning] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (isCallActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isCallActive) {
      endCall("時間到");
    }
    return () => clearInterval(interval);
  }, [isCallActive, timeLeft]);

  const handleSend = (text: string = inputValue) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender: 'me', read: false }]);
    setInputValue('');
    updateLastMessage(text);
    
    // Simulate read receipt and reply
    setTimeout(() => {
        setMessages(prev => prev.map(m => m.sender === 'me' ? {...m, read: true} : m));
    }, 1000);

    setTimeout(() => {
        const reply = "謝謝你的訊息！我很開心。";
        setMessages(prev => [...prev, { id: Date.now().toString(), text: reply, sender: 'partner' }]);
        updateLastMessage(reply);
    }, 2500);
  };

  const startVoiceInput = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsProcessingVoice(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          const text = await transcribeAudio(base64Audio);
          setInputValue(prev => prev + text);
          setIsProcessingVoice(false);
        };
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error", err);
      alert("無法存取麥克風");
    }
  };

  const stopVoiceInput = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const startCall = () => {
    setIsCallActive(true);
    setTimeLeft(300);
  };

  const endCall = (reason?: string) => {
    setIsCallActive(false);
    if (reason) alert(reason);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCloseWarning = () => {
    if (window.confirm("確認關閉防詐騙提醒？保持開啟能提高安全性，避免落入交友陷阱。")) {
        setShowSafetyWarning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 relative">
      
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
                <img src={partner.imageUrl} className="w-10 h-10 rounded-full object-cover" alt={partner.name} />
                <span className="text-xl font-bold text-gray-800">{partner.name}</span>
            </div>
        </div>
        <button 
            onClick={startCall}
            className="bg-green-100 p-3 rounded-full text-green-700 hover:bg-green-200"
        >
            <Phone className="w-6 h-6 fill-current" />
        </button>
      </div>

      {/* Safety Warning Banner */}
      {showSafetyWarning && (
        <div className="bg-red-50 p-3 border-b border-red-200 flex items-start gap-3 relative animate-fade-in">
            <ShieldAlert className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="flex-1 text-sm text-red-800">
                <strong>防詐騙提醒：</strong> 
                若對方傳送不明連結、要求轉帳匯款或投資，請務必提高警覺！
            </div>
            <button onClick={handleCloseWarning} className="text-red-400 hover:text-red-700 p-1">
                <X className="w-5 h-5" />
            </button>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-gray-400 text-sm my-4">今天 {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        
        {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-xl leading-relaxed ${
                    msg.sender === 'me' 
                    ? 'bg-secondary text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                    {msg.text}
                </div>
                {/* Read Receipt */}
                {msg.sender === 'me' && msg.read && (
                    <span className="text-xs text-gray-400 mt-1 mr-1">已讀</span>
                )}
            </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-200">
        {/* Recommended Starters */}
        {messages.length === 0 && (
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2">
                {RECOMMENDED_STARTERS.map((text, idx) => (
                    <button 
                        key={idx}
                        onClick={() => handleSend(text)}
                        className="whitespace-nowrap bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-lg border border-gray-200 hover:bg-gray-200"
                    >
                        {text}
                    </button>
                ))}
            </div>
        )}

        <div className="flex items-end gap-2">
            <div className="flex-1 bg-gray-100 rounded-2xl flex items-center p-2 border-2 border-transparent focus-within:border-primary">
                <textarea 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isProcessingVoice ? "語音辨識中..." : "輸入訊息..."}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xl max-h-32 p-2 resize-none"
                    rows={1}
                />
                <button
                    onMouseDown={startVoiceInput}
                    onMouseUp={stopVoiceInput}
                    onTouchStart={startVoiceInput}
                    onTouchEnd={stopVoiceInput}
                    className={`p-3 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                    <Mic className="w-6 h-6" />
                </button>
            </div>
            <button 
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
                className="bg-primary text-white p-4 rounded-full shadow-md disabled:opacity-50 hover:bg-teal-700"
            >
                <Send className="w-6 h-6" />
            </button>
        </div>
      </div>

      {/* Call Modal */}
      {isCallActive && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white">
            <div className="mb-12 flex flex-col items-center animate-pulse">
                <img src={partner.imageUrl} className="w-32 h-32 rounded-full border-4 border-white mb-6 object-cover" alt="User" />
                <h2 className="text-3xl font-bold mb-2">正在與 {partner.name} 通話</h2>
                <div className="flex items-center gap-2 text-secondary text-2xl font-mono bg-white/10 px-6 py-2 rounded-full">
                    <Clock className="w-6 h-6" />
                    {formatTime(timeLeft)}
                </div>
                <p className="text-gray-400 mt-2">限時通話 5 分鐘</p>
            </div>
            
            <button 
                onClick={() => endCall()}
                className="bg-red-500 p-6 rounded-full shadow-lg hover:bg-red-600 transform hover:scale-105 transition"
            >
                <Phone className="w-10 h-10 fill-white rotate-[135deg]" />
            </button>
            <p className="mt-4 text-lg">結束通話</p>
        </div>
      )}
    </div>
  );
};
