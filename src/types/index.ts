// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  preferences: UserPreferences;
  createdAt: string;
  isVerified: boolean;
}

export enum UserRole {
  USER = 'user',
  ADVISOR = 'advisor',
  ADMIN = 'admin',
}

export interface UserPreferences {
  currency: string;
  language: string;
  notifications: boolean;
  darkMode: boolean;
  travelInterests: string[];
}

// Tour Types
export interface Tour {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  images: string[];
  videos?: string[];
  price: number;
  originalPrice?: number;
  currency: string;
  duration: number;
  maxGroupSize: number;
  difficulty: TourDifficulty;
  type: TourType;
  category: TourCategory;
  destination: Destination;
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  availability: TourAvailability[];
  // Optional convenience fields for UI when a selected availability is flattened onto the tour
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum TourDifficulty {
  EASY = 'easy',
  MODERATE = 'moderate',
  CHALLENGING = 'challenging',
  EXTREME = 'extreme',
}

export enum TourType {
  DOMESTIC = 'domestic',
  INTERNATIONAL = 'international',
}

export enum TourCategory {
  ADVENTURE = 'adventure',
  CULTURAL = 'cultural',
  NATURE = 'nature',
  HISTORICAL = 'historical',
  BEACH = 'beach',
  CITY = 'city',
  WILDLIFE = 'wildlife',
  LUXURY = 'luxury',
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timezone: string;
  currency: string;
  language: string;
  description: string;
  images: string[];
  attractions: string[];
  bestTimeToVisit: string;
  climate: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
  transportation?: string;
}

export interface TourAvailability {
  id: string;
  tourId: string;
  startDate: string;
  endDate: string;
  availableSpots: number;
  price: number;
  isActive: boolean;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  tourId: string;
  availabilityId: string;
  status: BookingStatus;
  travelers: Traveler[];
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  tour: Tour;
  user: User;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface Traveler {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passportNumber?: string;
  nationality: string;
  dietaryRequirements?: string;
  medicalConditions?: string;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  tourId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  isReported: boolean;
  createdAt: string;
  user: Pick<User, 'firstName' | 'lastName' | 'avatar'>;
}

// Search Types
export interface SearchFilters {
  destination?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  duration?: {
    min: number;
    max: number;
  };
  groupSize?: number;
  difficulty?: TourDifficulty[];
  category?: TourCategory[];
  type?: TourType;
  rating?: number;
  sortBy?: SortOption;
}

export enum SortOption {
  PRICE_LOW_HIGH = 'price_asc',
  PRICE_HIGH_LOW = 'price_desc',
  RATING = 'rating',
  DURATION = 'duration',
  POPULARITY = 'popularity',
  DATE = 'date',
}

// Chat Types
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  message: string;
  type: MessageType;
  timestamp: string;
  isRead: boolean;
  deliveryStatus?: MessageDeliveryStatus;
  deliveredAt?: string;
  readAt?: string;
  attachments?: MessageAttachment[];
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system',
}

export enum MessageDeliveryStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name: string;
  size: number;
}

export interface ChatRoom {
  id: string;
  userId: string;
  advisorId: string;
  status: ChatStatus;
  lastMessage?: ChatMessage;
  createdAt: string;
  updatedAt: string;
}

export enum ChatStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  WAITING = 'waiting',
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  TourDetails: {
    tourId: string;
  };
  BookingDetails: {
    bookingId: string;
  };
  DestinationDetails: {
    destinationId: string;
  };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPVerification: {
    email: string;
    type: 'register' | 'forgot_password';
  };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Bookings: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  TourDetails: {
    tourId: string;
  };
  BookingFlow: {
    tourId: string;
    availabilityId: string;
  };
  DestinationDetails: {
    destinationId: string;
  };
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    fontWeight: {
      light: string;
      regular: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: object;
    md: object;
    lg: object;
  };
}
