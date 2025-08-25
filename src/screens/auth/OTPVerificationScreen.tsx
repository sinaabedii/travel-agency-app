import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/design-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RouteParams {
  email: string;
  type: 'register' | 'forgot_password';
}

const OTPVerificationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { theme } = useTheme();
  const { email, type } = route.params as RouteParams;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit verification code');
      return;
    }

    setIsLoading(true);
    try {
      // Mock OTP verification
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));
      
      if (otpString === '123456') {
        if (type === 'register') {
          // Complete registration
          await AsyncStorage.setItem('userToken', 'mock-jwt-token');
          await AsyncStorage.setItem('userData', JSON.stringify({
            id: '1',
            email,
            firstName: 'New',
            lastName: 'User',
            role: 'user'
          }));
          navigation.navigate('Main');
        } else {
          // Navigate to reset password screen (would be implemented)
          Alert.alert('Success', 'OTP verified! You can now reset your password.');
          navigation.navigate('Login');
        }
      } else {
        Alert.alert('Invalid OTP', 'The verification code you entered is incorrect');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setCanResend(false);
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    
    try {
      // Mock resend OTP
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
      Alert.alert('Code Sent', 'A new verification code has been sent to your email');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
      setCanResend(true);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.backText, { color: theme.colors.primary }]}>
          ← Back
        </Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.icon, { color: theme.colors.primary }]}>📱</Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Verification Code
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          We've sent a 6-digit verification code to
        </Text>
        <Text style={[styles.email, { color: theme.colors.text }]}>
          {email}
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            style={[
              styles.otpInput,
              {
                borderColor: digit ? theme.colors.primary : theme.colors.border,
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
              }
            ]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
            selectTextOnFocus
          />
        ))}
      </View>

      <Button
        title="Verify Code"
        onPress={handleVerifyOTP}
        loading={isLoading}
        fullWidth
        size="large"
        style={styles.verifyButton}
      />

      <View style={styles.resendContainer}>
        {!canResend ? (
          <Text style={[styles.timerText, { color: theme.colors.textSecondary }]}>
            Resend code in {formatTimer(timer)}
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResendOTP}>
            <Text style={[styles.resendText, { color: theme.colors.primary }]}>
              Resend Code
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.demoInfo}>
        <Text style={[styles.demoText, { color: theme.colors.textSecondary }]}>
          Demo: Use code 123456
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
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
    marginBottom: 8,
    fontFamily: 'Instrument Sans',
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Instrument Sans',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Instrument Sans',
  },
  verifyButton: {
    marginBottom: 30,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'Instrument Sans',
  },
  resendText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Instrument Sans',
  },
  demoInfo: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  demoText: {
    fontSize: 12,
    fontFamily: 'Instrument Sans',
  },
});

export default OTPVerificationScreen;
