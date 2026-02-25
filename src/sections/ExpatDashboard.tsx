// Expat Dashboard
// لوحة تحكم المغترب

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Building2,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PropertyCard } from '@/components/property-card/PropertyCard';
import { useAuthStore, usePropertiesStore, useOnboardingStore, useBookingsStore } from '@/lib/store';
import { seedProperties, seedBookings } from '@/lib/seed-data';
import { getTopMatches } from '@/lib/ai-matcher';
import type { Property, Booking } from '@/types';

export function ExpatDashboard() {
  const { user } = useAuthStore();
  const { properties, setProperties, favorites, toggleFavorite } = usePropertiesStore();
  const { criteria, isComplete } = useOnboardingStore();
  const { bookings, setBookings } = useBookingsStore();
  const [matches, setMatches] = useState<any[]>([]);
  const [recentViews, setRecentViews] = useState<Property[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    // تحميل العقارات
    if (properties.length === 0) setProperties(seedProperties as Property[]);
    if (bookings.length === 0) setBookings(seedBookings as Booking[]);

    // اختيار عقارات عشوائية للمشاهدات الأخيرة
    const shuffled = [...seedProperties].sort(() => 0.5 - Math.random());
    setRecentViews(shuffled.slice(0, 3) as Property[]);
  }, []);

  useEffect(() => {
    // حساب المطابقات إذا كان الـ Onboarding مكتمل
    if (isComplete && criteria.university) {
      setIsMatching(true);
      // محاكاة وقت المعالجة للـ AI
      const timer = setTimeout(() => {
        const topMatches = getTopMatches(criteria, properties, 3);
        setMatches(topMatches);
        setIsMatching(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, criteria, properties]);

  const stats = [
    { label: 'السكنات المحفوظة', value: favorites.length, icon: Heart, color: 'text-red-500', link: '/dashboard/expat/favorites' },
    { label: 'المحادثات', value: 3, icon: MessageSquare, color: 'text-blue-500', link: '/dashboard/expat/messages' },
    { label: 'معاينات مجدولة', value: bookings.filter(b => b.status === 'confirmed').length, icon: Calendar, color: 'text-green-500', link: '/dashboard/expat/bookings' },
    { label: 'آخر مشاهدة', value: 'اليوم', icon: TrendingUp, color: 'text-purple-500', link: '#' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a9d8f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                أهلاً بيك، {user?.name?.split(' ')[0] || 'مغترب'}! 👋
              </h1>
              <p className="text-white/80">
                جاهز تلاقي سكنك المثالي؟
              </p>
            </div>
            <Link to="/dashboard/expat/onboarding">
              <Button className="bg-[#f4a261] hover:bg-[#f4a261]/90 text-white">
                <Sparkles className="w-4 h-4 ml-2" />
                AI Matching
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat, index) => (
              <Link key={index} to={stat.link}>
                <Card className="p-4 bg-white/10 backdrop-blur border-0 hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-white/70">{stat.label}</div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Matches Section */}
        {isComplete && matches.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[#f4a261]" />
                  أفضل المطابقات ليك
                </h2>
                <p className="text-gray-500 mt-1">
                  بناءً على تفضيلاتك: {criteria.budget} ج، {criteria.type === 'shared_bed' ? 'سرير مشترك' : criteria.type === 'private_room' ? 'غرفة خاصة' : 'شقة كاملة'}
                </p>
              </div>
              <Link to="/dashboard/expat/search">
                <Button variant="outline" className="gap-2">
                  عرض الكل
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isMatching ? (
                // Skeletons
                [1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-1/3" />
                      <Skeleton className="h-8 w-1/4" />
                    </div>
                  </div>
                ))
              ) : (
                matches.map((match) => (
                  <PropertyCard
                    key={match.property.id}
                    property={match.property}
                    matchScore={match}
                    showMatchScore={true}
                    isFavorite={favorites.includes(match.property.id)}
                    onFavoriteToggle={toggleFavorite}
                  />
                ))
              )}
            </div>
          </section>
        )}

        {/* Featured Properties */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1e3a5f]">
              سكنات مميزة
            </h2>
            <Link to="/dashboard/expat/search">
              <Button variant="outline" className="gap-2">
                عرض الكل
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties
              .filter((p) => p.featured)
              .slice(0, 3)
              .map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={favorites.includes(property.id)}
                  onFavoriteToggle={toggleFavorite}
                />
              ))}
          </div>
        </section>

        {/* Recently Viewed */}
        {recentViews.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">
              شوفتها مؤخراً
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recentViews.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  variant="compact"
                  isFavorite={favorites.includes(property.id)}
                  onFavoriteToggle={toggleFavorite}
                />
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">
            إجراءات سريعة
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link to="/dashboard/expat/search">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="font-bold text-[#1e3a5f]">بحث متقدم</h3>
                <p className="text-sm text-gray-500 mt-1">فلترة حسب المدينة والسعر</p>
              </Card>
            </Link>

            <Link to="/dashboard/expat/favorites">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="font-bold text-[#1e3a5f]">المفضلة</h3>
                <p className="text-sm text-gray-500 mt-1">{favorites.length} سكن محفوظ</p>
              </Card>
            </Link>

            <Link to="/dashboard/expat/messages">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="font-bold text-[#1e3a5f]">الرسائل</h3>
                <p className="text-sm text-gray-500 mt-1">3 رسائل جديدة</p>
              </Card>
            </Link>

            <Link to="/dashboard/expat/onboarding">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-7 h-7 text-purple-500" />
                </div>
                <h3 className="font-bold text-[#1e3a5f]">AI Matching</h3>
                <p className="text-sm text-gray-500 mt-1">البحث الذكي عن السكن</p>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
