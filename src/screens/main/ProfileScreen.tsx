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
  const navigation = useNavigation<any>();
  const { theme, isDark, toggleTheme } = useTheme();
  const [user] = useState(mockUsers[0]); // Current user
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
              await AsyncStorage.multiRemove(['userToken', 'userData']);
              navigation.navigate('Auth');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    console.log('Edit profile');
  };

  const handleChangePassword = () => {
    // Navigate to change password screen
    console.log('Change password');
  };

  const handlePaymentMethods = () => {
    // Navigate to payment methods screen
    console.log('Payment methods');
  };

  const handleTravelPreferences = () => {
    // Navigate to travel preferences screen
    console.log('Travel preferences');
  };

  const handleSupport = () => {
    navigation.navigate('Chat');
  };

  const handleAbout = () => {
    Alert.alert(
      'About TripGlide',
      'TripGlide v1.0.0\n\nYour trusted travel companion for discovering amazing adventures around the world.\n\n© 2024 TripGlide. All rights reserved.'
    );
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
          <View style={styles.verificationBadge}>
            <Text style={styles.verificationIcon}>✓</Text>
            <Text style={[styles.verificationText, { color: theme.colors.success }]}>
              Verified
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
            {renderMenuItem('👤', 'Edit Profile', 'Update your personal information', handleEditProfile)}
            {renderMenuItem('🔒', 'Change Password', 'Update your password', handleChangePassword)}
            {renderMenuItem('💳', 'Payment Methods', 'Manage your payment options', handlePaymentMethods)}
            {renderMenuItem('🎯', 'Travel Preferences', 'Customize your travel interests', handleTravelPreferences)}
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
              'Notifications',
              'Manage your notification preferences',
              undefined,
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            )}
            {renderMenuItem(
              '🌙',
              'Dark Mode',
              isDark ? 'Switch to light theme' : 'Switch to dark theme',
              undefined,
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            )}
            {renderMenuItem('🌍', 'Language', 'English', () => {})}
            {renderMenuItem('💰', 'Currency', 'USD ($)', () => {})}
          </Card>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Support
          </Text>
          <Card padding="none">
            {renderMenuItem('💬', 'Contact Support', 'Get help from our team', handleSupport)}
            {renderMenuItem('📋', 'Terms of Service', 'Read our terms', () => {})}
            {renderMenuItem('🔒', 'Privacy Policy', 'Read our privacy policy', () => {})}
            {renderMenuItem('ℹ️', 'About', 'App version and info', handleAbout)}
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

        {/* Bottom Spacing */}
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Instrument Sans',
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Instrument Sans',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  verificationText: {
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginHorizontal: 20,
    fontFamily: 'Instrument Sans',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontFamily: 'Instrument Sans',
  },
  menuSubtitle: {
    fontSize: 14,
    marginTop: 2,
    fontFamily: 'Instrument Sans',
  },
  menuArrow: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    marginHorizontal: 20,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default ProfileScreen;
