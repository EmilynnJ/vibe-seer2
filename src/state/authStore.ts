import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User, RegisterData } from '../types/user';

// Mock users for demonstration - in production this would come from Neon database
const mockUsers = [
  {
    id: '1',
    email: 'client@test.com',
    password: 'password',
    role: 'client' as const,
    firstName: 'John',
    lastName: 'Doe',
    balance: 50.00,
    totalSpent: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'reader@test.com',
    password: 'password',
    role: 'reader' as const,
    firstName: 'Sarah',
    lastName: 'Moon',
    bio: 'Experienced psychic medium with 10+ years of spiritual guidance',
    specialties: ['Tarot', 'Love & Relationships', 'Career'],
    rating: 4.8,
    totalReviews: 156,
    chatRate: 3.99,
    phoneRate: 4.99,
    videoRate: 6.99,
    isAvailable: true,
    isOnline: true,
    totalEarnings: 1250.00,
    pendingEarnings: 89.50,
    createdAt: new Date().toISOString(),
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = mockUsers.find(u => u.email === email && u.password === password);
          if (!user) {
            throw new Error('Invalid email or password');
          }

          const { password: _, ...userWithoutPassword } = user;
          set({ 
            user: userWithoutPassword as User, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user already exists
          if (mockUsers.find(u => u.email === userData.email)) {
            throw new Error('User already exists');
          }

          const newUser = {
            id: Date.now().toString(),
            ...userData,
            balance: 0,
            totalSpent: 0,
            createdAt: new Date().toISOString(),
          };

          // In production, this would be saved to database
          mockUsers.push({ ...newUser, password: userData.password });

          const { password: _, ...userWithoutPassword } = newUser;
          set({ 
            user: userWithoutPassword as User, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateBalance: (amount: number) => {
        const { user } = get();
        if (user && user.role === 'client') {
          const clientUser = user as any;
          set({
            user: {
              ...user,
              balance: clientUser.balance + amount,
            } as User
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);