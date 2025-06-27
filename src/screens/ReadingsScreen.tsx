import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import useAppStore from '../state/appStore';
import BackgroundImage from '../components/BackgroundImage';

const categories = ['All', 'Love', 'Career', 'Spiritual', 'Life Path', 'Tarot', 'Numerology', 'Dreams', 'Healing'];

export default function ReadingsScreen() {
  const navigation = useNavigation();
  const { readers, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, favoriteReaders, setFavoriteReaders, user } = useAppStore();
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'online'>('rating');

  const filteredReaders = readers
    .filter(reader => {
      const matchesCategory = selectedCategory === 'All' || reader.specialties.some(spec => 
        spec.toLowerCase().includes(selectedCategory.toLowerCase())
      );
      const matchesSearch = searchQuery === '' || 
        reader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reader.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'online') return b.isOnline ? 1 : -1;
      return 0;
    });

  const toggleFavorite = (readerId: string) => {
    const newFavorites = favoriteReaders.includes(readerId)
      ? favoriteReaders.filter(id => id !== readerId)
      : [...favoriteReaders, readerId];
    setFavoriteReaders(newFavorites);
  };

  const requestReading = (reader: any) => {
    if (!user.isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please sign in to book a reading with ' + reader.name,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Auth' as never) }
        ]
      );
      return;
    }
    
    // User is authenticated, proceed with booking
    Alert.alert(
      'Book Reading',
      `Book a reading with ${reader.name} for ${reader.price}/min?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Book Now', onPress: () => {} }
      ]
    );
  };

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 py-3 bg-black/40 backdrop-blur-sm border-b border-white/10">
        <Text className="text-white text-2xl font-bold">Find Your Reader</Text>
        <Text className="text-white/80 text-sm">Connect with gifted psychics</Text>
      </View>

        {/* Search Bar */}
        <View className="px-4 py-3 bg-black/20">
          <View className="flex-row items-center bg-black/40 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
            <Ionicons name="search" size={20} color="#fff" />
            <TextInput
              placeholder="Search readers by name or specialty..."
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
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`mr-3 px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-purple-600/80 backdrop-blur-md border border-purple-400/50'
                  : 'bg-black/30 backdrop-blur-md border border-white/20'
              }`}
            >
              <Text className={`font-medium ${
                selectedCategory === category ? 'text-white' : 'text-white/80'
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
          {filteredReaders.length} readers found
        </Text>
        <View className="flex-row items-center">
            <Text className="text-white/60 text-sm mr-2">Sort by:</Text>
          <Pressable
            onPress={() => setSortBy(sortBy === 'rating' ? 'price' : sortBy === 'price' ? 'online' : 'rating')}
            className="flex-row items-center bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20"
          >
            <Text className="text-purple-300 font-medium text-sm">
              {sortBy === 'rating' ? 'Rating' : sortBy === 'price' ? 'Price' : 'Online'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#C084FC" />
          </Pressable>
        </View>
      </View>

        {/* Readers List */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {filteredReaders.map((reader) => (
          <View key={reader.id} className="mx-4 mb-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
            <View className="p-4">
              <View className="flex-row">
                {/* Avatar and Online Status */}
                <Pressable 
                  onPress={() => (navigation as any).navigate('ReaderProfile', { readerId: reader.id })}
                  className="relative mr-4"
                >
                  <View className="w-16 h-16 rounded-full bg-purple-100 items-center justify-center">
                    <Text className="text-2xl">{reader.avatar}</Text>
                  </View>
                  {reader.isOnline && (
                    <View className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white items-center justify-center">
                      <View className="w-2 h-2 bg-white rounded-full" />
                    </View>
                  )}
                </Pressable>

                {/* Reader Info */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Pressable 
                      onPress={() => (navigation as any).navigate('ReaderProfile', { readerId: reader.id })}
                      className="flex-1"
                    >
                      <Text className="text-lg font-bold text-white">{reader.name}</Text>
                    </Pressable>
                    <Pressable onPress={() => toggleFavorite(reader.id)}>
                      <Ionicons 
                        name={favoriteReaders.includes(reader.id) ? "heart" : "heart-outline"} 
                        size={24} 
                        color={favoriteReaders.includes(reader.id) ? "#EF4444" : "#666"} 
                      />
                    </Pressable>
                  </View>

                  <View className="flex-row items-center mt-1">
                    <View className="flex-row items-center">
                      {[...Array(5)].map((_, i) => (
                        <Ionicons 
                          key={i}
                          name={i < Math.floor(reader.rating) ? "star" : "star-outline"} 
                          size={14} 
                          color="#FFA500" 
                        />
                      ))}
                    </View>
                    <Text className="text-sm text-white/70 ml-2">
                      {reader.rating} ({reader.reviewCount} reviews)
                    </Text>
                  </View>

                  <Text className="text-sm text-white/80 mt-1" numberOfLines={2}>
                    {reader.bio}
                  </Text>

                  <View className="flex-row flex-wrap mt-2">
                    {reader.specialties.slice(0, 3).map((specialty, index) => (
                      <View key={index} className="bg-purple-600/30 backdrop-blur-sm rounded-full px-2 py-1 mr-2 mt-1 border border-purple-400/30">
                        <Text className="text-purple-200 text-xs font-medium">{specialty}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-white/20">
                <View className="flex-row items-center">
                  <Text className="text-lg font-bold text-purple-300">${reader.price}/min</Text>
                  <Text className="text-sm text-white/60 ml-2">{reader.experience}</Text>
                </View>

                <View className="flex-row gap-2">
                  {reader.isOnline ? (
                    <>
                      <Pressable 
                        onPress={() => requestReading(reader)}
                        className="bg-purple-600/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-400/50"
                      >
                        <Text className="text-white font-medium">Chat Now</Text>
                      </Pressable>
                      <Pressable 
                        onPress={() => requestReading(reader)}
                        className="bg-green-600/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-green-400/50"
                      >
                        <Text className="text-white font-medium">Call</Text>
                      </Pressable>
                    </>
                  ) : (
                    <Pressable 
                      onPress={() => requestReading(reader)}
                      className="bg-gray-600/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-400/50"
                    >
                      <Text className="text-white font-medium">Schedule</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          </View>
        ))}

        {filteredReaders.length === 0 && (
          <View className="items-center justify-center py-12">
            <Ionicons name="search" size={48} color="rgba(255,255,255,0.5)" />
            <Text className="text-white/70 text-lg font-medium mt-4">No readers found</Text>
            <Text className="text-white/50 text-center mt-2 px-8">
              Try adjusting your search or category filters
            </Text>
          </View>
        )}
        </ScrollView>
      </SafeAreaView>
    </BackgroundImage>
  );
}