import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BackgroundImage from '../components/BackgroundImage';
import useAppStore from '../state/appStore';
import WalletService, { WalletBalance, WalletTransaction } from '../services/walletService';

export default function WalletScreen() {
  const navigation = useNavigation();
  const { user, updateUserProfile } = useAppStore();
  
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addFundsModal, setAddFundsModal] = useState(false);
  const [addAmount, setAddAmount] = useState('25.00');
  const [isProcessing, setIsProcessing] = useState(false);

  const predefinedAmounts = [10, 25, 50, 100];

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setIsLoading(true);
      const [balanceData, transactionData] = await Promise.all([
        WalletService.getBalance(),
        WalletService.getTransactions(20)
      ]);
      
      setBalance(balanceData);
      setTransactions(transactionData);
      
      // Update user balance in store
      updateUserProfile({ walletBalance: balanceData.available });
    } catch (error) {
      console.error('Failed to load wallet data:', error);
      Alert.alert('Error', 'Failed to load wallet information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFunds = async () => {
    const amount = parseFloat(addAmount);
    
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    
    if (amount < 5) {
      Alert.alert('Minimum Amount', 'Minimum deposit is $5.00');
      return;
    }
    
    if (amount > 500) {
      Alert.alert('Maximum Amount', 'Maximum deposit is $500.00 per transaction');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await WalletService.addFunds(amount);
      
      if (result.success) {
        Alert.alert(
          'Funds Added Successfully!',
          `$${amount.toFixed(2)} has been added to your wallet.`,
          [
            {
              text: 'OK',
              onPress: () => {
                setAddFundsModal(false);
                setAddAmount('25.00');
                loadWalletData(); // Refresh data
              }
            }
          ]
        );
      } else {
        Alert.alert('Payment Failed', result.error || 'Failed to add funds');
      }
    } catch (error) {
      console.error('Add funds error:', error);
      Alert.alert('Error', 'An error occurred while processing your payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTransactionIcon = (type: WalletTransaction['type']) => {
    return WalletService.getTransactionIcon(type);
  };

  const getTransactionColor = (type: WalletTransaction['type']) => {
    return WalletService.getTransactionColor(type);
  };

  if (!user.isAuthenticated) {
    return (
      <BackgroundImage>
        <SafeAreaView className="flex-1 items-center justify-center px-6">
          <Ionicons name="wallet-outline" size={64} color="rgba(255,255,255,0.5)" />
          <Text className="text-white text-xl font-bold mt-4 text-center">
            Sign In Required
          </Text>
          <Text className="text-white/70 text-center mt-2">
            Please sign in to access your wallet
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Auth' as never)}
            className="bg-purple-600/80 backdrop-blur-sm rounded-xl px-6 py-3 mt-6 border border-purple-400/50"
          >
            <Text className="text-white font-bold">Sign In</Text>
          </Pressable>
        </SafeAreaView>
      </BackgroundImage>
    );
  }

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 py-3 bg-black/40 backdrop-blur-sm border-b border-white/10">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Pressable
                onPress={() => navigation.goBack()}
                className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full items-center justify-center mr-4"
              >
                <Ionicons name="arrow-back" size={20} color="white" />
              </Pressable>
              <Text className="text-white text-xl font-bold">My Wallet</Text>
            </View>
            <Pressable
              onPress={loadWalletData}
              className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full items-center justify-center"
            >
              <Ionicons name="refresh" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Balance Card */}
          <View className="px-4 py-6">
            <View className="bg-gradient-to-r from-purple-600/40 to-pink-600/40 rounded-2xl p-6 border border-purple-400/30">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-white/80 text-lg">Available Balance</Text>
                <Ionicons name="wallet" size={24} color="#C084FC" />
              </View>
              
              {balance ? (
                <Text className="text-white text-4xl font-bold mb-2">
                  {formatCurrency(balance.available)}
                </Text>
              ) : (
                <View className="bg-white/20 rounded-lg h-12 mb-2" />
              )}
              
              {balance && balance.pending > 0 && (
                <Text className="text-white/70 text-sm">
                  + {formatCurrency(balance.pending)} pending
                </Text>
              )}
              
              <Pressable
                onPress={() => setAddFundsModal(true)}
                className="bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 mt-4 flex-row items-center justify-center"
              >
                <Ionicons name="add" size={20} color="white" />
                <Text className="text-white font-bold ml-2">Add Funds</Text>
              </Pressable>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="px-4 mb-6">
            <Text className="text-white text-lg font-bold mb-3">Quick Actions</Text>
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setAddFundsModal(true)}
                className="flex-1 bg-black/40 backdrop-blur-md rounded-xl p-4 items-center border border-white/20"
              >
                <Ionicons name="add-circle" size={32} color="#10B981" />
                <Text className="text-white font-medium mt-2 text-center">Add Funds</Text>
              </Pressable>
              
              <Pressable
                onPress={() => navigation.navigate('Readings' as never)}
                className="flex-1 bg-black/40 backdrop-blur-md rounded-xl p-4 items-center border border-white/20"
              >
                <Ionicons name="book" size={32} color="#8B5CF6" />
                <Text className="text-white font-medium mt-2 text-center">Get Reading</Text>
              </Pressable>
            </View>
          </View>

          {/* Transaction History */}
          <View className="px-4 mb-6">
            <Text className="text-white text-lg font-bold mb-3">Recent Transactions</Text>
            
            {transactions.length > 0 ? (
              <View className="bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
                {transactions.map((transaction, index) => (
                  <View 
                    key={transaction.id} 
                    className={`p-4 ${index !== transactions.length - 1 ? 'border-b border-white/10' : ''}`}
                  >
                    <View className="flex-row items-center">
                      <View 
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: `${getTransactionColor(transaction.type)}20` }}
                      >
                        <Ionicons 
                          name={getTransactionIcon(transaction.type) as any} 
                          size={20} 
                          color={getTransactionColor(transaction.type)} 
                        />
                      </View>
                      
                      <View className="flex-1">
                        <Text className="text-white font-medium">
                          {WalletService.getTransactionTypeDisplay(transaction.type)}
                        </Text>
                        <Text className="text-white/70 text-sm" numberOfLines={1}>
                          {transaction.description}
                        </Text>
                        <Text className="text-white/50 text-xs">
                          {transaction.timestamp.toLocaleDateString()} {transaction.timestamp.toLocaleTimeString()}
                        </Text>
                      </View>
                      
                      <View className="items-end">
                        <Text 
                          className={`font-bold text-lg ${
                            transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </Text>
                        <Text className={`text-xs ${
                          transaction.status === 'completed' ? 'text-green-400' :
                          transaction.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {transaction.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="bg-black/40 backdrop-blur-md rounded-xl p-6 items-center border border-white/20">
                <Ionicons name="receipt-outline" size={48} color="rgba(255,255,255,0.3)" />
                <Text className="text-white/70 text-center mt-3">No transactions yet</Text>
                <Text className="text-white/50 text-center text-sm">
                  Your transaction history will appear here
                </Text>
              </View>
            )}
          </View>

          {/* Wallet Info */}
          <View className="px-4 pb-8">
            <View className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <Text className="text-white font-bold mb-3">💡 Wallet Tips</Text>
              <Text className="text-white/80 text-sm leading-5">
                • Maintain a balance for uninterrupted reading sessions
                • Readings are charged per minute based on the reader's rate
                • Unused balance remains in your wallet for future sessions
                • Add funds anytime using secure payment methods
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Add Funds Modal */}
        <Modal visible={addFundsModal} animationType="slide" presentationStyle="pageSheet">
          <BackgroundImage>
            <SafeAreaView className="flex-1">
              <View className="flex-1 px-6">
                {/* Header */}
                <View className="flex-row items-center justify-between py-4">
                  <Text className="text-white text-xl font-bold">Add Funds</Text>
                  <Pressable
                    onPress={() => setAddFundsModal(false)}
                    className="w-8 h-8 bg-black/40 rounded-full items-center justify-center"
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </Pressable>
                </View>

                {/* Amount Selection */}
                <View className="mb-6">
                  <Text className="text-white text-lg font-bold mb-4">Select Amount</Text>
                  <View className="flex-row flex-wrap gap-3 mb-4">
                    {predefinedAmounts.map((amount) => (
                      <Pressable
                        key={amount}
                        onPress={() => setAddAmount(amount.toFixed(2))}
                        className={`px-4 py-3 rounded-xl border ${
                          addAmount === amount.toFixed(2)
                            ? 'bg-purple-600/80 border-purple-400/50'
                            : 'bg-black/30 border-white/20'
                        }`}
                      >
                        <Text className={`font-medium ${
                          addAmount === amount.toFixed(2) ? 'text-white' : 'text-white/70'
                        }`}>
                          ${amount}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <Text className="text-white/70 mb-2">Custom Amount</Text>
                  <View className="flex-row items-center bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                    <Text className="text-white text-lg mr-2">$</Text>
                    <TextInput
                      value={addAmount}
                      onChangeText={setAddAmount}
                      placeholder="0.00"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      keyboardType="decimal-pad"
                      className="flex-1 text-white text-lg"
                    />
                  </View>
                </View>

                {/* Payment Method */}
                <View className="mb-6">
                  <Text className="text-white text-lg font-bold mb-3">Payment Method</Text>
                  <View className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <View className="flex-row items-center">
                      <Ionicons name="card" size={24} color="#60A5FA" />
                      <View className="ml-3">
                        <Text className="text-white font-medium">Credit/Debit Card</Text>
                        <Text className="text-white/70 text-sm">•••• •••• •••• 1234</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Add Funds Button */}
                <Pressable
                  onPress={handleAddFunds}
                  disabled={isProcessing}
                  className={`bg-purple-600/80 backdrop-blur-sm rounded-xl py-4 items-center border border-purple-400/50 ${
                    isProcessing ? 'opacity-50' : ''
                  }`}
                >
                  <Text className="text-white text-lg font-bold">
                    {isProcessing ? 'Processing...' : `Add $${addAmount}`}
                  </Text>
                </Pressable>

                {/* Security Notice */}
                <View className="mt-4 bg-black/20 rounded-xl p-3">
                  <Text className="text-white/60 text-xs text-center">
                    🔒 Your payment information is secure and encrypted. 
                    Funds are processed through Stripe's secure payment system.
                  </Text>
                </View>
              </View>
            </SafeAreaView>
          </BackgroundImage>
        </Modal>
      </SafeAreaView>
    </BackgroundImage>
  );
}