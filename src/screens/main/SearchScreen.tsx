import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { TourCard, Input, Button } from '@/components/design-system';
import { Tour, SearchFilters, SortOption, TourCategory, TourDifficulty, RootStackParamList } from '@/types';
import { searchTours } from '@/services/mockData';

const { width } = Dimensions.get('window');

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
  backButton: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Instrument Sans',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Instrument Sans',
  },
  placeholder: {
    width: 50,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 0,
  },
  filterBar: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Instrument Sans',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'Instrument Sans',
  },
  toursList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalButton: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Instrument Sans',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Instrument Sans',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Instrument Sans',
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Instrument Sans',
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rangeInput: {
    flex: 1,
    marginBottom: 0,
  },
  rangeSeparator: {
    fontSize: 14,
    fontFamily: 'Instrument Sans',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Instrument Sans',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { theme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: { min: 0, max: 10000 },
    duration: { min: 1, max: 30 },
    sortBy: SortOption.POPULARITY,
  });

  useEffect(() => {
    // Get initial query from navigation params
    const params = route.params as any;
    if (params?.query) {
      setSearchQuery(params.query);
    }
    loadTours();
  }, [route.params]);

  useEffect(() => {
    applyFilters();
  }, [tours, searchQuery, filters]);

  const loadTours = useCallback(async () => {
    setLoading(true);
    try {
      const allTours = searchTours();
      setTours(allTours);
    } catch (error) {
      console.error('Error loading tours:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...tours];

    // Search query filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(tour =>
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.destination.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(tour =>
        tour.price >= filters.priceRange!.min && tour.price <= filters.priceRange!.max
      );
    }

    // Duration filter
    if (filters.duration) {
      filtered = filtered.filter(tour =>
        tour.duration >= filters.duration!.min && tour.duration <= filters.duration!.max
      );
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(tour => filters.category!.includes(tour.category));
    }

    // Difficulty filter
    if (filters.difficulty && filters.difficulty.length > 0) {
      filtered = filtered.filter(tour => filters.difficulty!.includes(tour.difficulty));
    }

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter(tour => tour.rating >= filters.rating!);
    }

    // Sort
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case SortOption.PRICE_LOW_HIGH:
            return a.price - b.price;
          case SortOption.PRICE_HIGH_LOW:
            return b.price - a.price;
          case SortOption.RATING:
            return b.rating - a.rating;
          case SortOption.DURATION:
            return a.duration - b.duration;
          case SortOption.POPULARITY:
            return b.reviewCount - a.reviewCount;
          default:
            return 0;
        }
      });
    }

    setFilteredTours(filtered);
  }, [tours, searchQuery, filters]);

  const handleTourPress = (tourId: string) => {
    navigation.navigate('TourDetails', { tourId });
  };

  const handleFavoritePress = (tourId: string) => {
    setFavorites(prev => 
      prev.includes(tourId) 
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
  };

  const resetFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 10000 },
      duration: { min: 1, max: 30 },
      sortBy: SortOption.POPULARITY,
    });
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={[styles.modalButton, { color: theme.colors.textSecondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            Filters
          </Text>
          <TouchableOpacity onPress={resetFilters}>
            <Text style={[styles.modalButton, { color: theme.colors.primary }]}>
              Reset
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Sort By */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
              Sort By
            </Text>
            <View style={styles.sortOptions}>
              {Object.values(SortOption).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.sortOption,
                    {
                      backgroundColor: filters.sortBy === option 
                        ? theme.colors.primary 
                        : theme.colors.surface,
                    }
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, sortBy: option }))}
                >
                  <Text style={[
                    styles.sortOptionText,
                    {
                      color: filters.sortBy === option 
                        ? '#FFFFFF' 
                        : theme.colors.text,
                    }
                  ]}>
                    {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
              Price Range (USD)
            </Text>
            <View style={styles.rangeContainer}>
              <Input
                placeholder="Min"
                value={filters.priceRange?.min.toString() || '0'}
                onChangeText={(value) => {
                  const min = parseInt(value) || 0;
                  setFilters(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange!, min }
                  }));
                }}
                keyboardType="numeric"
                containerStyle={styles.rangeInput}
              />
              <Text style={[styles.rangeSeparator, { color: theme.colors.textSecondary }]}>
                to
              </Text>
              <Input
                placeholder="Max"
                value={filters.priceRange?.max.toString() || '10000'}
                onChangeText={(value) => {
                  const max = parseInt(value) || 10000;
                  setFilters(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange!, max }
                  }));
                }}
                keyboardType="numeric"
                containerStyle={styles.rangeInput}
              />
            </View>
          </View>

          {/* Duration */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
              Duration (Days)
            </Text>
            <View style={styles.rangeContainer}>
              <Input
                placeholder="Min"
                value={filters.duration?.min.toString() || '1'}
                onChangeText={(value) => {
                  const min = parseInt(value) || 1;
                  setFilters(prev => ({
                    ...prev,
                    duration: { ...prev.duration!, min }
                  }));
                }}
                keyboardType="numeric"
                containerStyle={styles.rangeInput}
              />
              <Text style={[styles.rangeSeparator, { color: theme.colors.textSecondary }]}>
                to
              </Text>
              <Input
                placeholder="Max"
                value={filters.duration?.max.toString() || '30'}
                onChangeText={(value) => {
                  const max = parseInt(value) || 30;
                  setFilters(prev => ({
                    ...prev,
                    duration: { ...prev.duration!, max }
                  }));
                }}
                keyboardType="numeric"
                containerStyle={styles.rangeInput}
              />
            </View>
          </View>

          {/* Categories */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: theme.colors.text }]}>
              Categories
            </Text>
            <View style={styles.chipContainer}>
              {Object.values(TourCategory).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: filters.category?.includes(category)
                        ? theme.colors.primary
                        : theme.colors.surface,
                    }
                  ]}
                  onPress={() => {
                    setFilters(prev => ({
                      ...prev,
                      category: prev.category?.includes(category)
                        ? prev.category.filter(c => c !== category)
                        : [...(prev.category || []), category]
                    }));
                  }}
                >
                  <Text style={[
                    styles.chipText,
                    {
                      color: filters.category?.includes(category)
                        ? '#FFFFFF'
                        : theme.colors.text,
                    }
                  ]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <Button
            title={`Show ${filteredTours.length} Results`}
            onPress={() => setShowFilters(false)}
            fullWidth
            size="large"
          />
        </View>
      </View>
    </Modal>
  );

  const renderTourItem = ({ item }: { item: Tour }) => (
    <TourCard
      tour={item}
      onPress={handleTourPress}
      onFavoritePress={handleFavoritePress}
      isFavorite={favorites.includes(item.id)}
      variant="default"
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.colors.primary }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Search Tours
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <Input
          placeholder="Search destinations, tours..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Text style={{ color: theme.colors.textSecondary }}>🔍</Text>}
          containerStyle={styles.searchInput}
        />
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => setShowFilters(true)}
          >
            <Text style={[styles.filterButtonText, { color: theme.colors.text }]}>🎛️ Filters</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.colors.surface }]}> 
            <Text style={[styles.filterButtonText, { color: theme.colors.text }]}>💰 Price</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.colors.surface }]}> 
            <Text style={[styles.filterButtonText, { color: theme.colors.text }]}>⭐ Rating</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.colors.surface }]}> 
            <Text style={[styles.filterButtonText, { color: theme.colors.text }]}>📅 Duration</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => setShowMap(prev => !prev)}
          >
            <Text style={[styles.filterButtonText, { color: theme.colors.text }]}> 
              {showMap ? '📋 List' : '🗺️ Map'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

    {/* Results */}
    <View style={styles.resultsHeader}>
      <Text style={[styles.resultsCount, { color: theme.colors.textSecondary }]}> 
        {filteredTours.length} tours found
      </Text>
    </View>

    {showMap ? (
      <View style={{ flex: 1, height: 400, marginHorizontal: 20, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={(() => {
            const first = filteredTours[0];
            const lat = first?.destination.coordinates?.latitude ?? 37.78825;
            const lng = first?.destination.coordinates?.longitude ?? -122.4324;
            const region: Region = { latitude: lat, longitude: lng, latitudeDelta: 30, longitudeDelta: 30 };
            return region;
          })()}
        >
          {filteredTours.map(t => (
            <Marker
              key={t.id}
              coordinate={{
                latitude: t.destination.coordinates?.latitude ?? 0,
                longitude: t.destination.coordinates?.longitude ?? 0,
              }}
              title={t.title}
              description={`${t.destination.name}, ${t.destination.country}`}
              onPress={() => handleTourPress(t.id)}
            />
          ))}
        </MapView>
      </View>
    ) : (
      <FlatList
        data={filteredTours}
        renderItem={renderTourItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.toursList}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadTours}
      />
    )}

    {renderFilterModal()}
  </View>
);

};

export default SearchScreen;
