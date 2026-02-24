// Zustand Store for Sakanak
// إدارة حالة التطبيق

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  User, 
  Property, 
  Message, 
  Booking, 
  Review,
  SearchCriteria,
  MatchingCriteria 
} from '@/types';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'OWNER' | 'EXPAT';
  phone?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        try {
          // محاكاة تسجيل الدخول
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // للتجربة - ننشئ مستخدم وهمي
          const mockUser: User = {
            id: 'user-001',
            email,
            name: 'مستخدم تجريبي',
            role: email.includes('owner') ? 'OWNER' : 'EXPAT',
            phone: '01001234567',
            createdAt: new Date(),
          };
          
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            id: 'user-' + Date.now(),
            email: data.email,
            name: data.name,
            role: data.role,
            phone: data.phone,
            createdAt: new Date(),
          };
          
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'sakanak-auth',
    }
  )
);

// Properties Store
interface PropertiesState {
  properties: Property[];
  filteredProperties: Property[];
  selectedProperty: Property | null;
  favorites: string[];
  isLoading: boolean;
  
  // Actions
  setProperties: (properties: Property[]) => void;
  filterProperties: (criteria: SearchCriteria) => void;
  selectProperty: (property: Property | null) => void;
  toggleFavorite: (propertyId: string) => void;
  addProperty: (property: Property) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (propertyId: string) => void;
}

export const usePropertiesStore = create<PropertiesState>()(
  persist(
    (set, get) => ({
      properties: [],
      filteredProperties: [],
      selectedProperty: null,
      favorites: [],
      isLoading: false,
      
      setProperties: (properties: Property[]) => {
        set({ properties, filteredProperties: properties });
      },
      
      filterProperties: (criteria: SearchCriteria) => {
        const { properties } = get();
        let filtered = [...properties];
        
        if (criteria.city) {
          filtered = filtered.filter(p => p.city === criteria.city);
        }
        
        if (criteria.university) {
          filtered = filtered.filter(p => 
            p.nearTo.some(u => u.includes(criteria.university!))
          );
        }
        
        if (criteria.minPrice !== undefined) {
          filtered = filtered.filter(p => p.price >= criteria.minPrice!);
        }
        
        if (criteria.maxPrice !== undefined) {
          filtered = filtered.filter(p => p.price <= criteria.maxPrice!);
        }
        
        if (criteria.type) {
          filtered = filtered.filter(p => p.type === criteria.type);
        }
        
        if (criteria.amenities && criteria.amenities.length > 0) {
          filtered = filtered.filter(p => 
            criteria.amenities!.every(a => p.amenities.includes(a))
          );
        }
        
        set({ filteredProperties: filtered });
      },
      
      selectProperty: (property: Property | null) => {
        set({ selectedProperty: property });
      },
      
      toggleFavorite: (propertyId: string) => {
        const { favorites } = get();
        if (favorites.includes(propertyId)) {
          set({ favorites: favorites.filter(id => id !== propertyId) });
        } else {
          set({ favorites: [...favorites, propertyId] });
        }
      },
      
      addProperty: (property: Property) => {
        const { properties } = get();
        set({ properties: [property, ...properties] });
      },
      
      updateProperty: (property: Property) => {
        const { properties } = get();
        set({
          properties: properties.map(p => 
            p.id === property.id ? property : p
          ),
        });
      },
      
      deleteProperty: (propertyId: string) => {
        const { properties } = get();
        set({
          properties: properties.filter(p => p.id !== propertyId),
        });
      },
    }),
    {
      name: 'sakanak-properties',
    }
  )
);

// Onboarding Store
interface OnboardingState {
  step: number;
  criteria: MatchingCriteria;
  matches: Property[];
  isComplete: boolean;
  
  // Actions
  setStep: (step: number) => void;
  setCriteria: (criteria: Partial<MatchingCriteria>) => void;
  setMatches: (matches: Property[]) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

const defaultCriteria: MatchingCriteria = {
  university: '',
  budget: 1500,
  type: 'shared_bed',
  preferences: [],
  additionalNotes: '',
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      step: 1,
      criteria: defaultCriteria,
      matches: [],
      isComplete: false,
      
      setStep: (step: number) => set({ step }),
      
      setCriteria: (criteria: Partial<MatchingCriteria>) => {
        set((state) => ({
          criteria: { ...state.criteria, ...criteria },
        }));
      },
      
      setMatches: (matches: Property[]) => set({ matches }),
      
      completeOnboarding: () => set({ isComplete: true }),
      
      reset: () => set({
        step: 1,
        criteria: defaultCriteria,
        matches: [],
        isComplete: false,
      }),
    }),
    {
      name: 'sakanak-onboarding',
    }
  )
);

// Messages Store
interface MessagesState {
  messages: Message[];
  activeConversation: string | null;
  isLoading: boolean;
  
  // Actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setActiveConversation: (userId: string | null) => void;
  markAsRead: (messageId: string) => void;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  messages: [],
  activeConversation: null,
  isLoading: false,
  
  setMessages: (messages: Message[]) => set({ messages }),
  
  addMessage: (message: Message) => {
    const { messages } = get();
    set({ messages: [...messages, message] });
  },
  
  setActiveConversation: (userId: string | null) => {
    set({ activeConversation: userId });
  },
  
  markAsRead: (messageId: string) => {
    const { messages } = get();
    set({
      messages: messages.map(m =>
        m.id === messageId ? { ...m, read: true } : m
      ),
    });
  },
}));

// Bookings Store
interface BookingsState {
  bookings: Booking[];
  isLoading: boolean;
  
  // Actions
  setBookings: (bookings: Booking[]) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],
  isLoading: false,
  
  setBookings: (bookings: Booking[]) => set({ bookings }),
  
  addBooking: (booking: Booking) => {
    const { bookings } = get();
    set({ bookings: [booking, ...bookings] });
  },
  
  updateBooking: (booking: Booking) => {
    const { bookings } = get();
    set({
      bookings: bookings.map(b =>
        b.id === booking.id ? booking : b
      ),
    });
  },
  
  cancelBooking: (bookingId: string) => {
    const { bookings } = get();
    set({
      bookings: bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      ),
    });
  },
}));

// Reviews Store
interface ReviewsState {
  reviews: Review[];
  isLoading: boolean;
  
  // Actions
  setReviews: (reviews: Review[]) => void;
  addReview: (review: Review) => void;
  getPropertyReviews: (propertyId: string) => Review[];
  getOwnerReviews: (ownerId: string) => Review[];
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
  reviews: [],
  isLoading: false,
  
  setReviews: (reviews: Review[]) => set({ reviews }),
  
  addReview: (review: Review) => {
    const { reviews } = get();
    set({ reviews: [review, ...reviews] });
  },
  
  getPropertyReviews: (propertyId: string) => {
    const { reviews } = get();
    return reviews.filter(r => r.propertyId === propertyId);
  },
  
  getOwnerReviews: (ownerId: string) => {
    const { reviews } = get();
    return reviews.filter(r => r.ownerId === ownerId);
  },
}));

// UI Store
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  
  // Actions
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'ar' | 'en') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'light',
      language: 'ar',
      
      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),
      
      setTheme: (theme: 'light' | 'dark') => set({ theme }),
      
      setLanguage: (language: 'ar' | 'en') => set({ language }),
    }),
    {
      name: 'sakanak-ui',
    }
  )
);
