import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAppStore from '../state/appStore';

// Import all screens
import HomeScreen from '../screens/HomeScreen';
import ReadingsScreen from '../screens/ReadingsScreen';
import LiveScreen from '../screens/LiveScreen';
import ShopScreen from '../screens/ShopScreen';
import CommunityScreen from '../screens/CommunityScreen';
import MessagesScreen from '../screens/MessagesScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ReaderDashboardScreen from '../screens/ReaderDashboardScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PoliciesScreen from '../screens/PoliciesScreen';
import AuthScreen from '../screens/AuthScreen';

const Stack = createNativeStackNavigator();

export default function RoleBasedNavigator() {
  const { user } = useAppStore();
  
  
  
  
  // Determine initial screen based on user role
  const getInitialRoute = () => {
    if (!user.isAuthenticated) return 'MainTabs';
    
    switch (user.role) {
      case 'admin':
        return 'AdminDashboard';
      case 'reader':
        return 'ReaderDashboard';
      default:
        return 'MainTabs';



    }
  };

  const initialRoute = getInitialRoute();


  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
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
      {/* All screens available to all roles */}
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ReaderDashboard" 
        component={ReaderDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Messages" 
        component={MessagesScreen}
        options={{ title: 'Messages', presentation: 'modal' }}
      />
      <Stack.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ title: 'Community' }}
      />
      <Stack.Screen 
        name="HelpCenter" 
        component={HelpCenterScreen}
        options={{ title: 'Help Center' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name="Policies" 
        component={PoliciesScreen}
        options={{ title: 'Policies' }}
      />
      <Stack.Screen 
        name="Auth" 
        component={AuthScreen}
        options={{ headerShown: false, presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}