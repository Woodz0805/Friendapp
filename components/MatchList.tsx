import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Heart, MapPin, Tag, ArchiveRestore } from 'lucide-react';

interface MatchListProps {
  matches: UserProfile[];
  onStartChat: (profile: UserProfile) => void;
  onPass: (profile: UserProfile) => void;
  onViewIgnored: () => void;
}

export const MatchList: React.FC<MatchListProps> = ({ matches, onStartChat, onPass, onViewIgnored }) => {
  const [filter, setFilter] = useState<string>('全部');
  const interests = ['全部', '爬山', '園藝', '烹飪', '攝影', '音樂', '茶道'];

  const filteredMatches = filter === '全部' 
    ? matches 
    : matches.filter(m => m.interests.includes(filter));

  return (
    <div className="pb-24">
      {/* Large Interest Filter Buttons */}
      <div className="sticky top-0 z-10 bg-surface py-4 shadow-sm">
        <div className="flex justify-between items-center px-4 mb-4">
             <h2 className="text-heading-1 font-bold text-primary">尋找新朋友</h2>
             <button 
                onClick={onViewIgnored}
                className="text-gray-500 flex items-center gap-1 text-sm font-bold bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300"
             >
                <ArchiveRestore className="w-4 h-4" /> 暫不考慮清單
             </button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
          {interests.map(interest => (
            <button
              key={interest}
              onClick={() => setFilter(interest)}
              className={`whitespace-nowrap px-6 py-3 rounded-full text-xl font-medium transition-colors border-2 ${
                filter === interest
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-300'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Match Cards */}
      <div className="px-4 space-y-6 mt-4">
        {filteredMatches.map(profile => (
          <div key={profile.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="relative h-64 w-full">
              <img 
                src={profile.imageUrl} 
                alt={profile.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                 <h3 className="text-white text-3xl font-bold">{profile.name}, {profile.age}歲</h3>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-center gap-2 text-gray-600 mb-3 text-xl">
                <MapPin className="w-6 h-6 text-secondary" />
                <span>距離您 <strong>{profile.distanceKm}</strong> 公里</span>
              </div>
              
              <p className="text-gray-700 text-body-lg mb-4 leading-relaxed">
                {profile.bio}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {profile.interests.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-green-50 text-green-800 px-3 py-1 rounded-lg text-lg">
                    <Tag className="w-4 h-4" /> {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                 <button 
                    onClick={() => onPass(profile)}
                    className="flex-1 bg-white border-2 border-gray-300 text-gray-600 py-4 rounded-xl text-xl font-bold hover:bg-gray-50 transition"
                 >
                    暫不考慮
                 </button>
                 <button 
                    onClick={() => onStartChat(profile)}
                    className="flex-1 bg-secondary text-white border-2 border-secondary py-4 rounded-xl text-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-500 transition shadow-md"
                 >
                    <Heart className="w-6 h-6 fill-current" />
                    打招呼
                 </button>
              </div>
            </div>
          </div>
        ))}
        {filteredMatches.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-xl">
            目前沒有符合此興趣的朋友，試試看其他標籤吧！
          </div>
        )}
      </div>
    </div>
  );
};
