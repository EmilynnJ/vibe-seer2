import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAppStore from '../state/appStore';

export default function AuthStatus() {
  const navigation = useNavigation();
  const { user, signOut } = useAppStore();

  if (!user.isAuthenticated) {
    return (
      <Pressable 
        onPress={() => navigation.navigate('Auth' as never)}
        className="flex-row items-center bg-purple-600/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-400/50"
      >
        <Ionicons name="person-circle-outline" size={20} color="white" />
        <Text className="text-white ml-2 font-medium">Sign In</Text>
      </Pressable>
    );
  }

  return (
    <View className="flex-row items-center bg-green-600/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-400/50">
      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
      <Text className="text-white ml-2 font-medium">{user.name}</Text>
    </View>
  );
}