
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

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Please accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Mock registration - replace with actual API call
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));
      
      // Navigate to OTP verification
      navigation.navigate('OTPVerification', {
        email: formData.email,
        type: 'register'
      });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSignIn = () => {
    navigation.navigate('Login' as never);
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
        <View style={styles.header}>
          <Text style={[styles.logo, { color: theme.colors.primary }]}>✈️</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Join us and start your adventure
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <Input
              label="First Name"
              placeholder="John"
              value={formData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              autoCapitalize="words"
              error={errors.firstName}
              containerStyle={[styles.nameInput, { marginRight: 8 }]}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={formData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              autoCapitalize="words"
              error={errors.lastName}
              containerStyle={[styles.nameInput, { marginLeft: 8 }]}
            />
          </View>

          <Input
            label="Email Address"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
            error={errors.phone}
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Password"
            placeholder="Create a strong password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry={!showPassword}
            error={errors.password}
            containerStyle={styles.inputContainer}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={{ color: theme.colors.textSecondary }}>
                  {showPassword ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            secureTextEntry={!showConfirmPassword}
            error={errors.confirmPassword}
            containerStyle={styles.inputContainer}
            rightIcon={
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Text style={{ color: theme.colors.textSecondary }}>
                  {showConfirmPassword ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            }
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAcceptTerms(!acceptTerms)}
          >
            <View style={[
              styles.checkbox,
              { 
                borderColor: errors.terms ? theme.colors.error : theme.colors.border,
                backgroundColor: acceptTerms ? theme.colors.primary : 'transparent'
              }
            ]}>
              {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
              I agree to the{' '}
              <Text style={{ color: theme.colors.primary }}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={{ color: theme.colors.primary }}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          {errors.terms && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.terms}
            </Text>
          )}

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
            size="large"
            style={styles.registerButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={[styles.signInText, { color: theme.colors.primary }]}>
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'Instrument Sans',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Instrument Sans',
  },
  form: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  nameInput: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Instrument Sans',
  },
  errorText: {
    fontSize: 12,
    marginBottom: 20,
    fontFamily: 'Instrument Sans',
  },
  registerButton: {
    marginTop: 10,
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
  signInText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Instrument Sans',
  },
});

export default RegisterScreen;
