import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAppStore from '../state/appStore';
import BackgroundImage from '../components/BackgroundImage';

export default function ReaderDashboardScreen() {
  const navigation = useNavigation();
  const { user, readers } = useAppStore();
  const [isOnline, setIsOnline] = useState(true);
  const [todaysEarnings, setTodaysEarnings] = useState(342.50);
  const [totalReadings, setTotalReadings] = useState(247);
  const [rating, setRating] = useState(4.9);
  
  // Find current reader data
  const readerData = readers.find(r => r.id === user.email) || readers[0];

  const readerStats = [
    { label: 'Total Readings', value: totalReadings.toString(), icon: 'book', color: 'bg-purple-600/30 text-purple-200' },
    { label: 'Rating', value: rating.toString(), icon: 'star', color: 'bg-amber-600/30 text-amber-200' },
    { label: 'Earnings Today', value: `${todaysEarnings.toFixed(2)}`, icon: 'card', color: 'bg-green-600/30 text-green-200' },
    { label: 'Rate Per Min', value: `${readerData?.price || 3.99}/min`, icon: 'time', color: 'bg-blue-600/30 text-blue-200' },
  ];

  const readerActions = [
    { title: 'Go Live', icon: 'radio', color: 'bg-red-600/80 backdrop-blur-sm border border-red-400/50', screen: 'Live' },
    { title: 'View Earnings', icon: 'trending-up', color: 'bg-green-600/80 backdrop-blur-sm border border-green-400/50', screen: 'ReaderEarnings' },
    { title: 'Client Messages', icon: 'mail', color: 'bg-blue-600/80 backdrop-blur-sm border border-blue-400/50', screen: 'Messages' },
    { title: 'My Profile', icon: 'person', color: 'bg-indigo-600/80 backdrop-blur-sm border border-indigo-400/50', screen: 'Profile' },
    { title: 'View Shop', icon: 'storefront', color: 'bg-purple-600/80 backdrop-blur-sm border border-purple-400/50', screen: 'Shop' },
    { title: 'Back to Home', icon: 'home', color: 'bg-amber-600/80 backdrop-blur-sm border border-amber-400/50', action: 'home' },
  ];

  const upcomingReadings = [
    { client: 'Sarah M.', time: '2:00 PM', type: 'Tarot Reading', status: 'confirmed' },
    { client: 'Michael R.', time: '3:30 PM', type: 'Love Reading', status: 'pending' },
    { client: 'Lisa K.', time: '5:00 PM', type: 'Career Guidance', status: 'confirmed' },
  ];

  const recentReviews = [
    { client: 'Jennifer L.', rating: 5, comment: 'Amazing reading! Very insightful and accurate.', time: '1 hour ago' },
    { client: 'David M.', rating: 5, comment: 'Emily helped me find clarity in my relationship.', time: '3 hours ago' },
    { client: 'Amanda S.', rating: 4, comment: 'Great session, very professional and caring.', time: '1 day ago' },
  ];

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-4 py-6 bg-black/40 backdrop-blur-sm border-b border-white/10">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-white">Reader Dashboard</Text>
                <Text className="text-white/80 mt-1">Welcome back, {user.name}</Text>
              </View>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => {
                    setIsOnline(!isOnline);
                    Alert.alert(
                      'Status Updated',
                      `You are now ${!isOnline ? 'online' : 'offline'} for readings`,
                      [{ text: 'OK' }]
                    );
                  }}
                  className={`${isOnline ? 'bg-green-600/30 border-green-400/50' : 'bg-gray-600/30 border-gray-400/50'} backdrop-blur-sm rounded-full px-3 py-1 border`}
                >
                  <View className="flex-row items-center">
                    <View className={`w-2 h-2 ${isOnline ? 'bg-green-400' : 'bg-gray-400'} rounded-full mr-2`} />
                    <Text className={`${isOnline ? 'text-green-200' : 'text-gray-200'} text-sm font-bold`}>
                      {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </Text>
                  </View>
                </Pressable>
                <View className="bg-purple-600/30 backdrop-blur-sm rounded-full px-3 py-1 border border-purple-400/50">
                  <Text className="text-purple-200 text-sm font-bold">READER</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View className="px-4 py-6">
            <Text className="text-lg font-semibold text-white mb-4">Today's Performance</Text>
            <View className="flex-row flex-wrap gap-3">
              {readerStats.map((stat, index) => (
                <View key={index} className={`flex-1 min-w-[45%] ${stat.color.split(' text-')[0]} backdrop-blur-md rounded-xl p-4 border border-white/20`}>
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                      <Ionicons name={stat.icon as any} size={20} color="white" />
                    </View>
                  </View>
                  <Text className="text-2xl font-bold text-white">{stat.value}</Text>
                  <Text className="text-sm text-white/80">{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Reader Actions */}
          <View className="px-4 py-6">
            <Text className="text-lg font-semibold text-white mb-4">Quick Actions</Text>
            <View className="flex-row flex-wrap gap-3">
              {readerActions.map((action, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    if (action.action === 'home') {
                      navigation.navigate('MainTabs' as never);
                    } else {
                      navigation.navigate(action.screen as never);
                    }
                  }}
                  className={`flex-1 min-w-[45%] ${action.color} rounded-xl p-4`}
                >
                  <Ionicons name={action.icon as any} size={24} color="white" />
                  <Text className="text-white font-semibold mt-2">{action.title}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Upcoming Readings */}
          <View className="px-4 py-6">
            <Text className="text-lg font-semibold text-white mb-4">Upcoming Readings</Text>
            <View className="bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
              {upcomingReadings.map((reading, index) => (
                <View key={index} className={`p-4 ${index !== upcomingReadings.length - 1 ? 'border-b border-white/10' : ''}`}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-white font-medium">{reading.client}</Text>
                      <Text className="text-white/70 text-sm">{reading.type}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-white font-medium">{reading.time}</Text>
                      <View className={`rounded-full px-2 py-1 ${reading.status === 'confirmed' ? 'bg-green-600/30' : 'bg-amber-600/30'}`}>
                        <Text className={`text-xs font-medium ${reading.status === 'confirmed' ? 'text-green-200' : 'text-amber-200'}`}>
                          {reading.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Reviews */}
          <View className="px-4 py-6">
            <Text className="text-lg font-semibold text-white mb-4">Recent Reviews</Text>
            <View className="space-y-3">
              {recentReviews.map((review, index) => (
                <View key={index} className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-white font-medium">{review.client}</Text>
                    <View className="flex-row">
                      {[...Array(5)].map((_, i) => (
                        <Ionicons 
                          key={i}
                          name={i < review.rating ? "star" : "star-outline"} 
                          size={14} 
                          color="#FFA500" 
                        />
                      ))}
                    </View>
                  </View>
                  <Text className="text-white/80 text-sm mb-2">"{review.comment}"</Text>
                  <Text className="text-white/60 text-xs">{review.time}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Availability Toggle */}
          <View className="px-4 py-6 pb-8">
            <Text className="text-lg font-semibold text-white mb-4">Availability</Text>
            <View className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white font-medium">Available for Readings</Text>
                  <Text className="text-white/70 text-sm">Toggle your online status</Text>
                </View>
                <View className="bg-green-600/80 backdrop-blur-sm rounded-full px-4 py-2 border border-green-400/50">
                  <Text className="text-white font-medium">Online</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundImage>
  );
}