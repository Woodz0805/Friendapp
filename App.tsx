import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile, Club } from './types';
import { MatchList } from './components/MatchList';
import { ClubList } from './components/ClubList';
import { Subscription } from './components/Subscription';
import { SupportChat } from './components/SupportChat';
import { VoiceAssistant } from './components/VoiceAssistant';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { ChatInterface } from './components/ChatInterface';
import { ChatList } from './components/ChatList';
import { IgnoredList } from './components/IgnoredList';
import { IdentityVerification } from './components/IdentityVerification';
import { Home, Users, HelpCircle, User, Star, MessageCircle } from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_PROFILES: UserProfile[] = [
  {
    id: '1', name: '王大明', age: 68, location: '台北市', distanceKm: 2.5,
    bio: '退休教師，喜歡週末去陽明山爬山，也喜歡研究茶葉。希望找個能一起喝茶聊天的朋友。',
    interests: ['爬山', '茶道', '閱讀'],
    imageUrl: 'https://picsum.photos/400/400?random=1',
    gender: 'male'
  },
  {
    id: '2', name: '林美惠', age: 65, location: '新北市', distanceKm: 5.0,
    bio: '剛開始學攝影，想找人一起去拍風景。平常喜歡在家種花養草。',
    interests: ['攝影', '園藝', '旅遊'],
    imageUrl: 'https://picsum.photos/400/400?random=2',
    gender: 'female'
  },
  {
    id: '3', name: '陳國強', age: 72, location: '桃園市', distanceKm: 12,
    bio: '喜歡下圍棋和聽古典音樂，每週都會去公園散步。',
    interests: ['音樂', '棋藝', '散步'],
    imageUrl: 'https://picsum.photos/400/400?random=3',
    gender: 'male'
  }
];

const MOCK_CLUBS: Club[] = [
  {
    id: 'c1', name: '北區銀髮登山社', description: '每週六早上集合，適合初學者的輕鬆步道行程，歡迎加入我們一起呼吸新鮮空氣！',
    memberCount: 128, category: '戶外', imageUrl: 'https://picsum.photos/600/300?random=10'
  },
  {
    id: 'c2', name: '快樂卡拉OK社', description: '愛唱歌的朋友看過來！我們每月舉辦兩次歡唱聚會，不管是老歌還是新歌都歡迎。',
    memberCount: 85, category: '娛樂', imageUrl: 'https://picsum.photos/600/300?random=11'
  },
  {
    id: 'c3', name: '養生太極拳班', description: '每天早上在公園一起打太極，強身健體，延年益壽。',
    memberCount: 200, category: '健康', imageUrl: 'https://picsum.photos/600/300?random=12'
  }
];

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  
  // Data State
  const [availableProfiles, setAvailableProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [ignoredProfiles, setIgnoredProfiles] = useState<UserProfile[]>([]);
  const [activeChats, setActiveChats] = useState<UserProfile[]>([]);
  const [activeChatProfile, setActiveChatProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Show splash screen for 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Handle Onboarding Completion
  const handleOnboardingComplete = (profile: UserProfile) => {
    setCurrentUser(profile);
    // After onboarding, go to Verification
    // But since verification component handles state internally, we just render it via logic below
  };

  const handleVerificationComplete = () => {
    setIsVerified(true);
    setCurrentView(ViewState.HOME);
  };

  // --- Actions ---

  const startChat = (profile: UserProfile) => {
    // Add to active chats if not already there
    if (!activeChats.find(c => c.id === profile.id)) {
        setActiveChats(prev => [profile, ...prev]);
    }
    // Remove from ignored if it was there (edge case from Ignored List)
    if (ignoredProfiles.find(p => p.id === profile.id)) {
        setIgnoredProfiles(prev => prev.filter(p => p.id !== profile.id));
    }

    setActiveChatProfile(profile);
    setCurrentView(ViewState.CHAT);
  };

  const passProfile = (profile: UserProfile) => {
    setAvailableProfiles(prev => prev.filter(p => p.id !== profile.id));
    setIgnoredProfiles(prev => [profile, ...prev]);
  };

  const restoreProfile = (profile: UserProfile) => {
      setIgnoredProfiles(prev => prev.filter(p => p.id !== profile.id));
      setAvailableProfiles(prev => [profile, ...prev]);
  };

  const updateChatLastMessage = (profileId: string, text: string) => {
      setActiveChats(prev => prev.map(chat => {
          if (chat.id === profileId) {
              return { ...chat, lastMessage: text, lastMessageTime: Date.now() };
          }
          return chat;
      }).sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0)));
  };


  // --- Render Logic ---

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!currentUser) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!isVerified) {
    return <IdentityVerification onVerified={handleVerificationComplete} />;
  }

  // --- Main Application Logic ---

  const renderContent = () => {
    switch (currentView) {
      case ViewState.HOME:
        return (
            <MatchList 
                matches={availableProfiles} 
                onStartChat={startChat} 
                onPass={passProfile}
                onViewIgnored={() => setCurrentView(ViewState.IGNORED_LIST)}
            />
        );
      case ViewState.CLUBS:
        return <ClubList clubs={MOCK_CLUBS} />;
      case ViewState.CHAT_LIST:
        return <ChatList chats={activeChats} onSelectChat={startChat} />;
      case ViewState.SUBSCRIBE:
        return <Subscription />;
      case ViewState.SUPPORT:
        return <SupportChat />;
      case ViewState.CHAT:
        return activeChatProfile 
          ? <ChatInterface 
                partner={activeChatProfile} 
                onBack={() => setCurrentView(ViewState.CHAT_LIST)} // Go back to list usually
                updateLastMessage={(text) => updateChatLastMessage(activeChatProfile.id, text)}
            />
          : <div className="p-10 text-center text-xl text-gray-500">請先選擇一位朋友聊天</div>;
      case ViewState.IGNORED_LIST:
        return (
            <IgnoredList 
                ignoredProfiles={ignoredProfiles}
                onRestore={restoreProfile}
                onChat={startChat}
                onBack={() => setCurrentView(ViewState.HOME)}
            />
        );
      case ViewState.PROFILE:
        return (
            <div className="p-6 text-center pt-20 pb-32">
                <img src={currentUser.imageUrl} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover" alt="My Profile"/>
                <h2 className="text-heading-1 font-bold text-gray-800">{currentUser.name}</h2>
                <p className="text-xl text-gray-600 mb-2">{currentUser.age}歲，{currentUser.location}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {currentUser.interests.map(t => (
                        <span key={t} className="bg-gray-100 px-3 py-1 rounded-full text-gray-600">{t}</span>
                    ))}
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-left mb-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-500 mb-2">自我介紹</h3>
                    <p className="text-lg text-gray-800 leading-relaxed">{currentUser.bio}</p>
                </div>
                <button className="w-full bg-white border border-gray-300 p-4 rounded-xl text-xl mb-3 shadow-sm font-bold text-gray-700">編輯個人檔案</button>
                <button className="w-full bg-white border border-gray-300 p-4 rounded-xl text-xl shadow-sm font-bold text-gray-700">帳戶設定</button>
            </div>
        );
      default:
        return <MatchList matches={availableProfiles} onStartChat={startChat} onPass={passProfile} onViewIgnored={() => setCurrentView(ViewState.IGNORED_LIST)} />;
    }
  };

  const NavButton = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button 
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center justify-center w-full py-3 transition-all ${
        currentView === view ? 'text-primary scale-105' : 'text-gray-400'
      }`}
    >
      <Icon className={`w-7 h-7 mb-1 ${currentView === view ? 'fill-current' : ''}`} strokeWidth={2} />
      <span className={`text-xs font-bold ${currentView === view ? 'text-primary' : 'text-gray-500'}`}>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-surface font-sans max-w-lg mx-auto shadow-2xl relative">
      
      {/* Top Header (Simple) - Hide in specific views */}
      {![ViewState.SUPPORT, ViewState.CHAT, ViewState.IGNORED_LIST].includes(currentView) && (
        <header className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-20">
            <h1 className="text-2xl font-bold text-primary tracking-wide">美PHONE有ㄩ</h1>
            <button 
                onClick={() => setCurrentView(ViewState.SUBSCRIBE)}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1 shadow-md"
            >
                <Star className="w-4 h-4 fill-white" />
                升級 VIP
            </button>
        </header>
      )}

      {/* Main Content Area */}
      <main className="min-h-screen">
        {renderContent()}
      </main>

      {/* Floating Voice Assistant - Hide in Chat to prevent confusion */}
      {currentView !== ViewState.CHAT && <VoiceAssistant />}

      {/* Bottom Navigation Bar */}
      {![ViewState.CHAT, ViewState.IGNORED_LIST].includes(currentView) && (
        <nav className="fixed bottom-0 max-w-lg w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30 flex justify-between px-2 pb-safe">
            <NavButton view={ViewState.HOME} icon={Home} label="首頁" />
            <NavButton view={ViewState.CHAT_LIST} icon={MessageCircle} label="聊天" />
            <NavButton view={ViewState.CLUBS} icon={Users} label="社團" />
            <NavButton view={ViewState.SUPPORT} icon={HelpCircle} label="客服" />
            <NavButton view={ViewState.PROFILE} icon={User} label="我的" />
        </nav>
      )}
    </div>
  );
};

export default App;
