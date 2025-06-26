import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Reader {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  isOnline: boolean;
  price: number;
  bio: string;
  experience: string;
}

export interface LiveStream {
  id: string;
  reader: Reader;
  title: string;
  thumbnail: string;
  viewers: number;
  category: string;
  isLive: boolean;
  scheduledTime?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: 'services' | 'digital' | 'physical';
  description: string;
  seller: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'reading' | 'order';
  isRead: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  content: string;
  timestamp: string;
  replies: number;
  likes: number;
  category: string;
  isSticky?: boolean;
}

interface AppState {
  // User authentication (persisted)
  user: {
    isAuthenticated: boolean;
    email: string;
    name: string;
    role: 'guest' | 'client' | 'reader' | 'admin';
    avatar?: string;
    walletBalance: number;
  };
  
  // User preferences (persisted)
  favoriteReaders: string[];
  readingHistory: string[];
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    categories: string[];
  };
  
  // Session data (not persisted)
  selectedCategory: string;
  searchQuery: string;
  unreadMessages: number;
  
  // Production data
  readers: Reader[];
  liveStreams: LiveStream[];
  products: Product[];
  messages: Message[];
  forumPosts: ForumPost[];
  allUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: 'client' | 'reader' | 'admin';
    status: 'active' | 'suspended' | 'pending';
    joinDate: string;
    lastActive: string;
    avatar?: string;
  }>;
  reports: Array<{
    id: string;
    type: string;
    content: string;
    reporter: string;
    reportedUser: string;
    timestamp: string;
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
    severity: 'low' | 'medium' | 'high';
  }>;
  
  // Actions
  updateUserProfile: (user: Partial<AppState['user']>) => void;
  signOut: () => void;
  setFavoriteReaders: (readers: string[]) => void;
  addToReadingHistory: (readerId: string) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setUnreadMessages: (count: number) => void;
  updatePreferences: (preferences: Partial<AppState['preferences']>) => void;
  markMessageAsRead: (messageId: string) => void;
  
  // Admin actions
  addUser: (userData: any) => void;
  updateUserStatus: (userId: string, status: 'active' | 'suspended' | 'pending') => void;
  deleteUser: (userId: string) => void;
  addReader: (readerData: any) => void;
  updateReader: (readerId: string, data: any) => void;
  addReport: (reportData: any) => void;
  updateReportStatus: (reportId: string, status: 'pending' | 'investigating' | 'resolved' | 'dismissed') => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Persisted state
      user: {
        isAuthenticated: false,
        email: '',
        name: 'Guest User',
        role: 'guest',
        walletBalance: 0,
      },
      favoriteReaders: [],
      readingHistory: [],
      preferences: {
        notifications: true,
        darkMode: false,
        categories: ['Love', 'Career', 'Spiritual', 'Life Path'],
      },
      
      // Session state
      selectedCategory: 'All',
      searchQuery: '',
      unreadMessages: 0,
      
      // Production data with sample data
      readers: [
        {
          id: '1',
          name: 'Luna Moonwhisper',
          avatar: '🌙',
          rating: 4.8,
          reviewCount: 156,
          specialties: ['Love', 'Career', 'Spiritual'],
          isOnline: true,
          price: 2.99,
          bio: 'Gifted psychic medium with over 10 years of experience helping souls find their path.',
          experience: '10+ years'
        },
        {
          id: '2',
          name: 'Crystal Starlight',
          avatar: '🔮',
          rating: 4.9,
          reviewCount: 203,
          specialties: ['Tarot', 'Dreams', 'Life Path'],
          isOnline: true,
          price: 3.99,
          bio: 'Expert tarot reader specializing in love and relationship guidance.',
          experience: '8+ years'
        }
      ],
      allUsers: [],
      reports: [],
      
      liveStreams: [],
      
      products: [
        {
          id: '1',
          title: 'Tarot Card Reading - Full Spread',
          price: 45.99,
          image: '🔮',
          category: 'services' as const,
          description: 'Comprehensive 10-card tarot reading with detailed interpretation',
          seller: 'Luna Moonwhisper'
        }
      ],
      
      messages: [],
      
      forumPosts: [],
      
      // Actions
      updateUserProfile: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
      signOut: () => set({
        user: {
          isAuthenticated: false,
          email: '',
          name: 'Guest User',
          role: 'guest',
          walletBalance: 0,
        },
        favoriteReaders: [],
        readingHistory: [],
      }),
      setFavoriteReaders: (readers) => set({ favoriteReaders: readers }),
      addToReadingHistory: (readerId) => set((state) => ({
        readingHistory: [readerId, ...state.readingHistory.filter(id => id !== readerId)].slice(0, 50)
      })),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setUnreadMessages: (count) => set({ unreadMessages: count }),
      updatePreferences: (preferences) => set((state) => ({
        preferences: { ...state.preferences, ...preferences }
      })),
      markMessageAsRead: (messageId) => set((state) => ({
        messages: state.messages.map(msg =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        ),
        unreadMessages: state.unreadMessages > 0 ? state.unreadMessages - 1 : 0
      })),
      
      // Admin actions
      addUser: (userData) => set((state) => ({
        allUsers: [...state.allUsers, {
          id: Date.now().toString(),
          joinDate: new Date().toISOString().split('T')[0],
          lastActive: 'Just now',
          status: 'active',
          ...userData
        }]
      })),
      
      updateUserStatus: (userId, status) => set((state) => ({
        allUsers: state.allUsers.map(user =>
          user.id === userId ? { ...user, status } : user
        )
      })),
      
      deleteUser: (userId) => set((state) => ({
        allUsers: state.allUsers.filter(user => user.id !== userId)
      })),
      
      addReader: (readerData) => set((state) => {
        const newReader = {
          id: Date.now().toString(),
          rating: 0,
          reviewCount: 0,
          isOnline: false,
          ...readerData
        };
        
        const newUser = {
          id: newReader.id,
          name: readerData.name,
          email: readerData.email,
          role: 'reader' as const,
          status: 'active' as const,
          joinDate: new Date().toISOString().split('T')[0],
          lastActive: 'Just now'
        };
        
        return {
          readers: [...state.readers, newReader],
          allUsers: [...state.allUsers, newUser]
        };
      }),
      
      updateReader: (readerId, data) => set((state) => ({
        readers: state.readers.map(reader =>
          reader.id === readerId ? { ...reader, ...data } : reader
        )
      })),
      
      addReport: (reportData) => set((state) => ({
        reports: [...state.reports, {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          status: 'pending' as const,
          ...reportData
        }]
      })),
      
      updateReportStatus: (reportId, status) => set((state) => ({
        reports: state.reports.map(report =>
          report.id === reportId ? { ...report, status } : report
        )
      }))
    }),
    {
      name: 'psychic-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        favoriteReaders: state.favoriteReaders,
        readingHistory: state.readingHistory,
        preferences: state.preferences,
        readers: state.readers,
        allUsers: state.allUsers,
        reports: state.reports,
        products: state.products,
        messages: state.messages,
        forumPosts: state.forumPosts,
        liveStreams: state.liveStreams,
      }),
      onRehydrateStorage: () => (state) => {
        // Migration: ensure role property exists for existing users
        if (state?.user && !state.user.role) {
          state.user.role = 'client';
        }
      },
    }
  )
);

export default useAppStore;