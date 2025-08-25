import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { Button, Input } from '@/components/design-system';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Mock API call
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));
      
      navigation.navigate('OTPVerification', {
        email,
        type: 'forgot_password'
      });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToLogin}
        >
          <Text style={[styles.backText, { color: theme.colors.primary }]}>
            ← Back to Login
          </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.icon, { color: theme.colors.primary }]}>🔒</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Forgot Password?
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Don't worry! Enter your email address and we'll send you a verification code to reset your password.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (error) setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={error}
            containerStyle={styles.inputContainer}
          />

          <Button
            title="Send Reset Code"
            onPress={handleResetPassword}
            loading={isLoading}
            fullWidth
            size="large"
            style={styles.resetButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Remember your password?{' '}
          </Text>
          <TouchableOpacity onPress={handleBackToLogin}>
            <Text style={[styles.loginText, { color: theme.colors.primary }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Instrument Sans',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: 'Instrument Sans',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Instrument Sans',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 30,
  },
  resetButton: {
    marginBottom: 30,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Instrument Sans',
  },
  loginText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Instrument Sans',
  },
});

export default ForgotPasswordScreen;
