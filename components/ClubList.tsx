import React, { useState } from 'react';
import { Club } from '../types';
import { Users, ArrowRight, X, CheckCircle } from 'lucide-react';

interface ClubListProps {
  clubs: Club[];
}

export const ClubList: React.FC<ClubListProps> = ({ clubs }) => {
  const [joiningClub, setJoiningClub] = useState<Club | null>(null);
  const [joinedClubs, setJoinedClubs] = useState<string[]>([]); // Track joined club IDs locally for this session
  const [showSuccess, setShowSuccess] = useState(false);

  const handleJoinClick = (club: Club) => {
    setJoiningClub(club);
  };

  const confirmJoin = () => {
    if (joiningClub) {
      setJoinedClubs([...joinedClubs, joiningClub.id]);
      setJoiningClub(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  return (
    <div className="pb-24 px-4 relative">
       {/* Success Toast */}
       {showSuccess && (
         <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-fade-in">
           <CheckCircle className="w-6 h-6" />
           <span className="text-xl font-bold">成功加入社團！</span>
         </div>
       )}

      <div className="py-6">
        <h2 className="text-heading-1 font-bold text-primary mb-2">同好社團</h2>
        <p className="text-xl text-gray-600">加入感興趣的社團，大家一起出來玩！</p>
      </div>

      <div className="grid gap-6">
        {clubs.map(club => {
          const isJoined = joinedClubs.includes(club.id);
          return (
          <div key={club.id} className="bg-white rounded-2xl shadow-md border-l-8 border-primary overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 h-48 md:h-auto">
                <img src={club.imageUrl} alt={club.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-100 text-blue-800 text-lg px-3 py-1 rounded-full font-medium">
                        {club.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-lg">
                        <Users className="w-5 h-5 mr-1" />
                        {club.memberCount} 人
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{club.name}</h3>
                <p className="text-gray-600 text-lg line-clamp-2">{club.description}</p>
              </div>
              
              <button 
                onClick={() => !isJoined && handleJoinClick(club)}
                disabled={isJoined}
                className={`mt-4 w-full py-3 rounded-xl text-xl font-bold flex items-center justify-center gap-2 transition ${
                    isJoined 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-primary text-white hover:bg-teal-700'
                }`}
              >
                {isJoined ? (
                    <>已加入 <CheckCircle className="w-6 h-6" /></>
                ) : (
                    <>申請加入 <ArrowRight className="w-6 h-6" /></>
                )}
              </button>
            </div>
          </div>
        )})}
      </div>

      {/* Confirmation Modal */}
      {joiningClub && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative animate-fade-in">
                <button 
                    onClick={() => setJoiningClub(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-6 h-6" />
                </button>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">確認加入？</h3>
                <p className="text-lg text-gray-600 mb-6">
                    您即將申請加入「<span className="font-bold text-primary">{joiningClub.name}</span>」。
                    <br/>這是一個適合{joiningClub.category}愛好者的社團。
                </p>

                <div className="flex gap-4">
                    <button 
                        onClick={() => setJoiningClub(null)}
                        className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl text-xl font-bold hover:bg-gray-200"
                    >
                        再想想
                    </button>
                    <button 
                        onClick={confirmJoin}
                        className="flex-1 bg-primary text-white py-3 rounded-xl text-xl font-bold hover:bg-teal-700 shadow-md"
                    >
                        確定加入
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};