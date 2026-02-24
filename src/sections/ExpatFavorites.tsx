// Expat Favorites Page
// صفحة المفضلة للمغتربين

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PropertyCard } from '@/components/property-card/PropertyCard';
import { usePropertiesStore } from '@/lib/store';
import { seedProperties } from '@/lib/seed-data';
import type { Property } from '@/types';

export function ExpatFavorites() {
  const { properties, favorites, toggleFavorite, setProperties } = usePropertiesStore();
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);

  useEffect(() => {
    setProperties(seedProperties as Property[]);
  }, []);

  useEffect(() => {
    const favs = properties.filter((p) => favorites.includes(p.id));
    setFavoriteProperties(favs);
  }, [favorites, properties]);

  const handleRemoveAll = () => {
    favorites.forEach((id) => toggleFavorite(id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a5f]">المفضلة</h1>
              <p className="text-gray-500 mt-1">
                {favoriteProperties.length} سكن محفوظ
              </p>
            </div>
            
            {favoriteProperties.length > 0 && (
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleRemoveAll}
              >
                <Trash2 className="w-4 h-4 ml-2" />
                إزالة الكل
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favoriteProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={true}
                onFavoriteToggle={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
              مفيش سكنات محفوظة
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              لما تلاقي سكن يعجبك، اضغط على علامة القلب عشان تحفظه هنا
            </p>
            <Link to="/dashboard/expat/search">
              <Button className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90">
                <MapPin className="w-4 h-4 ml-2" />
                ابحث عن سكن
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
