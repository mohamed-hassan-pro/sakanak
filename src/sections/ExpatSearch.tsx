// Expat Search Page
// صفحة البحث عن السكن للمغتربين

import { useState, useEffect } from 'react';
import { MapPin, Grid3X3, Map as MapIcon, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property-card/PropertyCard';
import { SmartFilter, ActiveFilters } from '@/components/smart-filter/SmartFilter';
import { usePropertiesStore } from '@/lib/store';
import { seedProperties } from '@/lib/seed-data';
import type { Property, SearchCriteria } from '@/types';

export function ExpatSearch() {
  const { properties, filteredProperties, setProperties, favorites, toggleFavorite } = usePropertiesStore();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [criteria, setCriteria] = useState<SearchCriteria>({});

  useEffect(() => {
    setProperties(seedProperties as Property[]);
  }, []);

  useEffect(() => {
    // تطبيق الفلترة
    let filtered = [...properties];

    if (criteria.city) {
      filtered = filtered.filter((p) => p.city === criteria.city);
    }

    if (criteria.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= criteria.minPrice!);
    }

    if (criteria.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= criteria.maxPrice!);
    }

    if (criteria.type) {
      filtered = filtered.filter((p) => p.type === criteria.type);
    }

    if (criteria.amenities && criteria.amenities.length > 0) {
      filtered = filtered.filter((p) =>
        criteria.amenities!.every((a) => p.amenities.includes(a))
      );
    }

    // تحديث الـ store
    // usePropertiesStore.setState({ filteredProperties: filtered });
  }, [criteria, properties]);

  const handleFilterChange = (newCriteria: SearchCriteria) => {
    setCriteria(newCriteria);
  };

  const handleResetFilters = () => {
    setCriteria({});
  };

  const handleRemoveFilter = (key: keyof SearchCriteria) => {
    const newCriteria = { ...criteria };
    delete newCriteria[key];
    setCriteria(newCriteria);
  };

  const displayProperties = criteria.city || criteria.type || criteria.minPrice !== undefined
    ? filteredProperties
    : properties;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a5f]">البحث عن سكن</h1>
              <p className="text-gray-500 text-sm mt-1">
                {displayProperties.length} سكن متاح
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-[#1e3a5f]'
                      : 'text-gray-500'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span className="hidden sm:inline">شبكة</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                    viewMode === 'map'
                      ? 'bg-white shadow-sm text-[#1e3a5f]'
                      : 'text-gray-500'
                  }`}
                >
                  <MapIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">خريطة</span>
                </button>
              </div>

              {/* Filter Toggle Mobile */}
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          <div className="mt-4">
            <ActiveFilters criteria={criteria} onRemove={handleRemoveFilter} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-80 flex-shrink-0`}>
            <SmartFilter
              criteria={criteria}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              resultsCount={displayProperties.length}
            />
          </aside>

          {/* Results */}
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isFavorite={favorites.includes(property.id)}
                    onFavoriteToggle={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              // Map View Placeholder
              <div className="bg-gray-200 rounded-xl h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">الخريطة قريباً!</p>
                  <p className="text-sm text-gray-500">
                    هنضيف خريطة تفاعلية قريباً
                  </p>
                </div>
              </div>
            )}

            {displayProperties.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  مفيش نتائج
                </h3>
                <p className="text-gray-500">
                  جرب تغيير معايير البحث
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
