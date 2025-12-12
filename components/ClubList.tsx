import React from 'react';
import { Club } from '../types';
import { Users, ArrowRight } from 'lucide-react';

interface ClubListProps {
  clubs: Club[];
}

export const ClubList: React.FC<ClubListProps> = ({ clubs }) => {
  return (
    <div className="pb-24 px-4">
      <div className="py-6">
        <h2 className="text-heading-1 font-bold text-primary mb-2">同好社團</h2>
        <p className="text-xl text-gray-600">加入感興趣的社團，大家一起出來玩！</p>
      </div>

      <div className="grid gap-6">
        {clubs.map(club => (
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
              
              <button className="mt-4 w-full bg-primary text-white py-3 rounded-xl text-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 transition">
                申請加入 <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
