import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAppStore from '../state/appStore';
import BackgroundImage from '../components/BackgroundImage';

const forumCategories = ['All', 'Dreams', 'Astrology', 'Tarot', 'Healing', 'Meditation', 'General'];

export default function CommunityScreen() {
  const navigation = useNavigation();
  const { forumPosts, user } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'replies'>('recent');

  const filteredPosts = forumPosts
    .filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.likes - a.likes;
      if (sortBy === 'replies') return b.replies - a.replies;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); // recent
    });

  const createPost = () => {
    if (!user.isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please sign in to create a new post',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Auth' as never) }
        ]
      );
      return;
    }
    
    // User is authenticated, proceed with creating post
    Alert.alert('Create Post', 'Post creation feature coming soon!');
  };

  const interactWithPost = (action: string, postId: string) => {
    if (!user.isAuthenticated) {
      Alert.alert(
        'Login Required',
        `Please sign in to ${action} this post`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Auth' as never) }
        ]
      );
      return;
    }
    
    // User is authenticated, proceed with action
    console.log(`${action} post:`, postId);
    Alert.alert('Success', `Post ${action}d successfully!`);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'dreams': return 'moon';
      case 'astrology': return 'planet';
      case 'tarot': return 'library';
      case 'healing': return 'leaf';
      case 'meditation': return 'flower';
      default: return 'chatbubbles';
    }
  };

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 py-3 bg-black/40 backdrop-blur-sm border-b border-white/10">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-2xl font-bold">Community</Text>
              <Text className="text-white/80 text-sm">Share insights & connect</Text>
            </View>
          <Pressable onPress={createPost} className="bg-white/20 rounded-full p-2">
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <View className="px-4 py-3 bg-black/20">
          <View className="flex-row items-center bg-black/40 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
            <Ionicons name="search" size={20} color="#fff" />
            <TextInput
              placeholder="Search discussions..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-white"
            />
            {searchQuery !== '' && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#fff" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Category Filter */}
        <View className="py-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {forumCategories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${
                selectedCategory === category
                  ? 'bg-green-600'
                  : 'bg-gray-100'
              }`}
            >
              <Ionicons 
                name={getCategoryIcon(category)} 
                size={16} 
                color={selectedCategory === category ? 'white' : '#666'} 
              />
              <Text className={`font-medium ml-1 ${
                selectedCategory === category ? 'text-white' : 'text-gray-700'
              }`}>
                {category}
              </Text>
            </Pressable>
          ))}
          </ScrollView>
        </View>

        {/* Sort Options */}
        <View className="flex-row items-center justify-between px-4 py-2 bg-black/20">
          <Text className="text-white/80 font-medium">
            {filteredPosts.length} discussions
          </Text>
          <View className="flex-row items-center">
            <Text className="text-white/60 text-sm mr-2">Sort by:</Text>
          <Pressable
            onPress={() => setSortBy(
              sortBy === 'recent' ? 'popular' : 
              sortBy === 'popular' ? 'replies' : 'recent'
            )}
            className="flex-row items-center bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20"
          >
            <Text className="text-green-300 font-medium text-sm">
              {sortBy === 'recent' ? 'Recent' : 
               sortBy === 'popular' ? 'Popular' : 'Most Replies'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#86EFAC" />
          </Pressable>
          </View>
        </View>

        {/* Posts List */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {filteredPosts.map((post) => (
          <Pressable
            key={post.id}
            onPress={() => interactWithPost('view', post.id)}
            className="mx-4 mb-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            {/* Sticky badge */}
            {post.isSticky && (
              <View className="flex-row items-center mb-2">
                <Ionicons name="pin" size={14} color="#F59E0B" />
                <Text className="text-amber-600 text-xs font-medium ml-1">Pinned</Text>
              </View>
            )}

            {/* Post Header */}
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1">
                <Text className="font-bold text-gray-900 text-lg" numberOfLines={2}>
                  {post.title}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-sm text-gray-600">by {post.author}</Text>
                  <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                  <Text className="text-sm text-gray-500">{formatTimeAgo(post.timestamp)}</Text>
                </View>
              </View>
              
              <View className={`rounded-full px-2 py-1 ${post.category === 'Dreams' ? 'bg-purple-100' :
                post.category === 'Astrology' ? 'bg-blue-100' :
                post.category === 'Tarot' ? 'bg-indigo-100' :
                post.category === 'Healing' ? 'bg-green-100' :
                post.category === 'Meditation' ? 'bg-pink-100' : 'bg-gray-100'
              }`}>
                <Text className={`text-xs font-medium ${post.category === 'Dreams' ? 'text-purple-700' :
                  post.category === 'Astrology' ? 'text-blue-700' :
                  post.category === 'Tarot' ? 'text-indigo-700' :
                  post.category === 'Healing' ? 'text-green-700' :
                  post.category === 'Meditation' ? 'text-pink-700' : 'text-gray-700'
                }`}>
                  {post.category}
                </Text>
              </View>
            </View>

            {/* Post Content Preview */}
            <Text className="text-gray-700 text-sm mb-3" numberOfLines={3}>
              {post.content}
            </Text>

            {/* Post Stats */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <Pressable 
                  onPress={() => interactWithPost('like', post.id)}
                  className="flex-row items-center"
                >
                  <Ionicons name="heart-outline" size={16} color="#666" />
                  <Text className="text-gray-600 text-sm ml-1">{post.likes}</Text>
                </Pressable>
                
                <Pressable 
                  onPress={() => interactWithPost('reply', post.id)}
                  className="flex-row items-center"
                >
                  <Ionicons name="chatbubble-outline" size={16} color="#666" />
                  <Text className="text-gray-600 text-sm ml-1">{post.replies}</Text>
                </Pressable>
                
                <Pressable 
                  onPress={() => interactWithPost('share', post.id)}
                  className="flex-row items-center"
                >
                  <Ionicons name="share-outline" size={16} color="#666" />
                </Pressable>
              </View>

              <Text className="text-green-600 font-medium text-sm">Read More</Text>
            </View>
          </Pressable>
        ))}

        {filteredPosts.length === 0 && (
          <View className="items-center justify-center py-12">
            <Ionicons name="chatbubbles" size={48} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg font-medium mt-4">No discussions found</Text>
            <Text className="text-gray-400 text-center mt-2 px-8">
              Try adjusting your search or category filters
            </Text>
          </View>
        )}

        {/* Community Guidelines */}
        <View className="mx-4 mb-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-4">
          <Text className="text-white text-lg font-bold">Community Guidelines</Text>
          <Text className="text-white/90 text-sm mt-1">
            Be respectful, supportive, and help create a safe space for spiritual growth.
          </Text>
          <Pressable className="bg-white/20 rounded-lg px-4 py-2 mt-3 self-start">
            <Text className="text-white font-medium">Read Guidelines</Text>
          </Pressable>
        </View>
        </ScrollView>

        {/* Floating Action Button */}
        <Pressable
          onPress={createPost}
          className="absolute bottom-6 right-6 w-14 h-14 bg-green-600/80 backdrop-blur-sm rounded-full items-center justify-center shadow-lg border border-green-400/50"
        >
          <Ionicons name="add" size={28} color="white" />
        </Pressable>
      </SafeAreaView>
    </BackgroundImage>
  );
}