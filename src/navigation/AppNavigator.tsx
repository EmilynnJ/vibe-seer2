import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ReadingsScreen from '../screens/ReadingsScreen';
import LiveScreen from '../screens/LiveScreen';
import ShopScreen from '../screens/ShopScreen';
import CommunityScreen from '../screens/CommunityScreen';
import MessagesScreen from '../screens/MessagesScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PoliciesScreen from '../screens/PoliciesScreen';
import AuthScreen from '../screens/AuthScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ReaderDashboardScreen from '../screens/ReaderDashboardScreen';
import UserManagementScreen from '../screens/UserManagementScreen';
import ContentModerationScreen from '../screens/ContentModerationScreen';
import AddReaderScreen from '../screens/AddReaderScreen';
import ReaderProfileScreen from '../screens/ReaderProfileScreen';
import VideoCallScreen from '../screens/VideoCallScreen';
import AboutScreen from '../screens/AboutScreen';
import WalletScreen from '../screens/WalletScreen';
import ReaderEarningsScreen from '../screens/ReaderEarningsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Readings') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Live') {
            iconName = focused ? 'radio' : 'radio-outline';
          } else if (route.name === 'Shop') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'people' : 'people-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 88,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="Readings" 
        component={ReadingsScreen} 
        options={{ title: 'READERS' }}
      />
      <Tab.Screen name="Live" component={LiveScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#8B5CF6',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Messages" 
          component={MessagesScreen}
          options={{
            title: 'Messages',
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="Community" 
          component={CommunityScreen}
          options={{
            title: 'Community',
          }}
        />
        <Stack.Screen 
          name="HelpCenter" 
          component={HelpCenterScreen}
          options={{
            title: 'Help Center',
          }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            title: 'Profile',
          }}
        />
        <Stack.Screen 
          name="Policies" 
          component={PoliciesScreen}
          options={{
            title: 'Policies',
          }}
        />
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboardScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ReaderDashboard" 
          component={ReaderDashboardScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="UserManagement" 
          component={UserManagementScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ContentModeration" 
          component={ContentModerationScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="AddReader" 
          component={AddReaderScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ReaderProfile" 
          component={ReaderProfileScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="VideoCall" 
          component={VideoCallScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="About" 
          component={AboutScreen}
          options={{
            title: 'About SoulSeer',
          }}
        />
        <Stack.Screen 
          name="Wallet" 
          component={WalletScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="ReaderEarnings" 
          component={ReaderEarningsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Analytics" 
          component={DashboardScreen}
          options={{
            title: 'Analytics',
          }}
        />
        <Stack.Screen 
          name="PaymentManagement" 
          component={DashboardScreen}
          options={{
            title: 'Payment Management',
          }}
        />
        <Stack.Screen 
          name="SystemSettings" 
          component={DashboardScreen}
          options={{
            title: 'System Settings',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}