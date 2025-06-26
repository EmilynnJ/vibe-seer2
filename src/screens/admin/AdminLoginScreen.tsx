import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminStore } from '../../state/adminStore';
import { Ionicons } from '@expo/vector-icons';

export default function AdminLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAdminStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Invalid credentials');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
      className="flex-1"
      imageStyle={{ opacity: 0.3 }}
    >
      <SafeAreaView className="flex-1 bg-black/80">
        <View className="flex-1 justify-center px-8">
          {/* Header */}
          <View className="items-center mb-12">
            <Ionicons name="shield-checkmark" size={80} color="#EC4899" />
            <Text className="text-4xl text-pink-400 mt-4 mb-2 font-bold italic">
              SoulSeer Admin
            </Text>
            <Text className="text-white text-lg opacity-80 font-serif">
              Platform Administration
            </Text>
          </View>

          {/* Login Form */}
          <View className="space-y-4">
            <View>
              <Text className="text-white mb-2 font-serif">Admin Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter admin email"
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
                placeholder="Enter admin password"
                placeholderTextColor="#9CA3AF"
                className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                secureTextEntry
              />
            </View>

            {error && (
              <View className="bg-red-500/20 border border-red-400 rounded-lg p-3">
                <Text className="text-red-400 text-center">{error}</Text>
              </View>
            )}

            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              className="bg-pink-500 rounded-lg py-4 mt-6"
            >
              <Text className="text-white text-center font-semibold text-lg">
                {isLoading ? 'Signing In...' : 'Admin Sign In'}
              </Text>
            </Pressable>
          </View>

          {/* Admin Info */}
          <View className="mt-8 p-4 bg-pink-500/10 rounded-lg border border-pink-400/30">
            <View className="flex-row items-center">
              <Ionicons name="person-circle" size={20} color="#EC4899" />
              <Text className="text-pink-400 ml-2 font-semibold">Admin Access</Text>
            </View>
            <Text className="text-white/80 text-sm mt-2">
              Welcome, Emilynn! Use your admin credentials to access the SoulSeer platform management dashboard.
            </Text>
          </View>

          {/* Security Notice */}
          <View className="mt-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-400/30">
            <View className="flex-row items-center">
              <Ionicons name="warning" size={20} color="#FBBF24" />
              <Text className="text-yellow-400 ml-2 font-semibold">Security Notice</Text>
            </View>
            <Text className="text-white/80 text-sm mt-2">
              This is a secure admin area. All actions are logged and monitored for security purposes.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}