import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { Card, Button } from '@/components/design-system';
import { mockUsers } from '@/services/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDark, toggleTheme } = useTheme();
  const [user] = useState(mockUsers[0]); // Mock current user
  const [notifications, setNotifications] = useState(user.preferences.notifications);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              navigation.navigate('Auth' as never);
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Coming Soon', 'Profile editing will be available in the next update!');
  };

  const handleChangePassword = () => {
    Alert.alert('Coming Soon', 'Password change will be available in the next update!');
  };

  const handleNotificationToggle = (value: boolean) => {
    setNotifications(value);
    // In a real app, this would update the backend
  };

  const renderProfileHeader = () => (
    <Card style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
            {user.email}
          </Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedIcon}>✓</Text>
            <Text style={[styles.verifiedText, { color: theme.colors.success }]}>
              Verified Account
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Text style={{ color: theme.colors.primary }}>✏️</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderMenuItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.menuItemLeft}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <View style={styles.menuItemText}>
          <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement || (
        <Text style={[styles.menuArrow, { color: theme.colors.textSecondary }]}>
          →
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Profile
          </Text>
        </View>

        {/* Profile Card */}
        {renderProfileHeader()}

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Account
          </Text>
          <Card padding="none">
            {renderMenuItem(
              '👤',
              'Personal Information',
              'Update your profile details',
              handleEditProfile
            )}
            {renderMenuItem(
              '🔒',
              'Change Password',
              'Update your password',
              handleChangePassword
            )}
            {renderMenuItem(
              '💳',
              'Payment Methods',
              'Manage your payment options',
              () => Alert.alert('Coming Soon', 'Payment methods management coming soon!')
            )}
            {renderMenuItem(
              '📍',
              'Travel Preferences',
              'Set your travel interests',
              () => Alert.alert('Coming Soon', 'Travel preferences coming soon!')
            )}
          </Card>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Settings
          </Text>
          <Card padding="none">
            {renderMenuItem(
              '🔔',
              'Push Notifications',
              'Manage notification preferences',
              undefined,
              <Switch
                value={notifications}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            )}
            {renderMenuItem(
              '🌙',
              'Dark Mode',
              'Toggle dark/light theme',
              undefined,
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            )}
            {renderMenuItem(
              '🌐',
              'Language',
              'English (US)',
              () => Alert.alert('Coming Soon', 'Language selection coming soon!')
            )}
            {renderMenuItem(
              '💱',
              'Currency',
              'USD - US Dollar',
              () => Alert.alert('Coming Soon', 'Currency selection coming soon!')
            )}
          </Card>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Support
          </Text>
          <Card padding="none">
            {renderMenuItem(
              '❓',
              'Help Center',
              'Get answers to common questions',
              () => Alert.alert('Coming Soon', 'Help center coming soon!')
            )}
            {renderMenuItem(
              '💬',
              'Contact Support',
              'Chat with our support team',
              () => navigation.navigate('Chat' as never)
            )}
            {renderMenuItem(
              '⭐',
              'Rate Our App',
              'Share your feedback',
              () => Alert.alert('Thank You!', 'Thank you for using TripGlide!')
            )}
            {renderMenuItem(
              '📋',
              'Terms of Service',
              'Read our terms and conditions',
              () => Alert.alert('Coming Soon', 'Terms of service coming soon!')
            )}
            {renderMenuItem(
              '🔒',
              'Privacy Policy',
              'Learn about data protection',
              () => Alert.alert('Coming Soon', 'Privacy policy coming soon!')
            )}
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Card>
            <View style={styles.appInfo}>
              <Text style={[styles.appName, { color: theme.colors.text }]}>
                TripGlide
              </Text>
              <Text style={[styles.appVersion, { color: theme.colors.textSecondary }]}>
                Version 1.0.0
              </Text>
            </View>
          </Card>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            fullWidth
            style={[styles.logoutButton, { borderColor: theme.colors.error }]}
            textStyle={{ color: theme.colors.error }}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Instrument Sans',
  },
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Instrument Sans',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Instrument Sans',
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Instrument Sans',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedIcon: {
    fontSize: 12,
    marginRight: 4,
    color: '#10B981',
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Instrument Sans',
  },
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginHorizontal: 20,
    fontFamily: 'Instrument Sans',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  menuItemText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
    fontFamily: 'Instrument Sans',
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'Instrument Sans',
  },
  menuArrow: {
    fontSize: 16,
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Instrument Sans',
  },
  appVersion: {
    fontSize: 14,
    fontFamily: 'Instrument Sans',
  },
  logoutButton: {
    marginHorizontal: 20,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default ProfileScreen;
