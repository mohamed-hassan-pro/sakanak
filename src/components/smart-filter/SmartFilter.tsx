// Smart Filter Component
// مكون الفلتر الذكي للبحث عن السكن

import { useState } from 'react';
import { 
  SlidersHorizontal, 
  Wallet, 
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  SUPPORTED_CITIES, 
  PROPERTY_TYPES, 
  AMENITIES,
  type SearchCriteria 
} from '@/types';

interface SmartFilterProps {
  criteria: SearchCriteria;
  onChange: (criteria: SearchCriteria) => void;
  onReset: () => void;
  resultsCount: number;
}

export function SmartFilter({ 
  criteria, 
  onChange, 
  onReset,
  resultsCount 
}: SmartFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = 
    criteria.city || 
    criteria.university ||
    criteria.minPrice !== undefined ||
    criteria.maxPrice !== undefined ||
    criteria.type ||
    (criteria.amenities && criteria.amenities.length > 0);

  const activeFiltersCount = [
    criteria.city,
    criteria.university,
    criteria.type,
    criteria.minPrice !== undefined || criteria.maxPrice !== undefined,
    criteria.amenities && criteria.amenities.length > 0,
  ].filter(Boolean).length;

  const toggleAmenity = (amenityId: string) => {
    const current = criteria.amenities || [];
    if (current.includes(amenityId)) {
      onChange({
        ...criteria,
        amenities: current.filter((a) => a !== amenityId),
      });
    } else {
      onChange({
        ...criteria,
        amenities: [...current, amenityId],
      });
    }
  };

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#1e3a5f]" />
          <h3 className="font-semibold">فلترة النتائج</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-[#f4a261] text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="w-4 h-4 ml-1" />
              إعادة ضبط
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'إخفاء' : 'عرض الكل'}
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* City Filter */}
        <select
          value={criteria.city || ''}
          onChange={(e) => onChange({ ...criteria, city: e.target.value || undefined })}
          className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
        >
          <option value="">كل المدن</option>
          {SUPPORTED_CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* Property Type Filter */}
        <select
          value={criteria.type || ''}
          onChange={(e) => onChange({ ...criteria, type: e.target.value as any || undefined })}
          className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
        >
          <option value="">كل الأنواع</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        {/* Price Range Quick Select */}
        <select
          value={`${criteria.minPrice || 0}-${criteria.maxPrice || 3000}`}
          onChange={(e) => {
            const [min, max] = e.target.value.split('-').map(Number);
            onChange({ 
              ...criteria, 
              minPrice: min || undefined, 
              maxPrice: max || undefined 
            });
          }}
          className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
        >
          <option value="0-3000">كل الأسعار</option>
          <option value="500-1000">500 - 1000 ج</option>
          <option value="1000-1500">1000 - 1500 ج</option>
          <option value="1500-2000">1500 - 2000 ج</option>
          <option value="2000-3000">2000 - 3000 ج</option>
        </select>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t pt-4 space-y-6">
          {/* Price Range Slider */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-3">
              <Wallet className="w-4 h-4" />
              نطاق السعر
            </label>
            <div className="px-2">
              <Slider
                value={[
                  criteria.minPrice || 500,
                  criteria.maxPrice || 3000,
                ]}
                onValueChange={([min, max]) =>
                  onChange({ ...criteria, minPrice: min, maxPrice: max })
                }
                min={500}
                max={3000}
                step={50}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>{criteria.minPrice || 500} ج</span>
                <span>{criteria.maxPrice || 3000} ج</span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-3">
              <Check className="w-4 h-4" />
              المرافق المطلوبة
            </label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((amenity) => {
                const isSelected = criteria.amenities?.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-[#1e3a5f] bg-[#1e3a5f]/5 text-[#1e3a5f]'
                        : 'border-gray-200 hover:border-[#1e3a5f]/50'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                    <span className="text-sm">{amenity.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-4 pt-4 border-t text-center text-sm text-gray-500">
        تم العثور على <span className="font-semibold text-[#1e3a5f]">{resultsCount}</span> سكن
      </div>
    </Card>
  );
}

// Active Filters Display
interface ActiveFiltersProps {
  criteria: SearchCriteria;
  onRemove: (key: keyof SearchCriteria) => void;
}

export function ActiveFilters({ criteria, onRemove }: ActiveFiltersProps) {
  const filters: { key: keyof SearchCriteria; label: string; value: string }[] = [];

  if (criteria.city) {
    filters.push({ key: 'city', label: 'المدينة', value: criteria.city });
  }

  if (criteria.type) {
    const typeLabel = PROPERTY_TYPES.find(t => t.id === criteria.type)?.name || criteria.type;
    filters.push({ key: 'type', label: 'النوع', value: typeLabel });
  }

  if (criteria.minPrice !== undefined || criteria.maxPrice !== undefined) {
    const min = criteria.minPrice || 500;
    const max = criteria.maxPrice || 3000;
    filters.push({ key: 'minPrice', label: 'السعر', value: `${min}-${max} ج` });
  }

  if (criteria.amenities && criteria.amenities.length > 0) {
    const amenityLabels = criteria.amenities.map(id => 
      AMENITIES.find(a => a.id === id)?.name || id
    );
    filters.push({ key: 'amenities', label: 'المرافق', value: amenityLabels.join(', ') });
  }

  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="flex items-center gap-1 bg-[#1e3a5f]/10 text-[#1e3a5f] hover:bg-[#1e3a5f]/20"
        >
          <span className="text-xs opacity-70">{filter.label}:</span>
          <span>{filter.value}</span>
          <button
            onClick={() => onRemove(filter.key)}
            className="mr-1 hover:text-red-500"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
