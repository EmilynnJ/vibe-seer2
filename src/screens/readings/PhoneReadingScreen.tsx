// Simplified Phone Reading Screen
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BackgroundImage from '../../components/BackgroundImage';

export default function PhoneReadingScreen() {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Simulate connection
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isConnected) {
      const timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isConnected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end this call?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Call', style: 'destructive', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 py-3 bg-black/40 backdrop-blur-sm border-b border-white/10">
          <Text className="text-white text-xl font-bold text-center">Phone Reading</Text>
        </View>

        {/* Call Interface */}
        <View className="flex-1 items-center justify-center px-6">
          {/* Reader Avatar */}
          <View className="w-32 h-32 rounded-full bg-purple-100 items-center justify-center mb-6">
            <Text className="text-6xl">🔮</Text>
          </View>

          <Text className="text-white text-2xl font-bold mb-2">Crystal Starlight</Text>
          <Text className="text-white/70 text-lg mb-6">
            {isConnected ? 'Connected' : 'Connecting...'}
          </Text>

          {/* Duration */}
          {isConnected && (
            <Text className="text-purple-300 text-3xl font-bold mb-8">
              {formatTime(duration)}
            </Text>
          )}

          {/* Controls */}
          <View className="flex-row gap-6">
            <Pressable
              onPress={() => setIsMuted(!isMuted)}
              className={`w-16 h-16 rounded-full items-center justify-center ${
                isMuted ? 'bg-red-600/80' : 'bg-white/20'
              } border border-white/30`}
            >
              <Ionicons
                name={isMuted ? 'mic-off' : 'mic'}
                size={28}
                color="white"
              />
            </Pressable>

            <Pressable
              onPress={endCall}
              className="w-16 h-16 rounded-full items-center justify-center bg-red-600/80 border border-red-400/50"
            >
              <Ionicons name="call" size={28} color="white" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </BackgroundImage>
  );
}