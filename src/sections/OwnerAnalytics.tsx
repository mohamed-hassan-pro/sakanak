// Owner Analytics Page
// صفحة التحليلات للمالك

import { useEffect } from 'react';
import {
    TrendingUp,
    Eye,
    MessageSquare,
    Star,
    ArrowUpRight,
    ArrowDownRight,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Tabs,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import { useAuthStore, usePropertiesStore, useBookingsStore, useReviewsStore } from '@/lib/store';
import { seedProperties, seedBookings, seedReviews } from '@/lib/seed-data';
import type { Property, Booking, Review } from '@/types';

export function OwnerAnalytics() {
    const { user } = useAuthStore();
    const { properties, setProperties } = usePropertiesStore();
    const { bookings, setBookings } = useBookingsStore();
    const { reviews, setReviews } = useReviewsStore();

    useEffect(() => {
        if (properties.length === 0) setProperties(seedProperties as Property[]);
        if (bookings.length === 0) setBookings(seedBookings as Booking[]);
        if (reviews.length === 0) setReviews(seedReviews as Review[]);
    }, []);

    const ownerProperties = properties.filter(p => p.ownerId === (user?.id || 'owner-001'));
    const ownerBookings = bookings.filter(b => ownerProperties.some(p => p.id === b.propertyId));
    const ownerReviews = reviews.filter(r => r.ownerId === (user?.id || 'owner-001'));

    const averageTrustScore = ownerReviews.length > 0
        ? Math.round(ownerReviews.reduce((acc, r) => acc + (r.trustScore || 0), 0) / ownerReviews.length)
        : 0;

    const stats = [
        { label: 'إجمالي المشاهدات', value: '1,284', change: '+12%', icon: Eye, color: 'text-blue-500' },
        { label: 'طلبات المعاينة', value: ownerBookings.length, change: '+5%', icon: Calendar, color: 'text-green-500' },
        { label: 'معدل الرد', value: '98%', change: '+2%', icon: MessageSquare, color: 'text-purple-500' },
        { label: 'Trust Score', value: `${averageTrustScore}%`, icon: Star, color: 'text-orange-500' }
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[#1e3a5f]">التحليلات والأداء</h1>
                <p className="text-gray-500">تابع أداء سكناتك وتفاعل الطلاب معاها</p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="p-6 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            {stat.change && (
                                <Badge className={stat.change.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                                    {stat.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
                                    {stat.change}
                                </Badge>
                            )}
                        </div>
                        <div className="text-2xl font-bold text-[#1e3a5f] mb-1">{stat.value}</div>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Market Comparison */}
                <Card className="lg:col-span-2 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#1e3a5f]">أداء السكنات الفردية</h2>
                        <Tabs defaultValue="views">
                            <TabsList>
                                <TabsTrigger value="views">المشاهدات</TabsTrigger>
                                <TabsTrigger value="bookings">الطلبات</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="space-y-6">
                        {ownerProperties.slice(0, 4).map((prop, idx) => (
                            <div key={prop.id} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-700 truncate max-w-[200px]">{prop.title}</span>
                                    <span className="text-gray-500 font-bold">{idx === 0 ? '450' : idx === 1 ? '320' : '280'} مشاهدة</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${idx === 0 ? 'bg-blue-500' : 'bg-blue-400'}`}
                                        style={{ width: `${idx === 0 ? 100 : idx === 1 ? 70 : 60}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-4">
                        <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-blue-900 text-sm">نصيحة المنصة</h4>
                            <p className="text-blue-800 text-xs mt-1">
                                سكنك في "الدقي" بيجيب مشاهدات أكتر بـ 25% من متوسط المنطقة. حاول ترفع صور إضافية للمطبخ عشان تزود طلبات المعاينة.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Reviews Summary */}
                <Card className="p-6">
                    <h2 className="text-xl font-bold text-[#1e3a5f] mb-6">تقييمات الثقة (Trust Score)</h2>
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle
                                    className="text-gray-100 stroke-current"
                                    strokeWidth="8"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                />
                                <circle
                                    className="text-green-500 stroke-current"
                                    strokeWidth="8"
                                    strokeDasharray={`${averageTrustScore * 2.51} 251.2`}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-[#1e3a5f]">{averageTrustScore}%</span>
                                <span className="text-[10px] text-gray-400 px-2 text-center uppercase tracking-tighter">Average Score</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-3 rounded-lg border bg-gray-50/50">
                            <div className="flex justify-between text-xs mb-1 font-medium">
                                <span>دقة الصور</span>
                                <span className="text-green-600">ممتاز</span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full">
                                <div className="bg-green-500 h-full rounded-full" style={{ width: '95%' }}></div>
                            </div>
                        </div>
                        <div className="p-3 rounded-lg border bg-gray-50/50">
                            <div className="flex justify-between text-xs mb-1 font-medium">
                                <span>صدق الوصف</span>
                                <span className="text-blue-600">جيد جداً</span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full">
                                <div className="bg-blue-500 h-full rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <div className="p-3 rounded-lg border bg-gray-50/50">
                            <div className="flex justify-between text-xs mb-1 font-medium">
                                <span>الأمان</span>
                                <span className="text-orange-600">جيد</span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full">
                                <div className="bg-orange-500 h-full rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Reviews Table */}
            <Card className="overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-[#1e3a5f]">آخر تقييمات الطلاب بعد المعاينة</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">الطالب / التاريخ</th>
                                <th className="px-6 py-4">السكن</th>
                                <th className="px-6 py-4">تقييم الصور</th>
                                <th className="px-6 py-4">قرار الطالب</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {ownerReviews.slice(0, 3).map((review) => {
                                const prop = properties.find(p => p.id === review.propertyId);
                                return (
                                    <tr key={review.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <p className="font-bold">أحمد علي</p>
                                            <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('ar-EG')}</p>
                                        </td>
                                        <td className="px-6 py-4 truncate max-w-[200px]">{prop?.title}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} className={`w-3 h-3 ${review.photosAccuracy >= s ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {review.wouldRecommend ? (
                                                <Badge className="bg-green-50 text-green-700 border-green-200">مهتم جداً</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-gray-400">غير مهتم</Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button variant="ghost" size="sm" className="text-blue-600">التفاصيل</Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
