import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/context/ThemeContext';
import { RootStackParamList, AuthStackParamList, MainTabParamList } from '@/types';

// Screens
import SplashScreen from '@/screens/SplashScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import OTPVerificationScreen from '@/screens/auth/OTPVerificationScreen';
import HomeScreen from '@/screens/main/HomeScreen';
import SearchScreen from '@/screens/main/SearchScreen';
import BookingsScreen from '@/screens/main/BookingsScreen';
import ChatScreen from '@/screens/main/ChatScreen';
import ProfileScreen from '@/screens/main/ProfileScreen';
import TourDetailsScreen from '@/screens/main/TourDetailsScreen';

const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        }),
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </AuthStack.Navigator>
  );
};

const MainNavigator = () => {
  const { theme } = useTheme();

  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontFamily: theme.typography.fontFamily,
          fontWeight: '500',
        },
      }}
    >
      <MainTab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="search" color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen 
        name="Bookings" 
        component={BookingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="calendar" color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="message" color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="user" color={color} size={size} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};

// Simple tab icon component (replace with actual icons)
const TabIcon: React.FC<{ name: string; color: string; size: number }> = ({ name, color, size }) => {
  const icons: { [key: string]: string } = {
    home: '🏠',
    search: '🔍',
    calendar: '📅',
    message: '💬',
    user: '👤',
  };

  return (
    <Text style={{ fontSize: size, color }}>
      {icons[name] || '?'}
    </Text>
  );
};

export const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.accent,
        },
      }}
    >
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }),
        }}
      >
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        <RootStack.Screen name="Main" component={MainNavigator} />
        <RootStack.Screen name="TourDetails" component={TourDetailsScreen} />
        <RootStack.Screen name="BookingDetails" component={BookingDetailsPlaceholder} />
        <RootStack.Screen name="DestinationDetails" component={DestinationDetailsPlaceholder} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

// Simple placeholders to avoid navigation errors until implemented
const BookingDetailsPlaceholder: React.FC = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Booking Details - Coming Soon</Text>
  </View>
);

const DestinationDetailsPlaceholder: React.FC = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Destination Details - Coming Soon</Text>
  </View>
);
