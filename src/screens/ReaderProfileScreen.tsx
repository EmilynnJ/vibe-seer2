import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackgroundImage from '../components/BackgroundImage';
import useAppStore from '../state/appStore';
import PaymentService from '../services/paymentService';
import DatabaseService from '../services/database';

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  reader: any;
  sessionType: 'chat' | 'phone' | 'video';
  navigation: any;
}

function BookingModal({ visible, onClose, reader, sessionType, navigation }: BookingModalProps) {
  const { user } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(30);

  const durations = [15, 30, 45, 60, 90, 120];
  const rate = sessionType === 'chat' ? reader.price : 
               sessionType === 'phone' ? reader.price * 1.2 : 
               reader.price * 1.5; // Video is premium

  const totalCost = (selectedDuration * rate) / 60;

  const handleBooking = async () => {
    if (!user.isAuthenticated) {
      Alert.alert('Authentication Required', 'Please sign in to book a reading');
      return;
    }

    setIsLoading(true);

    try {
      // Create payment intent
      const paymentIntent = await PaymentService.createReadingPaymentIntent(
        totalCost,
        reader.id,
        sessionType
      );

      // For now, we'll simulate successful payment
      // In production, you would handle Stripe payment flow here
      
      // Create reading session in database
      const sessionData = {
        readerId: reader.id,
        clientId: user.email, // Using email as temp ID
        sessionType,
        ratePerMinute: rate,
        duration: selectedDuration,
        totalCost,
        status: 'scheduled',
      };

      // Simulate API call to create session
      console.log('Creating session:', sessionData);

      Alert.alert(
        'Booking Confirmed!',
        `Your ${selectedDuration}-minute ${sessionType} session with ${reader.name} has been scheduled.`,
        [
          {
            text: 'Start Now',
            onPress: () => {
              onClose();
              // Navigate to video call screen
              navigation.navigate('VideoCall' as never, {
                readerId: reader.id,
                sessionType,
                clientBalance: totalCost * 2 // Simulate having enough balance
              } as never);
            }
          },
          {
            text: 'Later',
            onPress: () => {
              onClose();
            }
          }
        ]
      );

    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Booking Failed', 'Unable to process your booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <BackgroundImage>
        <SafeAreaView className="flex-1">
          <ScrollView className="flex-1 px-6">
            {/* Header */}
            <View className="flex-row items-center justify-between py-4">
              <Text className="text-white text-xl font-bold">Book Session</Text>
              <Pressable
                onPress={onClose}
                className="w-8 h-8 bg-black/40 rounded-full items-center justify-center"
              >
                <Ionicons name="close" size={20} color="white" />
              </Pressable>
            </View>

            {/* Reader Info */}
            <View className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-6">
              <View className="flex-row items-center">
                <View className="w-16 h-16 rounded-full bg-purple-100 items-center justify-center mr-4">
                  <Text className="text-2xl">{reader.avatar}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg font-bold">{reader.name}</Text>
                  <Text className="text-white/70">{sessionType.charAt(0).toUpperCase() + sessionType.slice(1)} Session</Text>
                  <Text className="text-purple-300 font-medium">${rate.toFixed(2)}/min</Text>
                </View>
              </View>
            </View>

            {/* Session Duration */}
            <View className="mb-6">
              <Text className="text-white text-lg font-bold mb-4">Select Duration</Text>
              <View className="flex-row flex-wrap gap-3">
                {durations.map((duration) => (
                  <Pressable
                    key={duration}
                    onPress={() => setSelectedDuration(duration)}
                    className={`px-4 py-3 rounded-xl border ${
                      selectedDuration === duration
                        ? 'bg-purple-600/80 border-purple-400/50'
                        : 'bg-black/30 border-white/20'
                    }`}
                  >
                    <Text className={`font-medium ${
                      selectedDuration === duration ? 'text-white' : 'text-white/70'
                    }`}>
                      {duration} min
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Cost Breakdown */}
            <View className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-6">
              <Text className="text-white text-lg font-bold mb-3">Cost Breakdown</Text>
              <View className="flex-row justify-between mb-2">
                <Text className="text-white/70">Duration:</Text>
                <Text className="text-white">{selectedDuration} minutes</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-white/70">Rate:</Text>
                <Text className="text-white">${rate.toFixed(2)}/min</Text>
              </View>
              <View className="h-px bg-white/20 my-3" />
              <View className="flex-row justify-between">
                <Text className="text-white font-bold">Total:</Text>
                <Text className="text-purple-300 font-bold text-lg">
                  ${totalCost.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Session Type Info */}
            <View className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-6">
              <Text className="text-white font-bold mb-2">
                {sessionType === 'chat' ? 'Chat Session' :
                 sessionType === 'phone' ? 'Phone Call' : 'Video Call'}
              </Text>
              <Text className="text-white/70 text-sm">
                {sessionType === 'chat' 
                  ? 'Connect via secure text messaging for a detailed reading experience.'
                  : sessionType === 'phone'
                  ? 'Have a personal conversation over the phone with your chosen reader.'
                  : 'Face-to-face video session for the most immersive reading experience.'
                }
              </Text>
            </View>

            {/* Book Button */}
            <Pressable
              onPress={handleBooking}
              disabled={isLoading}
              className={`bg-purple-600/80 backdrop-blur-sm rounded-xl py-4 items-center border border-purple-400/50 mb-6 ${
                isLoading ? 'opacity-50' : ''
              }`}
            >
              <Text className="text-white text-lg font-bold">
                {isLoading ? 'Processing...' : `Book for $${totalCost.toFixed(2)}`}
              </Text>
            </Pressable>

            {/* Terms */}
            <Text className="text-white/50 text-xs text-center mb-6">
              By booking this session, you agree to our Terms of Service and Payment Policy. 
              Sessions can be cancelled up to 2 hours before the scheduled time.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </BackgroundImage>
    </Modal>
  );
}

export default function ReaderProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { readers, favoriteReaders, setFavoriteReaders, user } = useAppStore();
  const [bookingModal, setBookingModal] = useState({ visible: false, sessionType: 'chat' as 'chat' | 'phone' | 'video' });

  // Get reader from route params or use default
  const readerId = (route.params as any)?.readerId;
  const reader = readers.find(r => r.id === readerId) || readers[0];

  if (!reader) {
    return (
      <BackgroundImage>
        <SafeAreaView className="flex-1 items-center justify-center">
          <Text className="text-white text-lg">Reader not found</Text>
          <Pressable
            onPress={() => navigation.goBack()}
            className="mt-4 bg-purple-600/80 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-medium">Go Back</Text>
          </Pressable>
        </SafeAreaView>
      </BackgroundImage>
    );
  }

  const isFavorite = favoriteReaders.includes(reader.id);

  const toggleFavorite = () => {
    const newFavorites = isFavorite
      ? favoriteReaders.filter(id => id !== reader.id)
      : [...favoriteReaders, reader.id];
    setFavoriteReaders(newFavorites);
  };

  const handleBooking = (sessionType: 'chat' | 'phone' | 'video') => {
    if (!user.isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to book a reading session.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Auth' as never) }
        ]
      );
      return;
    }

    setBookingModal({ visible: true, sessionType });
  };

  const closeBookingModal = () => {
    setBookingModal({ visible: false, sessionType: 'chat' });
  };

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4">
            <Pressable
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </Pressable>
            <Pressable
              onPress={toggleFavorite}
              className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full items-center justify-center"
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={20} 
                color={isFavorite ? "#EF4444" : "white"} 
              />
            </Pressable>
          </View>

          {/* Reader Profile */}
          <View className="px-6 mb-6">
            <View className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              {/* Avatar and Basic Info */}
              <View className="items-center mb-6">
                <View className="relative mb-4">
                  <View className="w-24 h-24 rounded-full bg-purple-100 items-center justify-center">
                    <Text className="text-4xl">{reader.avatar}</Text>
                  </View>
                  {reader.isOnline && (
                    <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white items-center justify-center">
                      <View className="w-3 h-3 bg-white rounded-full" />
                    </View>
                  )}
                </View>
                
                <Text className="text-white text-2xl font-bold mb-2">{reader.name}</Text>
                <Text className="text-white/70 text-center mb-4">{reader.bio}</Text>
                
                {/* Rating */}
                <View className="flex-row items-center mb-4">
                  <View className="flex-row items-center mr-4">
                    {[...Array(5)].map((_, i) => (
                      <Ionicons 
                        key={i}
                        name={i < Math.floor(reader.rating) ? "star" : "star-outline"} 
                        size={18} 
                        color="#FFA500" 
                      />
                    ))}
                  </View>
                  <Text className="text-white/80">
                    {reader.rating} ({reader.reviewCount} reviews)
                  </Text>
                </View>

                {/* Experience */}
                <Text className="text-purple-300 font-medium">{reader.experience}</Text>
              </View>

              {/* Specialties */}
              <View className="mb-6">
                <Text className="text-white text-lg font-bold mb-3">Specialties</Text>
                <View className="flex-row flex-wrap gap-2">
                  {reader.specialties.map((specialty, index) => (
                    <View 
                      key={index} 
                      className="bg-purple-600/30 backdrop-blur-sm rounded-full px-3 py-2 border border-purple-400/30"
                    >
                      <Text className="text-purple-200 text-sm font-medium">{specialty}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Pricing */}
              <View className="mb-6">
                <Text className="text-white text-lg font-bold mb-3">Session Rates</Text>
                <View className="gap-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="chatbubble-outline" size={20} color="#8B5CF6" />
                      <Text className="text-white ml-3">Chat Reading</Text>
                    </View>
                    <Text className="text-purple-300 font-medium">${reader.price}/min</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="call-outline" size={20} color="#8B5CF6" />
                      <Text className="text-white ml-3">Phone Reading</Text>
                    </View>
                    <Text className="text-purple-300 font-medium">${(reader.price * 1.2).toFixed(2)}/min</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="videocam-outline" size={20} color="#8B5CF6" />
                      <Text className="text-white ml-3">Video Reading</Text>
                    </View>
                    <Text className="text-purple-300 font-medium">${(reader.price * 1.5).toFixed(2)}/min</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="px-6 pb-6">
            <View className="gap-3">
              {reader.isOnline ? (
                <>
                  <Pressable
                    onPress={() => handleBooking('chat')}
                    className="bg-purple-600/80 backdrop-blur-sm rounded-xl py-4 border border-purple-400/50 flex-row items-center justify-center"
                  >
                    <Ionicons name="chatbubble" size={20} color="white" />
                    <Text className="text-white font-bold text-lg ml-3">Start Chat - ${reader.price}/min</Text>
                  </Pressable>
                  
                  <View className="flex-row gap-3">
                    <Pressable
                      onPress={() => handleBooking('phone')}
                      className="flex-1 bg-green-600/80 backdrop-blur-sm rounded-xl py-4 border border-green-400/50 flex-row items-center justify-center"
                    >
                      <Ionicons name="call" size={18} color="white" />
                      <Text className="text-white font-bold ml-2">Call</Text>
                    </Pressable>
                    
                    <Pressable
                      onPress={() => handleBooking('video')}
                      className="flex-1 bg-blue-600/80 backdrop-blur-sm rounded-xl py-4 border border-blue-400/50 flex-row items-center justify-center"
                    >
                      <Ionicons name="videocam" size={18} color="white" />
                      <Text className="text-white font-bold ml-2">Video</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <Pressable
                  onPress={() => handleBooking('chat')}
                  className="bg-gray-600/60 backdrop-blur-sm rounded-xl py-4 border border-gray-400/50 flex-row items-center justify-center"
                >
                  <Ionicons name="calendar" size={20} color="white" />
                  <Text className="text-white font-bold text-lg ml-3">Schedule Session</Text>
                </Pressable>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Booking Modal */}
        <BookingModal
          visible={bookingModal.visible}
          onClose={closeBookingModal}
          reader={reader}
          sessionType={bookingModal.sessionType}
          navigation={navigation}
        />
      </SafeAreaView>
    </BackgroundImage>
  );
}