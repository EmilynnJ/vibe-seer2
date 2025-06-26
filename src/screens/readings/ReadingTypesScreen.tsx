import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ReadingOption {
  id: string;
  type: 'chat' | 'phone' | 'video';
  name: string;
  description: string;
  icon: string;
  instantRate: number;
  packageOptions: {
    duration: number;
    price: number;
    originalPrice?: number;
    popular?: boolean;
  }[];
  features: string[];
  availability: 'instant' | 'scheduled' | 'both';
}

const readingOptions: ReadingOption[] = [
  {
    id: 'chat',
    type: 'chat',
    name: 'Chat Reading',
    description: 'Deep, detailed conversations through text with card pulls and insights',
    icon: 'chatbubbles',
    instantRate: 3.99,
    packageOptions: [
      { duration: 30, price: 79.99, originalPrice: 99.99, popular: true },
      { duration: 60, price: 149.99, originalPrice: 179.99 },
      { duration: 90, price: 199.99, originalPrice: 249.99 }
    ],
    features: [
      'Detailed written insights',
      'Tarot card images',
      'Unlimited follow-up questions',
      'Session transcript included',
      'Voice message support'
    ],
    availability: 'both'
  },
  {
    id: 'phone',
    type: 'phone',
    name: 'Phone Reading',
    description: 'Personal voice connection for immediate spiritual guidance',
    icon: 'call',
    instantRate: 4.99,
    packageOptions: [
      { duration: 20, price: 89.99 },
      { duration: 30, price: 119.99, popular: true },
      { duration: 45, price: 169.99 },
      { duration: 60, price: 219.99, originalPrice: 259.99 }
    ],
    features: [
      'Direct voice connection',
      'Real-time spiritual insights',
      'Immediate answers',
      'Optional call recording',
      'Energy reading included'
    ],
    availability: 'both'
  },
  {
    id: 'video',
    type: 'video',
    name: 'Video Reading',
    description: 'Face-to-face connection with visual card spreads and demonstrations',
    icon: 'videocam',
    instantRate: 6.99,
    packageOptions: [
      { duration: 30, price: 159.99, popular: true },
      { duration: 45, price: 219.99 },
      { duration: 60, price: 279.99, originalPrice: 329.99 }
    ],
    features: [
      'Face-to-face connection',
      'Visual card spreads',
      'Live demonstrations',
      'Enhanced spiritual connection',
      'Recording available'
    ],
    availability: 'both'
  }
];

export default function ReadingTypesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const [selectedOption, setSelectedOption] = useState<ReadingOption | null>(null);
  const [selectedMode, setSelectedMode] = useState<'instant' | 'scheduled'>('instant');

  const handleInstantReading = (option: ReadingOption) => {
    const userBalance = (user as any)?.balance || 0;
    
    if (userBalance < option.instantRate) {
      Alert.alert(
        'Insufficient Balance',
        `You need at least $${option.instantRate.toFixed(2)} per minute for this reading. Please add funds to your account.`,
        [
          { text: 'Add Funds', onPress: () => navigation.navigate('AddFunds') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }

    // Navigate to reader selection for instant reading
    (navigation as any).navigate('SelectReader', {
      readingType: option.type,
      mode: 'instant',
      rate: option.instantRate
    });
  };

  const handleScheduledReading = (option: ReadingOption, packageOption: any) => {
    // Navigate to scheduling screen
    (navigation as any).navigate('ScheduleReading', {
      readingType: option.type,
      package: packageOption,
      duration: packageOption.duration,
      price: packageOption.price
    });
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <ImageBackground
      source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
      className="flex-1"
      imageStyle={{ opacity: 0.3 }}
    >
      <SafeAreaView className="flex-1 bg-black/70">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-4 pb-6">
            <View className="flex-row items-center mb-4">
              <Pressable onPress={() => navigation.goBack()} className="mr-4">
                <Ionicons name="arrow-back" size={24} color="#EC4899" />
              </Pressable>
              <Text className="text-4xl text-pink-400 font-bold italic">
                Choose Your Reading
              </Text>
            </View>
            
            <Text className="text-white text-lg opacity-90 font-serif">
              Select the type of spiritual guidance that resonates with you
            </Text>
          </View>

          {/* Mode Selection */}
          <View className="px-6 mb-6">
            <View className="flex-row bg-white/10 rounded-xl p-1 border border-pink-400/30">
              <Pressable
                onPress={() => setSelectedMode('instant')}
                className={`flex-1 py-3 px-4 rounded-lg ${
                  selectedMode === 'instant' ? 'bg-pink-500' : 'bg-transparent'
                }`}
              >
                <Text className={`text-center font-semibold ${
                  selectedMode === 'instant' ? 'text-white' : 'text-white/70'
                }`}>
                  Instant Reading
                </Text>
                <Text className={`text-center text-xs mt-1 ${
                  selectedMode === 'instant' ? 'text-pink-200' : 'text-white/50'
                }`}>
                  Pay per minute
                </Text>
              </Pressable>
              
              <Pressable
                onPress={() => setSelectedMode('scheduled')}
                className={`flex-1 py-3 px-4 rounded-lg ${
                  selectedMode === 'scheduled' ? 'bg-pink-500' : 'bg-transparent'
                }`}
              >
                <Text className={`text-center font-semibold ${
                  selectedMode === 'scheduled' ? 'text-white' : 'text-white/70'
                }`}>
                  Scheduled Reading
                </Text>
                <Text className={`text-center text-xs mt-1 ${
                  selectedMode === 'scheduled' ? 'text-pink-200' : 'text-white/50'
                }`}>
                  Fixed price packages
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Reading Options */}
          <View className="px-6 space-y-6">
            {readingOptions.map((option) => (
              <View key={option.id} className="bg-white/10 rounded-xl border border-pink-400/20 overflow-hidden">
                {/* Header */}
                <View className="p-6">
                  <View className="flex-row items-center mb-4">
                    <View className="w-16 h-16 bg-pink-500/20 rounded-full items-center justify-center mr-4">
                      <Ionicons name={option.icon as any} size={28} color="#EC4899" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white text-xl font-bold">{option.name}</Text>
                      <Text className="text-pink-300 text-sm mt-1">
                        {selectedMode === 'instant' 
                          ? `${formatPrice(option.instantRate)}/minute`
                          : `Packages from ${formatPrice(option.packageOptions[0].price)}`
                        }
                      </Text>
                    </View>
                  </View>

                  <Text className="text-white/80 text-base mb-4 font-serif">
                    {option.description}
                  </Text>

                  {/* Features */}
                  <View className="mb-4">
                    <Text className="text-white font-semibold mb-2">What's included:</Text>
                    {option.features.slice(0, 3).map((feature, index) => (
                      <View key={index} className="flex-row items-center mb-1">
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text className="text-white/80 text-sm ml-2">{feature}</Text>
                      </View>
                    ))}
                    {option.features.length > 3 && (
                      <Text className="text-pink-300 text-sm">+{option.features.length - 3} more features</Text>
                    )}
                  </View>
                </View>

                {/* Action Section */}
                {selectedMode === 'instant' ? (
                  <View className="p-6 pt-0">
                    <Pressable
                      onPress={() => handleInstantReading(option)}
                      className="bg-pink-500 rounded-lg py-4 flex-row items-center justify-center"
                    >
                      <Ionicons name="flash" size={20} color="white" />
                      <Text className="text-white font-semibold text-lg ml-2">
                        Start Instant Reading
                      </Text>
                    </Pressable>
                    <Text className="text-white/60 text-center text-sm mt-2">
                      Connect with available readers now
                    </Text>
                  </View>
                ) : (
                  <View className="p-6 pt-0">
                    <Text className="text-white font-semibold mb-3">Choose a package:</Text>
                    <View className="space-y-2">
                      {option.packageOptions.map((pkg, index) => (
                        <Pressable
                          key={index}
                          onPress={() => handleScheduledReading(option, pkg)}
                          className={`p-3 rounded-lg border ${
                            pkg.popular 
                              ? 'bg-pink-500/20 border-pink-400' 
                              : 'bg-white/5 border-white/20'
                          }`}
                        >
                          <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                              <View className="flex-row items-center">
                                <Text className="text-white font-semibold">
                                  {pkg.duration} minutes
                                </Text>
                                {pkg.popular && (
                                  <View className="bg-gold-500 px-2 py-1 rounded-full ml-2">
                                    <Text className="text-black text-xs font-bold">POPULAR</Text>
                                  </View>
                                )}
                              </View>
                              {pkg.originalPrice && (
                                <Text className="text-white/60 text-sm line-through">
                                  {formatPrice(pkg.originalPrice)}
                                </Text>
                              )}
                            </View>
                            <View className="items-end">
                              <Text className="text-white text-xl font-bold">
                                {formatPrice(pkg.price)}
                              </Text>
                              {pkg.originalPrice && (
                                <Text className="text-green-400 text-sm">
                                  Save {formatPrice(pkg.originalPrice - pkg.price)}
                                </Text>
                              )}
                            </View>
                          </View>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Current Balance */}
          <View className="px-6 py-6">
            <View className="bg-gold-500/20 border border-gold-400/30 rounded-xl p-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gold-400 text-sm font-semibold">Your Balance</Text>
                  <Text className="text-white text-2xl font-bold">
                    {formatPrice((user as any)?.balance || 0)}
                  </Text>
                </View>
                <Pressable
                  onPress={() => navigation.navigate('AddFunds')}
                  className="bg-gold-500 px-4 py-2 rounded-lg"
                >
                  <Text className="text-black font-semibold">Add Funds</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}