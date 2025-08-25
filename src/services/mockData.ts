import { Tour, User, Destination, UserRole, TourDifficulty, TourType, TourCategory } from '@/types';

// Mock Destinations
export const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    continent: 'South America',
    coordinates: { latitude: -22.9068, longitude: -43.1729 },
    timezone: 'America/Sao_Paulo',
    currency: 'BRL',
    language: 'Portuguese',
    description: 'Rio de Janeiro, often simply called Rio, is one of Brazil\'s most iconic cities, renowned for its stunning beaches, vibrant culture, and breathtaking landscapes.',
    images: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    attractions: ['Christ the Redeemer', 'Sugarloaf Mountain', 'Copacabana Beach', 'Ipanema Beach'],
    bestTimeToVisit: 'December to March',
    climate: 'Tropical'
  },
  {
    id: '2',
    name: 'Patagonia',
    country: 'Argentina',
    continent: 'South America',
    coordinates: { latitude: -50.9423, longitude: -73.4068 },
    timezone: 'America/Argentina/Buenos_Aires',
    currency: 'ARS',
    language: 'Spanish',
    description: 'Patagonia is a region at the southern end of South America, shared by Argentina and Chile, known for its dramatic landscapes and pristine wilderness.',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    attractions: ['Torres del Paine', 'Perito Moreno Glacier', 'Mount Fitz Roy', 'Ushuaia'],
    bestTimeToVisit: 'November to March',
    climate: 'Subpolar'
  },
  {
    id: '3',
    name: 'Santorini',
    country: 'Greece',
    continent: 'Europe',
    coordinates: { latitude: 36.3932, longitude: 25.4615 },
    timezone: 'Europe/Athens',
    currency: 'EUR',
    language: 'Greek',
    description: 'Santorini is a Greek island in the southern Aegean Sea, famous for its dramatic views, stunning sunsets, and distinctive architecture.',
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    attractions: ['Oia Village', 'Red Beach', 'Akrotiri Archaeological Site', 'Fira Town'],
    bestTimeToVisit: 'April to October',
    climate: 'Mediterranean'
  }
];

// Mock Tours
export const mockTours: Tour[] = [
  {
    id: '1',
    title: 'Iconic Brazil Adventure',
    description: 'Experience the vibrant culture and stunning landscapes of Brazil on this comprehensive 8-day adventure through Rio de Janeiro and surrounding areas.',
    shortDescription: 'Explore Rio\'s iconic landmarks, beaches, and vibrant culture in this unforgettable Brazilian adventure.',
    images: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    videos: [],
    price: 2850,
    originalPrice: 3200,
    currency: 'USD',
    duration: 8,
    maxGroupSize: 12,
    difficulty: TourDifficulty.MODERATE,
    type: TourType.INTERNATIONAL,
    category: TourCategory.CULTURAL,
    destination: mockDestinations[0],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Rio de Janeiro',
        description: 'Arrive in Rio and transfer to your hotel',
        activities: ['Airport transfer', 'Hotel check-in', 'Welcome dinner'],
        meals: ['Dinner'],
        accommodation: 'Copacabana Palace Hotel',
        transportation: 'Private transfer'
      },
      {
        day: 2,
        title: 'Christ the Redeemer & Sugarloaf',
        description: 'Visit Rio\'s most iconic landmarks',
        activities: ['Christ the Redeemer statue', 'Sugarloaf Mountain', 'Cable car ride'],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Copacabana Palace Hotel',
        transportation: 'Tour bus'
      }
    ],
    inclusions: ['Accommodation', 'Daily breakfast', 'Professional guide', 'Transportation', 'Entrance fees'],
    exclusions: ['International flights', 'Personal expenses', 'Travel insurance', 'Alcoholic beverages'],
    rating: 4.8,
    reviewCount: 143,
    reviews: [],
    availability: [
      {
        id: '1',
        tourId: '1',
        startDate: '2024-03-15',
        endDate: '2024-03-23',
        availableSpots: 8,
        price: 2850,
        isActive: true
      }
    ],
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    title: 'Patagonia Wilderness Trek',
    description: 'Embark on an epic 12-day trekking adventure through the pristine wilderness of Patagonia, exploring glaciers, mountains, and unique wildlife.',
    shortDescription: 'Trek through Patagonia\'s stunning landscapes and witness some of the world\'s most dramatic scenery.',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    videos: [],
    price: 4200,
    currency: 'USD',
    duration: 12,
    maxGroupSize: 8,
    difficulty: TourDifficulty.CHALLENGING,
    type: TourType.INTERNATIONAL,
    category: TourCategory.ADVENTURE,
    destination: mockDestinations[1],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in El Calafate',
        description: 'Arrive and prepare for the adventure',
        activities: ['Airport transfer', 'Gear check', 'Briefing'],
        meals: ['Dinner'],
        accommodation: 'Mountain Lodge',
        transportation: 'Private transfer'
      }
    ],
    inclusions: ['Accommodation', 'All meals', 'Professional guide', 'Camping equipment', 'Transportation'],
    exclusions: ['International flights', 'Personal gear', 'Travel insurance', 'Tips'],
    rating: 4.9,
    reviewCount: 87,
    reviews: [],
    availability: [
      {
        id: '2',
        tourId: '2',
        startDate: '2024-04-01',
        endDate: '2024-04-13',
        availableSpots: 5,
        price: 4200,
        isActive: true
      }
    ],
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  },
  {
    id: '3',
    title: 'Santorini Island Escape',
    description: 'Discover the magic of Santorini with its stunning sunsets, white-washed buildings, and crystal-clear waters on this relaxing 5-day getaway.',
    shortDescription: 'Relax and unwind in the beautiful Greek island of Santorini with its iconic architecture and sunsets.',
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    videos: [],
    price: 1850,
    currency: 'USD',
    duration: 5,
    maxGroupSize: 16,
    difficulty: TourDifficulty.EASY,
    type: TourType.INTERNATIONAL,
    category: TourCategory.BEACH,
    destination: mockDestinations[2],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Santorini',
        description: 'Arrive and settle into your accommodation',
        activities: ['Airport transfer', 'Hotel check-in', 'Sunset viewing'],
        meals: ['Dinner'],
        accommodation: 'Luxury Resort',
        transportation: 'Private transfer'
      }
    ],
    inclusions: ['Accommodation', 'Daily breakfast', 'Airport transfers', 'Sunset cruise', 'Wine tasting'],
    exclusions: ['International flights', 'Lunch and dinner', 'Personal expenses', 'Travel insurance'],
    rating: 4.7,
    reviewCount: 256,
    reviews: [],
    availability: [
      {
        id: '3',
        tourId: '3',
        startDate: '2024-05-10',
        endDate: '2024-05-15',
        availableSpots: 12,
        price: 1850,
        isActive: true
      }
    ],
    isActive: true,
    isFeatured: true,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z'
  }
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'vanessa@example.com',
    firstName: 'Vanessa',
    lastName: 'Johnson',
    phone: '+1234567890',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    role: UserRole.USER,
    preferences: {
      currency: 'USD',
      language: 'en',
      notifications: true,
      darkMode: false,
      travelInterests: ['adventure', 'cultural', 'nature']
    },
    createdAt: '2024-01-01T00:00:00Z',
    isVerified: true
  },
  {
    id: '2',
    email: 'martin@example.com',
    firstName: 'Martin',
    lastName: 'Smith',
    role: UserRole.ADVISOR,
    preferences: {
      currency: 'USD',
      language: 'en',
      notifications: true,
      darkMode: false,
      travelInterests: []
    },
    createdAt: '2024-01-01T00:00:00Z',
    isVerified: true
  }
];

// Featured tours for home screen
export const getFeaturedTours = (): Tour[] => {
  return mockTours.filter(tour => tour.isFeatured);
};

// Popular destinations
export const getPopularDestinations = (): Destination[] => {
  return mockDestinations.slice(0, 3);
};

// Search tours with filters
export const searchTours = (query?: string, filters?: any): Tour[] => {
  let filteredTours = [...mockTours];

  if (query) {
    filteredTours = filteredTours.filter(tour =>
      tour.title.toLowerCase().includes(query.toLowerCase()) ||
      tour.destination.name.toLowerCase().includes(query.toLowerCase()) ||
      tour.destination.country.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Add more filter logic here as needed

  return filteredTours;
};
