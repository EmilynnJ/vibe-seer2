import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAppStore from '../state/appStore';
import BackgroundImage from '../components/BackgroundImage';

export default function AddReaderScreen() {
  const navigation = useNavigation();
  const { addReader } = useAppStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    experience: '',
    price: '',
    specialties: [] as string[],
    avatar: '🔮'
  });
  
  const [newSpecialty, setNewSpecialty] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const availableAvatars = ['🔮', '🌙', '⭐', '🔥', '🌿', '💎', '🌟', '✨', '🦋', '🌸'];
  const commonSpecialties = ['Tarot', 'Astrology', 'Crystal Reading', 'Palm Reading', 'Numerology', 'Dream Interpretation', 'Love Readings', 'Career Guidance', 'Spiritual Healing', 'Chakra Balancing'];

  const addSpecialty = (specialty: string) => {
    if (specialty && !formData.specialties.includes(specialty)) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter reader name');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter email address');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!formData.bio.trim()) {
      Alert.alert('Error', 'Please enter bio');
      return false;
    }
    if (!formData.experience.trim()) {
      Alert.alert('Error', 'Please enter experience');
      return false;
    }
    if (!formData.price || isNaN(parseFloat(formData.price))) {
      Alert.alert('Error', 'Please enter a valid price per minute');
      return false;
    }
    if (formData.specialties.length === 0) {
      Alert.alert('Error', 'Please add at least one specialty');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const readerData = {
        ...formData,
        price: parseFloat(formData.price),
        email: formData.email.toLowerCase().trim()
      };
      
      addReader(readerData);
      
      Alert.alert(
        'Success!',
        `Reader "${formData.name}" has been added successfully.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add reader. Please try again.');
    } finally {
      setIsSubmitting(false);
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
                <Text className="text-2xl font-bold text-white">Add New Reader</Text>
                <Text className="text-white/80">Create a new reader profile</Text>
              </View>
            </View>
          </View>

          <View className="px-4 py-6">
            {/* Avatar Selection */}
            <View className="mb-6">
              <Text className="text-white font-semibold mb-3">Avatar</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {availableAvatars.map((avatar) => (
                  <Pressable
                    key={avatar}
                    onPress={() => setFormData(prev => ({ ...prev, avatar }))}
                    className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
                      formData.avatar === avatar 
                        ? 'bg-purple-600/80 border border-purple-400' 
                        : 'bg-black/40 border border-white/20'
                    }`}
                  >
                    <Text className="text-2xl">{avatar}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Basic Information */}
            <View className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-6">
              <Text className="text-white font-semibold mb-4">Basic Information</Text>
              
              <View className="mb-4">
                <Text className="text-white/80 text-sm mb-2">Full Name *</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter reader's full name"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  className="bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white"
                />
              </View>

              <View className="mb-4">
                <Text className="text-white/80 text-sm mb-2">Email Address *</Text>
                <TextInput
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  placeholder="Enter email address"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white"
                />
              </View>

              <View className="mb-4">
                <Text className="text-white/80 text-sm mb-2">Price per Minute ($) *</Text>
                <TextInput
                  value={formData.price}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
                  placeholder="e.g. 3.99"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  keyboardType="decimal-pad"
                  className="bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white"
                />
              </View>

              <View className="mb-4">
                <Text className="text-white/80 text-sm mb-2">Experience *</Text>
                <TextInput
                  value={formData.experience}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, experience: text }))}
                  placeholder="e.g. 15+ years"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  className="bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white"
                />
              </View>

              <View>
                <Text className="text-white/80 text-sm mb-2">Bio *</Text>
                <TextInput
                  value={formData.bio}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
                  placeholder="Brief description of reader's abilities and style"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  multiline
                  numberOfLines={3}
                  className="bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white"
                />
              </View>
            </View>

            {/* Specialties */}
            <View className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-6">
              <Text className="text-white font-semibold mb-4">Specialties *</Text>
              
              {/* Current Specialties */}
              {formData.specialties.length > 0 && (
                <View className="mb-4">
                  <Text className="text-white/80 text-sm mb-2">Selected Specialties:</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {formData.specialties.map((specialty) => (
                      <Pressable
                        key={specialty}
                        onPress={() => removeSpecialty(specialty)}
                        className="bg-purple-600/80 rounded-full px-3 py-1 flex-row items-center"
                      >
                        <Text className="text-white text-sm mr-1">{specialty}</Text>
                        <Ionicons name="close" size={14} color="white" />
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              {/* Add Custom Specialty */}
              <View className="mb-4">
                <Text className="text-white/80 text-sm mb-2">Add Custom Specialty:</Text>
                <View className="flex-row gap-2">
                  <TextInput
                    value={newSpecialty}
                    onChangeText={setNewSpecialty}
                    placeholder="Enter specialty"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    className="flex-1 bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white"
                  />
                  <Pressable
                    onPress={() => addSpecialty(newSpecialty)}
                    className="bg-purple-600/80 rounded-xl px-4 py-3 border border-purple-400/50"
                  >
                    <Text className="text-white font-medium">Add</Text>
                  </Pressable>
                </View>
              </View>

              {/* Common Specialties */}
              <Text className="text-white/80 text-sm mb-2">Or select from common specialties:</Text>
              <View className="flex-row flex-wrap gap-2">
                {commonSpecialties.map((specialty) => (
                  <Pressable
                    key={specialty}
                    onPress={() => addSpecialty(specialty)}
                    disabled={formData.specialties.includes(specialty)}
                    className={`rounded-full px-3 py-2 ${
                      formData.specialties.includes(specialty)
                        ? 'bg-gray-600/50 opacity-50'
                        : 'bg-black/30 border border-white/20'
                    }`}
                  >
                    <Text className="text-white text-sm">{specialty}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`bg-purple-600/80 backdrop-blur-sm rounded-xl py-4 items-center border border-purple-400/50 ${
                isSubmitting ? 'opacity-50' : ''
              }`}
            >
              <Text className="text-white text-lg font-semibold">
                {isSubmitting ? 'Adding Reader...' : 'Add Reader'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundImage>
  );
}