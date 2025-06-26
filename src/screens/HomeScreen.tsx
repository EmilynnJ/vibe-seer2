import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAppStore from '../state/appStore';
import BackgroundImage from '../components/BackgroundImage';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { readers, liveStreams, unreadMessages, user } = useAppStore();
  
  const onlineReaders = readers.filter(reader => reader.isOnline);
  const activeStreams = liveStreams.filter(stream => stream.isLive);

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-sm border-b border-white/10">
        <View>
          <Text className="text-pink-400 text-3xl font-bold" style={{ fontFamily: 'Alex Brush' }}>SoulSeer</Text>
          <Text className="text-white/80 text-sm" style={{ fontFamily: 'Playfair Display' }}>
            {user.isAuthenticated ? `Welcome back, ${user.name}` : 'A Community of Gifted Psychics'}
          </Text>
        </View>
        <View className="flex-row gap-3">
          <Pressable 
            onPress={() => navigation.navigate('Messages' as never)}
            className="relative"
          >
            <Ionicons name="mail-outline" size={24} color="white" />
            {unreadMessages > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center">
                <Text className="text-white text-xs font-bold">{unreadMessages}</Text>
              </View>
            )}
          </Pressable>
          
          {user.isAuthenticated ? (
            <Pressable 
              onPress={() => {
                if (user.role === 'admin') {
                  navigation.navigate('AdminDashboard' as never);
                } else if (user.role === 'reader') {
                  navigation.navigate('ReaderDashboard' as never);
                } else {
                  navigation.navigate('Dashboard' as never);
                }
              }}
              className={`backdrop-blur-sm rounded-full px-3 py-1 border ${
                user.role === 'admin' ? 'bg-red-600/40 border-red-400/50' :
                user.role === 'reader' ? 'bg-purple-600/40 border-purple-400/50' :
                'bg-green-600/40 border-green-400/50'
              }`}
            >
              <Text className="text-white text-sm font-medium">
                {user.role === 'admin' ? 'Admin' : 
                 user.role === 'reader' ? 'Reader' : 'Dashboard'}
              </Text>
            </Pressable>
          ) : (
            <Pressable 
              onPress={() => navigation.navigate('Auth' as never)}
              className="bg-purple-600/40 backdrop-blur-sm rounded-full px-3 py-1 border border-purple-400/50"
            >
              <Text className="text-white text-sm font-medium">Sign In</Text>
            </Pressable>
          )}
          
          <Pressable onPress={() => navigation.navigate('Profile' as never)}>
            <Ionicons 
              name={user.isAuthenticated ? "person-circle" : "person-circle-outline"} 
              size={24} 
              color={user.isAuthenticated ? "#10B981" : "white"} 
            />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Daily Highlights Banner */}
        <View className="mx-4 mt-4 p-4 bg-black/50 backdrop-blur-md rounded-xl border border-white/20">
          <Text className="text-white text-lg font-bold">Daily Spiritual Insight</Text>
          <Text className="text-white/90 text-sm mt-1">
            "Trust your intuition today. The universe is guiding you toward new opportunities."
          </Text>
          <Text className="text-amber-300 text-xs mt-2 font-medium">✨ Today's Energy: High Intuition</Text>
        </View>

        {/* Online Readers Section */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="text-xl font-bold text-white">Online Readers</Text>
            <Pressable onPress={() => navigation.navigate('Readings' as never)}>
              <Text className="text-purple-300 font-medium">View All</Text>
            </Pressable>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
            {onlineReaders.map((reader, index) => (
              <Pressable
                key={reader.id}
                className="mr-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 p-4 w-40"
              >
                <View className="items-center">
                  <View className="w-16 h-16 rounded-full bg-purple-100 items-center justify-center mb-2">
                    <Text className="text-2xl">{reader.avatar}</Text>
                  </View>
                  <View className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  
                  <Text className="font-semibold text-white text-center text-sm" numberOfLines={2}>
                    {reader.name}
                  </Text>
                  
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="star" size={12} color="#FFA500" />
                    <Text className="text-xs text-white/80 ml-1">{reader.rating}</Text>
                  </View>
                  
                  <Text className="text-purple-300 font-bold text-sm mt-1">
                    ${reader.price}/min
                  </Text>
                  
                  <Text className="text-xs text-white/60 text-center mt-1" numberOfLines={1}>
                    {reader.specialties.join(', ')}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Active Streams Section */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-white">Live Now</Text>
              <View className="ml-2 bg-red-500 rounded-full px-2 py-1">
                <Text className="text-white text-xs font-bold">LIVE</Text>
              </View>
            </View>
            <Pressable onPress={() => navigation.navigate('Live' as never)}>
              <Text className="text-purple-300 font-medium">View All</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
            {activeStreams.map((stream) => (
              <Pressable
                key={stream.id}
                className="mr-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden w-60"
              >
                <View className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center">
                  <Text className="text-4xl">{stream.thumbnail}</Text>
                  <View className="absolute top-2 right-2 bg-red-500 rounded px-2 py-1">
                    <Text className="text-white text-xs font-bold">LIVE</Text>
                  </View>
                </View>
                
                <View className="p-3">
                  <Text className="font-semibold text-white" numberOfLines={2}>
                    {stream.title}
                  </Text>
                  <Text className="text-sm text-white/80 mt-1">
                    by {stream.reader.name}
                  </Text>
                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                      <Ionicons name="eye" size={14} color="#fff" />
                      <Text className="text-xs text-white/70 ml-1">{stream.viewers} watching</Text>
                    </View>
                    <Text className="text-xs text-purple-300 font-medium">{stream.category}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View className="mt-6 px-4">
          <Text className="text-xl font-bold text-white mb-3">Quick Actions</Text>
          <View className="flex-row flex-wrap gap-3">
            <Pressable 
              onPress={() => navigation.navigate('Readings' as never)}
              className="flex-1 min-w-[140px] bg-purple-600/30 backdrop-blur-md rounded-xl p-4 items-center border border-purple-400/30"
            >
              <Ionicons name="book" size={24} color="#C084FC" />
              <Text className="text-purple-200 font-medium mt-2">Get Reading</Text>
            </Pressable>
            
            <Pressable 
              onPress={() => navigation.navigate('Shop' as never)}
              className="flex-1 min-w-[140px] bg-blue-600/30 backdrop-blur-md rounded-xl p-4 items-center border border-blue-400/30"
            >
              <Ionicons name="storefront" size={24} color="#60A5FA" />
              <Text className="text-blue-200 font-medium mt-2">Shop</Text>
            </Pressable>
            
            <Pressable 
              onPress={() => navigation.navigate('Community' as never)}
              className="flex-1 min-w-[140px] bg-green-600/30 backdrop-blur-md rounded-xl p-4 items-center border border-green-400/30"
            >
              <Ionicons name="people" size={24} color="#34D399" />
              <Text className="text-green-200 font-medium mt-2">Community</Text>
            </Pressable>
            
            <Pressable 
              onPress={() => navigation.navigate('HelpCenter' as never)}
              className="flex-1 min-w-[140px] bg-amber-600/30 backdrop-blur-md rounded-xl p-4 items-center border border-amber-400/30"
            >
              <Ionicons name="help-circle" size={24} color="#FBBF24" />
              <Text className="text-amber-200 font-medium mt-2">Help</Text>
            </Pressable>
          </View>
        </View>

        {/* Online Readers Featured */}
        <View className="mt-6 px-4 pb-8">
          <Text className="text-xl font-bold text-white mb-3">Featured Online Readers</Text>
          <View className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <Text className="text-white text-lg font-bold">Connect Now - Live Guidance Available</Text>
            <Text className="text-white/90 text-sm mt-1">
              {onlineReaders.length} readers are online and ready to help you find clarity.
            </Text>
            <Pressable 
              onPress={() => navigation.navigate('Readings' as never)}
              className="bg-purple-600/80 backdrop-blur-sm rounded-lg px-4 py-2 mt-3 self-start border border-purple-400/30"
            >
              <Text className="text-white font-medium">Start Your Reading</Text>
            </Pressable>
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundImage>
  );
}