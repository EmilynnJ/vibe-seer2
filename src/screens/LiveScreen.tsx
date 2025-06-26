import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useAppStore from '../state/appStore';
import BackgroundImage from '../components/BackgroundImage';

const streamCategories = ['All', 'Tarot', 'Astrology', 'Healing', 'Meditation', 'Q&A'];

export default function LiveScreen() {
  const { liveStreams } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showScheduled, setShowScheduled] = useState(false);

  // Mock scheduled streams
  const scheduledStreams = [
    {
      id: 'scheduled1',
      reader: {
        id: '3',
        name: 'Phoenix Rising',
        avatar: '🔥',
        rating: 4.7,
        reviewCount: 654,
        specialties: ['Past Life', 'Dreams', 'Spiritual'],
        isOnline: false,
        price: 4.99,
        bio: 'Spiritual medium specializing in past life regression',
        experience: '20+ years'
      },
      title: 'Past Life Regression Workshop',
      thumbnail: '🌟',
      viewers: 0,
      category: 'Spiritual',
      isLive: false,
      scheduledTime: 'Today 8:00 PM'
    },
    {
      id: 'scheduled2',
      reader: {
        id: '4',
        name: 'Sage Wisdom',
        avatar: '🌿',
        rating: 4.9,
        reviewCount: 1156,
        specialties: ['Numerology', 'Life Path', 'Guidance'],
        isOnline: true,
        price: 3.49,
        bio: 'Numerology expert helping you understand your life path',
        experience: '18+ years'
      },
      title: 'Numerology Insights for 2024',
      thumbnail: '🔢',
      viewers: 0,
      category: 'Numerology',
      isLive: false,
      scheduledTime: 'Tomorrow 7:00 PM'
    }
  ];

  const currentStreams = showScheduled ? scheduledStreams : liveStreams;
  const filteredStreams = currentStreams.filter(stream => 
    selectedCategory === 'All' || stream.category === selectedCategory
  );

  const joinStream = (stream: any) => {
    if (stream.isLive) {
      Alert.alert(
        'Join Live Stream',
        `Join ${stream.reader.name}'s live session: "${stream.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Join', onPress: () => console.log('Joining stream:', stream.id) }
        ]
      );
    } else {
      Alert.alert(
        'Set Reminder',
        `Get notified when ${stream.reader.name}'s stream starts?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remind Me', onPress: () => console.log('Setting reminder for:', stream.id) }
        ]
      );
    }
  };

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 py-3 bg-black/40 backdrop-blur-sm border-b border-white/10">
          <Text className="text-white text-2xl font-bold">Live Streams</Text>
          <Text className="text-white/80 text-sm">Connect with readers in real-time</Text>
        </View>

      {/* Live/Scheduled Toggle */}
      <View className="px-4 py-3 bg-gray-50">
        <View className="flex-row bg-white rounded-xl p-1">
          <Pressable
            onPress={() => setShowScheduled(false)}
            className={`flex-1 py-2 rounded-lg ${!showScheduled ? 'bg-red-600' : ''}`}
          >
            <Text className={`text-center font-medium ${!showScheduled ? 'text-white' : 'text-gray-600'}`}>
              Live Now ({liveStreams.length})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowScheduled(true)}
            className={`flex-1 py-2 rounded-lg ${showScheduled ? 'bg-red-600' : ''}`}
          >
            <Text className={`text-center font-medium ${showScheduled ? 'text-white' : 'text-gray-600'}`}>
              Scheduled ({scheduledStreams.length})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Category Filter */}
      <View className="py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {streamCategories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`mr-3 px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-red-600'
                  : 'bg-gray-100'
              }`}
            >
              <Text className={`font-medium ${
                selectedCategory === category ? 'text-white' : 'text-gray-700'
              }`}>
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Streams List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {filteredStreams.map((stream) => (
          <Pressable
            key={stream.id}
            onPress={() => joinStream(stream)}
            className="mx-4 mb-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Thumbnail */}
            <View className="h-48 bg-gradient-to-br from-red-500 to-pink-500 items-center justify-center relative">
              <Text className="text-6xl">{stream.thumbnail}</Text>
              
              {/* Live Badge */}
              {stream.isLive ? (
                <View className="absolute top-3 left-3 bg-red-600 rounded px-3 py-1 flex-row items-center">
                  <View className="w-2 h-2 bg-white rounded-full mr-2" />
                  <Text className="text-white text-sm font-bold">LIVE</Text>
                </View>
              ) : (
                <View className="absolute top-3 left-3 bg-blue-600 rounded px-3 py-1">
                  <Text className="text-white text-sm font-bold">SCHEDULED</Text>
                </View>
              )}

              {/* Viewers Count */}
              {stream.isLive && (
                <View className="absolute top-3 right-3 bg-black/50 rounded px-2 py-1 flex-row items-center">
                  <Ionicons name="eye" size={14} color="white" />
                  <Text className="text-white text-sm ml-1">{stream.viewers}</Text>
                </View>
              )}

              {/* Play Button */}
              <View className="absolute bottom-3 right-3 w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                <Ionicons name="play" size={24} color="white" />
              </View>
            </View>

            {/* Stream Info */}
            <View className="p-4">
              <Text className="text-lg font-bold text-gray-900 mb-1">{stream.title}</Text>
              
              <View className="flex-row items-center mb-2">
                <Text className="text-xl mr-2">{stream.reader.avatar}</Text>
                <View className="flex-1">
                  <Text className="font-medium text-gray-900">{stream.reader.name}</Text>
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={12} color="#FFA500" />
                    <Text className="text-sm text-gray-600 ml-1">
                      {stream.reader.rating} • {stream.reader.reviewCount} reviews
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row flex-wrap mb-3">
                {stream.reader.specialties.slice(0, 3).map((specialty, index) => (
                  <View key={index} className="bg-red-100 rounded-full px-2 py-1 mr-2 mb-1">
                    <Text className="text-red-700 text-xs font-medium">{specialty}</Text>
                  </View>
                ))}
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="bg-red-100 rounded px-2 py-1 mr-2">
                    <Text className="text-red-700 text-sm font-medium">{stream.category}</Text>
                  </View>
                  {!stream.isLive && (
                    <View className="flex-row items-center">
                      <Ionicons name="time" size={16} color="#666" />
                      <Text className="text-gray-600 text-sm ml-1">{stream.scheduledTime}</Text>
                    </View>
                  )}
                </View>

                <View className="flex-row items-center">
                  {stream.isLive ? (
                    <View className="bg-red-600 rounded-lg px-4 py-2">
                      <Text className="text-white font-medium">Join Live</Text>
                    </View>
                  ) : (
                    <View className="bg-blue-600 rounded-lg px-4 py-2">
                      <Text className="text-white font-medium">Set Reminder</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Pressable>
        ))}

        {filteredStreams.length === 0 && (
          <View className="items-center justify-center py-12">
            <Ionicons name="radio" size={48} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              {showScheduled ? 'No scheduled streams' : 'No live streams'}
            </Text>
            <Text className="text-gray-400 text-center mt-2 px-8">
              {showScheduled 
                ? 'Check back later for upcoming streams' 
                : 'Readers will appear here when they go live'
              }
            </Text>
          </View>
        )}

        {/* Promotion Banner */}
        <View className="mx-4 mb-8 bg-gradient-to-r from-purple-600 to-red-600 rounded-xl p-4">
          <Text className="text-white text-lg font-bold">Want to host your own stream?</Text>
          <Text className="text-white/90 text-sm mt-1">
            Join our community of readers and share your gifts with the world.
          </Text>
          <Pressable className="bg-white/20 rounded-lg px-4 py-2 mt-3 self-start">
            <Text className="text-white font-medium">Learn More</Text>
          </Pressable>
        </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundImage>
  );
}