// Owner Dashboard
// لوحة تحكم المالك

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Eye,
  MessageSquare,
  Plus,
  ArrowLeft,
  Star,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, usePropertiesStore } from '@/lib/store';
import { seedProperties } from '@/lib/seed-data';
import type { Property } from '@/types';

export function OwnerDashboard() {
  const { user } = useAuthStore();
  const { properties, setProperties } = usePropertiesStore();
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalMessages: 0,
    totalProperties: 0,
    avgRating: 0,
  });

  useEffect(() => {
    setProperties(seedProperties as Property[]);
  }, []);

  useEffect(() => {
    // فلترة عقارات المالك الحالي (للتجربة)
    const ownerProps = properties.filter((_p) => _p.ownerId === user?.id || _p.ownerId === 'owner-001');
    setMyProperties(ownerProps);

    // حساب الإحصائيات
    setStats({
      totalViews: ownerProps.reduce((sum) => sum + Math.floor(Math.random() * 100), 0),
      totalMessages: 12,
      totalProperties: ownerProps.length,
      avgRating: 4.5,
    });
  }, [properties, user]);

  const statCards = [
    {
      label: 'عقاراتي',
      value: stats.totalProperties,
      icon: Building2,
      color: 'bg-blue-500',
      trend: '+2 هذا الشهر',
    },
    {
      label: 'المشاهدات',
      value: stats.totalViews,
      icon: Eye,
      color: 'bg-green-500',
      trend: '+15% هذا الأسبوع',
    },
    {
      label: 'الرسائل',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'bg-purple-500',
      trend: '3 جديدة',
    },
    {
      label: 'متوسط التقييم',
      value: stats.avgRating,
      icon: Star,
      color: 'bg-yellow-500',
      trend: 'ممتاز',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a5f]">
                أهلاً بيك، {user?.name?.split(' ')[0] || 'مالك'}! 👋
              </h1>
              <p className="text-gray-500 mt-1">
                إليك ملخص نشاطك اليوم
              </p>
            </div>
            <Link to="/dashboard/owner/add-property">
              <Button className="bg-[#f4a261] hover:bg-[#f4a261]/90">
                <Plus className="w-4 h-4 ml-2" />
                إضافة عقار
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#1e3a5f] mt-1">
                    {stat.value}
                  </p>
                  <p className="text-green-500 text-sm mt-2">{stat.trend}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Recent Messages */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1e3a5f]">آخر الرسائل</h2>
              <Link to="/dashboard/owner/messages">
                <Button variant="ghost" size="sm" className="gap-1">
                  عرض الكل
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {[
                {
                  name: 'أحمد السوداني',
                  message: 'السلام عليكم، عايز أعرف السكن ده متاح لسه؟',
                  time: 'منذ 5 دقائق',
                  unread: true,
                },
                {
                  name: 'سارة الأردنية',
                  message: 'ممكن أجي أشوف السكن بكرة؟',
                  time: 'منذ ساعة',
                  unread: true,
                },
                {
                  name: 'يوسف اليمني',
                  message: 'شكراً على الاستضافة!',
                  time: 'منذ 3 ساعات',
                  unread: false,
                },
              ].map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    msg.unread ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {msg.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{msg.name}</h4>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{msg.message}</p>
                  </div>
                  {msg.unread && (
                    <Badge className="bg-red-500 text-white">جديد</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Visits */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1e3a5f]">معاينات قادمة</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {[
                {
                  name: 'محمد من السودان',
                  property: 'سرير في غرفة مفروشة',
                  date: 'السبت، 25 فبراير',
                  time: '10:00 ص',
                },
                {
                  name: 'فاطمة من المغرب',
                  property: 'غرفة خاصة',
                  date: 'الأحد، 26 فبراير',
                  time: '2:00 م',
                },
              ].map((visit, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-[#2a9d8f] rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{visit.name}</h4>
                    <p className="text-sm text-gray-600">{visit.property}</p>
                    <p className="text-xs text-[#2a9d8f] mt-1">
                      {visit.date} - {visit.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* My Properties */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1e3a5f]">عقاراتي</h2>
            <Link to="/dashboard/owner/properties">
              <Button variant="outline" className="gap-2">
                عرض الكل
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {myProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.slice(0, 3).map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="relative h-40">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    {property.verified && (
                      <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                        موثق
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#1e3a5f] mb-1">{property.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{property.city}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">
                        {property.price.toLocaleString()} ج
                      </span>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Eye className="w-4 h-4" />
                        {Math.floor(Math.random() * 100)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">
                مفيش عقارات
              </h3>
              <p className="text-gray-500 mb-6">
                ابدأ بإضافة عقارك الأول
              </p>
              <Link to="/dashboard/owner/add-property">
                <Button className="bg-[#f4a261] hover:bg-[#f4a261]/90">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة عقار
                </Button>
              </Link>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
