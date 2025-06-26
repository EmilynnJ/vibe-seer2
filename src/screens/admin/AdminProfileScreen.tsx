import React from 'react';
import { View, Text, Pressable, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminStore } from '../../state/adminStore';
import { Ionicons } from '@expo/vector-icons';

export default function AdminProfileScreen() {
  const { admin, logout } = useAdminStore();

  return (
    <ImageBackground
      source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
      className="flex-1"
      imageStyle={{ opacity: 0.2 }}
    >
      <SafeAreaView className="flex-1 bg-black/80">
        <View className="flex-1 px-6 pt-8">
          <Text className="text-4xl text-pink-400 font-bold italic text-center mb-8">
            Admin Profile
          </Text>
          
          <View className="bg-white/10 rounded-xl p-6 border border-pink-400/30 mb-6">
            <View className="items-center">
              <View className="w-20 h-20 bg-pink-500/20 rounded-full items-center justify-center mb-4">
                <Ionicons name="shield-checkmark" size={40} color="#EC4899" />
              </View>
              
              <Text className="text-white text-xl font-semibold font-serif">
                {admin?.firstName} {admin?.lastName}
              </Text>
              <Text className="text-pink-300 text-lg font-semibold mt-1">Administrator</Text>
              <Text className="text-white/70 mt-2">{admin?.email}</Text>
              
              <View className="mt-4 px-3 py-1 bg-pink-500/20 rounded-full">
                <Text className="text-pink-300 text-sm font-semibold">ADMIN ACCESS</Text>
              </View>
            </View>
          </View>

          {/* Admin Actions */}
          <View className="space-y-3 mb-8">
            <Pressable className="flex-row items-center p-4 bg-white/10 rounded-xl border border-pink-400/20">
              <Ionicons name="settings" size={24} color="#EC4899" />
              <View className="ml-4 flex-1">
                <Text className="text-white font-semibold">Platform Settings</Text>
                <Text className="text-white/70 text-sm">Configure system settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#EC4899" />
            </Pressable>

            <Pressable className="flex-row items-center p-4 bg-white/10 rounded-xl border border-yellow-400/20">
              <Ionicons name="document-text" size={24} color="#FBBF24" />
              <View className="ml-4 flex-1">
                <Text className="text-white font-semibold">System Logs</Text>
                <Text className="text-white/70 text-sm">View application logs</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FBBF24" />
            </Pressable>

            <Pressable className="flex-row items-center p-4 bg-white/10 rounded-xl border border-green-400/20">
              <Ionicons name="shield" size={24} color="#10B981" />
              <View className="ml-4 flex-1">
                <Text className="text-white font-semibold">Security Center</Text>
                <Text className="text-white/70 text-sm">Security monitoring</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#10B981" />
            </Pressable>

            <Pressable className="flex-row items-center p-4 bg-white/10 rounded-xl border border-purple-400/20">
              <Ionicons name="card" size={24} color="#8B5CF6" />
              <View className="ml-4 flex-1">
                <Text className="text-white font-semibold">Payment Management</Text>
                <Text className="text-white/70 text-sm">Stripe integration settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8B5CF6" />
            </Pressable>
          </View>

          {/* System Info */}
          <View className="bg-white/10 rounded-xl p-4 border border-gray-400/20 mb-6">
            <Text className="text-white font-semibold mb-3">System Information</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-white/70">Version</Text>
                <Text className="text-white">1.0.0</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/70">Environment</Text>
                <Text className="text-white">Production</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/70">Database</Text>
                <Text className="text-green-400">Neon PostgreSQL</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/70">Stripe</Text>
                <Text className="text-green-400">Live Mode Active</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/70">Admin Account</Text>
                <Text className="text-pink-400">Emilynn J.</Text>
              </View>
            </View>
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