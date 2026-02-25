// Types for Sakanak Platform
// أنواع البيانات لمنصة سكنك

export type UserRole = 'OWNER' | 'EXPAT';

export type PropertyType = 'shared_bed' | 'private_room' | 'full_apartment';

export type PriceType = 'per_bed' | 'per_room' | 'per_apartment';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'visited';

export type OwnerBadge = 'new' | 'verified' | 'trusted' | 'flagged';

export type ExpatBadge = 'new' | 'reliable' | 'super_tenant';

// المستخدم
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  preferences?: ExpatPreferences;
  createdAt: Date;
}

// تفضيلات المغترب (للـ AI Matching)
export interface ExpatPreferences {
  university: string;
  budget: number;
  propertyType: PropertyType;
  priorities: string[];
  additionalNotes?: string;
}

// العقار/السكن
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: PriceType;
  location: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  nearTo: string[];
  distanceTo?: {
    university: string;
    distance: number;
  };
  type: PropertyType;
  rooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  verified: boolean;
  featured: boolean;
  available: boolean;
  ownerId: string;
  owner?: User;
  ownerStats?: OwnerStats;
  reviews?: Review[];
  createdAt: Date;
}

// إحصائيات المالك
export interface OwnerStats {
  id: string;
  ownerId: string;
  totalReviews: number;
  averageTrustScore: number;
  photosAccuracy: number;
  descriptionAccuracy: number;
  amenitiesMatch: number;
  safetyAccuracy: number;
  overallRating: number;
  badge: OwnerBadge;
}

// إحصائيات المغترب
export interface ExpatStats {
  id: string;
  expatId: string;
  totalReviews: number;
  averageTenantScore: number;
  punctuality: number;
  respectRules: number;
  badge: ExpatBadge;
}

// التقييم
export interface Review {
  id: string;
  bookingId: string;
  propertyId: string;
  reviewerId: string;
  ownerId: string;
  photosAccuracy: number;
  descriptionAccuracy: number;
  amenitiesMatch: number;
  safetyAccuracy: number;
  overallRating: number;
  photosMatch?: boolean;
  amenitiesPresent?: Record<string, boolean>;
  wouldRecommend: boolean;
  comment?: string;
  visitPhotos: string[];
  visitDate: Date;
  createdAt: Date;
  trustScore: number;
}

// تقييم المغترب
export interface TenantReview {
  id: string;
  tenantId: string;
  ownerId: string;
  propertyId: string;
  punctuality: number;
  respectRules: number;
  cleanliness: number;
  communication: number;
  rentedFinally: 'through_platform' | 'direct' | 'no' | 'pending';
  comment?: string;
  createdAt: Date;
  tenantScore: number;
}

// الحجز/طلب المعاينة
export interface Booking {
  id: string;
  propertyId: string;
  property?: Property;
  expatId: string;
  expat?: User;
  status: BookingStatus;
  visitDate?: Date;
  notes?: string;
  createdAt: Date;
  review?: Review;
}

// الرسالة
export interface Message {
  id: string;
  content: string;
  senderId: string;
  sender?: User;
  receiverId: string;
  receiver?: User;
  propertyId: string;
  property?: Property;
  createdAt: Date;
  read: boolean;
}

// المفضلة
export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  property?: Property;
  createdAt: Date;
}

// نتيجة AI Matching
export interface PropertyWithScores {
  property: Property;
  matchScore: number;
  trustScore: number;
  finalScore: number;
}

// معايير البحث
export interface SearchCriteria {
  city?: string;
  university?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: PropertyType;
  amenities?: string[];
  maxDistance?: number;
}

// معايير AI Matching
export interface MatchingCriteria {
  university: string;
  budget: number;
  type: PropertyType;
  preferences: string[];
  additionalNotes?: string;
}

// الجامعات المدعومة
export const SUPPORTED_UNIVERSITIES = [
  { id: 'cairo', name: 'جامعة القاهرة', nameEn: 'Cairo University', city: 'القاهرة' },
  { id: 'ain_shams', name: 'جامعة عين شمس', nameEn: 'Ain Shams University', city: 'القاهرة' },
  { id: 'auc', name: 'الجامعة الأمريكية', nameEn: 'AUC', city: 'القاهرة' },
  { id: 'alexandria', name: 'جامعة الإسكندرية', nameEn: 'Alexandria University', city: 'الإسكندرية' },
  { id: 'mansoura', name: 'جامعة المنصورة', nameEn: 'Mansoura University', city: 'المنصورة' },
  { id: 'tanta', name: 'جامعة طنطا', nameEn: 'Tanta University', city: 'طنطا' },
  { id: 'assiut', name: 'جامعة أسيوط', nameEn: 'Assiut University', city: 'أسيوط' },
  { id: 'qena', name: 'جامعة قنا', nameEn: 'Qena University', city: 'قنا' },
  { id: 'sohag', name: 'جامعة سوهاج', nameEn: 'Sohag University', city: 'سوهاج' },
  { id: 'zagazig', name: 'جامعة الزقازيق', nameEn: 'Zagazig University', city: 'الزقازيق' },
] as const;

// المدن المدعومة
export const SUPPORTED_CITIES = [
  'القاهرة',
  'الإسكندرية',
  'المنصورة',
  'طنطا',
  'أسيوط',
  'قنا',
  'سوهاج',
  'الزقازيق',
] as const;

// أنواع السكن
export const PROPERTY_TYPES = [
  { id: 'shared_bed', name: 'سرير في غرفة مشتركة', nameEn: 'Bed in Shared Room' },
  { id: 'private_room', name: 'غرفة خاصة', nameEn: 'Private Room' },
  { id: 'full_apartment', name: 'شقة كاملة', nameEn: 'Full Apartment' },
] as const;

// المرافق/الخدمات
export const AMENITIES = [
  { id: 'wifi', name: 'WiFi', icon: 'Wifi' },
  { id: 'ac', name: 'تكييف', icon: 'Wind' },
  { id: 'kitchen', name: 'مطبخ', icon: 'ChefHat' },
  { id: 'laundry', name: 'غسالة', icon: 'WashingMachine' },
  { id: 'security', name: 'أمان', icon: 'Shield' },
  { id: 'elevator', name: 'أسانسير', icon: 'ArrowUpDown' },
  { id: 'parking', name: 'جراج', icon: 'Car' },
  { id: 'gym', name: 'جيم', icon: 'Dumbbell' },
] as const;

// أولويات البحث
export const SEARCH_PRIORITIES = [
  { id: 'near_university', name: 'قرب الجامعة', icon: 'MapPin' },
  { id: 'cheap_price', name: 'سعر رخيص', icon: 'Banknote' },
  { id: 'safety', name: 'أمان', icon: 'Shield' },
  { id: 'quiet', name: 'هدوء', icon: 'VolumeX' },
  { id: 'strong_wifi', name: 'WiFi قوي', icon: 'Wifi' },
  { id: 'furnished', name: 'مفروش', icon: 'Sofa' },
] as const;

export interface Notification {
  id: string;
  type: 'message' | 'booking' | 'review' | 'system';
  title: string;
  content: string;
  link: string;
  read: boolean;
  createdAt: Date;
}
