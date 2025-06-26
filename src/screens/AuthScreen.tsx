import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BackgroundImage from '../components/BackgroundImage';
import useAppStore from '../state/appStore';
import AuthService from '../services/authService';

export default function AuthScreen() {
  const navigation = useNavigation();
  const { updateUserProfile, addUser } = useAppStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!AuthService.validateEmail(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      if (!formData.name) {
        Alert.alert('Error', 'Please enter your name');
        return;
      }

      const passwordValidation = AuthService.validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        Alert.alert('Password Requirements', passwordValidation.errors.join('\n'));
        return;
      }
    }

    setIsLoading(true);

    try {
      let result;
      
      if (isSignUp) {
        // Split name into first and last name
        const nameParts = formData.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        result = await AuthService.signUp({
          email: formData.email,
          password: formData.password,
          firstName,
          lastName,
        });
      } else {
        result = await AuthService.signIn({
          email: formData.email,
          password: formData.password,
        });
      }

      if (result.success && result.user) {
        // Update app store with authenticated user
        updateUserProfile({
          isAuthenticated: true,
          email: result.user.email,
          name: `${result.user.firstName} ${result.user.lastName}`,
          role: result.user.role,
          avatar: result.user.avatar,
        });

        // Add user to system if it's a new signup
        if (isSignUp) {
          addUser({
            name: `${result.user.firstName} ${result.user.lastName}`,
            email: result.user.email,
            role: result.user.role,
            avatar: result.user.avatar,
          });
        }

        // Navigate back and then to appropriate dashboard
        navigation.goBack();
        setTimeout(() => {
          switch (result.user?.role) {
            case 'admin':
              navigation.navigate('AdminDashboard' as never);
              break;
            case 'reader':
              navigation.navigate('ReaderDashboard' as never);
              break;
            default:
              break;
          }
        }, 200);
      } else {
        Alert.alert('Authentication Failed', result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Error', 'Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = (provider: string) => {
    Alert.alert('Coming Soon', `${provider} sign-in will be available soon!`);
  };

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 py-8">
            <Pressable
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full items-center justify-center mb-6"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </Pressable>
            
            <Text className="text-white text-3xl font-bold mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text className="text-white/70 text-lg">
              {isSignUp 
                ? 'Join our spiritual community' 
                : 'Sign in to access your readings'
              }
            </Text>
          </View>

          {/* Auth Form */}
          <View className="px-6">
            <View className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              {/* Name Field (Sign Up Only) */}
              {isSignUp && (
                <View className="mb-4">
                  <Text className="text-white/80 text-sm font-medium mb-2">Full Name</Text>
                  <TextInput
                    value={formData.name}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                    placeholder="Enter your full name"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white"
                  />
                </View>
              )}

              {/* Email Field */}
              <View className="mb-4">
                <Text className="text-white/80 text-sm font-medium mb-2">Email Address</Text>
                <TextInput
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white"
                />
              </View>

              {/* Password Field */}
              <View className="mb-4">
                <Text className="text-white/80 text-sm font-medium mb-2">Password</Text>
                <TextInput
                  value={formData.password}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  secureTextEntry
                  className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white"
                />
              </View>

              {/* Confirm Password Field (Sign Up Only) */}
              {isSignUp && (
                <View className="mb-6">
                  <Text className="text-white/80 text-sm font-medium mb-2">Confirm Password</Text>
                  <TextInput
                    value={formData.confirmPassword}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                    placeholder="Confirm your password"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    secureTextEntry
                    className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white"
                  />
                </View>
              )}

              {/* Submit Button */}
              <Pressable
                onPress={handleSubmit}
                disabled={isLoading}
                className={`bg-purple-600/80 backdrop-blur-sm rounded-xl py-4 items-center border border-purple-400/50 ${
                  isLoading ? 'opacity-50' : ''
                }`}
              >
                <Text className="text-white text-lg font-semibold">
                  {isLoading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
                </Text>
              </Pressable>

              {/* Forgot Password (Sign In Only) */}
              {!isSignUp && (
                <Pressable className="items-center mt-4">
                  <Text className="text-purple-300 text-sm">Forgot Password?</Text>
                </Pressable>
              )}
            </View>

            {/* Toggle Auth Mode */}
            <View className="flex-row items-center justify-center mt-6">
              <Text className="text-white/70">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              </Text>
              <Pressable onPress={() => setIsSignUp(!isSignUp)}>
                <Text className="text-purple-300 font-semibold">
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </Text>
              </Pressable>
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-px bg-white/20" />
              <Text className="text-white/60 px-4">Or continue with</Text>
              <View className="flex-1 h-px bg-white/20" />
            </View>

            {/* Social Sign In */}
            <View className="gap-3 mb-8">
              <Pressable
                onPress={() => handleSocialSignIn('Google')}
                className="bg-black/40 backdrop-blur-md rounded-xl py-4 border border-white/20 flex-row items-center justify-center"
              >
                <Text className="text-white font-medium">Continue with Google</Text>
              </Pressable>

              <Pressable
                onPress={() => handleSocialSignIn('Apple')}
                className="bg-black/40 backdrop-blur-md rounded-xl py-4 border border-white/20 flex-row items-center justify-center"
              >
                <Text className="text-white font-medium">Continue with Apple</Text>
              </Pressable>

              <Pressable
                onPress={() => handleSocialSignIn('Facebook')}
                className="bg-black/40 backdrop-blur-md rounded-xl py-4 border border-white/20 flex-row items-center justify-center"
              >
                <Text className="text-white font-medium">Continue with Facebook</Text>
              </Pressable>
            </View>

            {/* Terms */}
            {isSignUp && (
              <Text className="text-white/50 text-xs text-center leading-5 mb-6">
                By creating an account, you agree to our{' '}
                <Text className="text-purple-300">Terms of Service</Text> and{' '}
                <Text className="text-purple-300">Privacy Policy</Text>
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundImage>
  );
}