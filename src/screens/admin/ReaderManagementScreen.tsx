import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, Modal, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminStore } from '../../state/adminStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AdminReader } from '../../types/admin';

export default function ReaderManagementScreen() {
  const { readers, createReader, updateReader, deactivateUser, isLoading } = useAdminStore();
  const navigation = useNavigation();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newReader, setNewReader] = useState<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    bio: string;
    specialties: string[];
    chatRate: string;
    phoneRate: string;
    videoRate: string;
  }>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    bio: '',
    specialties: [],
    chatRate: '',
    phoneRate: '',
    videoRate: ''
  });

  const filteredReaders = readers.filter((reader: AdminReader) =>
    reader.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reader.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reader.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateReader = async (): Promise<void> => {
    if (!newReader.email || !newReader.password || !newReader.firstName || !newReader.lastName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await createReader({
        email: newReader.email,
        password: newReader.password,
        firstName: newReader.firstName,
        lastName: newReader.lastName,
        bio: newReader.bio,
        specialties: newReader.specialties,
        chatRate: parseFloat(newReader.chatRate) || 0,
        phoneRate: parseFloat(newReader.phoneRate) || 0,
        videoRate: parseFloat(newReader.videoRate) || 0
      });

      Alert.alert('Success', 'Reader account created successfully');
      setShowCreateModal(false);
      setNewReader({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        bio: '',
        specialties: [],
        chatRate: '',
        phoneRate: '',
        videoRate: ''
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create reader account');
    }
  };

  const handleDeactivateReader = (reader: AdminReader): void => {
    Alert.alert(
      'Deactivate Reader',
      `Are you sure you want to deactivate ${reader.firstName} ${reader.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: () => deactivateUser(reader.userId)
        }
      ]
    );
  };

  const formatCurrency = (amount: number): string => `$${amount.toFixed(2)}`;

  return (
    <ImageBackground
      source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
      className="flex-1"
      imageStyle={{ opacity: 0.2 }}
    >
      <SafeAreaView className="flex-1 bg-black/80">
        {/* Header */}
        <View className="flex-row items-center p-4 border-b border-pink-400/30">
          <Pressable onPress={() => navigation.goBack()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#EC4899" />
          </Pressable>
          <Text className="text-white text-xl font-semibold flex-1">Reader Management</Text>
          <Pressable
            onPress={() => setShowCreateModal(true)}
            className="bg-pink-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Add Reader</Text>
          </Pressable>
        </View>

        {/* Search */}
        <View className="px-4 py-3">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search readers..."
            placeholderTextColor="#9CA3AF"
            className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
          />
        </View>

        {/* Readers List */}
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {filteredReaders.map((reader) => (
            <View key={reader.id} className="mb-4 p-4 bg-white/10 rounded-xl border border-pink-400/20">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-white text-lg font-semibold">
                      {reader.firstName} {reader.lastName}
                    </Text>
                    <View className={`ml-2 w-3 h-3 rounded-full ${reader.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                  </View>
                  
                  <Text className="text-white/70 text-sm mt-1">{reader.email}</Text>
                  
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text className="text-gold-400 ml-1 mr-2">{reader.rating.toFixed(1)}</Text>
                    <Text className="text-white/60">({reader.totalReviews} reviews)</Text>
                  </View>

                  {reader.specialties.length > 0 && (
                    <Text className="text-pink-300 text-sm mt-1">
                      {reader.specialties.join(' • ')}
                    </Text>
                  )}

                  <View className="flex-row mt-2 space-x-2">
                    <Text className="text-white/70 text-xs bg-pink-500/20 px-2 py-1 rounded">
                      Chat: {formatCurrency(reader.chatRate)}/min
                    </Text>
                    <Text className="text-white/70 text-xs bg-purple-500/20 px-2 py-1 rounded">
                      Phone: {formatCurrency(reader.phoneRate)}/min
                    </Text>
                    <Text className="text-white/70 text-xs bg-indigo-500/20 px-2 py-1 rounded">
                      Video: {formatCurrency(reader.videoRate)}/min
                    </Text>
                  </View>

                  <View className="flex-row mt-2">
                    <Text className="text-green-400 text-sm mr-4">
                      Earnings: {formatCurrency(reader.totalEarnings)}
                    </Text>
                    <Text className="text-yellow-400 text-sm">
                      Pending: {formatCurrency(reader.pendingEarnings)}
                    </Text>
                  </View>
                </View>

                <View className="items-end">
                  <View className={`px-2 py-1 rounded-full ${
                    reader.verificationStatus === 'approved' ? 'bg-green-500' :
                    reader.verificationStatus === 'pending' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}>
                    <Text className="text-white text-xs font-semibold">
                      {reader.verificationStatus.toUpperCase()}
                    </Text>
                  </View>
                  
                  <Pressable
                    onPress={() => handleDeactivateReader(reader)}
                    className="mt-2 bg-red-500/20 border border-red-400 px-3 py-1 rounded"
                  >
                    <Text className="text-red-400 text-xs">Deactivate</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Create Reader Modal */}
        <Modal
          visible={showCreateModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <ImageBackground
            source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
            className="flex-1"
            imageStyle={{ opacity: 0.2 }}
          >
            <SafeAreaView className="flex-1 bg-black/80">
              <View className="flex-row items-center p-4 border-b border-pink-400/30">
                <Pressable onPress={() => setShowCreateModal(false)} className="mr-4">
                  <Ionicons name="close" size={24} color="#EC4899" />
                </Pressable>
                <Text className="text-white text-xl font-semibold">Create Reader Account</Text>
              </View>

              <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                <View className="space-y-4">
                  <View>
                    <Text className="text-white mb-2 font-serif">Email *</Text>
                    <TextInput
                      value={newReader.email}
                      onChangeText={(text) => setNewReader({...newReader, email: text})}
                      placeholder="reader@example.com"
                      placeholderTextColor="#9CA3AF"
                      className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View>
                    <Text className="text-white mb-2 font-serif">Password *</Text>
                    <TextInput
                      value={newReader.password}
                      onChangeText={(text) => setNewReader({...newReader, password: text})}
                      placeholder="Secure password"
                      placeholderTextColor="#9CA3AF"
                      className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                      secureTextEntry
                    />
                  </View>

                  <View className="flex-row space-x-3">
                    <View className="flex-1">
                      <Text className="text-white mb-2 font-serif">First Name *</Text>
                      <TextInput
                        value={newReader.firstName}
                        onChangeText={(text) => setNewReader({...newReader, firstName: text})}
                        placeholder="First name"
                        placeholderTextColor="#9CA3AF"
                        className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white mb-2 font-serif">Last Name *</Text>
                      <TextInput
                        value={newReader.lastName}
                        onChangeText={(text) => setNewReader({...newReader, lastName: text})}
                        placeholder="Last name"
                        placeholderTextColor="#9CA3AF"
                        className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                      />
                    </View>
                  </View>

                  <View>
                    <Text className="text-white mb-2 font-serif">Bio</Text>
                    <TextInput
                      value={newReader.bio}
                      onChangeText={(text) => setNewReader({...newReader, bio: text})}
                      placeholder="Reader bio and experience..."
                      placeholderTextColor="#9CA3AF"
                      className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View className="flex-row space-x-3">
                    <View className="flex-1">
                      <Text className="text-white mb-2 font-serif">Chat Rate</Text>
                      <TextInput
                        value={newReader.chatRate}
                        onChangeText={(text) => setNewReader({...newReader, chatRate: text})}
                        placeholder="0.00"
                        placeholderTextColor="#9CA3AF"
                        className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                        keyboardType="decimal-pad"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white mb-2 font-serif">Phone Rate</Text>
                      <TextInput
                        value={newReader.phoneRate}
                        onChangeText={(text) => setNewReader({...newReader, phoneRate: text})}
                        placeholder="0.00"
                        placeholderTextColor="#9CA3AF"
                        className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                        keyboardType="decimal-pad"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white mb-2 font-serif">Video Rate</Text>
                      <TextInput
                        value={newReader.videoRate}
                        onChangeText={(text) => setNewReader({...newReader, videoRate: text})}
                        placeholder="0.00"
                        placeholderTextColor="#9CA3AF"
                        className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={handleCreateReader}
                  disabled={isLoading}
                  className="bg-pink-500 rounded-lg py-4 mt-6 mb-8"
                >
                  <Text className="text-white text-center font-semibold text-lg">
                    {isLoading ? 'Creating...' : 'Create Reader Account'}
                  </Text>
                </Pressable>
              </ScrollView>
            </SafeAreaView>
          </ImageBackground>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}