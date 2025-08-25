import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from '@/context/ThemeContext';
import { Tour } from '@/types';
import { Card } from './Card';

interface TourCardProps {
  tour: Tour;
  onPress: (tourId: string) => void;
  onFavoritePress?: (tourId: string) => void;
  isFavorite?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth - 32; // Account for margins

export const TourCard: React.FC<TourCardProps> = memo(({
  tour,
  onPress,
  onFavoritePress,
  isFavorite = false,
  variant = 'default',
}) => {
  const { theme } = useTheme();

  const getImageHeight = () => {
    switch (variant) {
      case 'compact':
        return 120;
      case 'featured':
        return 250;
      default:
        return 200;
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return `${currency === 'USD' ? '$' : currency} ${price.toLocaleString()}`;
  };

  const formatDuration = (duration: number) => {
    if (duration === 1) return '1 day';
    if (duration < 7) return `${duration} days`;
    const weeks = Math.floor(duration / 7);
    const days = duration % 7;
    if (days === 0) return `${weeks} week${weeks > 1 ? 's' : ''}`;
    return `${weeks}w ${days}d`;
  };

  const renderRating = () => (
    <View style={styles.ratingContainer}>
      <Text style={[styles.ratingText, { color: theme.colors.warning }]}>★</Text>
      <Text style={[styles.ratingText, { color: theme.colors.text }]}>
        {tour.rating.toFixed(1)}
      </Text>
      <Text style={[styles.reviewCount, { color: theme.colors.textSecondary }]}>
        ({tour.reviewCount})
      </Text>
    </View>
  );

  const renderPrice = () => (
    <View style={styles.priceContainer}>
      {tour.originalPrice && tour.originalPrice > tour.price && (
        <Text style={[styles.originalPrice, { color: theme.colors.textSecondary }]}>
          {formatPrice(tour.originalPrice, tour.currency)}
        </Text>
      )}
      <Text style={[styles.price, { color: theme.colors.primary }]}>
        {formatPrice(tour.price, tour.currency)}
      </Text>
    </View>
  );

  const renderBadges = () => (
    <View style={styles.badgeContainer}>
      {tour.isFeatured && (
        <View style={[styles.badge, { backgroundColor: theme.colors.accent }]}>
          <Text style={styles.badgeText}>Featured</Text>
        </View>
      )}
      {tour.originalPrice && tour.originalPrice > tour.price && (
        <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
          <Text style={styles.badgeText}>
            {Math.round((1 - tour.price / tour.originalPrice) * 100)}% OFF
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <Card
      onPress={() => onPress(tour.id)}
      padding="none"
      variant="elevated"
      style={[styles.card, { width: variant === 'compact' ? cardWidth * 0.7 : cardWidth }]}
    >
      <View style={styles.imageContainer}>
        <FastImage
          source={{ uri: tour.images[0] }}
          style={[styles.image, { height: getImageHeight() }]}
          resizeMode={FastImage.resizeMode.cover}
        />
        
        {/* Favorite Button */}
        <TouchableOpacity
          style={[styles.favoriteButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => onFavoritePress?.(tour.id)}
        >
          <Text style={[styles.favoriteIcon, { color: isFavorite ? theme.colors.error : theme.colors.textSecondary }]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>

        {/* Badges */}
        {renderBadges()}
      </View>

      <View style={[styles.content, { padding: theme.spacing.md }]}>
        {/* Location */}
        <Text style={[styles.location, { color: theme.colors.textSecondary }]}>
          {tour.destination.name}, {tour.destination.country}
        </Text>

        {/* Title */}
        <Text
          style={[styles.title, { color: theme.colors.text }]}
          numberOfLines={variant === 'compact' ? 1 : 2}
        >
          {tour.title}
        </Text>

        {/* Description */}
        {variant !== 'compact' && (
          <Text
            style={[styles.description, { color: theme.colors.textSecondary }]}
            numberOfLines={2}
          >
            {tour.shortDescription}
          </Text>
        )}

        {/* Details Row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Duration
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {formatDuration(tour.duration)}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Group Size
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              Max {tour.maxGroupSize}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Difficulty
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
            </Text>
          </View>
        </View>

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          {renderRating()}
          {renderPrice()}
        </View>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  location: {
    fontSize: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
});

TourCard.displayName = 'TourCard';
