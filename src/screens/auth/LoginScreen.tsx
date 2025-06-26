import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../state/authStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Please try again');
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
          <View className="items-center mb-12">
            <Text className="text-5xl text-pink-400 mb-4 font-bold italic">
              SoulSeer
            </Text>
            <Text className="text-white text-lg opacity-80 font-serif">
              A Community of Gifted Psychics
            </Text>
          </View>

          {/* Login Form */}
          <View className="space-y-4">
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

            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              className="bg-pink-500 rounded-lg py-4 mt-6"
            >
              <Text className="text-white text-center font-semibold text-lg">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </Pressable>

            <View className="flex-row justify-center mt-6">
              <Text className="text-white opacity-80">Don't have an account? </Text>
              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text className="text-pink-400 font-semibold">Sign Up</Text>
              </Pressable>
            </View>

            {/* Demo Credentials */}
            <View className="mt-8 p-4 bg-white/5 rounded-lg border border-gold-400/20">
              <Text className="text-gold-400 text-center mb-2 font-semibold">Demo Credentials</Text>
              <Text className="text-white text-sm">Client: client@test.com / password</Text>
              <Text className="text-white text-sm">Reader: reader@test.com / password</Text>
              <Text className="text-pink-400 text-sm mt-2">Admin access available via separate login</Text>
            </View>

            {/* Admin Access */}
            <View className="mt-6">
              <Pressable 
                onPress={() => (navigation as any).navigate('AdminAuth')}
                className="flex-row items-center justify-center p-3 border border-pink-400/30 rounded-lg"
              >
                <Ionicons name="shield-checkmark" size={20} color="#EC4899" />
                <Text className="text-pink-400 ml-2 font-semibold">Admin Access</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}