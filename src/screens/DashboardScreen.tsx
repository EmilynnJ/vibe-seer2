import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAppStore from '../state/appStore';
import BackgroundImage from '../components/BackgroundImage';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user, favoriteReaders, readingHistory, readers } = useAppStore();
  
  const onlineReaders = readers.filter(r => r.isOnline).length;

  const stats = [
    { label: 'Total Readings', value: readingHistory.length.toString(), icon: 'book', color: 'bg-purple-600/30 text-purple-200' },
    { label: 'Favorite Readers', value: favoriteReaders.length.toString(), icon: 'heart', color: 'bg-red-600/30 text-red-200' },
    { label: 'Wallet Balance', value: `${user.walletBalance?.toFixed(2) || '0.00'}`, icon: 'wallet', color: 'bg-green-600/30 text-green-200' },
    { label: 'Online Readers', value: onlineReaders.toString(), icon: 'radio', color: 'bg-blue-600/30 text-blue-200' },
  ];

  const quickActions = [
    { title: 'Book Reading', icon: 'book', color: 'bg-purple-600/80 backdrop-blur-sm border border-purple-400/50', screen: 'Readings' },
    { title: 'My Wallet', icon: 'wallet', color: 'bg-emerald-600/80 backdrop-blur-sm border border-emerald-400/50', screen: 'Wallet' },
    { title: 'View Messages', icon: 'mail', color: 'bg-blue-600/80 backdrop-blur-sm border border-blue-400/50', screen: 'Messages' },
    { title: 'Browse Shop', icon: 'storefront', color: 'bg-green-600/80 backdrop-blur-sm border border-green-400/50', screen: 'Shop' },
    { title: 'Join Community', icon: 'people', color: 'bg-indigo-600/80 backdrop-blur-sm border border-indigo-400/50', screen: 'Community' },
  ];

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 py-6 bg-black/40 backdrop-blur-sm border-b border-white/10">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-white">
                {user.isAuthenticated ? `Welcome, ${user.name}` : 'Dashboard'}
              </Text>
              <Text className="text-white/80 mt-1">
                {user.isAuthenticated 
                  ? 'Your spiritual journey overview' 
                  : 'Sign in to see your personalized dashboard'
                }
              </Text>
            </View>
            {user.isAuthenticated && (
              <View className="bg-blue-600/30 backdrop-blur-sm rounded-full px-3 py-1 border border-blue-400/50">
                <Text className="text-blue-200 text-sm font-bold">
                  {(user.role || 'CLIENT').toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          
          {/* Role-specific dashboard links */}
          {/* Role-specific dashboard access */}
          {user.isAuthenticated && user.role && user.role !== 'client' && (
            <View className="mt-4 flex-row gap-2">
              {user.role === 'admin' && (
                <Pressable 
                  onPress={() => navigation.navigate('AdminDashboard' as never)}
                  className="bg-red-600/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-red-400/50"
                >
                  <Text className="text-white font-medium">Open Admin Dashboard</Text>
                </Pressable>
              )}
              {user.role === 'reader' && (
                <Pressable 
                  onPress={() => navigation.navigate('ReaderDashboard' as never)}
                  className="bg-purple-600/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-400/50"
                >
                  <Text className="text-white font-medium">Open Reader Dashboard</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

        {/* Stats Grid */}
        {user.isAuthenticated ? (
          <View className="px-4 py-6">
            <Text className="text-lg font-semibold text-white mb-4">Your Stats</Text>
            <View className="flex-row flex-wrap gap-3">
              {stats.map((stat, index) => (
                <View key={index} className={`flex-1 min-w-[45%] ${stat.color.split(' text-')[0]} backdrop-blur-md rounded-xl p-4 border border-white/20`}>
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                      <Ionicons name={stat.icon as any} size={20} color="white" />
                    </View>
                  </View>
                  <Text className="text-2xl font-bold text-white">{stat.value}</Text>
                  <Text className="text-sm text-white/80">{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View className="px-4 py-6">
            <View className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <View className="items-center">
                <Ionicons name="person-circle-outline" size={48} color="rgba(255,255,255,0.6)" />
                <Text className="text-white text-lg font-semibold mt-4">Sign In Required</Text>
                <Text className="text-white/70 text-center mt-2">
                  Sign in to see your personalized stats and access your spiritual journey dashboard.
                </Text>
                <Pressable 
                  onPress={() => navigation.navigate('Auth' as never)}
                  className="bg-purple-600/80 backdrop-blur-sm rounded-lg px-6 py-3 mt-4 border border-purple-400/50"
                >
                  <Text className="text-white font-medium">Sign In</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-white mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap gap-3">
            {quickActions.map((action, index) => (
              <Pressable
                key={index}
                onPress={() => navigation.navigate(action.screen as never)}
                className={`flex-1 min-w-[45%] ${action.color} rounded-xl p-4`}
              >
                <Ionicons name={action.icon as any} size={24} color="white" />
                <Text className="text-white font-semibold mt-2">{action.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-white mb-4">Recent Activity</Text>
          <View className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <View className="items-center py-8">
              <Ionicons name="time-outline" size={48} color="rgba(255,255,255,0.5)" />
              <Text className="text-white/70 text-lg font-medium mt-4">No recent activity</Text>
              <Text className="text-white/50 text-center mt-2">
                {user.isAuthenticated 
                  ? 'Your reading history and interactions will appear here' 
                  : 'Sign in to see your activity history'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-white mb-4">
            {user.isAuthenticated ? 'Recommended for You' : 'Get Started'}
          </Text>
          <View className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <Text className="text-white text-lg font-bold">
              {user.isAuthenticated ? 'Continue Your Journey' : 'Discover Your Path'}
            </Text>
            <Text className="text-white/90 text-sm mt-1">
              {user.isAuthenticated 
                ? 'Based on your interests, we recommend exploring these areas.'
                : 'Connect with top-rated psychics and start your spiritual journey today.'
              }
            </Text>
            <Pressable 
              onPress={() => navigation.navigate('Readings' as never)}
              className="bg-purple-600/60 backdrop-blur-sm rounded-lg px-4 py-2 mt-3 self-start border border-purple-400/50"
            >
              <Text className="text-white font-medium">
                {user.isAuthenticated ? 'Book Your Next Reading' : 'Explore Readers'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Account Overview */}
        <View className="px-4 py-6 pb-8">
          <Text className="text-lg font-semibold text-white mb-4">Account</Text>
          <View className="bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
            <Pressable 
              onPress={() => navigation.navigate('Profile' as never)}
              className="flex-row items-center justify-between p-4 border-b border-white/10"
            >
              <View className="flex-row items-center">
                <Ionicons name="person-circle-outline" size={24} color="white" />
                <Text className="ml-3 font-medium text-white">Profile Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
            </Pressable>
            
            <Pressable className="flex-row items-center justify-between p-4 border-b border-white/10">
              <View className="flex-row items-center">
                <Ionicons name="card-outline" size={24} color="white" />
                <Text className="ml-3 font-medium text-white">Payment Methods</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
            </Pressable>
            
            <Pressable className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center">
                <Ionicons name="notifications-outline" size={24} color="white" />
                <Text className="ml-3 font-medium text-white">Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
            </Pressable>
          </View>
        </View>
      </ScrollView>
      </SafeAreaView>
    </BackgroundImage>
  );
}