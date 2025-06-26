import React from 'react';
import { View, Text, ScrollView, Pressable, Image, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../state/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock data for available readers
const availableReaders = [
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Moon',
    specialties: ['Tarot', 'Love & Relationships'],
    rating: 4.8,
    totalReviews: 156,
    chatRate: 3.99,
    phoneRate: 4.99,
    videoRate: 6.99,
    isOnline: true,
    avatar: 'https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg',
  },
  {
    id: '3',
    firstName: 'Luna',
    lastName: 'Star',
    specialties: ['Astrology', 'Career'],
    rating: 4.9,
    totalReviews: 89,
    chatRate: 4.99,
    phoneRate: 5.99,
    videoRate: 7.99,
    isOnline: true,
    avatar: 'https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg',
  },
];

export default function HomeScreen() {
  const { user } = useAuthStore();
  const navigation = useNavigation<NavigationProp>();

  const startReading = (readerId: string, sessionType: 'chat' | 'phone' | 'video', rate: number) => {
    const userBalance = (user as any)?.balance || 0;
    
    if (userBalance < rate) {
      Alert.alert(
        'Insufficient Balance',
        `You need at least ${rate.toFixed(2)} to start this reading. Please add funds to your account.`,
        [{ text: 'OK' }]
      );
      return;
    }

    navigation.navigate('ReadingSession', { readerId, sessionType });
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
            <Text className="text-6xl text-pink-400 text-center mb-2 font-bold italic">
              SoulSeer
            </Text>
            
            {/* Hero Image */}
            <View className="items-center mb-4">
              <Image
                source={{ uri: 'https://i.postimg.cc/tRLSgCPb/HERO-IMAGE-1.jpg' }}
                className="w-full h-48 rounded-xl"
                resizeMode="cover"
              />
            </View>
            
            <Text className="text-white text-xl text-center opacity-90 font-serif">
              A Community of Gifted Psychics
            </Text>

            {/* Welcome Message */}
            <View className="mt-6 p-4 bg-white/10 rounded-lg border border-pink-400/30">
              <Text className="text-white text-lg font-serif">
                Welcome back, {user?.firstName}!
              </Text>
              <Text className="text-white/70 mt-1">
                Balance: ${(user as any)?.balance?.toFixed(2) || '0.00'}
              </Text>
            </View>
          </View>

          {/* Online Readers */}
          <View className="px-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-xl font-semibold font-serif">
                Available Readers
              </Text>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                <Text className="text-green-400 text-sm">{availableReaders.length} Online</Text>
              </View>
            </View>

            {availableReaders.map((reader) => (
              <View key={reader.id} className="mb-4 p-4 bg-white/10 rounded-xl border border-pink-400/20">
                <View className="flex-row">
                  <Image
                    source={{ uri: reader.avatar }}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-white text-lg font-semibold">
                        {reader.firstName} {reader.lastName}
                      </Text>
                      <View className="w-3 h-3 bg-green-400 rounded-full" />
                    </View>
                    
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text className="text-gold-400 ml-1 mr-2">{reader.rating}</Text>
                      <Text className="text-white/60">({reader.totalReviews} reviews)</Text>
                    </View>

                    <Text className="text-pink-300 text-sm mt-1">
                      {reader.specialties.join(' • ')}
                    </Text>

                    {/* Rates */}
                    <View className="flex-row mt-3 space-x-3">
                      <Pressable 
                        className="flex-1 bg-pink-500/20 border border-pink-400 rounded-lg py-2"
                        onPress={() => startReading(reader.id, 'chat', reader.chatRate)}
                      >
                        <Text className="text-pink-300 text-center text-xs">CHAT</Text>
                        <Text className="text-white text-center font-semibold">${reader.chatRate}/min</Text>
                      </Pressable>
                      <Pressable 
                        className="flex-1 bg-pink-500/20 border border-pink-400 rounded-lg py-2"
                        onPress={() => startReading(reader.id, 'phone', reader.phoneRate)}
                      >
                        <Text className="text-pink-300 text-center text-xs">PHONE</Text>
                        <Text className="text-white text-center font-semibold">${reader.phoneRate}/min</Text>
                      </Pressable>
                      <Pressable 
                        className="flex-1 bg-pink-500/20 border border-pink-400 rounded-lg py-2"
                        onPress={() => startReading(reader.id, 'video', reader.videoRate)}
                      >
                        <Text className="text-pink-300 text-center text-xs">VIDEO</Text>
                        <Text className="text-white text-center font-semibold">${reader.videoRate}/min</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Quick Actions */}
          <View className="px-6 mt-6 mb-6">
            <Text className="text-white text-xl font-semibold mb-4 font-serif">
              Quick Actions
            </Text>
            
            <View className="flex-row space-x-3 mb-4">
              <Pressable 
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-4 items-center"
                onPress={() => navigation.navigate('ReadingTypes')}
              >
                <Ionicons name="sparkles" size={24} color="white" />
                <Text className="text-white font-semibold mt-2">New Reading</Text>
                <Text className="text-white/70 text-xs mt-1">Instant or Scheduled</Text>
              </Pressable>
              
              <Pressable 
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 items-center"
                onPress={() => navigation.navigate('AddFunds')}
              >
                <Ionicons name="add-circle" size={24} color="white" />
                <Text className="text-white font-semibold mt-2">Add Funds</Text>
              </Pressable>
            </View>
            
            <View className="flex-row space-x-3">
              <Pressable className="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg p-4 items-center">
                <Ionicons name="storefront" size={24} color="white" />
                <Text className="text-white font-semibold mt-2">Shop</Text>
              </Pressable>
              
              <Pressable className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg p-4 items-center">
                <Ionicons name="time" size={24} color="white" />
                <Text className="text-white font-semibold mt-2">My Sessions</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}