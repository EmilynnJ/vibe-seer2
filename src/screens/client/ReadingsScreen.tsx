import React from 'react';
import { View, Text, ScrollView, Pressable, Image, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../state/authStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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
  {
    id: '4',
    firstName: 'Crystal',
    lastName: 'Vision',
    specialties: ['Clairvoyance', 'Spiritual Guidance'],
    rating: 4.7,
    totalReviews: 203,
    chatRate: 3.49,
    phoneRate: 4.49,
    videoRate: 6.49,
    isOnline: false,
    avatar: 'https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg',
  },
];

export default function ReadingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();

  const selectReader = (readerId: string) => {
    navigation.navigate('ReadingTypes');
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
              Find Your Reader
            </Text>
            <Text className="text-white text-center opacity-80 font-serif">
              Connect with our gifted psychics
            </Text>
          </View>

          {/* Filter Buttons */}
          <View className="px-6 mb-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-3">
                <Pressable className="bg-pink-500 px-4 py-2 rounded-full">
                  <Text className="text-white font-semibold">All</Text>
                </Pressable>
                <Pressable className="bg-white/10 border border-pink-400/30 px-4 py-2 rounded-full">
                  <Text className="text-pink-300">Online Only</Text>
                </Pressable>
                <Pressable className="bg-white/10 border border-pink-400/30 px-4 py-2 rounded-full">
                  <Text className="text-pink-300">Tarot</Text>
                </Pressable>
                <Pressable className="bg-white/10 border border-pink-400/30 px-4 py-2 rounded-full">
                  <Text className="text-pink-300">Love</Text>
                </Pressable>
                <Pressable className="bg-white/10 border border-pink-400/30 px-4 py-2 rounded-full">
                  <Text className="text-pink-300">Career</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>

          {/* Readers List */}
          <View className="px-6">
            {availableReaders.map((reader) => (
              <View key={reader.id} className="mb-6 p-4 bg-white/10 rounded-xl border border-pink-400/20">
                <View className="flex-row">
                  <View className="relative">
                    <Image
                      source={{ uri: reader.avatar }}
                      className="w-20 h-20 rounded-full mr-4"
                    />
                    <View className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-black ${reader.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                  </View>
                  
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-white text-xl font-semibold">
                        {reader.firstName} {reader.lastName}
                      </Text>
                      <Text className="text-white/60 text-sm">
                        {reader.isOnline ? 'Online' : 'Offline'}
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text className="text-gold-400 ml-1 mr-2">{reader.rating}</Text>
                      <Text className="text-white/60">({reader.totalReviews} reviews)</Text>
                    </View>

                    <Text className="text-pink-300 text-sm mt-2">
                      {reader.specialties.join(' • ')}
                    </Text>

                    {/* Action Buttons */}
                    <View className="flex-row mt-4 space-x-2">
                      <Pressable 
                        className="flex-1 py-3 px-4 rounded-lg bg-pink-500 border border-pink-500"
                        onPress={() => selectReader(reader.id)}
                      >
                        <Text className="text-white text-center font-semibold">
                          Select Reader
                        </Text>
                      </Pressable>
                      
                      <View className="flex-1 justify-center items-center">
                        <Text className="text-white/60 text-xs">Chat: ${reader.chatRate}/min</Text>
                        <Text className="text-white/60 text-xs">Phone: ${reader.phoneRate}/min</Text>
                        <Text className="text-white/60 text-xs">Video: ${reader.videoRate}/min</Text>
                      </View>
                    </View>
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