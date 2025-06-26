import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Alert, ImageBackground, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../state/authStore';
import { Ionicons } from '@expo/vector-icons';
import SessionService, { SessionState, ChatMessage as SessionChatMessage } from '../services/sessionService';
import { BillingEvent } from '../services/billingService';
import { Camera, CameraView } from 'expo-camera';

type Props = NativeStackScreenProps<RootStackParamList, 'ReadingSession'>;

export default function ReadingSessionScreen({ route, navigation }: Props) {
  const { readerId, sessionType, mode, scheduledReadingId } = route.params;
  const { user } = useAuthStore();

  useEffect(() => {
    // Route to specialized reading screens based on session type and mode
    const routeToSpecializedScreen = () => {
      if (sessionType === 'chat') {
        navigation.replace('ChatReading', {
          readerId,
          mode: mode || 'instant',
          scheduledReadingId
        });
        return;
      }

      if (sessionType === 'phone') {
        navigation.replace('PhoneReading', {
          readerId,
          mode: mode || 'instant',
          scheduledReadingId
        });
        return;
      }

      // For video readings, continue with the current implementation
      // (could be enhanced later with a specialized VideoReadingScreen)
    };

    routeToSpecializedScreen();
  }, [readerId, sessionType, mode, scheduledReadingId, navigation]);
  
  // Session state
  const [sessionService] = useState(() => new SessionService());
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [billingInfo, setBillingInfo] = useState({ balance: 0, totalCost: 0, duration: 0 });
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('disconnected');
  
  // UI state
  const [isVideoEnabled, setIsVideoEnabled] = useState(sessionType === 'video');
  const [isAudioEnabled, setIsAudioEnabled] = useState(sessionType !== 'chat');
  const [showControls, setShowControls] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Refs
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const localVideoRef = useRef<any>(null);
  const remoteVideoRef = useRef<any>(null);

  // Initialize session
  useEffect(() => {
    initializeSession();
    setupEventHandlers();
    
    return () => {
      sessionService.cleanup();
    };
  }, [readerId, sessionType, user]);

  const initializeSession = async () => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const clientInfo = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        avatar: user.avatar
      };

      const ratePerMinute = sessionType === 'chat' ? 3.99 : sessionType === 'phone' ? 4.99 : 6.99;
      
      // Request session
      const session = await sessionService.requestSession(readerId, sessionType, ratePerMinute, clientInfo);
      setSessionState(session);
      
      // Start the session after a brief delay to simulate connection
      setTimeout(async () => {
        try {
          await sessionService.startSession();
        } catch (error) {
          console.error('Failed to start session:', error);
          Alert.alert('Error', 'Failed to start the reading session');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Failed to initialize session:', error);
      Alert.alert('Error', 'Failed to start the reading session');
      navigation.goBack();
    }
  };

  const setupEventHandlers = () => {
    // Session state changes
    sessionService.onStateChange((state) => {
      setSessionState(state);
      setConnectionQuality(state.connectionQuality);
      setBillingInfo({
        balance: 0, // This should come from user store
        totalCost: state.totalCost,
        duration: state.duration
      });
    });

    // Chat messages
    sessionService.onChatMessage((message) => {
      setMessages(prev => [...prev, message]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    // Billing events
    sessionService.onBillingEvent((event) => {
      handleBillingEvent(event);
    });

    // Errors
    sessionService.onError((error) => {
      Alert.alert('Session Error', error);
    });

    // Media streams
    const localStreamUpdate = sessionService.getLocalStream();
    const remoteStreamUpdate = sessionService.getRemoteStream();
    
    if (localStreamUpdate) setLocalStream(localStreamUpdate);
    if (remoteStreamUpdate) setRemoteStream(remoteStreamUpdate);
  };

  const handleBillingEvent = (event: BillingEvent) => {
    switch (event.type) {
      case 'balance_low':
        Alert.alert('Low Balance', 'Your balance is running low. Please add funds to continue the session.');
        break;
      case 'session_ended':
        endSession();
        break;
      case 'payment_failed':
        Alert.alert('Payment Failed', 'There was an issue processing your payment. The session has been paused.');
        break;
    }
  };

  const endSession = async () => {
    try {
      await sessionService.endSession();
      
      if (sessionState) {
        const totalMinutes = Math.ceil(sessionState.duration / 60);
        const totalCost = sessionState.totalCost;
        
        Alert.alert(
          'Session Completed',
          `Duration: ${formatTime(sessionState.duration)}\nTotal cost: ${totalCost.toFixed(2)}\n\nThank you for using SoulSeer!`,
          [
            {
              text: 'Rate Session',
              onPress: () => {
                // Navigate to rating screen
                navigation.goBack();
              },
            },
            {
              text: 'Done',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error ending session:', error);
      navigation.goBack();
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !sessionState) return;

    try {
      sessionService.sendChatMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const toggleVideo = () => {
    if (sessionService.isSessionActive()) {
      const enabled = sessionService.toggleVideo();
      setIsVideoEnabled(enabled);
    }
  };

  const toggleAudio = () => {
    if (sessionService.isSessionActive()) {
      const enabled = sessionService.toggleAudio();
      setIsAudioEnabled(enabled);
    }
  };

  const toggleControlsVisibility = () => {
    setShowControls(!showControls);
    Animated.timing(fadeAnim, {
      toValue: showControls ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return '#10B981'; // green
      case 'good': return '#FBBF24'; // yellow
      case 'poor': return '#F59E0B'; // orange
      case 'disconnected': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };

  const getConnectionQualityText = () => {
    switch (connectionQuality) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'poor': return 'Poor';
      case 'disconnected': return 'Connecting...';
      default: return 'Unknown';
    }
  };

  if (!sessionState) {
    return (
      <ImageBackground
        source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
        className="flex-1"
        imageStyle={{ opacity: 0.3 }}
      >
        <SafeAreaView className="flex-1 bg-black/90 justify-center items-center">
          <View className="items-center">
            <Ionicons name="hourglass" size={60} color="#EC4899" />
            <Text className="text-white text-xl mt-4">Connecting to Reader...</Text>
            <Text className="text-white/70 text-center mt-2 px-8">
              Please wait while we establish your reading session
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.composerapi.com/DF975EB4-4D27-404A-B320-77E2200DF7D2.jpg' }}
      className="flex-1"
      imageStyle={{ opacity: 0.2 }}
    >
      <SafeAreaView className="flex-1 bg-black/90">
        {/* Header */}
        <Animated.View 
          style={{ opacity: fadeAnim }}
          className="flex-row items-center justify-between p-4 border-b border-pink-400/30"
        >
          <View className="flex-row items-center">
            <Pressable onPress={endSession} className="mr-4">
              <Ionicons name="close" size={24} color="#EF4444" />
            </Pressable>
            <View>
              <Text className="text-white text-lg font-semibold">
                {sessionState.participants.reader.name}
              </Text>
              <Text className="text-pink-300 capitalize">{sessionState.sessionType} Reading</Text>
              <View className="flex-row items-center mt-1">
                <View 
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: getConnectionQualityColor() }}
                />
                <Text className="text-white/70 text-xs">{getConnectionQualityText()}</Text>
              </View>
            </View>
          </View>
          
          <View className="items-end">
            <Text className="text-gold-400 font-bold text-lg">
              {formatTime(billingInfo.duration)}
            </Text>
            <Text className="text-white/70 text-sm">${sessionState.ratePerMinute}/min</Text>
            <Text className="text-green-400 text-sm font-semibold">
              ${billingInfo.totalCost.toFixed(2)}
            </Text>
          </View>
        </Animated.View>

        {/* Session Status */}
        {sessionState.status === 'connecting' && (
          <View className="p-3 bg-yellow-500/20 border-b border-yellow-400/30">
            <Text className="text-yellow-400 text-center">Establishing connection...</Text>
          </View>
        )}

        {sessionState.status === 'active' && (
          <View className="p-2 bg-green-500/20 border-b border-green-400/30">
            <Text className="text-green-400 text-center text-sm">
              Reading in progress • Billing active
            </Text>
          </View>
        )}

        {sessionState.status === 'paused' && (
          <View className="p-3 bg-orange-500/20 border-b border-orange-400/30">
            <Text className="text-orange-400 text-center">Session paused • Billing stopped</Text>
          </View>
        )}

        {/* Video Container */}
        {sessionType === 'video' && (
          <View className="relative flex-1">
            {/* Remote Video (Full Screen) */}
            <View className="absolute inset-0 bg-black">
              {remoteStream ? (
                <View className="flex-1 bg-gray-900 items-center justify-center">
                  <Text className="text-white">Remote Video Stream</Text>
                  {/* In a real implementation, you'd render the MediaStream here */}
                </View>
              ) : (
                <View className="flex-1 bg-gray-900 items-center justify-center">
                  <Ionicons name="person" size={80} color="#6B7280" />
                  <Text className="text-white/70 mt-4">Waiting for reader's video...</Text>
                </View>
              )}
              
              {/* Tap to toggle controls */}
              <Pressable 
                className="absolute inset-0"
                onPress={toggleControlsVisibility}
              />
            </View>

            {/* Local Video (Picture-in-Picture) */}
            <Animated.View 
              style={{ opacity: fadeAnim }}
              className="absolute top-4 right-4 w-32 h-40 bg-black rounded-lg overflow-hidden border-2 border-pink-400/50"
            >
              {localStream && isVideoEnabled ? (
                <View className="flex-1 bg-gray-800 items-center justify-center">
                  <Text className="text-white text-xs">Your Video</Text>
                  {/* In a real implementation, you'd render the local MediaStream here */}
                </View>
              ) : (
                <View className="flex-1 bg-gray-800 items-center justify-center">
                  <Ionicons name="videocam-off" size={24} color="#6B7280" />
                </View>
              )}
            </Animated.View>
          </View>
        )}

        {/* Chat/Audio Only Container */}
        {sessionType !== 'video' && (
          <View className="flex-1 p-4">
            {/* Reader Avatar for Audio/Chat */}
            <View className="items-center mb-6">
              <View className="w-32 h-32 bg-pink-500/20 rounded-full items-center justify-center border-4 border-pink-400/50">
                <Ionicons name="person" size={60} color="#EC4899" />
              </View>
              <Text className="text-white text-xl font-semibold mt-4">
                {sessionState.participants.reader.name}
              </Text>
              <Text className="text-pink-300">{sessionType === 'phone' ? 'Voice Reading' : 'Chat Reading'}</Text>
            </View>
          </View>
        )}

        {/* Chat Messages */}
        <View className="flex-1">
          <ScrollView 
            ref={scrollViewRef}
            className="flex-1 p-4" 
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 && sessionState.status === 'active' && (
              <View className="bg-white/10 p-4 rounded-lg mb-4 border border-pink-400/20">
                <Text className="text-pink-300 font-semibold mb-2">Welcome to your reading!</Text>
                <Text className="text-white/80">
                  Hi {user?.firstName}! I'm {sessionState.participants.reader.name}, and I'm here to provide you with guidance and clarity. 
                  Feel free to share what's on your mind or ask any questions you have.
                </Text>
              </View>
            )}
            
            {messages.map((message) => (
              <View
                key={message.id}
                className={`mb-3 ${message.senderType === 'client' ? 'items-end' : 'items-start'}`}
              >
                <View
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'system'
                      ? 'bg-yellow-500/20 border border-yellow-400/30'
                      : message.senderType === 'client'
                      ? 'bg-pink-500 rounded-br-sm'
                      : 'bg-white/10 border border-pink-400/20 rounded-bl-sm'
                  }`}
                >
                  <Text className={`${
                    message.type === 'system' ? 'text-yellow-200' : 'text-white'
                  }`}>
                    {message.message}
                  </Text>
                  <Text className={`text-xs mt-1 ${
                    message.type === 'system'
                      ? 'text-yellow-300/70'
                      : message.senderType === 'client' 
                      ? 'text-pink-200' 
                      : 'text-white/60'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Message Input */}
        <Animated.View 
          style={{ opacity: fadeAnim }}
          className="border-t border-pink-400/30"
        >
          <View className="flex-row items-center p-4">
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 bg-white/10 border border-pink-400/30 rounded-full px-4 py-3 text-white mr-3"
              multiline
              maxLength={500}
            />
            <Pressable
              onPress={sendMessage}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                newMessage.trim() && sessionState.status === 'active'
                  ? 'bg-pink-500'
                  : 'bg-gray-600'
              }`}
              disabled={!newMessage.trim() || sessionState.status !== 'active'}
            >
              <Ionicons name="send" size={20} color="white" />
            </Pressable>
          </View>

          {/* Control Buttons */}
          <View className="flex-row px-4 pb-4 space-x-3">
            {sessionType === 'video' && (
              <Pressable 
                onPress={toggleVideo}
                className={`flex-1 rounded-lg py-3 items-center ${
                  isVideoEnabled ? 'bg-pink-500' : 'bg-gray-600'
                }`}
              >
                <Ionicons 
                  name={isVideoEnabled ? "videocam" : "videocam-off"} 
                  size={20} 
                  color="white" 
                />
                <Text className="text-white text-xs mt-1">
                  {isVideoEnabled ? 'Camera On' : 'Camera Off'}
                </Text>
              </Pressable>
            )}
            
            {(sessionType === 'phone' || sessionType === 'video') && (
              <Pressable 
                onPress={toggleAudio}
                className={`flex-1 rounded-lg py-3 items-center ${
                  isAudioEnabled ? 'bg-pink-500' : 'bg-gray-600'
                }`}
              >
                <Ionicons 
                  name={isAudioEnabled ? "mic" : "mic-off"} 
                  size={20} 
                  color="white" 
                />
                <Text className="text-white text-xs mt-1">
                  {isAudioEnabled ? 'Mic On' : 'Mic Off'}
                </Text>
              </Pressable>
            )}
            
            {sessionState.status === 'paused' ? (
              <Pressable 
                onPress={() => sessionService.resumeSession()}
                className="flex-1 bg-green-500 rounded-lg py-3 items-center"
              >
                <Ionicons name="play" size={20} color="white" />
                <Text className="text-white text-xs mt-1">Resume</Text>
              </Pressable>
            ) : (
              <Pressable 
                onPress={() => sessionService.pauseSession()}
                className="flex-1 bg-yellow-500 rounded-lg py-3 items-center"
              >
                <Ionicons name="pause" size={20} color="white" />
                <Text className="text-white text-xs mt-1">Pause</Text>
              </Pressable>
            )}
            
            <Pressable 
              onPress={endSession}
              className="flex-1 bg-red-500 rounded-lg py-3 items-center"
            >
              <Ionicons name="call" size={20} color="white" />
              <Text className="text-white text-xs mt-1">End</Text>
            </Pressable>
          </View>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}