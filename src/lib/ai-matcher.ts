// AI Matching Algorithm for Sakanak
// خوارزمية التوفيق الذكية لمنصة سكنك

import type { Property, MatchingCriteria, PropertyWithScores } from '@/types';

// حساب المسافة بين نقطتين باستخدام صيغة هافرساين
export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// إحداثيات الجامعات
const UNIVERSITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'cairo': { lat: 30.0237, lng: 31.2086 },
  'ain_shams': { lat: 30.0778, lng: 31.2859 },
  'auc': { lat: 30.0192, lng: 31.4994 },
  'alexandria': { lat: 31.2001, lng: 29.9187 },
  'mansoura': { lat: 31.0364, lng: 31.3807 },
  'tanta': { lat: 30.7865, lng: 31.0004 },
  'assiut': { lat: 27.1783, lng: 31.1859 },
  'qena': { lat: 26.1551, lng: 32.716 },
  'sohag': { lat: 26.5569, lng: 31.6948 },
  'zagazig': { lat: 30.5765, lng: 31.5041 },
};

// حساب درجة مطابقة المسافة
function calculateDistanceScore(
  property: Property, 
  universityId: string
): number {
  const uniCoords = UNIVERSITY_COORDINATES[universityId];
  if (!uniCoords || !property.coordinates) {
    return 50; // درجة متوسطة إذا مفيش إحداثيات
  }
  
  const distance = calculateDistance(
    uniCoords.lat,
    uniCoords.lng,
    property.coordinates.lat,
    property.coordinates.lng
  );
  
  // درجة المسافة: 5 كم أو أقل = 100%, 5-10 كم = 70%, 10-15 كم = 40%, أكتر = 20%
  if (distance <= 5) return 100;
  if (distance <= 10) return 70;
  if (distance <= 15) return 40;
  return 20;
}

// حساب درجة مطابقة السعر
function calculatePriceScore(
  property: Property, 
  budget: number
): number {
  const priceRatio = property.price / budget;
  
  // السعر ضمن الميزانية = 100%
  if (priceRatio <= 1) return 100;
  
  // أقل من 10% زيادة = 80%
  if (priceRatio <= 1.1) return 80;
  
  // أقل من 20% زيادة = 60%
  if (priceRatio <= 1.2) return 60;
  
  // أقل من 30% زيادة = 40%
  if (priceRatio <= 1.3) return 40;
  
  // أكتر من 30% = 20%
  return 20;
}

// حساب درجة مطابقة نوع السكن
function calculateTypeScore(
  property: Property, 
  preferredType: string
): number {
  if (property.type === preferredType) return 100;
  
  // التسلسل الهرمي للتفضيلات
  const typeHierarchy: Record<string, string[]> = {
    'shared_bed': ['private_room', 'full_apartment'],
    'private_room': ['shared_bed', 'full_apartment'],
    'full_apartment': ['private_room', 'shared_bed'],
  };
  
  const alternatives = typeHierarchy[preferredType] || [];
  if (alternatives.includes(property.type)) {
    return 60; // بديل مقبول
  }
  
  return 30;
}

// حساب درجة المرافق/الخدمات
function calculateAmenitiesScore(
  property: Property, 
  preferences: string[]
): number {
  if (preferences.length === 0) return 100;
  
  // تحويل الأولويات لمرافق
  const priorityToAmenities: Record<string, string[]> = {
    'near_university': [],
    'cheap_price': [],
    'safety': ['security'],
    'quiet': [],
    'strong_wifi': ['wifi'],
    'furnished': [],
  };
  
  const requiredAmenities = preferences
    .flatMap(p => priorityToAmenities[p] || []);
  
  if (requiredAmenities.length === 0) return 100;
  
  const matchedAmenities = requiredAmenities.filter(
    a => property.amenities.includes(a)
  );
  
  return (matchedAmenities.length / requiredAmenities.length) * 100;
}

// حساب درجة الثقة (Trust Score)
function calculateTrustScore(property: Property): number {
  // إذا مفيش تقييمات، نرجع درجة متوسطة
  if (!property.ownerStats) return 50;
  
  const stats = property.ownerStats;
  return stats.averageTrustScore;
}

// حساب تنافسية السعر مقارنة بالسوق
function calculatePriceCompetitiveness(
  property: Property,
  allProperties: Property[]
): number {
  const sameTypeInCity = allProperties.filter(
    p => p.city === property.city && p.type === property.type
  );
  
  if (sameTypeInCity.length === 0) return 50;
  
  const avgPrice = sameTypeInCity.reduce((sum, p) => sum + p.price, 0) / 
                   sameTypeInCity.length;
  
  // لو السعر أقل من المتوسط، درجة عالية
  if (property.price <= avgPrice) {
    return Math.min(100, (avgPrice / property.price) * 80);
  }
  
  // لو السعر أعلى من المتوسط
  return Math.max(20, 100 - ((property.price - avgPrice) / avgPrice) * 50);
}

// الدالة الرئيسية لحساب درجة المطابقة
export function calculateMatchScore(
  criteria: MatchingCriteria,
  property: Property,
  allProperties: Property[]
): PropertyWithScores {
  // 1. حساب Match Score (40%) - مطابقة التفضيلات
  const distanceScore = calculateDistanceScore(property, criteria.university);
  const priceScore = calculatePriceScore(property, criteria.budget);
  const typeScore = calculateTypeScore(property, criteria.type);
  const amenitiesScore = calculateAmenitiesScore(property, criteria.preferences);
  
  const matchScore = (
    distanceScore * 0.35 + // المسافة 35%
    priceScore * 0.30 +    // السعر 30%
    typeScore * 0.20 +     // نوع السكن 20%
    amenitiesScore * 0.15  // المرافق 15%
  );
  
  // 2. حساب Trust Score (30%) - ثقة المالك
  const trustScore = calculateTrustScore(property);
  
  // 3. حساب Price Competitiveness (20%) - تنافسية السعر
  const priceCompetitiveness = calculatePriceCompetitiveness(property, allProperties);
  
  // 4. Distance Bonus (10%) - مكافأة القرب
  const distanceBonus = distanceScore >= 90 ? 100 : distanceScore >= 70 ? 70 : 40;
  
  // المجموع النهائي
  const finalScore = 
    (matchScore * 0.4) + 
    (trustScore * 0.3) + 
    (priceCompetitiveness * 0.2) + 
    (distanceBonus * 0.1);
  
  return {
    property,
    matchScore: Math.round(matchScore),
    trustScore: Math.round(trustScore),
    finalScore: Math.round(finalScore),
  };
}

// ترتيب العقارات حسب الدرجة النهائية
export function sortPropertiesByMatchScore(
  propertiesWithScores: PropertyWithScores[]
): PropertyWithScores[] {
  return propertiesWithScores.sort((a, b) => b.finalScore - a.finalScore);
}

// الحصول على أفضل المطابقات
export function getTopMatches(
  criteria: MatchingCriteria,
  properties: Property[],
  limit: number = 5
): PropertyWithScores[] {
  const propertiesWithScores = properties.map(property =>
    calculateMatchScore(criteria, property, properties)
  );
  
  const sorted = sortPropertiesByMatchScore(propertiesWithScores);
  return sorted.slice(0, limit);
}

// توليد نص توصية بالعربية
export function generateRecommendationText(
  propertyWithScore: PropertyWithScores
): string {
  const { matchScore, trustScore, finalScore } = propertyWithScore;
  
  const parts: string[] = [];
  
  if (finalScore >= 90) {
    parts.push('تطابق ممتاز!');
  } else if (finalScore >= 75) {
    parts.push('تطابق جيد جداً');
  } else if (finalScore >= 60) {
    parts.push('تطابق مقبول');
  } else {
    parts.push('تطابق ضعيف');
  }
  
  if (trustScore >= 90) {
    parts.push('مالك موثوق 100%');
  } else if (trustScore >= 75) {
    parts.push('مالك موثوق');
  }
  
  if (matchScore >= 80) {
    parts.push('يناسب تفضيلاتك بشكل كبير');
  }
  
  return parts.join(' • ');
}

// الحصول على لون الدرجة
export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-500';
  if (score >= 75) return 'text-emerald-500';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

// الحصول على لون خلفية الدرجة
export function getScoreBgColor(score: number): string {
  if (score >= 90) return 'bg-green-100 text-green-700';
  if (score >= 75) return 'bg-emerald-100 text-emerald-700';
  if (score >= 60) return 'bg-yellow-100 text-yellow-700';
  if (score >= 40) return 'bg-orange-100 text-orange-700';
  return 'bg-red-100 text-red-700';
}

// الحصول على Badge للمالك
export function getOwnerBadge(stats?: { badge: string; totalReviews: number }): {
  text: string;
  color: string;
  icon: string;
} {
  if (!stats || stats.totalReviews === 0) {
    return {
      text: 'مالك جديد',
      color: 'bg-gray-100 text-gray-600',
      icon: 'User',
    };
  }
  
  switch (stats.badge) {
    case 'trusted':
      return {
        text: 'مالك موثوق 100%',
        color: 'bg-green-100 text-green-700',
        icon: 'BadgeCheck',
      };
    case 'verified':
      return {
        text: 'مالك موثق',
        color: 'bg-blue-100 text-blue-700',
        icon: 'CheckCircle',
      };
    case 'flagged':
      return {
        text: 'تنبيه: تقييمات سلبية',
        color: 'bg-red-100 text-red-700',
        icon: 'AlertTriangle',
      };
    default:
      return {
        text: 'مالك جديد',
        color: 'bg-gray-100 text-gray-600',
        icon: 'User',
      };
  }
}
