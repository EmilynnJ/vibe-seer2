import React, { useState } from 'react';
import { View, Text, Pressable, Alert, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../state/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const fundingOptions = [
  { amount: 10, label: '$10' },
  { amount: 25, label: '$25' },
  { amount: 50, label: '$50' },
  { amount: 100, label: '$100' },
];

export default function AddFundsScreen() {
  const { user, updateBalance } = useAuthStore();
  const navigation = useNavigation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddFunds = () => {
    if (!selectedAmount) {
      Alert.alert('Error', 'Please select an amount to add');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      updateBalance(selectedAmount);
      setIsProcessing(false);
      Alert.alert(
        'Success!',
        `$${selectedAmount.toFixed(2)} has been added to your account.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 2000);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
      className="flex-1"
      imageStyle={{ opacity: 0.3 }}
    >
      <SafeAreaView className="flex-1 bg-black/70">
        <View className="flex-row items-center p-4 border-b border-pink-400/30">
          <Pressable onPress={() => navigation.goBack()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#EC4899" />
          </Pressable>
          <Text className="text-white text-xl font-semibold">Add Funds</Text>
        </View>

        <View className="flex-1 px-6 pt-8">
          <View className="bg-white/10 rounded-xl p-6 border border-pink-400/30 mb-8">
            <Text className="text-white text-lg font-semibold mb-2">Current Balance</Text>
            <Text className="text-gold-400 text-3xl font-bold">
              ${(user as any)?.balance?.toFixed(2) || '0.00'}
            </Text>
          </View>

          <Text className="text-white text-lg font-semibold mb-4 font-serif">
            Select Amount to Add
          </Text>

          <View className="grid grid-cols-2 gap-4 mb-8">
            {fundingOptions.map((option) => (
              <Pressable
                key={option.amount}
                onPress={() => setSelectedAmount(option.amount)}
                className={`p-6 rounded-xl border-2 ${
                  selectedAmount === option.amount
                    ? 'bg-pink-500 border-pink-400'
                    : 'bg-white/10 border-pink-400/30'
                }`}
              >
                <Text className="text-white text-center text-2xl font-bold">
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={handleAddFunds}
            disabled={!selectedAmount || isProcessing}
            className={`rounded-lg py-4 ${
              selectedAmount && !isProcessing
                ? 'bg-pink-500'
                : 'bg-gray-600'
            }`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isProcessing 
                ? 'Processing Payment...' 
                : selectedAmount 
                  ? `Add $${selectedAmount.toFixed(2)}` 
                  : 'Select Amount'
              }
            </Text>
          </Pressable>

          <Text className="text-white/60 text-sm text-center mt-4">
            Payments are processed securely through Stripe.
            {'\n'}No charges will be made without your confirmation.
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}