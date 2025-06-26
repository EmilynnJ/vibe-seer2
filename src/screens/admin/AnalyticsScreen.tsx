import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminStore } from '../../state/adminStore';
import { Ionicons } from '@expo/vector-icons';

export default function AnalyticsScreen() {
  const { stats, loadStats } = useAdminStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <ImageBackground
      source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
      className="flex-1"
      imageStyle={{ opacity: 0.2 }}
    >
      <SafeAreaView className="flex-1 bg-black/80">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-4 pb-6 border-b border-pink-400/30">
            <Text className="text-4xl text-pink-400 font-bold italic">
              Analytics
            </Text>
            <Text className="text-white/80 mt-1">
              Platform insights and metrics
            </Text>
          </View>

          {stats && (
            <View className="px-6 pt-6">
              {/* User Metrics */}
              <View className="mb-8">
                <Text className="text-white text-xl font-semibold mb-4 font-serif">
                  User Metrics
                </Text>
                
                <View className="grid grid-cols-2 gap-4">
                  <View className="bg-gradient-to-br from-pink-500/20 to-purple-600/20 p-4 rounded-xl border border-pink-400/30">
                    <Ionicons name="people" size={24} color="#EC4899" />
                    <Text className="text-white text-2xl font-bold mt-2">
                      {stats.users.totalUsers}
                    </Text>
                    <Text className="text-pink-300 text-sm">Total Users</Text>
                  </View>
                  
                  <View className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 p-4 rounded-xl border border-purple-400/30">
                    <Ionicons name="person-add" size={24} color="#8B5CF6" />
                    <Text className="text-white text-2xl font-bold mt-2">
                      {stats.users.newUsers30d}
                    </Text>
                    <Text className="text-purple-300 text-sm">New (30 days)</Text>
                  </View>
                </View>

                <View className="grid grid-cols-2 gap-4 mt-4">
                  <View className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 p-4 rounded-xl border border-green-400/30">
                    <Ionicons name="person" size={24} color="#10B981" />
                    <Text className="text-white text-2xl font-bold mt-2">
                      {stats.users.totalClients}
                    </Text>
                    <Text className="text-green-300 text-sm">Clients</Text>
                  </View>
                  
                  <View className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 p-4 rounded-xl border border-yellow-400/30">
                    <Ionicons name="star" size={24} color="#FBBF24" />
                    <Text className="text-white text-2xl font-bold mt-2">
                      {stats.users.totalReaders}
                    </Text>
                    <Text className="text-yellow-300 text-sm">Readers</Text>
                  </View>
                </View>
              </View>

              {/* Session Metrics */}
              <View className="mb-8">
                <Text className="text-white text-xl font-semibold mb-4 font-serif">
                  Session Metrics
                </Text>
                
                <View className="grid grid-cols-2 gap-4">
                  <View className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 p-4 rounded-xl border border-blue-400/30">
                    <Ionicons name="chatbubbles" size={24} color="#3B82F6" />
                    <Text className="text-white text-2xl font-bold mt-2">
                      {stats.sessions.totalSessions}
                    </Text>
                    <Text className="text-blue-300 text-sm">Total Sessions</Text>
                  </View>
                  
                  <View className="bg-gradient-to-br from-cyan-500/20 to-teal-600/20 p-4 rounded-xl border border-cyan-400/30">
                    <Ionicons name="checkmark-circle" size={24} color="#06B6D4" />
                    <Text className="text-white text-2xl font-bold mt-2">
                      {stats.sessions.completedSessions}
                    </Text>
                    <Text className="text-cyan-300 text-sm">Completed</Text>
                  </View>
                </View>

                <View className="grid grid-cols-2 gap-4 mt-4">
                  <View className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 p-4 rounded-xl border border-indigo-400/30">
                    <Ionicons name="today" size={24} color="#6366F1" />
                    <Text className="text-white text-2xl font-bold mt-2">
                      {stats.sessions.sessionsToday}
                    </Text>
                    <Text className="text-indigo-300 text-sm">Today</Text>
                  </View>
                  
                  <View className="bg-gradient-to-br from-rose-500/20 to-pink-600/20 p-4 rounded-xl border border-rose-400/30">
                    <Ionicons name="time" size={24} color="#F43F5E" />
                    <Text className="text-white text-2xl font-bold mt-2">
                      {Math.round(stats.sessions.avgSessionLength || 0)}
                    </Text>
                    <Text className="text-rose-300 text-sm">Avg Minutes</Text>
                  </View>
                </View>
              </View>

              {/* Revenue Metrics */}
              <View className="mb-8">
                <Text className="text-white text-xl font-semibold mb-4 font-serif">
                  Revenue Metrics
                </Text>
                
                <View className="bg-gradient-to-br from-gold-500/20 to-yellow-600/20 p-6 rounded-xl border border-gold-400/30 mb-4">
                  <Ionicons name="trending-up" size={32} color="#FBBF24" />
                  <Text className="text-white text-3xl font-bold mt-2">
                    {formatCurrency(stats.revenue.totalRevenue)}
                  </Text>
                  <Text className="text-gold-300 text-lg">Total Revenue</Text>
                </View>

                <View className="grid grid-cols-2 gap-4">
                  <View className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 p-4 rounded-xl border border-emerald-400/30">
                    <Ionicons name="calendar" size={24} color="#10B981" />
                    <Text className="text-white text-xl font-bold mt-2">
                      {formatCurrency(stats.revenue.revenueToday)}
                    </Text>
                    <Text className="text-emerald-300 text-sm">Today</Text>
                  </View>
                  
                  <View className="bg-gradient-to-br from-teal-500/20 to-cyan-600/20 p-4 rounded-xl border border-teal-400/30">
                    <Ionicons name="calendar-outline" size={24} color="#14B8A6" />
                    <Text className="text-white text-xl font-bold mt-2">
                      {formatCurrency(stats.revenue.revenue30d)}
                    </Text>
                    <Text className="text-teal-300 text-sm">30 Days</Text>
                  </View>
                </View>
              </View>

              {/* Performance Indicators */}
              <View className="mb-8">
                <Text className="text-white text-xl font-semibold mb-4 font-serif">
                  Performance Indicators
                </Text>
                
                <View className="space-y-4">
                  <View className="bg-white/10 rounded-xl p-4 border border-pink-400/20">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-white font-semibold">Session Completion Rate</Text>
                      <Text className="text-green-400 font-bold">
                        {stats.sessions.totalSessions > 0 
                          ? Math.round((stats.sessions.completedSessions / stats.sessions.totalSessions) * 100)
                          : 0}%
                      </Text>
                    </View>
                    <View className="mt-2 h-2 bg-gray-700 rounded-full">
                      <View 
                        className="h-2 bg-green-400 rounded-full"
                        style={{ 
                          width: `${stats.sessions.totalSessions > 0 
                            ? (stats.sessions.completedSessions / stats.sessions.totalSessions) * 100
                            : 0}%` 
                        }}
                      />
                    </View>
                  </View>

                  <View className="bg-white/10 rounded-xl p-4 border border-pink-400/20">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-white font-semibold">Average Revenue per User</Text>
                      <Text className="text-gold-400 font-bold">
                        {formatCurrency(
                          stats.users.totalUsers > 0 
                            ? stats.revenue.totalRevenue / stats.users.totalUsers
                            : 0
                        )}
                      </Text>
                    </View>
                  </View>

                  <View className="bg-white/10 rounded-xl p-4 border border-pink-400/20">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-white font-semibold">Average Revenue per Session</Text>
                      <Text className="text-gold-400 font-bold">
                        {formatCurrency(
                          stats.sessions.completedSessions > 0 
                            ? stats.revenue.totalRevenue / stats.sessions.completedSessions
                            : 0
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}