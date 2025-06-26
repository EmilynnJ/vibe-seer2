import React from 'react';
import { View, Text, ScrollView, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  return (
    <ImageBackground
      source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
      className="flex-1"
      imageStyle={{ opacity: 0.3 }}
    >
      <SafeAreaView className="flex-1 bg-black/70">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 pt-8">
            <Text className="text-4xl text-pink-400 text-center mb-2 font-bold italic">
              About SoulSeer
            </Text>
            
            <View className="items-center mb-8">
              <Image
                source={{ uri: 'https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg' }}
                className="w-32 h-32 rounded-full border-4 border-pink-400/50"
                resizeMode="cover"
              />
            </View>

            <View className="bg-white/10 rounded-xl p-6 border border-pink-400/30">
              <Text className="text-white text-base leading-6 font-serif">
                At SoulSeer, we are dedicated to providing ethical, compassionate, and judgment-free spiritual guidance. Our mission is twofold: to offer clients genuine, heart-centered readings and to uphold fair, ethical standards for our readers.
                {'\n\n'}
                Founded by psychic medium Emilynn, SoulSeer was created as a response to the corporate greed that dominates many psychic platforms. Unlike other apps, our readers keep the majority of what they earn and play an active role in shaping the platform.
                {'\n\n'}
                SoulSeer is more than just an app—it's a soul tribe. A community of gifted psychics united by our life's calling: to guide, heal, and empower those who seek clarity on their journey.
              </Text>
            </View>

            <View className="mt-6 bg-pink-500/10 rounded-xl p-6 border border-pink-400/30">
              <Text className="text-pink-300 text-lg font-semibold mb-4 font-serif">
                Purpose & Vision
              </Text>
              <Text className="text-white text-base leading-6 font-serif">
                SoulSeer is a premium platform connecting spiritual readers with clients seeking guidance. The app embodies a mystical yet professional atmosphere while providing robust functionality for seamless spiritual consultations.
              </Text>
            </View>

            <View className="mt-6 mb-8 bg-gold-500/10 rounded-xl p-6 border border-gold-400/30">
              <Text className="text-gold-400 text-lg font-semibold mb-4 font-serif">
                Our Values
              </Text>
              <Text className="text-white text-base leading-6 font-serif">
                • Ethical and compassionate spiritual guidance{'\n'}
                • Fair compensation for our readers{'\n'}
                • Judgment-free environment for all seekers{'\n'}
                • Authentic, heart-centered connections{'\n'}
                • Community-driven platform development
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}