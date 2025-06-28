import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, Modal, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAdminStore } from '../../state/adminStore';
import { Ionicons } from '@expo/vector-icons';
import { AdminClient } from '../../types/admin';

export default function ClientManagementScreen() {
  const { clients, refundClient, deactivateUser, isLoading } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRefundModal, setShowRefundModal] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<AdminClient | null>(null);
  const [refundAmount, setRefundAmount] = useState<string>('');
  const [refundReason, setRefundReason] = useState<string>('');

  const filteredClients = clients.filter((client: AdminClient) =>
    client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefund = async (): Promise<void> => {
    if (!selectedClient || !refundAmount || !refundReason) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amount = parseFloat(refundAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      await refundClient(selectedClient.userId, amount, refundReason);
      Alert.alert('Success', `Refund of $${amount.toFixed(2)} processed successfully`);
      setShowRefundModal(false);
      setSelectedClient(null);
      setRefundAmount('');
      setRefundReason('');
    } catch (error) {
      Alert.alert('Error', 'Failed to process refund');
    }
  };

  const handleDeactivateClient = (client: AdminClient): void => {
    Alert.alert(
      'Deactivate Client',
      `Are you sure you want to deactivate ${client.firstName} ${client.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: () => deactivateUser(client.userId)
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
        <View className="px-6 pt-4 pb-6 border-b border-pink-400/30">
          <Text className="text-4xl text-pink-400 font-bold italic">
            Client Management
          </Text>
          <Text className="text-white/80 mt-1">
            {clients.length} total clients
          </Text>
        </View>

        {/* Search */}
        <View className="px-4 py-3">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search clients..."
            placeholderTextColor="#9CA3AF"
            className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
          />
        </View>

        {/* Clients List */}
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {filteredClients.map((client) => (
            <View key={client.id} className="mb-4 p-4 bg-white/10 rounded-xl border border-pink-400/20">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-white text-lg font-semibold">
                    {client.firstName} {client.lastName}
                  </Text>
                  
                  <Text className="text-white/70 text-sm mt-1">{client.email}</Text>
                  
                  <View className="flex-row mt-2">
                    <View className="mr-6">
                      <Text className="text-gold-400 text-lg font-bold">
                        {formatCurrency(client.balance)}
                      </Text>
                      <Text className="text-white/60 text-xs">Current Balance</Text>
                    </View>
                    <View>
                      <Text className="text-green-400 text-lg font-bold">
                        {formatCurrency(client.totalSpent)}
                      </Text>
                      <Text className="text-white/60 text-xs">Total Spent</Text>
                    </View>
                  </View>

                  <Text className="text-white/60 text-xs mt-2">
                    Member since: {new Date(client.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <View className="items-end space-y-2">
                  <Pressable
                    onPress={() => {
                      setSelectedClient(client);
                      setShowRefundModal(true);
                    }}
                    className="bg-yellow-500/20 border border-yellow-400 px-3 py-1 rounded"
                  >
                    <Text className="text-yellow-400 text-xs">Refund</Text>
                  </Pressable>
                  
                  <Pressable
                    onPress={() => handleDeactivateClient(client)}
                    className="bg-red-500/20 border border-red-400 px-3 py-1 rounded"
                  >
                    <Text className="text-red-400 text-xs">Deactivate</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Refund Modal */}
        <Modal
          visible={showRefundModal}
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
                <Pressable onPress={() => setShowRefundModal(false)} className="mr-4">
                  <Ionicons name="close" size={24} color="#EC4899" />
                </Pressable>
                <Text className="text-white text-xl font-semibold">Process Refund</Text>
              </View>

              <View className="flex-1 px-4 pt-6">
                {selectedClient && (
                  <View className="bg-white/10 rounded-xl p-4 border border-pink-400/30 mb-6">
                    <Text className="text-white text-lg font-semibold">
                      {selectedClient.firstName} {selectedClient.lastName}
                    </Text>
                    <Text className="text-white/70">{selectedClient.email}</Text>
                    <Text className="text-gold-400 mt-2">
                      Current Balance: {formatCurrency(selectedClient.balance)}
                    </Text>
                  </View>
                )}

                <View className="space-y-4">
                  <View>
                    <Text className="text-white mb-2 font-serif">Refund Amount</Text>
                    <TextInput
                      value={refundAmount}
                      onChangeText={setRefundAmount}
                      placeholder="0.00"
                      placeholderTextColor="#9CA3AF"
                      className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                      keyboardType="decimal-pad"
                    />
                  </View>

                  <View>
                    <Text className="text-white mb-2 font-serif">Reason for Refund</Text>
                    <TextInput
                      value={refundReason}
                      onChangeText={setRefundReason}
                      placeholder="Enter refund reason..."
                      placeholderTextColor="#9CA3AF"
                      className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>

                <Pressable
                  onPress={handleRefund}
                  disabled={isLoading}
                  className="bg-yellow-500 rounded-lg py-4 mt-6"
                >
                  <Text className="text-white text-center font-semibold text-lg">
                    {isLoading ? 'Processing...' : 'Process Refund'}
                  </Text>
                </Pressable>
              </View>
            </SafeAreaView>
          </ImageBackground>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}