import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAppStore from '../state/appStore';
import BackgroundImage from '../components/BackgroundImage';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { preferences, updatePreferences, user, signOut } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: '',
    birthDate: '',
    location: ''
  });

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Profile Updated', 'Your profile changes have been saved.');
  };

  const handleSignIn = () => {
    navigation.navigate('Auth' as never);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: () => signOut() }
      ]
    );
  };

  const handlePolicyNavigation = (policy: string) => {
    navigation.navigate('Policies' as never);
  };

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-6 bg-white">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-gray-900">Profile</Text>
              <Text className="text-gray-600 mt-1">Manage your account settings</Text>
            </View>
            <Pressable 
              onPress={() => setIsEditing(!isEditing)}
              className="bg-purple-600 rounded-full p-2"
            >
              <Ionicons name={isEditing ? 'checkmark' : 'create'} size={24} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Profile Picture */}
        <View className="items-center py-6 bg-white">
          <View className="w-24 h-24 rounded-full bg-purple-100 items-center justify-center mb-4">
            <Ionicons name="person" size={48} color="#8B5CF6" />
          </View>
          {user.isAuthenticated ? (
            <Pressable onPress={() => setIsEditing(!isEditing)}>
              <Text className="text-purple-300 font-medium">Customize Profile</Text>
            </Pressable>
          ) : (
            <Pressable onPress={handleSignIn}>
              <Text className="text-purple-300 font-medium">Sign In to Customize</Text>
            </Pressable>
          )}
        </View>

        {/* Personal Information */}
        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Personal Information</Text>
          <View className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Name */}
            <View className="p-4 border-b border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-2">Full Name</Text>
              {isEditing ? (
                <TextInput
                  value={profileData.name}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, name: text }))}
                  className="text-gray-900 border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter your full name"
                />
              ) : (
                <Text className="text-gray-900">{profileData.name}</Text>
              )}
            </View>

            {/* Email */}
            <View className="p-4 border-b border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
              {isEditing ? (
                <TextInput
                  value={profileData.email}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, email: text }))}
                  className="text-gray-900 border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              ) : (
                <Text className="text-gray-900">{profileData.email}</Text>
              )}
            </View>

            {/* Phone */}
            <View className="p-4 border-b border-gray-100">
              <Text className="text-sm font-medium text-gray-700 mb-2">Phone</Text>
              {isEditing ? (
                <TextInput
                  value={profileData.phone}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, phone: text }))}
                  className="text-gray-900 border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text className="text-gray-900">{profileData.phone || 'Not provided'}</Text>
              )}
            </View>

            {/* Birth Date */}
            <View className="p-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Birth Date</Text>
              {isEditing ? (
                <TextInput
                  value={profileData.birthDate}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, birthDate: text }))}
                  className="text-gray-900 border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="MM/DD/YYYY"
                />
              ) : (
                <Text className="text-gray-900">{profileData.birthDate || 'Not provided'}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Preferences</Text>
          <View className="bg-white rounded-xl shadow-sm border border-gray-100">
            <View className="p-4 border-b border-gray-100">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-medium text-gray-900">Notifications</Text>
                  <Text className="text-sm text-gray-600">Receive updates and reminders</Text>
                </View>
                <Switch
                  value={preferences.notifications}
                  onValueChange={(value) => updatePreferences({ notifications: value })}
                  trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
                  thumbColor={preferences.notifications ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            </View>

            <View className="p-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-medium text-gray-900">Dark Mode</Text>
                  <Text className="text-sm text-gray-600">Use dark theme</Text>
                </View>
                <Switch
                  value={preferences.darkMode}
                  onValueChange={(value) => updatePreferences({ darkMode: value })}
                  trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
                  thumbColor={preferences.darkMode ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Favorite Categories */}
        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Favorite Categories</Text>
          <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <View className="flex-row flex-wrap gap-2">
              {preferences.categories.map((category, index) => (
                <View key={index} className="bg-purple-100 rounded-full px-3 py-1">
                  <Text className="text-purple-700 font-medium">{category}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Account</Text>
          <View className="bg-white rounded-xl shadow-sm border border-gray-100">
            <Pressable 
              onPress={() => handlePolicyNavigation('privacy')}
              className="p-4 border-b border-gray-100 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <Ionicons name="shield-checkmark" size={24} color="#10B981" />
                <Text className="ml-3 font-medium text-gray-900">Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </Pressable>

            <Pressable 
              onPress={() => handlePolicyNavigation('terms')}
              className="p-4 border-b border-gray-100 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <Ionicons name="document-text" size={24} color="#3B82F6" />
                <Text className="ml-3 font-medium text-gray-900">Terms of Service</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </Pressable>

            <Pressable 
              onPress={() => navigation.navigate('HelpCenter' as never)}
              className="p-4 border-b border-gray-100 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <Ionicons name="help-circle" size={24} color="#F59E0B" />
                <Text className="ml-3 font-medium text-gray-900">Help Center</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </Pressable>

            {user.isAuthenticated ? (
              <Pressable 
                onPress={handleSignOut}
                className="p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <Ionicons name="log-out" size={24} color="#EF4444" />
                  <Text className="ml-3 font-medium text-white">Sign Out</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </Pressable>
            ) : (
              <Pressable 
                onPress={handleSignIn}
                className="p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <Ionicons name="log-in" size={24} color="#8B5CF6" />
                  <Text className="ml-3 font-medium text-white">Sign In</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </Pressable>
            )}
          </View>
        </View>

        {/* App Information */}
        <View className="px-4 py-6 pb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">App Information</Text>
          <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-700">Version</Text>
              <Text className="text-gray-900 font-medium">1.0.0</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">Last Updated</Text>
              <Text className="text-gray-900 font-medium">January 2024</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      </SafeAreaView>
    </BackgroundImage>
  );
}