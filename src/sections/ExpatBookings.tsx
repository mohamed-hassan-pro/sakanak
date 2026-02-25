// Expat Bookings Page
// صفحة حجوزاتي للمغتربين

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    MapPin,
    Clock,
    CheckCircle2,
    MessageCircle,
    Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useBookingsStore, useAuthStore, usePropertiesStore, useMessagesStore } from '@/lib/store';
import { seedBookings, seedProperties } from '@/lib/seed-data';
import type { Booking, Property } from '@/types';

export function ExpatBookings() {
    const { user } = useAuthStore();
    const { bookings, setBookings, cancelBooking } = useBookingsStore();
    const { properties, setProperties } = usePropertiesStore();
    const { setActiveConversation } = useMessagesStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (properties.length === 0) {
            setProperties(seedProperties as Property[]);
        }
        if (bookings.length === 0) {
            // فلترة الحجوزات الخاصة بالمستخدم الحالي
            const userBookings = seedBookings.filter(b => b.expatId === (user?.id || 'expat-001'));
            setBookings(userBookings as Booking[]);
        }
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">قيد الانتظار</Badge>;
            case 'confirmed':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">مؤكد</Badge>;
            case 'cancelled':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">ملغي</Badge>;
            case 'completed':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">تمت الزيارة</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleStartChat = (ownerId: string) => {
        setActiveConversation(ownerId);
        navigate('/dashboard/expat/messages');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1e3a5f]">حجوزاتي</h1>
                        <p className="text-gray-500 mt-1">تابع حالة طلبات المعاينة للسكنات</p>
                    </div>
                    <Calendar className="w-10 h-10 text-gray-400 opacity-20" />
                </div>

                {bookings.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">مفيش حجوزات لسه</h3>
                        <p className="text-gray-500 mb-6">ابدأ بالبحث عن سكن واحجز ميعاد للمعاينة</p>
                        <Button onClick={() => navigate('/dashboard/expat/search')} className="bg-[#1e3a5f]">
                            ابحث عن سكن
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => {
                            const property = properties.find(p => p.id === booking.propertyId);
                            if (!property) return null;

                            return (
                                <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Property Image */}
                                        <div className="md:w-48 h-32 md:h-auto relative">
                                            <img
                                                src={property.images[0]}
                                                alt={property.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Booking Info */}
                                        <div className="flex-1 p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-lg text-[#1e3a5f] hover:underline cursor-pointer"
                                                        onClick={() => navigate(`/dashboard/expat/property/${property.id}`)}>
                                                        {property.title}
                                                    </h3>
                                                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        <span>{property.location}</span>
                                                    </div>
                                                </div>
                                                {getStatusBadge(booking.status)}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 text-[#2a9d8f]" />
                                                    <span>{booking.visitDate ? new Date(booking.visitDate).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' }) : 'لم يحدد'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="w-4 h-4 text-[#2a9d8f]" />
                                                    <span>{booking.visitDate ? new Date(booking.visitDate).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : 'لم يحدد'}</span>
                                                </div>
                                            </div>

                                            {booking.notes && (
                                                <div className="mt-3 bg-gray-50 p-2 rounded text-xs text-gray-500 border-r-2 border-gray-200">
                                                    <span className="font-bold ml-1">ملاحظاتي:</span> {booking.notes}
                                                </div>
                                            )}

                                            <Separator className="my-4" />

                                            <div className="flex flex-wrap items-center gap-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2"
                                                    onClick={() => handleStartChat(property.ownerId)}
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                    تحدث مع المالك
                                                </Button>

                                                {booking.status === 'pending' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => cancelBooking(booking.id)}
                                                    >
                                                        إلغاء الطلب
                                                    </Button>
                                                )}

                                                {booking.status === 'confirmed' && (
                                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        تم تأكيد ميعاد المعاينة من المالك
                                                    </p>
                                                )}

                                                {booking.status === 'completed' && !booking.review && (
                                                    <Button
                                                        className="bg-[#f4a261] hover:bg-[#f4a261]/90 gap-2"
                                                        size="sm"
                                                        onClick={() => navigate(`/dashboard/expat/review/${booking.id}`)}
                                                    >
                                                        <Star className="w-4 h-4" />
                                                        قيم السكن والمالك
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
