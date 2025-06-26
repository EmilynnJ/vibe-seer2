import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '../components/BackgroundImage';

const faqCategories = ['General', 'Readings', 'Payments', 'Account', 'Technical'];

const faqs = [
  {
    id: '1',
    category: 'General',
    question: 'How does psychic reading work?',
    answer: 'Our psychic readers use their intuitive abilities to provide guidance and insights about your life. They may use tools like tarot cards, crystals, or simply their natural psychic gifts.'
  },
  {
    id: '2',
    category: 'Readings',
    question: 'How long is a typical reading session?',
    answer: "Reading sessions typically last 15-60 minutes, depending on your needs and the reader's availability. You can choose the duration that works best for you."
  },
  {
    id: '3',
    category: 'Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and digital wallets. All payments are processed securely through our encrypted payment system.'
  },
  {
    id: '4',
    category: 'Account',
    question: 'How do I create an account?',
    answer: 'You can create an account by clicking the sign-up button and providing your email address. Verification is quick and easy.'
  },
  {
    id: '5',
    category: 'Technical',
    question: 'What if I have connection issues during a reading?',
    answer: 'If you experience technical difficulties, our support team will help resolve the issue and ensure you receive the full value of your reading.'
  }
];

export default function HelpCenterScreen() {
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'General' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const contactSupport = () => {
    console.log('Contact support');
  };

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
      {/* Search Bar */}
      <View className="px-4 py-3 bg-gray-50">
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            placeholder="Search help articles..."
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

      {/* Category Filter */}
      <View className="py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {faqCategories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`mr-3 px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-amber-600'
                  : 'bg-gray-100'
              }`}
            >
              <Text className={`font-medium ${
                selectedCategory === category ? 'text-white' : 'text-gray-700'
              }`}>
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View className="px-4 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Quick Help</Text>
          <View className="flex-row gap-3">
            <Pressable 
              onPress={contactSupport}
              className="flex-1 bg-blue-100 rounded-xl p-4 items-center"
            >
              <Ionicons name="chatbubble-ellipses" size={24} color="#3B82F6" />
              <Text className="text-blue-700 font-medium mt-2">Live Chat</Text>
            </Pressable>
            
            <Pressable 
              onPress={contactSupport}
              className="flex-1 bg-green-100 rounded-xl p-4 items-center"
            >
              <Ionicons name="mail" size={24} color="#10B981" />
              <Text className="text-green-700 font-medium mt-2">Email Support</Text>
            </Pressable>
            
            <Pressable 
              onPress={contactSupport}
              className="flex-1 bg-purple-100 rounded-xl p-4 items-center"
            >
              <Ionicons name="call" size={24} color="#8B5CF6" />
              <Text className="text-purple-700 font-medium mt-2">Call Us</Text>
            </Pressable>
          </View>
        </View>

        {/* FAQ Section */}
        <View className="px-4 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Frequently Asked Questions ({filteredFaqs.length})
          </Text>
          
          {filteredFaqs.map((faq) => (
            <Pressable
              key={faq.id}
              onPress={() => toggleFaq(faq.id)}
              className="mb-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <View className="p-4">
                <View className="flex-row items-center justify-between">
                  <Text className="flex-1 font-medium text-gray-900 pr-3">
                    {faq.question}
                  </Text>
                  <Ionicons 
                    name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color="#666" 
                  />
                </View>
                
                {expandedFaq === faq.id && (
                  <View className="mt-3 pt-3 border-t border-gray-100">
                    <Text className="text-gray-700 leading-6">{faq.answer}</Text>
                  </View>
                )}
              </View>
            </Pressable>
          ))}
          
          {filteredFaqs.length === 0 && (
            <View className="items-center py-8">
              <Ionicons name="help-circle-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 text-lg font-medium mt-4">No articles found</Text>
              <Text className="text-gray-400 text-center mt-2">Try adjusting your search terms</Text>
            </View>
          )}
        </View>

        {/* Video Tutorials */}
        <View className="px-4 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Video Tutorials</Text>
          <View className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-4">
            <View className="flex-row items-center">
              <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center">
                <Ionicons name="play" size={24} color="white" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-white font-bold text-lg">Getting Started Guide</Text>
                <Text className="text-white/90 text-sm">Learn how to book your first reading</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View className="px-4 py-4 pb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Contact Information</Text>
          <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <View className="flex-row items-center mb-3">
              <Ionicons name="time" size={20} color="#666" />
              <Text className="ml-3 text-gray-700">Support Hours: 24/7</Text>
            </View>
            <View className="flex-row items-center mb-3">
              <Ionicons name="mail" size={20} color="#666" />
              <Text className="ml-3 text-gray-700">support@psychicconnect.com</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="call" size={20} color="#666" />
              <Text className="ml-3 text-gray-700">1-800-PSYCHIC</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      </SafeAreaView>
    </BackgroundImage>
  );
}