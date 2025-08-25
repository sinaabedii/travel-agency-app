import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { TourCard, Input, Button } from '@/components/design-system';
import { Tour, Destination } from '@/types';
import { getFeaturedTours, getPopularDestinations, mockUsers } from '@/services/mockData';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const currentUser = mockUsers[0]; // Mock current user

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      // Mock API calls
      const tours = getFeaturedTours();
      const destinations = getPopularDestinations();
      
      setFeaturedTours(tours);
      setPopularDestinations(destinations);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Search' as never, { query: searchQuery } as never);
    } else {
      navigation.navigate('Search' as never);
    }
  };

  const handleTourPress = (tourId: string) => {
    navigation.navigate('TourDetails' as never, { tourId } as never);
  };

  const handleFavoritePress = (tourId: string) => {
    setFavorites(prev => 
      prev.includes(tourId) 
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
  };

  const handleDestinationPress = (destinationId: string) => {
    navigation.navigate('DestinationDetails' as never, { destinationId } as never);
  };

  const renderDestinationCard = ({ item }: { item: Destination }) => (
    <TouchableOpacity
      style={[styles.destinationCard, { backgroundColor: theme.colors.surface }]}
      onPress={() => handleDestinationPress(item.id)}
    >
      <View style={styles.destinationImagePlaceholder}>
        <Text style={styles.destinationEmoji}>🌍</Text>
      </View>
      <Text style={[styles.destinationName, { color: theme.colors.text }]}>
        {item.name}
      </Text>
      <Text style={[styles.destinationCountry, { color: theme.colors.textSecondary }]}>
        {item.country}
      </Text>
    </TouchableOpacity>
  );

  const renderCategoryChip = (category: string, emoji: string) => (
    <TouchableOpacity
      key={category}
      style={[styles.categoryChip, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('Search' as never, { category } as never)}
    >
      <Text style={styles.categoryEmoji}>{emoji}</Text>
      <Text style={[styles.categoryText, { color: theme.colors.text }]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
              Hello, {currentUser.firstName}
            </Text>
            <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
              Welcome to TripGlide
            </Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileAvatar}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <Input
            placeholder="Search destinations, tours..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Text style={{ color: theme.colors.textSecondary }}>🔍</Text>}
            rightIcon={<Text style={{ color: theme.colors.primary }}>🎯</Text>}
            onRightIconPress={handleSearch}
            containerStyle={styles.searchInput}
            onSubmitEditing={handleSearch}
          />
        </View>

        {/* Trip Selection */}
        <View style={styles.tripSelection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Select your next trip
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryRow}>
              {renderCategoryChip('Asia', '🏯')}
              {renderCategoryChip('Europe', '🏰')}
              {renderCategoryChip('South America', '🏔️')}
              {renderCategoryChip('North America', '🗽')}
              {renderCategoryChip('Africa', '🦁')}
            </View>
          </ScrollView>
        </View>

        {/* Featured Tours */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Featured Tours
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search' as never)}>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
                See all
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredTours}
            renderItem={({ item }) => (
              <TourCard
                tour={item}
                onPress={handleTourPress}
                onFavoritePress={handleFavoritePress}
                isFavorite={favorites.includes(item.id)}
                variant="featured"
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toursContainer}
          />
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Popular Destinations
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
                See all
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={popularDestinations}
            renderItem={renderDestinationCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsContainer}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => navigation.navigate('Bookings' as never)}
            >
              <Text style={styles.quickActionIcon}>📅</Text>
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                My Bookings
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => navigation.navigate('Chat' as never)}
            >
              <Text style={styles.quickActionIcon}>💬</Text>
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                Live Chat
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]}
            >
              <Text style={styles.quickActionIcon}>🎁</Text>
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                Special Offers
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]}
            >
              <Text style={styles.quickActionIcon}>📍</Text>
              <Text style={[styles.quickActionText, { color: theme.colors.text }]}>
                Nearby Tours
              </Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  welcomeSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Instrument Sans',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Instrument Sans',
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatar: {
    fontSize: 20,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchInput: {
    marginBottom: 0,
  },
  tripSelection: {
    marginBottom: 32,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Instrument Sans',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Instrument Sans',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Instrument Sans',
  },
  toursContainer: {
    paddingLeft: 20,
  },
  destinationsContainer: {
    paddingLeft: 20,
  },
  destinationCard: {
    width: 120,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  destinationImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  destinationEmoji: {
    fontSize: 24,
  },
  destinationName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Instrument Sans',
  },
  destinationCountry: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Instrument Sans',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionCard: {
    width: (width - 52) / 2,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Instrument Sans',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default HomeScreen;
