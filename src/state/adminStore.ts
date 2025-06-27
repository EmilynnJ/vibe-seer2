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
          const stats = await ApiService.getPlatformStats();
          set({ stats });
        } catch (error) {
          console.error('Failed to load stats:', error);
          set({ error: 'Failed to load platform statistics' });
        }
      },

      loadReaders: async () => {
        try {
          const readers = await ApiService.getAllReaders();
          set({ readers });
        } catch (error) {
          console.error('Failed to load readers:', error);
          set({ error: 'Failed to load readers' });
        }
      },

      loadClients: async () => {
        try {
          const clients = await ApiService.getAllClients();
          set({ clients });
        } catch (error) {
          console.error('Failed to load clients:', error);
          set({ error: 'Failed to load clients' });
        }
      },

      loadActiveSessions: async () => {
        try {
          const sessions = await ApiService.getActiveSessions();
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
          await ApiService.createReader(data);

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
          await ApiService.updateReader(userId, updates);

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
          await ApiService.deactivateUser(userId);

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
          await ApiService.refundClient(userId, amount, reason);

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