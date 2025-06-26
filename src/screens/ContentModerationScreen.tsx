import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAppStore from '../state/appStore';
import BackgroundImage from '../components/BackgroundImage';

export default function ContentModerationScreen() {
  const navigation = useNavigation();
  const { reports, updateReportStatus } = useAppStore();
  const [selectedTab, setSelectedTab] = useState('reports');

  const pendingReports = reports.filter(r => r.status === 'pending');
  
  const tabs = [
    { id: 'reports', label: 'Reports', count: pendingReports.length },
    { id: 'flagged', label: 'Flagged Posts', count: 0 },
    { id: 'reviews', label: 'Reviews', count: 0 },
  ];

  const handleReportAction = (reportId: string, action: string) => {
    let newStatus: 'pending' | 'investigating' | 'resolved' | 'dismissed';
    
    switch (action) {
      case 'approve':
        newStatus = 'resolved';
        break;
      case 'dismiss':
        newStatus = 'dismissed';
        break;
      case 'investigate':
        newStatus = 'investigating';
        break;
      default:
        return;
    }
    
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} this report?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => updateReportStatus(reportId, newStatus) }
      ]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-600/30 text-red-200';
      case 'medium': return 'bg-amber-600/30 text-amber-200';
      case 'low': return 'bg-green-600/30 text-green-200';
      default: return 'bg-gray-600/30 text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-600/30 text-amber-200';
      case 'investigating': return 'bg-blue-600/30 text-blue-200';
      case 'resolved': return 'bg-green-600/30 text-green-200';
      case 'dismissed': return 'bg-gray-600/30 text-gray-200';
      default: return 'bg-gray-600/30 text-gray-200';
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
                <Text className="text-2xl font-bold text-white">Content Moderation</Text>
                <Text className="text-white/80">Review reports and manage content</Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View className="px-4 py-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tabs.map((tab) => (
                <Pressable
                  key={tab.id}
                  onPress={() => setSelectedTab(tab.id)}
                  className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${
                    selectedTab === tab.id
                      ? 'bg-red-600/80 backdrop-blur-sm border border-red-400/50'
                      : 'bg-black/30 backdrop-blur-md border border-white/20'
                  }`}
                >
                  <Text className={`font-medium ${
                    selectedTab === tab.id ? 'text-white' : 'text-white/80'
                  }`}>
                    {tab.label}
                  </Text>
                  {tab.count > 0 && (
                    <View className="ml-2 bg-white/20 rounded-full px-2 py-1">
                      <Text className="text-white text-xs font-bold">{tab.count}</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Content */}
          <View className="px-4">
            {selectedTab === 'reports' && (
              <View>
                <Text className="text-white font-semibold mb-4">
                  {reports.length} total reports
                </Text>
                
                {reports.length === 0 ? (
                  <View className="items-center py-12">
                    <Ionicons name="shield-checkmark" size={48} color="rgba(255,255,255,0.5)" />
                    <Text className="text-white/70 text-lg font-medium mt-4">No reports</Text>
                    <Text className="text-white/50 text-center mt-2">All clear! No content reports to review.</Text>
                  </View>
                ) : (
                  reports.map((report) => (
                  <View key={report.id} className="bg-black/40 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/20">
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-2">
                          <Ionicons name="flag" size={16} color="#EF4444" />
                          <Text className="text-white font-semibold ml-2">{report.type.replace('_', ' ').toUpperCase()}</Text>
                          <View className={`ml-2 rounded-full px-2 py-1 ${getSeverityColor(report.severity)}`}>
                            <Text className="text-xs font-medium">{report.severity.toUpperCase()}</Text>
                          </View>
                          <View className={`ml-2 rounded-full px-2 py-1 ${getStatusColor(report.status)}`}>
                            <Text className="text-xs font-medium">{report.status.toUpperCase()}</Text>
                          </View>
                        </View>
                        
                        <Text className="text-white/80 mb-2">{report.content}</Text>
                        <Text className="text-white/60 text-sm">Reported by: {report.reporter}</Text>
                        <Text className="text-white/60 text-sm">Against: {report.reportedUser}</Text>
                        <Text className="text-white/60 text-sm">{new Date(report.timestamp).toLocaleString()}</Text>
                      </View>
                    </View>
                    
                    <View className="flex-row gap-2">
                      <Pressable 
                        onPress={() => handleReportAction(report.id, 'approve')}
                        className="bg-green-600/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-green-400/50"
                      >
                        <Text className="text-white font-medium">Approve</Text>
                      </Pressable>
                      
                      <Pressable 
                        onPress={() => handleReportAction(report.id, 'dismiss')}
                        className="bg-gray-600/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-400/50"
                      >
                        <Text className="text-white font-medium">Dismiss</Text>
                      </Pressable>
                      
                      <Pressable 
                        onPress={() => handleReportAction(report.id, 'investigate')}
                        className="bg-blue-600/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-400/50"
                      >
                        <Text className="text-white font-medium">Investigate</Text>
                      </Pressable>
                    </View>
                  </View>
                  ))
                )}
              </View>
            )}

            {selectedTab === 'flagged' && (
              <View className="items-center py-12">
                <Ionicons name="flag-outline" size={48} color="rgba(255,255,255,0.5)" />
                <Text className="text-white/70 text-lg font-medium mt-4">No flagged posts</Text>
                <Text className="text-white/50 text-center mt-2">Flagged community posts will appear here</Text>
              </View>
            )}

            {selectedTab === 'reviews' && (
              <View className="items-center py-12">
                <Ionicons name="star-outline" size={48} color="rgba(255,255,255,0.5)" />
                <Text className="text-white/70 text-lg font-medium mt-4">No reviews to moderate</Text>
                <Text className="text-white/50 text-center mt-2">Reader reviews requiring attention will appear here</Text>
              </View>
            )}
          </View>

          {/* Quick Actions */}
          <View className="px-4 py-6">
            <Text className="text-white font-semibold mb-4">Quick Actions</Text>
            <View className="flex-row flex-wrap gap-3">
              <Pressable className="flex-1 min-w-[45%] bg-amber-600/60 backdrop-blur-sm rounded-xl p-4 border border-amber-400/50">
                <Ionicons name="eye-off" size={24} color="white" />
                <Text className="text-white font-semibold mt-2">Hide Content</Text>
              </Pressable>
              
              <Pressable className="flex-1 min-w-[45%] bg-red-600/60 backdrop-blur-sm rounded-xl p-4 border border-red-400/50">
                <Ionicons name="ban" size={24} color="white" />
                <Text className="text-white font-semibold mt-2">Ban User</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundImage>
  );
}