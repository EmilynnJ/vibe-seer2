import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, TextInput, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import SchedulingService from '../../services/schedulingService';
import { TimeSlot, ScheduledReading } from '../../types/readings';

interface RouteParams {
  readingType: 'chat' | 'phone' | 'video';
  readerId?: string;
  package: {
    duration: number;
    price: number;
    originalPrice?: number;
  };
  duration: number;
  price: number;
}

export default function ScheduleReadingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuthStore();
  const params = route.params as RouteParams;
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedReader, setSelectedReader] = useState<string | null>(params.readerId || null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableReaders, setAvailableReaders] = useState<any[]>([]);

  const schedulingService = SchedulingService.getInstance();

  useEffect(() => {
    loadAvailableReaders();
  }, []);

  useEffect(() => {
    if (selectedReader) {
      loadAvailableSlots();
    }
  }, [selectedDate, selectedReader]);

  const loadAvailableReaders = async () => {
    try {
      // Mock data for available readers
      setAvailableReaders([
        {
          id: 'reader1',
          name: 'Sarah Moon',
          specialties: ['Tarot', 'Love & Relationships'],
          rating: 4.8,
          reviews: 156,
          avatar: 'https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg',
          rates: {
            chat: 3.99,
            phone: 4.99,
            video: 6.99
          }
        },
        {
          id: 'reader2',
          name: 'Luna Star',
          specialties: ['Astrology', 'Career'],
          rating: 4.9,
          reviews: 89,
          avatar: 'https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg',
          rates: {
            chat: 4.99,
            phone: 5.99,
            video: 7.99
          }
        }
      ]);
    } catch (error) {
      console.error('Error loading readers:', error);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedReader) return;

    try {
      setIsLoading(true);
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 7); // Load next 7 days

      const slots = await schedulingService.getAvailableTimeSlots(
        selectedReader,
        params.readingType,
        selectedDate,
        endDate,
        params.duration
      );

      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading slots:', error);
      Alert.alert('Error', 'Failed to load available time slots');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookReading = async () => {
    if (!selectedSlot || !selectedReader || !user) {
      Alert.alert('Error', 'Please select a time slot and reader');
      return;
    }

    try {
      setIsLoading(true);

      const booking: ScheduledReading = await schedulingService.bookScheduledReading({
        readerId: selectedReader,
        clientId: user.id,
        timeSlot: selectedSlot,
        readingType: params.readingType,
        duration: params.duration,
        price: params.price,
        specialRequests,
        notes
      });

      Alert.alert(
        'Booking Confirmed!',
        `Your ${params.readingType} reading has been scheduled for ${formatTimeSlot(selectedSlot)}. You will receive a confirmation email shortly.`,
        [
          {
            text: 'View My Bookings',
            onPress: () => (navigation as any).navigate('MyBookings')
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error booking reading:', error);
      Alert.alert('Booking Failed', 'There was an error booking your reading. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeSlot = (slot: TimeSlot): string => {
    const date = slot.date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return `${date} at ${slot.startTime}`;
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const getDaysForCalendar = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const getAvailableSlotsForDate = (date: Date) => {
    return availableSlots.filter(slot => 
      slot.date.toDateString() === date.toDateString()
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
      className="flex-1"
      imageStyle={{ opacity: 0.2 }}
    >
      <SafeAreaView className="flex-1 bg-black/80">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center p-4 border-b border-pink-400/30">
            <Pressable onPress={() => navigation.goBack()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#EC4899" />
            </Pressable>
            <Text className="text-white text-xl font-semibold">Schedule Reading</Text>
          </View>

          {/* Reading Details */}
          <View className="p-6">
            <View className="bg-white/10 rounded-xl p-4 border border-pink-400/20 mb-6">
              <Text className="text-pink-400 text-lg font-semibold capitalize">
                {params.readingType} Reading
              </Text>
              <Text className="text-white text-sm opacity-80 mt-1">
                {params.duration} minutes • {formatPrice(params.price)}
              </Text>
              {params.package.originalPrice && (
                <Text className="text-green-400 text-sm">
                  Save {formatPrice(params.package.originalPrice - params.price)}
                </Text>
              )}
            </View>

            {/* Reader Selection */}
            {!params.readerId && (
              <View className="mb-6">
                <Text className="text-white text-lg font-semibold mb-3 font-serif">
                  Choose Your Reader
                </Text>
                <View className="space-y-3">
                  {availableReaders.map((reader) => (
                    <Pressable
                      key={reader.id}
                      onPress={() => setSelectedReader(reader.id)}
                      className={`p-4 rounded-xl border ${
                        selectedReader === reader.id
                          ? 'bg-pink-500/20 border-pink-400'
                          : 'bg-white/5 border-white/20'
                      }`}
                    >
                      <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-pink-500/20 rounded-full items-center justify-center mr-3">
                          <Ionicons name="person" size={20} color="#EC4899" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-white font-semibold">{reader.name}</Text>
                          <Text className="text-pink-300 text-sm">
                            {reader.specialties.join(' • ')}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text className="text-white/60 text-sm ml-1">
                              {reader.rating} ({reader.reviews} reviews)
                            </Text>
                          </View>
                        </View>
                        {selectedReader === reader.id && (
                          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                        )}
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Date Selection */}
            {selectedReader && (
              <View className="mb-6">
                <Text className="text-white text-lg font-semibold mb-3 font-serif">
                  Choose Date
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row space-x-3">
                    {getDaysForCalendar().map((date, index) => {
                      const isSelected = selectedDate.toDateString() === date.toDateString();
                      const slotsForDate = getAvailableSlotsForDate(date);
                      const hasSlots = slotsForDate.length > 0;
                      
                      return (
                        <Pressable
                          key={index}
                          onPress={() => setSelectedDate(date)}
                          disabled={!hasSlots}
                          className={`p-3 rounded-lg min-w-[80px] items-center ${
                            isSelected
                              ? 'bg-pink-500 border-pink-400'
                              : hasSlots
                              ? 'bg-white/10 border-white/20'
                              : 'bg-gray-600/20 border-gray-500/20'
                          } border`}
                        >
                          <Text className={`text-xs ${
                            isSelected ? 'text-white' : hasSlots ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </Text>
                          <Text className={`text-lg font-bold ${
                            isSelected ? 'text-white' : hasSlots ? 'text-white' : 'text-gray-500'
                          }`}>
                            {date.getDate()}
                          </Text>
                          <Text className={`text-xs ${
                            isSelected ? 'text-pink-200' : hasSlots ? 'text-white/60' : 'text-gray-500'
                          }`}>
                            {date.toLocaleDateString('en-US', { month: 'short' })}
                          </Text>
                          {hasSlots && (
                            <View className="w-2 h-2 bg-green-400 rounded-full mt-1" />
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Time Slot Selection */}
            {selectedReader && selectedDate && (
              <View className="mb-6">
                <Text className="text-white text-lg font-semibold mb-3 font-serif">
                  Available Times
                </Text>
                {isLoading ? (
                  <View className="items-center py-8">
                    <Text className="text-white/70">Loading available times...</Text>
                  </View>
                ) : (
                  <View className="flex-row flex-wrap gap-3">
                    {getAvailableSlotsForDate(selectedDate).map((slot) => (
                      <Pressable
                        key={slot.id}
                        onPress={() => setSelectedSlot(slot)}
                        className={`px-4 py-3 rounded-lg border ${
                          selectedSlot?.id === slot.id
                            ? 'bg-pink-500 border-pink-400'
                            : 'bg-white/10 border-white/20'
                        }`}
                      >
                        <Text className={`font-semibold ${
                          selectedSlot?.id === slot.id ? 'text-white' : 'text-white'
                        }`}>
                          {slot.startTime}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
                
                {!isLoading && getAvailableSlotsForDate(selectedDate).length === 0 && (
                  <View className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
                    <Text className="text-yellow-400 text-center">
                      No available times for this date. Please select another date.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Additional Information */}
            {selectedSlot && (
              <View className="space-y-4 mb-6">
                <View>
                  <Text className="text-white text-lg font-semibold mb-2 font-serif">
                    Special Requests
                  </Text>
                  <TextInput
                    value={specialRequests}
                    onChangeText={setSpecialRequests}
                    placeholder="Any specific areas you'd like to focus on..."
                    placeholderTextColor="#9CA3AF"
                    className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View>
                  <Text className="text-white text-lg font-semibold mb-2 font-serif">
                    Additional Notes
                  </Text>
                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Any additional information for your reader..."
                    placeholderTextColor="#9CA3AF"
                    className="bg-white/10 border border-pink-400/30 rounded-lg px-4 py-3 text-white"
                    multiline
                    numberOfLines={2}
                  />
                </View>
              </View>
            )}

            {/* Booking Summary */}
            {selectedSlot && (
              <View className="bg-white/10 rounded-xl p-4 border border-pink-400/20 mb-6">
                <Text className="text-white text-lg font-semibold mb-3">Booking Summary</Text>
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-white/70">Reading Type</Text>
                    <Text className="text-white capitalize">{params.readingType}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-white/70">Duration</Text>
                    <Text className="text-white">{params.duration} minutes</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-white/70">Date & Time</Text>
                    <Text className="text-white">{formatTimeSlot(selectedSlot)}</Text>
                  </View>
                  <View className="h-px bg-white/20 my-2" />
                  <View className="flex-row justify-between">
                    <Text className="text-white text-lg font-semibold">Total</Text>
                    <Text className="text-pink-400 text-lg font-bold">{formatPrice(params.price)}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Book Button */}
            {selectedSlot && (
              <Pressable
                onPress={handleBookReading}
                disabled={isLoading}
                className="bg-pink-500 rounded-lg py-4 flex-row items-center justify-center"
              >
                {isLoading ? (
                  <Text className="text-white font-semibold text-lg">Booking...</Text>
                ) : (
                  <>
                    <Ionicons name="calendar" size={20} color="white" />
                    <Text className="text-white font-semibold text-lg ml-2">
                      Book Reading - {formatPrice(params.price)}
                    </Text>
                  </>
                )}
              </Pressable>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}