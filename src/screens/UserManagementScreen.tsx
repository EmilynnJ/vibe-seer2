import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAppStore from '../state/appStore';
import BackgroundImage from '../components/BackgroundImage';

export default function UserManagementScreen() {
  const navigation = useNavigation();
  const { allUsers, updateUserStatus, deleteUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Clients', 'Readers', 'Admins', 'Suspended'];

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || 
      (selectedFilter === 'Clients' && user.role === 'client') ||
      (selectedFilter === 'Readers' && user.role === 'reader') ||
      (selectedFilter === 'Admins' && user.role === 'admin') ||
      (selectedFilter === 'Suspended' && user.status === 'suspended');
    return matchesSearch && matchesFilter;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-600/30 text-red-200';
      case 'reader': return 'bg-purple-600/30 text-purple-200';
      case 'client': return 'bg-blue-600/30 text-blue-200';
      default: return 'bg-gray-600/30 text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600/30 text-green-200';
      case 'suspended': return 'bg-amber-600/30 text-amber-200';
      case 'suspended': return 'bg-red-600/30 text-red-200';
      case 'pending': return 'bg-yellow-600/30 text-yellow-200';
      default: return 'bg-gray-600/30 text-gray-200';
    }
  };

  const handleUserAction = (userId: string, action: string, userName: string) => {
    if (action === 'delete') {
      Alert.alert(
        'Delete User',
        `Are you sure you want to delete ${userName}? This action cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteUser(userId) }
        ]
      );
    } else if (action === 'suspend') {
      Alert.alert(
        'Suspend User',
        `Suspend ${userName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Suspend', onPress: () => updateUserStatus(userId, 'suspended') }
        ]
      );
    } else if (action === 'activate') {
      updateUserStatus(userId, 'active');
    }
  };

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-4 py-6 bg-black/40 backdrop-blur-sm border-b border-white/10">
            <View className="flex-row items-center">
              <Pressable 
                onPress={() => navigation.goBack()}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4"
              >
                <Ionicons name="arrow-back" size={20} color="white" />
              </Pressable>
              <View>
                <Text className="text-2xl font-bold text-white">User Management</Text>
                <Text className="text-white/80">Manage platform users and permissions</Text>
              </View>
            </View>
          </View>

          {/* Search and Filters */}
          <View className="px-4 py-4">
            <View className="flex-row items-center bg-black/40 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 mb-4">
              <Ionicons name="search" size={20} color="white" />
              <TextInput
                placeholder="Search users..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-3 text-white"
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filters.map((filter) => (
                <Pressable
                  key={filter}
                  onPress={() => setSelectedFilter(filter)}
                  className={`mr-3 px-4 py-2 rounded-full ${
                    selectedFilter === filter
                      ? 'bg-blue-600/80 backdrop-blur-sm border border-blue-400/50'
                      : 'bg-black/30 backdrop-blur-md border border-white/20'
                  }`}
                >
                  <Text className={`font-medium ${
                    selectedFilter === filter ? 'text-white' : 'text-white/80'
                  }`}>
                    {filter}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* User List */}
          <View className="px-4">
            <Text className="text-white font-semibold mb-4">
              {filteredUsers.length} users found
            </Text>
            
            {filteredUsers.map((user) => (
              <View key={user.id} className="bg-black/40 backdrop-blur-md rounded-xl p-4 mb-3 border border-white/20">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <Text className="text-white font-semibold text-lg">{user.name}</Text>
                      <View className={`ml-2 rounded-full px-2 py-1 ${getRoleColor(user.role)}`}>
                        <Text className="text-xs font-medium">{user.role.toUpperCase()}</Text>
                      </View>
                      <View className={`ml-2 rounded-full px-2 py-1 ${getStatusColor(user.status)}`}>
                        <Text className="text-xs font-medium">{user.status.toUpperCase()}</Text>
                      </View>
                    </View>
                    
                    <Text className="text-white/70 mb-1">{user.email}</Text>
                    <Text className="text-white/60 text-sm">Joined: {user.joinDate}</Text>
                    <Text className="text-white/60 text-sm">Last active: {user.lastActive}</Text>
                  </View>
                  
                  <View className="items-end gap-2">
                    <Pressable className="bg-blue-600/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-blue-400/50">
                      <Text className="text-white text-sm font-medium">View</Text>
                    </Pressable>
                    
                    {user.status === 'active' ? (
                      <Pressable 
                        onPress={() => handleUserAction(user.id, 'suspend', user.name)}
                        className="bg-amber-600/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-amber-400/50"
                      >
                        <Text className="text-white text-sm font-medium">Suspend</Text>
                      </Pressable>
                    ) : (
                      <Pressable 
                        onPress={() => handleUserAction(user.id, 'activate', user.name)}
                        className="bg-green-600/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-400/50"
                      >
                        <Text className="text-white text-sm font-medium">Activate</Text>
                      </Pressable>
                    )}
                    
                    <Pressable 
                      onPress={() => handleUserAction(user.id, 'delete', user.name)}
                      className="bg-red-600/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-red-400/50"
                    >
                      <Text className="text-white text-sm font-medium">Delete</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Stats */}
          <View className="px-4 py-6">
            <Text className="text-white font-semibold mb-4">User Statistics</Text>
            <View className="flex-row flex-wrap gap-3">
              <View className="flex-1 min-w-[45%] bg-blue-600/30 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Text className="text-white text-2xl font-bold">{allUsers.length}</Text>
                <Text className="text-white/80 text-sm">Total Users</Text>
              </View>
              <View className="flex-1 min-w-[45%] bg-green-600/30 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Text className="text-white text-2xl font-bold">{allUsers.filter(u => u.role === 'reader').length}</Text>
                <Text className="text-white/80 text-sm">Readers</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundImage>
  );
}