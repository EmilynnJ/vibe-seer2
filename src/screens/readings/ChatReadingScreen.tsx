// Simplified Chat Reading Screen
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BackgroundImage from '../../components/BackgroundImage';

export default function ChatReadingScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isActive, setIsActive] = useState(false);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date(),
      isFromUser: true
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate reader response
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        content: 'Thank you for your message. I sense positive energy around you.',
        timestamp: new Date(),
        isFromUser: false
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 py-3 bg-black/40 backdrop-blur-sm border-b border-white/10">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full items-center justify-center mr-4"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </Pressable>
            <Text className="text-white text-xl font-bold">Chat Reading</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView className="flex-1 px-4 py-4">
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 ${message.isFromUser ? 'items-end' : 'items-start'}`}
            >
              <View
                className={`max-w-[80%] rounded-2xl p-3 ${
                  message.isFromUser
                    ? 'bg-purple-600/80 backdrop-blur-sm border border-purple-400/50'
                    : 'bg-black/40 backdrop-blur-sm border border-white/20'
                }`}
              >
                <Text className="text-white">{message.content}</Text>
                <Text className="text-white/60 text-xs mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View className="px-4 py-3 bg-black/20 border-t border-white/10">
          <View className="flex-row items-end bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type your message..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              className="flex-1 text-white min-h-[40px] max-h-[120px]"
              multiline
              textAlignVertical="top"
            />
            <Pressable
              onPress={sendMessage}
              className={`ml-3 w-10 h-10 rounded-full items-center justify-center ${
                newMessage.trim() ? 'bg-purple-600/80 border border-purple-400/50' : 'bg-gray-600/40'
              }`}
            >
              <Ionicons
                name="send"
                size={20}
                color={newMessage.trim() ? 'white' : 'rgba(255,255,255,0.5)'}
              />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </BackgroundImage>
  );
}