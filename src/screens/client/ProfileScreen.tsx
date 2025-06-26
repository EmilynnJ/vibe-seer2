import React from 'react';
import { View, Text, Pressable, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../state/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <ImageBackground
      source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
      className="flex-1"
      imageStyle={{ opacity: 0.3 }}
    >
      <SafeAreaView className="flex-1 bg-black/70">
        <View className="flex-1 px-6 pt-8">
          <Text className="text-4xl text-pink-400 text-center mb-8 font-bold italic">
            Profile
          </Text>
          
          <View className="bg-white/10 rounded-xl p-6 border border-pink-400/30 mb-6">
            <Text className="text-white text-xl font-semibold font-serif">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-pink-300 capitalize">{user?.role}</Text>
            <Text className="text-white/70 mt-2">{user?.email}</Text>
            {user?.role === 'client' && (
              <Text className="text-gold-400 mt-2">Balance: ${(user as any)?.balance?.toFixed(2) || '0.00'}</Text>
            )}
          </View>
          
          <Pressable 
            onPress={logout}
            className="bg-red-500 rounded-lg py-4 flex-row items-center justify-center"
          >
            <Ionicons name="log-out" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Sign Out</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}