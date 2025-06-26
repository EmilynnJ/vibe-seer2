import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../state/authStore';
import { useAdminStore } from '../state/adminStore';
import AuthStack from './AuthStack';
import ClientTabs from './ClientTabs';
import ReaderTabs from './ReaderTabs';
import AdminTabs from './AdminTabs';
import AdminLoginScreen from '../screens/admin/AdminLoginScreen';
import ReadingSessionScreen from '../screens/ReadingSessionScreen';
import ReadingTypesScreen from '../screens/readings/ReadingTypesScreen';
import ScheduleReadingScreen from '../screens/readings/ScheduleReadingScreen';
import ChatReadingScreen from '../screens/readings/ChatReadingScreen';
import PhoneReadingScreen from '../screens/readings/PhoneReadingScreen';
import AddFundsScreen from '../screens/client/AddFundsScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated: userAuthenticated, user } = useAuthStore();
  const { isAuthenticated: adminAuthenticated } = useAdminStore();

  // Check for admin authentication first
  if (adminAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
      </Stack.Navigator>
    );
  }

  // Check for user authentication
  if (!userAuthenticated || !user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="AdminAuth" component={AdminLoginScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user.role === 'client' ? (
        <>
          <Stack.Screen name="ClientTabs" component={ClientTabs} />
          <Stack.Screen name="ReadingSession" component={ReadingSessionScreen} />
          <Stack.Screen name="ReadingTypes" component={ReadingTypesScreen} />
          <Stack.Screen name="ScheduleReading" component={ScheduleReadingScreen} />
          <Stack.Screen name="ChatReading" component={ChatReadingScreen} />
          <Stack.Screen name="PhoneReading" component={PhoneReadingScreen} />
          <Stack.Screen name="AddFunds" component={AddFundsScreen} />
        </>
      ) : user.role === 'reader' ? (
        <>
          <Stack.Screen name="ReaderTabs" component={ReaderTabs} />
          <Stack.Screen name="ReadingSession" component={ReadingSessionScreen} />
          <Stack.Screen name="ReadingTypes" component={ReadingTypesScreen} />
          <Stack.Screen name="ScheduleReading" component={ScheduleReadingScreen} />
          <Stack.Screen name="ChatReading" component={ChatReadingScreen} />
          <Stack.Screen name="PhoneReading" component={PhoneReadingScreen} />
        </>
      ) : (
        <Stack.Screen name="ClientTabs" component={ClientTabs} />
      )}
    </Stack.Navigator>
  );
}