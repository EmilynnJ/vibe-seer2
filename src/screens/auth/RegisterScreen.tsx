import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../state/authStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        role: 'client',
      });
    } catch (error) {
      Alert.alert('Registration Failed', error instanceof Error ? error.message : 'Please try again');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
      className="flex-1"
      imageStyle={{ opacity: 0.4 }}
    >
      <SafeAreaView className="flex-1 bg-black/60">
        <View className="flex-1 justify-center px-8">
          {/* Logo */}
          <View className="items-center mb-8">
            <Text className="text-4xl text-pink-400 mb-2 font-bold italic">
              SoulSeer
            </Text>
            <Text className="text-white text-base opacity-80 font-serif">
              Join Our Spiritual Community
            </Text>
          </View>

          {/* Register Form */}
          <View className="space-y-4">
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Text className="text-white mb-2 font-serif">First Name</Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  placeholderTextColor="#9CA3AF"
                  className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                />
              </View>
              <View className="flex-1">
                <Text className="text-white mb-2 font-serif">Last Name</Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  placeholderTextColor="#9CA3AF"
                  className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                />
              </View>
            </View>

            <View>
              <Text className="text-white mb-2 font-serif">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className="text-white mb-2 font-serif">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                secureTextEntry
              />
            </View>

            <View>
              <Text className="text-white mb-2 font-serif">Confirm Password</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                secureTextEntry
              />
            </View>

            <Pressable
              onPress={handleRegister}
              disabled={isLoading}
              className="bg-pink-500 rounded-lg py-4 mt-6"
            >
              <Text className="text-white text-center font-semibold text-lg">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </Pressable>

            <View className="flex-row justify-center mt-6">
              <Text className="text-white opacity-80">Already have an account? </Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text className="text-pink-400 font-semibold">Sign In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}