// Property Card Component
// مكون بطاقة العقار

import { useState } from 'react';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Users, 
  Heart, 
  BadgeCheck,
  Wifi,
  Wind,
  ChefHat,
  Shield,
  Check
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Property, PropertyWithScores } from '@/types';
import { getScoreBgColor, getOwnerBadge, generateRecommendationText } from '@/lib/ai-matcher';

interface PropertyCardProps {
  property: Property;
  matchScore?: PropertyWithScores;
  showMatchScore?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (propertyId: string) => void;
  onClick?: (property: Property) => void;
  variant?: 'default' | 'compact' | 'horizontal';
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  ac: <Wind className="w-4 h-4" />,
  kitchen: <ChefHat className="w-4 h-4" />,
  security: <Shield className="w-4 h-4" />,
};

const priceTypeLabels: Record<string, string> = {
  per_bed: 'للسرير',
  per_room: 'للغرفة',
  per_apartment: 'للشقة',
};

export function PropertyCard({
  property,
  matchScore,
  showMatchScore = false,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  variant = 'default',
}: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const ownerBadge = getOwnerBadge(property.ownerStats);

  if (variant === 'compact') {
    return (
      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onClick?.(property)}
      >
        <div className="relative h-32">
          {!imageError ? (
            <>
              <img
                src={property.images[0]}
                alt={property.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setIsImageLoading(false)}
                onError={() => setImageError(true)}
              />
              {isImageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Bed className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          {showMatchScore && matchScore && (
            <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${getScoreBgColor(matchScore.finalScore)}`}>
              {matchScore.finalScore}% match
            </div>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle?.(property.id);
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
        </div>
        
        <div className="p-3">
          <h3 className="font-medium text-sm truncate">{property.title}</h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{property.city}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-[#1e3a5f]">
              {property.price.toLocaleString()} ج
            </span>
            <span className="text-xs text-gray-500">
              {priceTypeLabels[property.priceType]}
            </span>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onClick?.(property)}
      >
        <div className="flex">
          <div className="relative w-48 h-32 flex-shrink-0">
            {!imageError ? (
              <>
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isImageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setImageError(true)}
                />
                {isImageLoading && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Bed className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            {showMatchScore && matchScore && (
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${getScoreBgColor(matchScore.finalScore)}`}>
                {matchScore.finalScore}%
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{property.title}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location}</span>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle?.(property.id);
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                {property.beds} سرير
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                {property.bathrooms} حمام
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {property.rooms} غرفة
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={ownerBadge.color}>
                  {ownerBadge.text}
                </Badge>
                {property.verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Check className="w-3 h-3 ml-1" />
                    موثق
                  </Badge>
                )}
              </div>
              
              <div className="text-left">
                <span className="text-2xl font-bold text-[#1e3a5f]">
                  {property.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 mr-1">
                  ج/{priceTypeLabels[property.priceType]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
      onClick={() => onClick?.(property)}
    >
      <div className="relative h-56">
        {!imageError ? (
          <>
            <img
              src={property.images[0]}
              alt={property.title}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setImageError(true)}
            />
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Bed className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Match Score Badge */}
        {showMatchScore && matchScore && (
          <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-sm font-bold ${getScoreBgColor(matchScore.finalScore)}`}>
            {matchScore.finalScore}% match
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle?.(property.id);
          }}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
        
        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#f4a261] text-white text-sm font-medium">
            مميز
          </div>
        )}
        
        {/* Image Counter */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
            {property.images.length} صور
          </div>
        )}
      </div>
      
      <div className="p-5">
        {/* Title & Location */}
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{property.title}</h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>
        
        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
            >
              {amenityIcons[amenity] || <Check className="w-3 h-3" />}
              {amenity === 'wifi' && 'WiFi'}
              {amenity === 'ac' && 'تكييف'}
              {amenity === 'kitchen' && 'مطبخ'}
              {amenity === 'security' && 'أمان'}
              {amenity === 'laundry' && 'غسالة'}
              {amenity === 'elevator' && 'أسانسير'}
              {amenity === 'parking' && 'جراج'}
              {amenity === 'gym' && 'جيم'}
            </span>
          ))}
          {property.amenities.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
              +{property.amenities.length - 4}
            </span>
          )}
        </div>
        
        {/* Owner Badge & Rating */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className={ownerBadge.color}>
            {ownerBadge.text}
          </Badge>
          {property.verified && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <BadgeCheck className="w-3 h-3 ml-1" />
              موثق
            </Badge>
          )}
        </div>
        
        {/* Details */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            {property.beds} سرير
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            {property.bathrooms} حمام
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {property.rooms} غرفة
          </span>
        </div>
        
        {/* Match Recommendation */}
        {showMatchScore && matchScore && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              {generateRecommendationText(matchScore)}
            </p>
          </div>
        )}
        
        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <span className="text-2xl font-bold text-[#1e3a5f]">
              {property.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 mr-1">
              ج/{priceTypeLabels[property.priceType]}
            </span>
          </div>
          
          <Button className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90">
            شوف التفاصيل
          </Button>
        </div>
      </div>
    </Card>
  );
}
