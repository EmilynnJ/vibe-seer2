import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminStore } from '../../state/adminStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AdminDashboardScreen() {
  const { 
    admin, 
    stats, 
    readers, 
    clients, 
    activeSessions, 
    isLoading, 
    loadStats, 
    loadReaders, 
    loadClients, 
    loadActiveSessions 
  } = useAdminStore();
  
  const navigation = useNavigation();

  useEffect(() => {
    // Refresh data on mount
    refreshData();
  }, []);

  const refreshData = async () => {
    await Promise.all([
      loadStats(),
      loadReaders(),
      loadClients(),
      loadActiveSessions()
    ]);
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <ImageBackground
      source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
      className="flex-1"
      imageStyle={{ opacity: 0.2 }}
    >
      <SafeAreaView className="flex-1 bg-black/80">
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
          }
        >
          {/* Header */}
          <View className="px-6 pt-4 pb-6 border-b border-pink-400/30">
            <Text className="text-4xl text-pink-400 font-bold italic">
              Admin Dashboard
            </Text>
            <Text className="text-white/80 mt-1">
              Welcome back, {admin?.firstName}!
            </Text>
          </View>

          {/* Quick Stats */}
          {stats && (
            <View className="px-6 pt-6">
              <Text className="text-white text-xl font-semibold mb-4 font-serif">
                Platform Overview
              </Text>
              
              <View className="grid grid-cols-2 gap-4 mb-6">
                <View className="bg-gradient-to-br from-pink-500/20 to-purple-600/20 p-4 rounded-xl border border-pink-400/30">
                  <Ionicons name="people" size={24} color="#EC4899" />
                  <Text className="text-white text-2xl font-bold mt-2">
                    {stats.users.totalUsers}
                  </Text>
                  <Text className="text-pink-300 text-sm">Total Users</Text>
                  <Text className="text-green-400 text-xs mt-1">
                    +{stats.users.newUsers30d} this month
                  </Text>
                </View>
                
                <View className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 p-4 rounded-xl border border-purple-400/30">
                  <Ionicons name="chatbubbles" size={24} color="#8B5CF6" />
                  <Text className="text-white text-2xl font-bold mt-2">
                    {stats.sessions.sessionsToday}
                  </Text>
                  <Text className="text-purple-300 text-sm">Sessions Today</Text>
                  <Text className="text-white/60 text-xs mt-1">
                    {stats.sessions.totalSessions} total
                  </Text>
                </View>
              </View>

              <View className="bg-gradient-to-br from-gold-500/20 to-yellow-600/20 p-4 rounded-xl border border-gold-400/30 mb-6">
                <Ionicons name="trending-up" size={24} color="#FBBF24" />
                <Text className="text-white text-3xl font-bold mt-2">
                  {formatCurrency(stats.revenue.revenueToday)}
                </Text>
                <Text className="text-gold-300 text-sm">Revenue Today</Text>
                <Text className="text-white/70 text-sm mt-1">
                  {formatCurrency(stats.revenue.revenue30d)} this month • {formatCurrency(stats.revenue.totalRevenue)} total
                </Text>
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View className="px-6 mb-6">
            <Text className="text-white text-xl font-semibold mb-4 font-serif">
              Quick Actions
            </Text>
            
            <View className="space-y-3">
              <Pressable 
                className="flex-row items-center p-4 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-xl border border-pink-400/30"
                onPress={() => (navigation as any).navigate('Readers')}
              >
                <Ionicons name="person-add" size={24} color="#EC4899" />
                <View className="ml-4 flex-1">
                  <Text className="text-white font-semibold">Manage Readers</Text>
                  <Text className="text-white/70 text-sm">{readers.length} total readers</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#EC4899" />
              </Pressable>
              
              <Pressable 
                className="flex-row items-center p-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl border border-purple-400/30"
                onPress={() => (navigation as any).navigate('Clients')}
              >
                <Ionicons name="people" size={24} color="#8B5CF6" />
                <View className="ml-4 flex-1">
                  <Text className="text-white font-semibold">Manage Clients</Text>
                  <Text className="text-white/70 text-sm">{clients.length} total clients</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8B5CF6" />
              </Pressable>
              
              <Pressable 
                className="flex-row items-center p-4 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl border border-green-400/30"
                onPress={() => (navigation as any).navigate('Dashboard')}
              >
                <Ionicons name="radio" size={24} color="#10B981" />
                <View className="ml-4 flex-1">
                  <Text className="text-white font-semibold">Active Sessions</Text>
                  <Text className="text-white/70 text-sm">{activeSessions.length} sessions running</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#10B981" />
              </Pressable>
              
              <Pressable 
                className="flex-row items-center p-4 bg-gradient-to-r from-yellow-500/20 to-orange-600/20 rounded-xl border border-yellow-400/30"
                onPress={() => (navigation as any).navigate('Analytics')}
              >
                <Ionicons name="analytics" size={24} color="#FBBF24" />
                <View className="ml-4 flex-1">
                  <Text className="text-white font-semibold">Analytics & Reports</Text>
                  <Text className="text-white/70 text-sm">View detailed insights</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#FBBF24" />
              </Pressable>
            </View>
          </View>

          {/* Recent Activity */}
          <View className="px-6 mb-8">
            <Text className="text-white text-xl font-semibold mb-4 font-serif">
              Recent Activity
            </Text>
            
            {activeSessions.slice(0, 3).map((session) => (
              <View key={session.id} className="mb-3 p-4 bg-white/10 rounded-xl border border-pink-400/20">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-white font-semibold">
                      {session.sessionType.toUpperCase()} Session
                    </Text>
                    <Text className="text-white/70 text-sm">
                      {session.readerFirstName} {session.readerLastName} • {session.clientFirstName} {session.clientLastName}
                    </Text>
                    <Text className="text-pink-300 text-sm">
                      {formatCurrency(session.ratePerMinute)}/min
                    </Text>
                  </View>
                  <View className="items-end">
                    <View className="bg-green-500 px-2 py-1 rounded-full">
                      <Text className="text-white text-xs font-semibold">ACTIVE</Text>
                    </View>
                    <Text className="text-white/60 text-xs mt-1">
                      {session.totalMinutes}min
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}