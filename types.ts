export interface UserProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  distanceKm: number; // For matches, this is distance. For "Me", this might be 0.
  bio: string;
  interests: string[];
  imageUrl: string;
  gender?: 'male' | 'female';
  preference?: 'male' | 'female' | 'both';
  lastMessage?: string; // For Chat List
  lastMessageTime?: number; // For Chat List
}

export interface Club {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  isRecurring: boolean;
}

export enum ViewState {
  HOME = 'HOME',
  CLUBS = 'CLUBS',
  SUPPORT = 'SUPPORT',
  PROFILE = 'PROFILE',
  SUBSCRIBE = 'SUBSCRIBE',
  CHAT = 'CHAT',
  CHAT_LIST = 'CHAT_LIST',
  IGNORED_LIST = 'IGNORED_LIST',
  VERIFICATION = 'VERIFICATION'
}
