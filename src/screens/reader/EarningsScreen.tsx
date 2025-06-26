import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EarningsScreen() {
  return (
    <ImageBackground
      source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
      className="flex-1"
      imageStyle={{ opacity: 0.3 }}
    >
      <SafeAreaView className="flex-1 bg-black/70 justify-center items-center">
        <Text className="text-4xl text-pink-400 text-center mb-4 font-bold italic">
          Earnings
        </Text>
        <Text className="text-white text-center opacity-80 font-serif">
          Detailed earnings analytics coming soon
        </Text>
      </SafeAreaView>
    </ImageBackground>
  );
}