import React, { useState, useRef } from 'react';
import { Mic, X, Volume2 } from 'lucide-react';
import { processVoiceCommand } from '../services/geminiService';

export const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startListening = async () => {
    setResponse(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          // Send to Gemini
          const result = await processVoiceCommand(base64Audio);
          setResponse(result.reply);
          
          // Speak it out
          speakText(result.reply);
          
          setIsProcessing(false);
        };
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setResponse("無法存取麥克風，請檢查權限。");
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      // Stop all tracks to release mic
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.9; // Slightly slower for elderly
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsListening(true)} // Open modal if not active, or just toggle
        className="fixed bottom-24 right-4 bg-secondary text-white p-5 rounded-full shadow-2xl z-40 border-4 border-white animate-bounce-slow"
        aria-label="開啟語音助理"
      >
        <Mic className="w-8 h-8" />
      </button>

      {/* Voice Modal Overlay */}
      {(isListening || isProcessing || response) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl relative">
            
            <button 
                onClick={() => {
                    setIsListening(false);
                    setResponse(null);
                    setIsProcessing(false);
                    window.speechSynthesis.cancel();
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
            >
                <X className="w-8 h-8" />
            </button>

            <h3 className="text-2xl font-bold text-primary mb-6">語音小幫手</h3>

            {isProcessing ? (
               <div className="flex flex-col items-center gap-4 py-8">
                  <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xl text-gray-600">正在思考中...</p>
               </div>
            ) : response ? (
                <div className="py-4">
                    <p className="text-2xl text-gray-800 mb-6 leading-relaxed text-left bg-gray-50 p-4 rounded-xl">
                        "{response}"
                    </p>
                    <button 
                        onClick={() => {
                            setResponse(null);
                            startListening();
                        }}
                        className="bg-primary text-white px-8 py-4 rounded-full text-xl font-bold w-full"
                    >
                        再說一次
                    </button>
                </div>
            ) : (
                <div className="py-8">
                    <p className="text-xl text-gray-600 mb-8">請按住按鈕，說出您的需求<br/>(例如：我想找登山社團)</p>
                    
                    <button
                        onMouseDown={startListening}
                        onMouseUp={stopListening}
                        onTouchStart={startListening}
                        onTouchEnd={stopListening}
                        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                            isListening ? 'bg-red-500 scale-110 shadow-red-200' : 'bg-secondary hover:bg-yellow-500'
                        } shadow-xl mx-auto`}
                    >
                        <Mic className="w-16 h-16 text-white" />
                    </button>
                    <p className="mt-4 text-gray-400 text-lg">按住說話，放開結束</p>
                </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
