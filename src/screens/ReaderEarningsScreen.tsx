import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BackgroundImage from '../components/BackgroundImage';
import useAppStore from '../state/appStore';

export default function ReaderEarningsScreen() {
  const navigation = useNavigation();
  const { user } = useAppStore();
  const [selectedPeriod, setSelectedPeriod] = useState('Today');

  const periods = ['Today', 'Week', 'Month', 'Year'];
  
  const earningsData = {
    Today: {
      total: 342.50,
      sessions: 8,
      hours: 6.5,
      avgPerSession: 42.81
    },
    Week: {
      total: 1847.30,
      sessions: 45,
      hours: 38.2,
      avgPerSession: 41.05
    },
    Month: {
      total: 7239.80,
      sessions: 186,
      hours: 152.4,
      avgPerSession: 38.92
    },
    Year: {
      total: 89547.60,
      sessions: 2341,
      hours: 1845.7,
      avgPerSession: 38.25
    }
  };

  const currentData = earningsData[selectedPeriod as keyof typeof earningsData];

  const recentSessions = [
    { client: 'Sarah M.', type: 'Video Reading', duration: '45 min', earnings: 89.55, time: '2:30 PM' },
    { client: 'Michael R.', type: 'Chat Reading', duration: '30 min', earnings: 59.70, time: '1:15 PM' },
    { client: 'Lisa K.', type: 'Phone Reading', duration: '25 min', earnings: 49.75, time: '11:45 AM' },
    { client: 'David P.', type: 'Video Reading', duration: '60 min', earnings: 119.40, time: '10:00 AM' },
  ];

  const payoutHistory = [
    { date: '2024-01-15', amount: 2450.75, status: 'Completed', method: 'Bank Transfer' },
    { date: '2024-01-08', amount: 1890.30, status: 'Completed', method: 'PayPal' },
    { date: '2024-01-01', amount: 2123.45, status: 'Completed', method: 'Bank Transfer' },
  ];

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 py-3 bg-black/40 backdrop-blur-sm border-b border-white/10">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full items-center justify-center mr-4"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </Pressable>
            <Text className="text-white text-xl font-bold">Earnings</Text>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Period Selector */}
          <View className="px-4 py-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {periods.map((period) => (
                  <Pressable
                    key={period}
                    onPress={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-xl ${
                      selectedPeriod === period
                        ? 'bg-purple-600/80 border border-purple-400/50'
                        : 'bg-black/30 border border-white/20'
                    }`}
                  >
                    <Text className={`font-medium ${
                      selectedPeriod === period ? 'text-white' : 'text-white/70'
                    }`}>
                      {period}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Earnings Summary */}
          <View className="px-4 mb-6">
            <View className="bg-gradient-to-r from-green-600/40 to-emerald-600/40 rounded-2xl p-6 border border-green-400/30">
              <Text className="text-white/80 text-lg mb-2">{selectedPeriod} Earnings</Text>
              <Text className="text-white text-4xl font-bold mb-4">
                ${currentData.total.toFixed(2)}
              </Text>
              
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-white/70 text-sm">{currentData.sessions} Sessions</Text>
                  <Text className="text-white font-medium">${currentData.avgPerSession.toFixed(2)} avg</Text>
                </View>
                <View>
                  <Text className="text-white/70 text-sm">{currentData.hours} Hours</Text>
                  <Text className="text-white font-medium">{(currentData.total / currentData.hours).toFixed(2)}/hr</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View className="px-4 mb-6">
            <Text className="text-white text-lg font-bold mb-3">Performance Stats</Text>
            <View className="flex-row flex-wrap gap-3">
              <View className="flex-1 min-w-[45%] bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Ionicons name="trending-up" size={24} color="#10B981" />
                <Text className="text-2xl font-bold text-white mt-2">${(currentData.total / (currentData.sessions || 1)).toFixed(0)}</Text>
                <Text className="text-sm text-white/80">Avg per Session</Text>
              </View>
              
              <View className="flex-1 min-w-[45%] bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Ionicons name="time" size={24} color="#3B82F6" />
                <Text className="text-2xl font-bold text-white mt-2">{Math.round(currentData.hours)}</Text>
                <Text className="text-sm text-white/80">Hours Worked</Text>
              </View>
              
              <View className="flex-1 min-w-[45%] bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Ionicons name="people" size={24} color="#8B5CF6" />
                <Text className="text-2xl font-bold text-white mt-2">{currentData.sessions}</Text>
                <Text className="text-sm text-white/80">Total Sessions</Text>
              </View>
              
              <View className="flex-1 min-w-[45%] bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Ionicons name="star" size={24} color="#F59E0B" />
                <Text className="text-2xl font-bold text-white mt-2">4.9</Text>
                <Text className="text-sm text-white/80">Average Rating</Text>
              </View>
            </View>
          </View>

          {/* Recent Sessions */}
          <View className="px-4 mb-6">
            <Text className="text-white text-lg font-bold mb-3">Recent Sessions</Text>
            <View className="bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
              {recentSessions.map((session, index) => (
                <View key={index} className={`p-4 ${index !== recentSessions.length - 1 ? 'border-b border-white/10' : ''}`}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-white font-medium">{session.client}</Text>
                      <Text className="text-white/70 text-sm">{session.type} • {session.duration}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-green-400 font-bold text-lg">+${session.earnings.toFixed(2)}</Text>
                      <Text className="text-white/50 text-xs">{session.time}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Payout History */}
          <View className="px-4 mb-8">
            <Text className="text-white text-lg font-bold mb-3">Payout History</Text>
            <View className="bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
              {payoutHistory.map((payout, index) => (
                <View key={index} className={`p-4 ${index !== payoutHistory.length - 1 ? 'border-b border-white/10' : ''}`}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-white font-medium">${payout.amount.toFixed(2)}</Text>
                      <Text className="text-white/70 text-sm">{payout.method} • {payout.date}</Text>
                    </View>
                    <View className="bg-green-600/20 rounded-full px-3 py-1">
                      <Text className="text-green-300 text-sm font-medium">{payout.status}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Payout Info */}
          <View className="px-4 pb-8">
            <View className="bg-blue-600/20 rounded-xl p-4 border border-blue-400/30">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={24} color="#3B82F6" />
                <View className="ml-3 flex-1">
                  <Text className="text-blue-200 font-bold mb-1">Payout Information</Text>
                  <Text className="text-blue-100 text-sm leading-5">
                    • Payouts are processed weekly on Fridays
                    • Minimum payout threshold is $15
                    • You keep 70% of all earnings (platform takes 30%)
                    • Earnings shown are your net amount after platform fee
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundImage>
  );
}