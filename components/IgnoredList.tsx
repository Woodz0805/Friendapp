import React from 'react';
import { UserProfile } from '../types';
import { RefreshCcw, MessageCircle, ArrowLeft, Frown } from 'lucide-react';

interface IgnoredListProps {
  ignoredProfiles: UserProfile[];
  onRestore: (profile: UserProfile) => void;
  onChat: (profile: UserProfile) => void;
  onBack: () => void;
}

export const IgnoredList: React.FC<IgnoredListProps> = ({ ignoredProfiles, onRestore, onChat, onBack }) => {
  return (
    <div className="pb-24 min-h-screen bg-surface">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">暫不考慮清單</h2>
      </div>

      {ignoredProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400">
               <Frown className="w-20 h-20 mb-4 opacity-20" />
               <p className="text-xl">這裡空空的</p>
               <p className="text-lg">您還沒有略過任何人喔</p>
           </div>
      ) : (
          <div className="p-4 space-y-4">
              {ignoredProfiles.map(profile => (
                  <div key={profile.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                      <img src={profile.imageUrl} className="w-16 h-16 rounded-full object-cover grayscale" alt={profile.name} />
                      <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800">{profile.name}, {profile.age}</h3>
                          <p className="text-gray-500 text-sm truncate">{profile.location}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => onRestore(profile)}
                            className="bg-gray-100 p-2 rounded-lg text-gray-600 text-sm font-bold flex items-center gap-1 hover:bg-gray-200"
                          >
                              <RefreshCcw className="w-4 h-4" /> 恢復
                          </button>
                          <button 
                            onClick={() => onChat(profile)}
                            className="bg-secondary text-white p-2 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-yellow-500"
                          >
                              <MessageCircle className="w-4 h-4" /> 聊天
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};
