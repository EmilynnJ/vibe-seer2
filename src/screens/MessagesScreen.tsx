import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAppStore from '../state/appStore';
import BackgroundImage from '../components/BackgroundImage';

const messageTypes = ['All', 'Text', 'Reading', 'Order'];

export default function MessagesScreen() {
  const navigation = useNavigation();
  const { messages, markMessageAsRead, unreadMessages, setUnreadMessages, user } = useAppStore();
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');

  const filteredMessages = messages
    .filter(message => {
      const matchesType = selectedType === 'All' || message.type === selectedType.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    if (!user.isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please sign in to send messages',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Auth' as never) }
        ]
      );
      setNewMessage('');
      return;
    }
    
    // User is authenticated, send message
    Alert.alert('Message Sent', 'Your message has been sent successfully!');

    setNewMessage('');
  };

  // Sample conversation messages - in production, these would come from the database
  useEffect(() => {
    if (messages.length === 0) {
      // Add sample messages for demo
      const sampleMessages = [
        {
          id: '1',
          sender: 'Luna Moonwhisper',
          content: 'Thank you for booking a reading with me! I\'m excited to connect with your energy and provide insights.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          type: 'reading',
          isRead: false
        },
        {
          id: '2',
          sender: 'Crystal Starlight',
          content: 'Your tarot reading session is scheduled for tomorrow at 3 PM. Please prepare any specific questions you\'d like guidance on.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          type: 'reading',
          isRead: true
        },
        {
          id: '3',
          sender: 'Support',
          content: 'Your recent order #PS-2024-001 has been processed and will be shipped within 2-3 business days.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          type: 'order',
          isRead: false
        }
      ];
      // Note: In production, these would be loaded from the database
    }
  }, [messages]);

  const openMessage = (message: any) => {
    if (!message.isRead) {
      markMessageAsRead(message.id);
    }
    
    // Set up conversation view
    setSelectedConversation(message);
    setConversationMessages([
      message,
      // Add sample conversation history
      {
        id: 'reply_1',
        sender: user.name || 'You',
        content: 'Thank you for the message!',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        type: 'text',
        isRead: true,
        isFromUser: true
      }
    ]);
  };

  const sendReply = () => {
    if (!replyText.trim() || !selectedConversation) return;
    
    const newReply = {
      id: Date.now().toString(),
      sender: user.name || 'You',
      content: replyText.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: true,
      isFromUser: true
    };
    
    setConversationMessages(prev => [...prev, newReply]);
    setReplyText('');
    
    // Simulate response after 2 seconds
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        sender: selectedConversation.sender,
        content: 'Thank you for your message! I\'ll get back to you soon.',
        timestamp: new Date().toISOString(),
        type: 'text',
        isRead: true,
        isFromUser: false
      };
      setConversationMessages(prev => [...prev, response]);
    }, 2000);
  };

  const closeConversation = () => {
    setSelectedConversation(null);
    setConversationMessages([]);
    setReplyText('');
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'reading': return 'book';
      case 'order': return 'card';
      case 'text': return 'chatbubble';
      default: return 'mail';
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'reading': return 'text-purple-600';
      case 'order': return 'text-blue-600';
      case 'text': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 py-3 bg-black/40 backdrop-blur-sm border-b border-white/10">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-2xl font-bold">Messages</Text>
            <Text className="text-white/80 text-sm">
              {unreadMessages} unread message{unreadMessages !== 1 ? 's' : ''}
            </Text>
          </View>
          <Pressable className="bg-white/20 rounded-full p-2">
            <Ionicons name="create" size={24} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-3 bg-gray-50">
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-gray-900"
          />
          {searchQuery !== '' && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Message Type Filter */}
      <View className="py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {messageTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => setSelectedType(type)}
              className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${
                selectedType === type
                  ? 'bg-blue-600'
                  : 'bg-gray-100'
              }`}
            >
              <Ionicons 
                name={getMessageIcon(type.toLowerCase())} 
                size={16} 
                color={selectedType === type ? 'white' : '#666'} 
              />
              <Text className={`font-medium ml-1 ${
                selectedType === type ? 'text-white' : 'text-gray-700'
              }`}>
                {type}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Messages List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {filteredMessages.map((message) => (
          <Pressable
            key={message.id}
            onPress={() => openMessage(message)}
            className={`mx-4 mb-3 rounded-xl p-4 ${
              message.isRead ? 'bg-white border border-gray-100' : 'bg-blue-50 border border-blue-200'
            }`}
          >
            <View className="flex-row items-start">
              {/* Avatar */}
              <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-3">
                <Text className="text-lg">
                  {message.sender === 'Luna Moonwhisper' ? '🌙' :
                   message.sender === 'Crystal Starlight' ? '🔮' :
                   message.sender === 'Support' ? '🛟' : '👤'}
                </Text>
              </View>

              {/* Message Content */}
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className={`font-bold ${message.isRead ? 'text-gray-900' : 'text-blue-900'}`}>
                    {message.sender}
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={getMessageIcon(message.type)} 
                      size={14} 
                      className={getMessageColor(message.type)}
                      color={message.type === 'reading' ? '#8B5CF6' :
                             message.type === 'order' ? '#3B82F6' :
                             message.type === 'text' ? '#10B981' : '#666'}
                    />
                    <Text className="text-gray-500 text-sm ml-1">
                      {formatTimeAgo(message.timestamp)}
                    </Text>
                  </View>
                </View>

                <Text 
                  className={`text-sm ${message.isRead ? 'text-gray-700' : 'text-gray-900'}`}
                  numberOfLines={2}
                >
                  {message.content}
                </Text>

                {/* Message Type Badge */}
                <View className="flex-row items-center justify-between mt-2">
                  <View className={`rounded-full px-2 py-1 ${
                    message.type === 'reading' ? 'bg-purple-100' :
                    message.type === 'order' ? 'bg-blue-100' :
                    message.type === 'text' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Text className={`text-xs font-medium ${
                      message.type === 'reading' ? 'text-purple-700' :
                      message.type === 'order' ? 'text-blue-700' :
                      message.type === 'text' ? 'text-green-700' : 'text-gray-700'
                    }`}>
                      {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                    </Text>
                  </View>

                  {!message.isRead && (
                    <View className="w-3 h-3 bg-blue-600 rounded-full" />
                  )}
                </View>
              </View>
            </View>
          </Pressable>
        ))}

        {filteredMessages.length === 0 && (
          <View className="items-center justify-center py-12">
            <Ionicons name="mail" size={48} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg font-medium mt-4">No messages found</Text>
            <Text className="text-gray-400 text-center mt-2 px-8">
              {searchQuery ? 'Try adjusting your search terms' : 'Your messages will appear here'}
            </Text>
          </View>
        )}

        {/* Message Preferences */}
        <View className="mx-4 mb-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4">
          <Text className="text-white text-lg font-bold">Message Preferences</Text>
          <Text className="text-white/90 text-sm mt-1">
            Customize your notification settings and communication preferences.
          </Text>
          <Pressable className="bg-white/20 rounded-lg px-4 py-2 mt-3 self-start">
            <Text className="text-white font-medium">Manage Settings</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Compose Message */}
      <View className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
          <TextInput
            placeholder="Start a new conversation..."
            value={newMessage}
            onChangeText={setNewMessage}
            className="flex-1 text-gray-900"
            multiline
            maxLength={500}
          />
          <Pressable 
            onPress={sendMessage}
            className={`ml-3 w-10 h-10 rounded-full items-center justify-center ${
              newMessage.trim() ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={newMessage.trim() ? 'white' : '#666'} 
            />
          </Pressable>
        </View>
      </View>

      {/* Conversation Modal */}
      <Modal visible={!!selectedConversation} animationType="slide" presentationStyle="pageSheet">
        <BackgroundImage>
          <SafeAreaView className="flex-1">
            {selectedConversation && (
              <>
                {/* Conversation Header */}
                <View className="px-4 py-3 bg-black/40 backdrop-blur-sm border-b border-white/10">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3">
                        <Text className="text-lg">
                          {selectedConversation.sender === 'Luna Moonwhisper' ? '🌙' :
                           selectedConversation.sender === 'Crystal Starlight' ? '🔮' :
                           selectedConversation.sender === 'Support' ? '🛟' : '👤'}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-bold text-lg">{selectedConversation.sender}</Text>
                        <Text className="text-white/70 text-sm">
                          {selectedConversation.type === 'reading' ? 'Psychic Reader' :
                           selectedConversation.type === 'order' ? 'Order Support' : 'Message'}
                        </Text>
                      </View>
                    </View>
                    <Pressable
                      onPress={closeConversation}
                      className="w-8 h-8 bg-black/40 rounded-full items-center justify-center"
                    >
                      <Ionicons name="close" size={20} color="white" />
                    </Pressable>
                  </View>
                </View>

                {/* Messages List */}
                <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
                  {conversationMessages.map((msg, index) => (
                    <View key={msg.id} className={`mb-4 ${msg.isFromUser ? 'items-end' : 'items-start'}`}>
                      <View className={`max-w-[80%] rounded-2xl p-3 ${
                        msg.isFromUser 
                          ? 'bg-purple-600/80 backdrop-blur-sm border border-purple-400/50' 
                          : 'bg-black/40 backdrop-blur-sm border border-white/20'
                      }`}>
                        <Text className={`${msg.isFromUser ? 'text-white' : 'text-white'}`}>
                          {msg.content}
                        </Text>
                        <Text className={`text-xs mt-1 ${
                          msg.isFromUser ? 'text-white/70' : 'text-white/60'
                        }`}>
                          {formatTimeAgo(msg.timestamp)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                {/* Reply Input */}
                <View className="px-4 py-3 bg-black/20 border-t border-white/10">
                  <View className="flex-row items-end bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                    <TextInput
                      placeholder="Type your message..."
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={replyText}
                      onChangeText={setReplyText}
                      className="flex-1 text-white min-h-[40px] max-h-[120px]"
                      multiline
                      textAlignVertical="top"
                    />
                    <Pressable 
                      onPress={sendReply}
                      className={`ml-3 w-10 h-10 rounded-full items-center justify-center ${
                        replyText.trim() ? 'bg-purple-600/80 border border-purple-400/50' : 'bg-gray-600/40'
                      }`}
                    >
                      <Ionicons 
                        name="send" 
                        size={20} 
                        color={replyText.trim() ? 'white' : 'rgba(255,255,255,0.5)'} 
                      />
                    </Pressable>
                  </View>
                </View>
              </>
            )}
          </SafeAreaView>
        </BackgroundImage>
      </Modal>
      </SafeAreaView>
    </BackgroundImage>
  );
}