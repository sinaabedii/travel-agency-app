import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { Card, Button } from '@/components/design-system';
import { Booking, BookingStatus } from '@/types';

const BookingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  // Mock bookings data
  const mockBookings: Booking[] = [
    {
      id: '1',
      userId: '1',
      tourId: '1',
      availabilityId: '1',
      status: BookingStatus.CONFIRMED,
      travelers: [
        {
          firstName: 'Vanessa',
          lastName: 'Johnson',
          email: 'vanessa@example.com',
          phone: '+1234567890',
          dateOfBirth: '1990-05-15',
          nationality: 'American',
        }
      ],
      totalAmount: 2850,
      currency: 'USD',
      paymentStatus: 'paid' as any,
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
      tour: {
        id: '1',
        title: 'Iconic Brazil Adventure',
        images: ['https://images.unsplash.com/photo-1544966503-7cc5ac882d5f'],
        destination: { name: 'Rio de Janeiro', country: 'Brazil' },
        duration: 8,
        startDate: '2024-03-15',
        endDate: '2024-03-23',
      } as any,
      user: {} as any,
    },
    {
      id: '2',
      userId: '1',
      tourId: '3',
      availabilityId: '3',
      status: BookingStatus.PENDING,
      travelers: [
        {
          firstName: 'Vanessa',
          lastName: 'Johnson',
          email: 'vanessa@example.com',
          phone: '+1234567890',
          dateOfBirth: '1990-05-15',
          nationality: 'American',
        }
      ],
      totalAmount: 1850,
      currency: 'USD',
      paymentStatus: 'pending' as any,
      createdAt: '2024-02-10T00:00:00Z',
      updatedAt: '2024-02-10T00:00:00Z',
      tour: {
        id: '3',
        title: 'Santorini Island Escape',
        images: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff'],
        destination: { name: 'Santorini', country: 'Greece' },
        duration: 5,
        startDate: '2024-05-10',
        endDate: '2024-05-15',
      } as any,
      user: {} as any,
    }
  ];

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setRefreshing(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getFilteredBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      const tourStartDate = new Date(booking.tour.startDate);
      
      switch (activeTab) {
        case 'upcoming':
          return tourStartDate >= now && booking.status !== BookingStatus.CANCELLED;
        case 'past':
          return tourStartDate < now && booking.status === BookingStatus.COMPLETED;
        case 'cancelled':
          return booking.status === BookingStatus.CANCELLED;
        default:
          return true;
      }
    });
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return theme.colors.success;
      case BookingStatus.PENDING:
        return theme.colors.warning;
      case BookingStatus.CANCELLED:
        return theme.colors.error;
      case BookingStatus.COMPLETED:
        return theme.colors.primary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'Confirmed';
      case BookingStatus.PENDING:
        return 'Pending Payment';
      case BookingStatus.CANCELLED:
        return 'Cancelled';
      case BookingStatus.COMPLETED:
        return 'Completed';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleBookingPress = (booking: Booking) => {
    navigation.navigate('BookingDetails' as never, { bookingId: booking.id } as never);
  };

  const handlePayNow = (booking: Booking) => {
    // Navigate to payment screen
    console.log('Pay now for booking:', booking.id);
  };

  const handleCancelBooking = (booking: Booking) => {
    // Show cancel confirmation
    console.log('Cancel booking:', booking.id);
  };

  const renderBookingCard = ({ item }: { item: Booking }) => (
    <Card
      onPress={() => handleBookingPress(item)}
      style={styles.bookingCard}
      variant="elevated"
    >
      <View style={styles.bookingHeader}>
        <View style={styles.bookingInfo}>
          <Text style={[styles.tourTitle, { color: theme.colors.text }]}>
            {item.tour.title}
          </Text>
          <Text style={[styles.destination, { color: theme.colors.textSecondary }]}>
            {item.tour.destination.name}, {item.tour.destination.country}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            Dates
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            {formatDate(item.tour.startDate)} - {formatDate(item.tour.endDate)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            Duration
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            {item.tour.duration} days
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            Travelers
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            {item.travelers.length} person{item.travelers.length > 1 ? 's' : ''}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
            Total Amount
          </Text>
          <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>
            ${item.totalAmount.toLocaleString()}
          </Text>
        </View>
      </View>

      {item.status === BookingStatus.PENDING && (
        <View style={styles.actionButtons}>
          <Button
            title="Pay Now"
            onPress={() => handlePayNow(item)}
            size="small"
            style={styles.payButton}
          />
          <Button
            title="Cancel"
            onPress={() => handleCancelBooking(item)}
            variant="outline"
            size="small"
            style={styles.cancelButton}
          />
        </View>
      )}
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📅</Text>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No {activeTab} bookings
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        {activeTab === 'upcoming' 
          ? "You don't have any upcoming trips. Start planning your next adventure!"
          : `You don't have any ${activeTab} bookings.`
        }
      </Text>
      {activeTab === 'upcoming' && (
        <Button
          title="Explore Tours"
          onPress={() => navigation.navigate('Search' as never)}
          style={styles.exploreButton}
        />
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          My Bookings
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(['upcoming', 'past', 'cancelled'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { borderBottomColor: theme.colors.primary }
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              {
                color: activeTab === tab ? theme.colors.primary : theme.colors.textSecondary,
                fontWeight: activeTab === tab ? '600' : '400',
              }
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bookings List */}
      <FlatList
        data={getFilteredBookings()}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.bookingsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadBookings} />
        }
        ListEmptyComponent={renderEmptyState}
      />
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Instrument Sans',
  },
  bookingsList: {
    padding: 20,
    paddingBottom: 100,
  },
  bookingCard: {
    marginBottom: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bookingInfo: {
    flex: 1,
  },
  tourTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Instrument Sans',
  },
  destination: {
    fontSize: 14,
    fontFamily: 'Instrument Sans',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Instrument Sans',
  },
  bookingDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Instrument Sans',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Instrument Sans',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Instrument Sans',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  payButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Instrument Sans',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: 'Instrument Sans',
  },
  exploreButton: {
    paddingHorizontal: 32,
  },
});

export default BookingsScreen;
