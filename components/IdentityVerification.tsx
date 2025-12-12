import React, { useState, useRef } from 'react';
import { Camera, ShieldCheck, Upload, User, CheckCircle } from 'lucide-react';

interface IdentityVerificationProps {
  onVerified: () => void;
}

export const IdentityVerification: React.FC<IdentityVerificationProps> = ({ onVerified }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: ID, 2: Selfie, 3: Processing
  const [idImage, setIdImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'selfie') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'id') setIdImage(reader.result as string);
        else setSelfieImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 1 && idImage) setStep(2);
    else if (step === 2 && selfieImage) {
      setStep(3);
      // Simulate verification delay
      setTimeout(() => {
        onVerified();
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-surface p-4 flex flex-col items-center justify-center max-w-lg mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full text-center">
        <div className="mb-6 flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
                <ShieldCheck className="w-16 h-16 text-green-600" />
            </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">真人實名認證</h2>
        <p className="text-gray-500 text-lg mb-8">為了確保交友環境安全，我們需要確認您是本人。</p>

        {step === 3 ? (
             <div className="flex flex-col items-center py-8">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl font-bold text-gray-700">正在審核資料中...</p>
                <p className="text-gray-500 mt-2">請稍候，約需幾秒鐘</p>
             </div>
        ) : (
            <>
                <div className="mb-8">
                    <div className="flex justify-center items-center gap-4 mb-6">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${step === 1 ? 'bg-primary text-white' : 'bg-green-500 text-white'}`}>
                            {step > 1 ? <CheckCircle className="w-6 h-6" /> : '1'}
                        </div>
                        <div className="w-16 h-1 bg-gray-200">
                            <div className={`h-full bg-green-500 transition-all ${step === 2 ? 'w-full' : 'w-0'}`}></div>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${step === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                            2
                        </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">
                        {step === 1 ? '拍攝身分證件正面' : '拍攝您的自拍照'}
                    </h3>

                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-4 border-dashed border-gray-300 rounded-2xl h-64 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden relative"
                    >
                        {(step === 1 ? idImage : selfieImage) ? (
                            <img src={step === 1 ? idImage! : selfieImage!} className="w-full h-full object-cover" alt="upload" />
                        ) : (
                            <>
                                {step === 1 ? <Upload className="w-16 h-16 text-gray-400 mb-2" /> : <User className="w-16 h-16 text-gray-400 mb-2" />}
                                <span className="text-gray-500 text-lg font-bold">點擊開啟相機</span>
                            </>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            accept="image/*"
                            capture="environment" // or 'user' for selfie
                            className="hidden" 
                            onChange={(e) => handleCapture(e, step === 1 ? 'id' : 'selfie')}
                        />
                    </div>
                </div>

                <button 
                    onClick={handleNext}
                    disabled={step === 1 ? !idImage : !selfieImage}
                    className="w-full bg-primary text-white py-4 rounded-xl text-2xl font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-700 transition"
                >
                    {step === 1 ? '下一步' : '提交審核'}
                </button>
            </>
        )}
      </div>
    </div>
  );
};
