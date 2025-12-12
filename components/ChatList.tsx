import React from 'react';
import { UserProfile } from '../types';
import { MessageCircle } from 'lucide-react';

interface ChatListProps {
  chats: UserProfile[];
  onSelectChat: (profile: UserProfile) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat }) => {
  return (
    <div className="pb-24">
       <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
            <h2 className="text-heading-1 font-bold text-primary">聊天列表</h2>
            <p className="text-gray-500 text-lg">您曾經互動過的朋友</p>
       </div>

       {chats.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
               <MessageCircle className="w-24 h-24 mb-4 opacity-20" />
               <p className="text-xl">目前還沒有聊天記錄</p>
               <p className="text-lg">快去「首頁」找人打招呼吧！</p>
           </div>
       ) : (
           <div className="p-4 space-y-4">
               {chats.map(profile => (
                   <div 
                    key={profile.id} 
                    onClick={() => onSelectChat(profile)}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-98 transition-transform"
                   >
                       <img src={profile.imageUrl} className="w-16 h-16 rounded-full object-cover" alt={profile.name} />
                       <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-baseline mb-1">
                               <h3 className="text-xl font-bold text-gray-800 truncate">{profile.name}</h3>
                               <span className="text-sm text-gray-400">
                                   {profile.lastMessageTime 
                                     ? new Date(profile.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                                     : ''}
                               </span>
                           </div>
                           <p className="text-lg text-gray-500 truncate">
                               {profile.lastMessage || "點擊開始聊天..."}
                           </p>
                       </div>
                   </div>
               ))}
           </div>
       )}
    </div>
  );
};
