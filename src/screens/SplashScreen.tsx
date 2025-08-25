import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Check if user has seen onboarding
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      const userToken = await AsyncStorage.getItem('userToken');

      setTimeout(() => {
        if (userToken) {
          navigation.navigate('Main' as never);
        } else if (hasSeenOnboarding) {
          navigation.navigate('Auth' as never);
        } else {
          navigation.navigate('Onboarding' as never);
        }
      }, 2000);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setTimeout(() => {
        navigation.navigate('Onboarding' as never);
      }, 2000);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={[styles.logo, { color: '#FFFFFF' }]}>✈️</Text>
        <Text style={[styles.title, { color: '#FFFFFF' }]}>TripGlide</Text>
        <Text style={[styles.subtitle, { color: 'rgba(255, 255, 255, 0.8)' }]}>
          Discover Amazing Adventures
        </Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={[styles.version, { color: 'rgba(255, 255, 255, 0.6)' }]}>
          Version 1.0.0
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'Instrument Sans',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: 'Instrument Sans',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  version: {
    fontSize: 12,
    fontFamily: 'Instrument Sans',
  },
});

export default SplashScreen;
