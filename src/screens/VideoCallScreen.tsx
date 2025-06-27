import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  interpolate
} from 'react-native-reanimated';
import BackgroundImage from '../components/BackgroundImage';
import useAppStore from '../state/appStore';
import WebRTCService, { ReadingSession } from '../services/webrtcService';

const { width, height } = Dimensions.get('window');

export default function VideoCallScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, readers } = useAppStore();
  
  // Route params
  const { readerId, sessionType = 'video', clientBalance = 100 } = (route.params as any) || {};
  const reader = readers.find(r => r.id === readerId);
  
  // Session state
  const [session, setSession] = useState<ReadingSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(false);
  
  // Animation values
  const connectingAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);
  
  // Refs
  const webrtcService = useRef(WebRTCService).current;
  
  useEffect(() => {
    startSession();
    
    // Setup WebRTC callbacks
    webrtcService.setOnSessionUpdate((updatedSession) => {
      setSession(updatedSession);
    });
    
    // Start animations
    connectingAnimation.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
    pulseAnimation.value = withRepeat(withTiming(1.1, { duration: 1000 }), -1, true);
    
    return () => {
      webrtcService.endSession();
    };
  }, []);
  
  const startSession = async () => {
    if (!reader || !user.isAuthenticated) {
      Alert.alert('Error', 'Invalid session parameters');
      navigation.goBack();
      return;
    }
    
    try {
      const newSession = await webrtcService.startReadingSession({
        readerId: reader.id,
        clientId: user.email,
        sessionType: sessionType as 'chat' | 'phone' | 'video',
        ratePerMinute: reader.price,
        clientBalance: clientBalance
      });
      
      setSession(newSession);
      
      // Simulate connection delay
      setTimeout(() => {
        setIsConnecting(false);
      }, 3000);
    } catch (error) {
      console.error('❌ Failed to start session:', error);
      Alert.alert('Connection Failed', 'Unable to start the reading session. Please try again.');
      navigation.goBack();
    }
  };
  
  const endCall = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this reading session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => {
            webrtcService.endSession('user_ended');
            navigation.goBack();
          }
        }
      ]
    );
  };
  
  const toggleAudio = () => {
    const newState = webrtcService.toggleAudio();
    setIsAudioMuted(!newState);
  };
  
  const toggleVideo = () => {
    const newState = webrtcService.toggleVideo();
    setIsVideoOff(!newState);
  };
  
  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };
  
  // Animated styles
  const connectingStyle = useAnimatedStyle(() => {
    const opacity = interpolate(connectingAnimation.value, [0, 1], [0.5, 1]);
    return { opacity };
  });
  
  const pulseStyle = useAnimatedStyle(() => {
    const scale = pulseAnimation.value;
    return { transform: [{ scale }] };
  });
  
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
  
  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        {/* Header with session info */}
        <View className="px-4 py-3 bg-black/60 backdrop-blur-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white text-lg font-bold">{reader.name}</Text>
              <Text className="text-white/70 text-sm capitalize">
                {sessionType} Reading • {formatCurrency(reader.price)}/min
              </Text>
            </View>
            
            {session && (
              <View className="items-end">
                <Text className="text-purple-300 font-bold text-lg">
                  {formatTime(session.totalMinutes)}
                </Text>
                <Text className="text-white/70 text-sm">
                  Balance: {formatCurrency(session.clientBalance)}
                </Text>
              </View>
            )}
          </View>
          
          {session && (
            <View className="mt-2 bg-white/10 rounded-lg p-2">
              <Text className="text-white/80 text-xs">
                Session Cost: {formatCurrency(session.totalCost)} • 
                Status: <Text className="capitalize text-green-300">{session.status}</Text>
              </Text>
            </View>
          )}
        </View>
        
        {/* Video Area */}
        <View className="flex-1 relative">
          {isConnecting ? (
            /* Connecting Screen */
            <Animated.View style={[connectingStyle]} className="flex-1 items-center justify-center">
              <Animated.View style={[pulseStyle]} className="w-32 h-32 rounded-full bg-purple-600/30 items-center justify-center mb-6">
                <View className="w-20 h-20 rounded-full bg-purple-100 items-center justify-center">
                  <Text className="text-4xl">{reader.avatar}</Text>
                </View>
              </Animated.View>
              
              <Text className="text-white text-xl font-bold mb-2">Connecting to {reader.name}</Text>
              <Text className="text-white/70 text-center px-8">
                Please wait while we establish a secure connection...
              </Text>
              
              <View className="flex-row items-center mt-6">
                {[0, 1, 2].map((i) => (
                  <Animated.View
                    key={i}
                    style={[
                      connectingStyle,
                      { marginHorizontal: 4 }
                    ]}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                ))}
              </View>
            </Animated.View>
          ) : (
            /* Connected Video Screen */
            <View className="flex-1">
              {/* Remote Video (Reader) */}
              <View className="flex-1 bg-black/40 items-center justify-center">
                <View className="w-40 h-40 rounded-full bg-purple-100 items-center justify-center">
                  <Text className="text-6xl">{reader.avatar}</Text>
                </View>
                <Text className="text-white text-xl font-bold mt-4">{reader.name}</Text>
                <Text className="text-white/70">
                  {sessionType === 'video' ? 'Video Connected' : 
                   sessionType === 'phone' ? 'Voice Connected' : 'Chat Active'}
                </Text>
              </View>
              
              {/* Local Video (Client) - Picture in Picture */}
              {sessionType === 'video' && (
                <View className="absolute top-4 right-4 w-24 h-32 bg-black/60 rounded-xl items-center justify-center border border-white/20">
                  {isVideoOff ? (
                    <Ionicons name="videocam-off" size={24} color="white" />
                  ) : (
                    <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
                      <Text className="text-xl">👤</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
        
        {/* Controls */}
        {!isConnecting && (
          <View className="px-6 py-6 bg-black/60 backdrop-blur-sm">
            <View className="flex-row items-center justify-center gap-6">
              {/* Audio Toggle */}
              <Pressable
                onPress={toggleAudio}
                className={`w-14 h-14 rounded-full items-center justify-center ${
                  isAudioMuted ? 'bg-red-600/80' : 'bg-white/20'
                } border border-white/30`}
              >
                <Ionicons 
                  name={isAudioMuted ? "mic-off" : "mic"} 
                  size={24} 
                  color="white" 
                />
              </Pressable>
              
              {/* Video Toggle (for video calls) */}
              {sessionType === 'video' && (
                <Pressable
                  onPress={toggleVideo}
                  className={`w-14 h-14 rounded-full items-center justify-center ${
                    isVideoOff ? 'bg-red-600/80' : 'bg-white/20'
                  } border border-white/30`}
                >
                  <Ionicons 
                    name={isVideoOff ? "videocam-off" : "videocam"} 
                    size={24} 
                    color="white" 
                  />
                </Pressable>
              )}
              
              {/* Chat Toggle */}
              <Pressable
                onPress={() => setShowChat(!showChat)}
                className="w-14 h-14 rounded-full items-center justify-center bg-purple-600/80 border border-purple-400/50"
              >
                <Ionicons name="chatbubble" size={24} color="white" />
              </Pressable>
              
              {/* End Call */}
              <Pressable
                onPress={endCall}
                className="w-14 h-14 rounded-full items-center justify-center bg-red-600/80 border border-red-400/50"
              >
                <Ionicons name="call" size={24} color="white" />
              </Pressable>
            </View>
            
            {/* Session Stats */}
            {session && (
              <View className="mt-4 bg-black/40 rounded-xl p-3">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-white/70 text-xs">Session Time</Text>
                    <Text className="text-white font-bold">{formatTime(session.totalMinutes)}</Text>
                  </View>
                  <View>
                    <Text className="text-white/70 text-xs">Total Cost</Text>
                    <Text className="text-purple-300 font-bold">{formatCurrency(session.totalCost)}</Text>
                  </View>
                  <View>
                    <Text className="text-white/70 text-xs">Remaining</Text>
                    <Text className="text-green-300 font-bold">{formatCurrency(session.clientBalance)}</Text>
                  </View>
                </View>
                
                {/* Warning for low balance */}
                {session.clientBalance < (session.ratePerMinute * 2) && (
                  <View className="mt-2 bg-amber-600/20 rounded-lg p-2">
                    <Text className="text-amber-300 text-xs text-center">
                      ⚠️ Low balance warning: Less than 2 minutes remaining
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
        
        {/* Chat Overlay */}
        {showChat && (
          <View className="absolute bottom-0 left-0 right-0 h-64 bg-black/90 backdrop-blur-sm">
            <View className="flex-row items-center justify-between p-4 border-b border-white/10">
              <Text className="text-white font-bold">Chat</Text>
              <Pressable onPress={() => setShowChat(false)}>
                <Ionicons name="close" size={24} color="white" />
              </Pressable>
            </View>
            
            <View className="flex-1 px-4 py-2">
              <Text className="text-white/70 text-center">
                Chat messages will appear here during the session
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </BackgroundImage>
  );
}