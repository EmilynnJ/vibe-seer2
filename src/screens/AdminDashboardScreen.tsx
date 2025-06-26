import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAppStore from '../state/appStore';
import BackgroundImage from '../components/BackgroundImage';
import StripeProductService from '../services/stripeProductService';

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const { user, readers, allUsers, reports, products } = useAppStore();
  const [isSyncing, setIsSyncing] = useState(false);

  const activeReaders = readers.filter(r => r.isOnline).length;
  const pendingReports = reports.filter(r => r.status === 'pending').length;
  
  const adminStats = [
    { label: 'Total Users', value: allUsers.length.toString(), icon: 'people', color: 'bg-blue-600/30 text-blue-200' },
    { label: 'Active Readers', value: readers.length.toString(), icon: 'person', color: 'bg-green-600/30 text-green-200' },
    { label: 'Online Readers', value: activeReaders.toString(), icon: 'radio', color: 'bg-red-600/30 text-red-200' },
    { label: 'Pending Reports', value: pendingReports.toString(), icon: 'flag', color: 'bg-purple-600/30 text-purple-200' },
  ];

  const adminActions = [
    { title: 'Manage Users', icon: 'people', color: 'bg-blue-600/80 backdrop-blur-sm border border-blue-400/50', screen: 'UserManagement' },
    { title: 'Add Reader', icon: 'person-add', color: 'bg-green-600/80 backdrop-blur-sm border border-green-400/50', screen: 'AddReader' },
    { title: 'Content Moderation', icon: 'shield-checkmark', color: 'bg-amber-600/80 backdrop-blur-sm border border-amber-400/50', screen: 'ContentModeration' },
    { title: 'Sync Products', icon: 'sync', color: 'bg-emerald-600/80 backdrop-blur-sm border border-emerald-400/50', action: 'syncProducts' },
    { title: 'Analytics', icon: 'analytics', color: 'bg-purple-600/80 backdrop-blur-sm border border-purple-400/50', screen: 'Analytics' },
    { title: 'Payment Management', icon: 'card', color: 'bg-indigo-600/80 backdrop-blur-sm border border-indigo-400/50', screen: 'PaymentManagement' },
    { title: 'System Settings', icon: 'settings', color: 'bg-gray-600/80 backdrop-blur-sm border border-gray-400/50', screen: 'SystemSettings' },
  ];

  const handleAdminAction = async (action: any) => {
    if (action.action === 'syncProducts') {
      await handleProductSync();
    } else {
      console.log('🔧 Navigating to admin screen:', action.screen);
      navigation.navigate(action.screen as never);
    }
  };

  const handleProductSync = async () => {
    if (isSyncing) return;
    
    Alert.alert(
      'Sync Products with Stripe',
      `This will sync ${products.length} products with Stripe. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sync Now',
          onPress: async () => {
            setIsSyncing(true);
            try {
              console.log('🔄 Starting Stripe product sync...');
              const result = await StripeProductService.syncProductsWithStripe();
              
              if (result.success) {
                Alert.alert(
                  'Sync Successful!',
                  `✅ Synced: ${result.syncedCount} products\n` +
                  `🆕 Created: ${result.createdCount} new products\n` +
                  `📝 Updated: ${result.updatedCount} products`,
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert(
                  'Sync Failed',
                  result.error || 'Unknown error occurred during sync',
                  [{ text: 'OK' }]
                );
              }
            } catch (error) {
              console.error('❌ Product sync error:', error);
              Alert.alert(
                'Sync Error',
                'Failed to sync products with Stripe. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setIsSyncing(false);
            }
          }
        }
      ]
    );
  };

  // Generate recent activity from actual data
  const recentActivity = [
    ...allUsers.slice(-3).map(user => ({
      type: 'user',
      message: `New ${user.role} registration: ${user.name}`,
      time: user.lastActive,
      icon: 'person-add'
    })),
    ...reports.slice(-2).map(report => ({
      type: 'report',
      message: `${report.type.replace('_', ' ')} reported`,
      time: new Date(report.timestamp).toLocaleString(),
      icon: 'flag'
    }))
  ].slice(-5); // Keep only last 5 activities

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-4 py-6 bg-black/40 backdrop-blur-sm border-b border-white/10">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <Pressable 
                    onPress={() => navigation.navigate('MainTabs' as never)}
                    className="w-8 h-8 bg-white/20 rounded-full items-center justify-center mr-3"
                  >
                    <Ionicons name="home" size={16} color="white" />
                  </Pressable>
                  <Text className="text-2xl font-bold text-white">Admin Dashboard</Text>
                </View>
                <Text className="text-white/80">Welcome back, {user.name}</Text>
                <Text className="text-white/60 text-xs mt-1">Email: {user.email} | Role: {user.role}</Text>
              </View>
              <View className="bg-red-600/30 backdrop-blur-sm rounded-full px-3 py-1 border border-red-400/50">
                <Text className="text-red-200 text-sm font-bold">ADMIN</Text>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View className="px-4 py-6">
            <Text className="text-lg font-semibold text-white mb-4">Platform Overview</Text>
            <View className="flex-row flex-wrap gap-3">
              {adminStats.map((stat, index) => (
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

          {/* Admin Actions */}
          <View className="px-4 py-6">
            <Text className="text-lg font-semibold text-white mb-4">Admin Tools</Text>
            <View className="flex-row flex-wrap gap-3">
              {adminActions.map((action, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleAdminAction(action)}
                  disabled={action.action === 'syncProducts' && isSyncing}
                  className={`flex-1 min-w-[45%] ${action.color} rounded-xl p-4 ${
                    action.action === 'syncProducts' && isSyncing ? 'opacity-50' : ''
                  }`}
                >
                  <Ionicons 
                    name={action.icon as any} 
                    size={24} 
                    color="white" 
                  />
                  <Text className="text-white font-semibold mt-2">
                    {action.action === 'syncProducts' && isSyncing ? 'Syncing...' : action.title}
                  </Text>
                  {action.action === 'syncProducts' && (
                    <Text className="text-white/70 text-xs mt-1">
                      {products.length} products
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View className="px-4 py-6">
            <Text className="text-lg font-semibold text-white mb-4">Recent Activity</Text>
            <View className="bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
              {recentActivity.map((activity, index) => (
                <View key={index} className={`p-4 ${index !== recentActivity.length - 1 ? 'border-b border-white/10' : ''}`}>
                  <View className="flex-row items-start">
                    <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mr-3">
                      <Ionicons name={activity.icon as any} size={16} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-medium">{activity.message}</Text>
                      <Text className="text-white/60 text-sm mt-1">{activity.time}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Alerts */}
          <View className="px-4 py-6">
            <Text className="text-lg font-semibold text-white mb-4">Alerts & Notifications</Text>
            <View className="space-y-3">
              <View className="bg-amber-600/30 backdrop-blur-md rounded-xl p-4 border border-amber-400/50">
                <View className="flex-row items-center">
                  <Ionicons name="warning" size={20} color="#FBBF24" />
                  <Text className="text-amber-200 font-medium ml-2">3 reports pending review</Text>
                </View>
              </View>
              
              <View className="bg-green-600/30 backdrop-blur-md rounded-xl p-4 border border-green-400/50">
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text className="text-green-200 font-medium ml-2">System backup completed</Text>
                </View>
              </View>
              
              <View className="bg-blue-600/30 backdrop-blur-md rounded-xl p-4 border border-blue-400/50">
                <View className="flex-row items-center">
                  <Ionicons name="information-circle" size={20} color="#3B82F6" />
                  <Text className="text-blue-200 font-medium ml-2">5 new reader applications</Text>
                </View>
              </View>
            </View>
          </View>

          {/* System Status */}
          <View className="px-4 py-6 pb-8">
            <Text className="text-lg font-semibold text-white mb-4">System Status</Text>
            <View className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <View className="space-y-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-white">Server Status</Text>
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <Text className="text-green-200 text-sm">Online</Text>
                  </View>
                </View>
                
                <View className="flex-row items-center justify-between">
                  <Text className="text-white">Payment Processing</Text>
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <Text className="text-green-200 text-sm">Operational</Text>
                  </View>
                </View>
                
                <View className="flex-row items-center justify-between">
                  <Text className="text-white">Live Streaming</Text>
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <Text className="text-green-200 text-sm">Active</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundImage>
  );
}