import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { Camera, Check, User, Smile, Image as ImageIcon } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const INTEREST_TAGS = [
  '爬山', '園藝', '烹飪', '攝影', '音樂', '茶道', 
  '下棋', '太極', '旅遊', '閱讀', '跳舞', '書法',
  '美食', '養生', '寵物'
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    bio: '',
    gender: '' as 'male' | 'female' | '',
    preference: '' as 'male' | 'female' | 'both' | '',
    interests: [] as string[],
    imageUrl: ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleInterest = (tag: string) => {
    setFormData(prev => {
      if (prev.interests.includes(tag)) {
        return { ...prev, interests: prev.interests.filter(t => t !== tag) };
      } else {
        return { ...prev, interests: [...prev.interests, tag] };
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAndSubmit = () => {
    const newErrors: string[] = [];
    if (!formData.name) newErrors.push('請輸入您的姓名');
    if (!formData.age) newErrors.push('請輸入您的年齡');
    if (!formData.location) newErrors.push('請輸入您的居住地');
    if (!formData.gender) newErrors.push('請選擇您的性別');
    if (!formData.preference) newErrors.push('請選擇想認識的對象性別');
    if (!formData.bio) newErrors.push('請簡單介紹一下自己');
    if (formData.interests.length < 3) newErrors.push('請至少選擇 3 個興趣');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const defaultImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=0D9488&color=fff&size=400`;

    const profile: UserProfile = {
      id: 'current-user',
      name: formData.name,
      age: parseInt(formData.age),
      location: formData.location,
      distanceKm: 0,
      bio: formData.bio,
      interests: formData.interests,
      imageUrl: formData.imageUrl || defaultImage,
      gender: formData.gender as 'male' | 'female',
      preference: formData.preference as 'male' | 'female' | 'both'
    };

    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-surface p-4 pb-24 max-w-lg mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-primary p-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">建立個人檔案</h2>
          <p className="text-white/80 text-lg">讓我們更認識您，才能幫您找到好朋友！</p>
        </div>

        {errors.length > 0 && (
            <div className="bg-red-50 p-4 border-l-4 border-red-500 m-4">
                <h3 className="font-bold text-red-700 text-lg mb-2">請補充以下資料：</h3>
                <ul className="list-disc list-inside text-red-600 text-lg">
                    {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                </ul>
            </div>
        )}

        <div className="p-6 space-y-8">
          
          {/* Section 0: Profile Picture */}
          <section className="flex flex-col items-center">
             <div className="relative mb-4">
                <div className="w-40 h-40 rounded-full border-4 border-gray-100 shadow-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    {formData.imageUrl ? (
                        <img src={formData.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-20 h-20 text-gray-300" />
                    )}
                </div>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-secondary text-white p-3 rounded-full shadow-lg border-2 border-white hover:bg-yellow-500"
                >
                    <Camera className="w-6 h-6" />
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden" 
                />
             </div>
             <p className="text-gray-500 text-lg">點擊相機圖示上傳照片</p>
          </section>

          {/* Section 1: Basic Info */}
          <section>
            <div className="flex items-center gap-2 mb-4">
                <User className="w-8 h-8 text-secondary" />
                <h3 className="text-2xl font-bold text-gray-800">基本資料</h3>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-600 text-lg font-bold mb-2">您的姓名 (或暱稱)</label>
                    <input 
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl p-4 text-xl focus:border-primary focus:outline-none"
                        placeholder="例：王大明"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-600 text-lg font-bold mb-2">年齡</label>
                        <input 
                            type="number"
                            value={formData.age}
                            onChange={e => setFormData({...formData, age: e.target.value})}
                            className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl p-4 text-xl focus:border-primary focus:outline-none"
                            placeholder="65"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 text-lg font-bold mb-2">居住城市</label>
                        <input 
                            type="text"
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                            className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl p-4 text-xl focus:border-primary focus:outline-none"
                            placeholder="例：台北市"
                        />
                    </div>
                </div>
            </div>
          </section>

          {/* Section 2: Gender & Preference */}
          <section className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
                <Smile className="w-8 h-8 text-secondary" />
                <h3 className="text-2xl font-bold text-gray-800">交友偏好</h3>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-gray-600 text-lg font-bold mb-3">您的性別</label>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setFormData({...formData, gender: 'male'})}
                            className={`flex-1 py-4 rounded-xl text-xl font-bold border-2 transition-all ${formData.gender === 'male' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-300'}`}
                        >
                            男士
                        </button>
                        <button 
                            onClick={() => setFormData({...formData, gender: 'female'})}
                            className={`flex-1 py-4 rounded-xl text-xl font-bold border-2 transition-all ${formData.gender === 'female' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-300'}`}
                        >
                            女士
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-600 text-lg font-bold mb-3">想認識的對象</label>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setFormData({...formData, preference: 'male'})}
                            className={`flex-1 py-3 rounded-xl text-lg font-bold border-2 transition-all ${formData.preference === 'male' ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-500 border-gray-300'}`}
                        >
                            男士
                        </button>
                        <button 
                            onClick={() => setFormData({...formData, preference: 'female'})}
                            className={`flex-1 py-3 rounded-xl text-lg font-bold border-2 transition-all ${formData.preference === 'female' ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-500 border-gray-300'}`}
                        >
                            女士
                        </button>
                        <button 
                            onClick={() => setFormData({...formData, preference: 'both'})}
                            className={`flex-1 py-3 rounded-xl text-lg font-bold border-2 transition-all ${formData.preference === 'both' ? 'bg-secondary text-white border-secondary' : 'bg-white text-gray-500 border-gray-300'}`}
                        >
                            都想認識
                        </button>
                    </div>
                </div>
            </div>
          </section>

          {/* Section 3: Bio */}
          <section className="border-t pt-6">
            <label className="block text-gray-600 text-2xl font-bold mb-3">自我介紹</label>
            <textarea 
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl p-4 text-xl h-32 focus:border-primary focus:outline-none"
                placeholder="寫些什麼讓大家認識您...例如您喜歡做什麼？"
            />
          </section>

          {/* Section 4: Interests */}
          <section className="border-t pt-6">
            <label className="block text-gray-600 text-2xl font-bold mb-4">
                您的興趣 <span className="text-base font-normal text-gray-400">(請至少選3個)</span>
            </label>
            <div className="flex flex-wrap gap-3">
                {INTEREST_TAGS.map(tag => (
                    <button
                        key={tag}
                        onClick={() => toggleInterest(tag)}
                        className={`px-6 py-3 rounded-full text-xl font-medium border-2 transition-all ${
                            formData.interests.includes(tag)
                            ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                            : 'bg-white text-gray-500 border-gray-200'
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
          </section>

          {/* Submit Button */}
          <div className="pt-6">
            <button 
                onClick={validateAndSubmit}
                className="w-full bg-gradient-to-r from-primary to-teal-700 text-white text-2xl font-bold py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3"
            >
                完成，開始交友 <Check className="w-8 h-8" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
