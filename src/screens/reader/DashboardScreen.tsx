import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../state/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Mock data - in production this would come from the database
  const readerData = {
    todayEarnings: 127.50,
    pendingPayout: 89.50,
    totalEarnings: 1250.00,
    sessionsToday: 8,
    avgRating: 4.8,
    totalReviews: 156,
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
      className="flex-1"
      imageStyle={{ opacity: 0.3 }}
    >
      <SafeAreaView className="flex-1 bg-black/70">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-4 pb-6">
            <Text className="text-4xl text-pink-400 text-center mb-2 font-bold italic">
              Reader Dashboard
            </Text>
            <Text className="text-white text-center opacity-80">
              Welcome back, {user?.firstName}!
            </Text>
          </View>

          {/* Availability Toggle */}
          <View className="mx-6 mb-6 p-4 bg-white/10 rounded-xl border border-pink-400/30">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-lg font-semibold">Availability Status</Text>
                <Text className="text-white/70">
                  {isAvailable ? 'You are currently online and available' : 'You are currently offline'}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-white mr-3">{isAvailable ? 'Online' : 'Offline'}</Text>
                <Switch
                  value={isAvailable}
                  onValueChange={setIsAvailable}
                  trackColor={{ false: '#374151', true: '#EC4899' }}
                  thumbColor={isAvailable ? '#FBBF24' : '#9CA3AF'}
                />
              </View>
            </View>
          </View>

          {/* Earnings Overview */}
          <View className="px-6 mb-6">
            <Text className="text-white text-xl font-semibold mb-4 font-serif">
              Earnings Overview
            </Text>
            
            <View className="grid grid-cols-2 gap-4">
              <View className="bg-gradient-to-br from-pink-500/20 to-purple-600/20 p-4 rounded-xl border border-pink-400/30">
                <Text className="text-pink-300 text-sm">Today's Earnings</Text>
                <Text className="text-white text-2xl font-bold">${readerData.todayEarnings.toFixed(2)}</Text>
                <Text className="text-green-400 text-xs mt-1">+12% from yesterday</Text>
              </View>
              
              <View className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 p-4 rounded-xl border border-purple-400/30">
                <Text className="text-purple-300 text-sm">Pending Payout</Text>
                <Text className="text-white text-2xl font-bold">${readerData.pendingPayout.toFixed(2)}</Text>
                <Text className="text-yellow-400 text-xs mt-1">Available tomorrow</Text>
              </View>
            </View>

            <View className="mt-4 bg-gradient-to-br from-gold-500/20 to-yellow-600/20 p-4 rounded-xl border border-gold-400/30">
              <Text className="text-gold-300 text-sm">Total Lifetime Earnings</Text>
              <Text className="text-white text-3xl font-bold">${readerData.totalEarnings.toFixed(2)}</Text>
              <Text className="text-white/70 text-sm mt-1">Across {readerData.totalReviews} completed sessions</Text>
            </View>
          </View>

          {/* Today's Stats */}
          <View className="px-6 mb-6">
            <Text className="text-white text-xl font-semibold mb-4 font-serif">
              Today's Performance
            </Text>
            
            <View className="flex-row space-x-4">
              <View className="flex-1 bg-white/10 p-4 rounded-xl border border-pink-400/20">
                <Ionicons name="chatbubbles" size={24} color="#EC4899" />
                <Text className="text-white text-lg font-bold mt-2">{readerData.sessionsToday}</Text>
                <Text className="text-white/70 text-sm">Sessions</Text>
              </View>
              
              <View className="flex-1 bg-white/10 p-4 rounded-xl border border-gold-400/20">
                <Ionicons name="star" size={24} color="#FFD700" />
                <Text className="text-white text-lg font-bold mt-2">{readerData.avgRating}</Text>
                <Text className="text-white/70 text-sm">Avg Rating</Text>
              </View>
              
              <View className="flex-1 bg-white/10 p-4 rounded-xl border border-green-400/20">
                <Ionicons name="time" size={24} color="#10B981" />
                <Text className="text-white text-lg font-bold mt-2">2.5h</Text>
                <Text className="text-white/70 text-sm">Online Time</Text>
              </View>
            </View>
          </View>

          {/* Rate Settings */}
          <View className="px-6 mb-6">
            <Text className="text-white text-xl font-semibold mb-4 font-serif">
              Your Rates
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row items-center justify-between p-4 bg-white/10 rounded-xl border border-pink-400/20">
                <View className="flex-row items-center">
                  <Ionicons name="chatbubble" size={20} color="#EC4899" />
                  <Text className="text-white ml-3">Chat Reading</Text>
                </View>
                <Text className="text-pink-400 font-semibold">$3.99/min</Text>
              </View>
              
              <View className="flex-row items-center justify-between p-4 bg-white/10 rounded-xl border border-purple-400/20">
                <View className="flex-row items-center">
                  <Ionicons name="call" size={20} color="#8B5CF6" />
                  <Text className="text-white ml-3">Phone Reading</Text>
                </View>
                <Text className="text-purple-400 font-semibold">$4.99/min</Text>
              </View>
              
              <View className="flex-row items-center justify-between p-4 bg-white/10 rounded-xl border border-indigo-400/20">
                <View className="flex-row items-center">
                  <Ionicons name="videocam" size={20} color="#6366F1" />
                  <Text className="text-white ml-3">Video Reading</Text>
                </View>
                <Text className="text-indigo-400 font-semibold">$6.99/min</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="px-6 mb-8">
            <Text className="text-white text-xl font-semibold mb-4 font-serif">
              Quick Actions
            </Text>
            
            <View className="space-y-3">
              <Pressable className="flex-row items-center p-4 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-xl border border-pink-400/30">
                <Ionicons name="settings" size={24} color="#EC4899" />
                <Text className="text-white ml-4 font-semibold">Edit Profile & Rates</Text>
              </Pressable>
              
              <Pressable className="flex-row items-center p-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl border border-purple-400/30">
                <Ionicons name="analytics" size={24} color="#8B5CF6" />
                <Text className="text-white ml-4 font-semibold">View Detailed Analytics</Text>
              </Pressable>
              
              <Pressable className="flex-row items-center p-4 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl border border-green-400/30">
                <Ionicons name="card" size={24} color="#10B981" />
                <Text className="text-white ml-4 font-semibold">Payout Settings</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}