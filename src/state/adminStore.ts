import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdminState, AdminUser, CreateReaderData } from '../types/admin';
import ApiService from '../services/apiService';

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      admin: null,
      stats: null,
      readers: [],
      clients: [],
      activeSessions: [],
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Production admin credentials
          // In full production, this would call ApiService.adminLogin()
          const validAdmins = [
            {
              email: 'emilynnj14@gmail.com',
              password: 'JayJas1423!',
              admin: {
                id: 'admin-emilynn',
                email: 'emilynnj14@gmail.com',
                firstName: 'Emilynn',
                lastName: 'Johnson',
                role: 'admin' as const,
                isActive: true,
                createdAt: new Date().toISOString(),
              }
            },
            {
              email: 'admin@soulseer.com',
              password: 'admin123!',
              admin: {
                id: 'admin-system',
                email: 'admin@soulseer.com',
                firstName: 'SoulSeer',
                lastName: 'Admin',
                role: 'admin' as const,
                isActive: true,
                createdAt: new Date().toISOString(),
              }
            }
          ];

          const validAdmin = validAdmins.find(a => a.email === email && a.password === password);
          
          if (!validAdmin) {
            throw new Error('Invalid admin credentials');
          }

          const admin = validAdmin.admin;

          set({ 
            isAuthenticated: true, 
            admin, 
            isLoading: false 
          });

          // Load initial data
          get().loadStats();
          get().loadReaders();
          get().loadClients();
          get().loadActiveSessions();

        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Login failed' 
          });
          throw error;
        }
      },

      logout: () => {
        set({ 
          isAuthenticated: false, 
          admin: null, 
          stats: null,
          readers: [],
          clients: [],
          activeSessions: [],
          error: null 
        });
      },

      loadStats: async () => {
        try {
          // Production would use: await ApiService.getPlatformStats()
          const stats = {
            users: {
              totalUsers: 1247,
              totalClients: 1089,
              totalReaders: 158,
              newUsers30d: 234,
            },
            sessions: {
              totalSessions: 3456,
              completedSessions: 3289,
              sessionsToday: 89,
              avgSessionLength: 23.5,
            },
            revenue: {
              totalRevenue: 87543.21,
              revenueToday: 2890.45,
              revenue30d: 23456.78,
            },
          };
          set({ stats });
        } catch (error) {
          console.error('Failed to load stats:', error);
          set({ error: 'Failed to load platform statistics' });
        }
      },

      loadReaders: async () => {
        try {
          // Production would use: await ApiService.getAllReaders()
          const readers = [
            {
              id: 'reader-1',
              userId: 'user-reader-1',
              email: 'sarah.moon@soulseer.com',
              firstName: 'Sarah',
              lastName: 'Moon',
              bio: 'Experienced psychic medium with 10+ years of spiritual guidance',
              specialties: ['Tarot', 'Love & Relationships', 'Career'],
              chatRate: 3.99,
              phoneRate: 4.99,
              videoRate: 6.99,
              isAvailable: true,
              isOnline: true,
              totalEarnings: 12450.75,
              pendingEarnings: 89.50,
              rating: 4.8,
              totalReviews: 156,
              verificationStatus: 'approved' as const,
              stripeAccountId: 'acct_1234567890',
              createdAt: new Date().toISOString(),
            },
            {
              id: 'reader-2',
              userId: 'user-reader-2',
              email: 'luna.star@soulseer.com',
              firstName: 'Luna',
              lastName: 'Star',
              bio: 'Astrology expert and spiritual counselor',
              specialties: ['Astrology', 'Career', 'Spiritual Guidance'],
              chatRate: 4.99,
              phoneRate: 5.99,
              videoRate: 7.99,
              isAvailable: false,
              isOnline: false,
              totalEarnings: 8932.45,
              pendingEarnings: 124.75,
              rating: 4.9,
              totalReviews: 89,
              verificationStatus: 'approved' as const,
              stripeAccountId: 'acct_0987654321',
              createdAt: new Date().toISOString(),
            },
          ];
          
          set({ readers });
        } catch (error) {
          console.error('Failed to load readers:', error);
          set({ error: 'Failed to load readers' });
        }
      },

      loadClients: async () => {
        try {
          // Production would use: await ApiService.getAllClients()
          const clients = [
            {
              id: 'client-1',
              userId: 'user-client-1',
              email: 'john.doe@email.com',
              firstName: 'John',
              lastName: 'Doe',
              balance: 50.00,
              totalSpent: 234.56,
              stripeCustomerId: 'cus_1234567890',
              createdAt: new Date().toISOString(),
            },
            {
              id: 'client-2',
              userId: 'user-client-2',
              email: 'jane.smith@email.com',
              firstName: 'Jane',
              lastName: 'Smith',
              balance: 125.75,
              totalSpent: 567.89,
              stripeCustomerId: 'cus_0987654321',
              createdAt: new Date().toISOString(),
            },
          ];
          
          set({ clients });
        } catch (error) {
          console.error('Failed to load clients:', error);
          set({ error: 'Failed to load clients' });
        }
      },

      loadActiveSessions: async () => {
        try {
          // Production would use: await ApiService.getActiveSessions()
          const sessions = [
            {
              id: 'session-1',
              sessionType: 'video' as const,
              status: 'active' as const,
              ratePerMinute: 6.99,
              startTime: new Date().toISOString(),
              totalMinutes: 15,
              totalCost: 104.85,
              readerFirstName: 'Sarah',
              readerLastName: 'Moon',
              clientFirstName: 'John',
              clientLastName: 'Doe',
              createdAt: new Date().toISOString(),
            },
            {
              id: 'session-2',
              sessionType: 'chat' as const,
              status: 'active' as const,
              ratePerMinute: 3.99,
              startTime: new Date().toISOString(),
              totalMinutes: 8,
              totalCost: 31.92,
              readerFirstName: 'Luna',
              readerLastName: 'Star',
              clientFirstName: 'Jane',
              clientLastName: 'Smith',
              createdAt: new Date().toISOString(),
            },
          ];
          
          set({ activeSessions: sessions });
        } catch (error) {
          console.error('Failed to load active sessions:', error);
          set({ error: 'Failed to load active sessions' });
        }
      },

      createReader: async (data: CreateReaderData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Production would use: await ApiService.createReader(data)
          console.log('Creating reader:', data);
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Add the new reader to the current list
          const newReader = {
            id: `reader-${Date.now()}`,
            userId: `user-reader-${Date.now()}`,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            bio: data.bio,
            specialties: data.specialties,
            chatRate: data.chatRate,
            phoneRate: data.phoneRate,
            videoRate: data.videoRate,
            isAvailable: false,
            isOnline: false,
            totalEarnings: 0,
            pendingEarnings: 0,
            rating: 0,
            totalReviews: 0,
            verificationStatus: 'pending' as const,
            createdAt: new Date().toISOString(),
          };

          const { readers } = get();
          set({ readers: [newReader, ...readers], isLoading: false });
          
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to create reader' 
          });
          throw error;
        }
      },

      updateReader: async (userId: string, updates: any) => {
        set({ isLoading: true, error: null });
        
        try {
          // Production would use: await ApiService.updateReader(userId, updates)
          console.log('Updating reader:', userId, updates);
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { readers } = get();
          const updatedReaders = readers.map(reader => 
            reader.userId === userId ? { ...reader, ...updates } : reader
          );
          
          set({ readers: updatedReaders, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to update reader' 
          });
          throw error;
        }
      },

      deactivateUser: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Production would use: await ApiService.deactivateUser(userId)
          console.log('Deactivating user:', userId);
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { readers, clients } = get();
          
          // Remove from readers list
          const updatedReaders = readers.filter(reader => reader.userId !== userId);
          
          // Remove from clients list
          const updatedClients = clients.filter(client => client.userId !== userId);
          
          set({ 
            readers: updatedReaders, 
            clients: updatedClients,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to deactivate user' 
          });
          throw error;
        }
      },

      refundClient: async (userId: string, amount: number, reason: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Production would use: await ApiService.refundClient(userId, amount, reason)
          console.log('Processing refund:', { userId, amount, reason });
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { clients } = get();
          const updatedClients = clients.map(client => 
            client.userId === userId 
              ? { ...client, balance: client.balance + amount }
              : client
          );
          
          set({ clients: updatedClients, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to process refund' 
          });
          throw error;
        }
      },
    }),
    {
      name: 'admin-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        admin: state.admin,
      }),
    }
  )
);