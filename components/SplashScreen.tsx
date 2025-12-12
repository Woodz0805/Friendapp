import React from 'react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-primary flex flex-col items-center justify-center z-50">
      <div className="text-white text-center animate-fade-in">
        <div className="mb-4">
            <svg 
              className="w-24 h-24 mx-auto mb-4 text-secondary" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              <path d="M14.05 2a9 9 0 0 1 8 7.94"></path>
              <path d="M14.05 6A5 5 0 0 1 18 10"></path>
            </svg>
        </div>
        <h1 className="text-6xl font-bold tracking-widest leading-tight drop-shadow-md">
          美PHONE<br/>有ㄩ
        </h1>
        <p className="mt-6 text-2xl font-light text-white/90">
            最溫暖的熟齡社交平台
        </p>
      </div>
    </div>
  );
};
