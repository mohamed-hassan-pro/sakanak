// Expat Property Details Page
// صفحة تفاصيل السكن للمغتربين

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin,
    Bed,
    Bath,
    Users,
    Heart,
    BadgeCheck,
    Check,
    MessageCircle,
    Calendar,
    Share2,
    ArrowRight,
    Wifi,
    Wind,
    ChefHat,
    Shield,
    WashingMachine,
    ArrowUpDown,
    Car,
    Dumbbell,
    Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePropertiesStore, useMessagesStore, useAuthStore, useBookingsStore, useReviewsStore } from '@/lib/store';
import { getOwnerBadge } from '@/lib/ai-matcher';
import { seedProperties } from '@/lib/seed-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Property, Booking, Review } from '@/types';

const amenityIcons: Record<string, { icon: React.ReactNode; label: string }> = {
    wifi: { icon: <Wifi className="w-5 h-5" />, label: 'WiFi' },
    ac: { icon: <Wind className="w-5 h-5" />, label: 'تكييف' },
    kitchen: { icon: <ChefHat className="w-5 h-5" />, label: 'مطبخ' },
    security: { icon: <Shield className="w-5 h-5" />, label: 'أمان' },
    laundry: { icon: <WashingMachine className="w-5 h-5" />, label: 'غسالة' },
    elevator: { icon: <ArrowUpDown className="w-5 h-5" />, label: 'أسانسير' },
    parking: { icon: <Car className="w-5 h-5" />, label: 'جراج' },
    gym: { icon: <Dumbbell className="w-5 h-5" />, label: 'جيم' },
};

export function ExpatPropertyDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { properties, setProperties, favorites, toggleFavorite } = usePropertiesStore();
    const { setActiveConversation } = useMessagesStore();
    const { addBooking } = useBookingsStore();
    const { getPropertyReviews } = useReviewsStore();
    const { user } = useAuthStore();

    const [property, setProperty] = useState<Property | null>(null);
    const [activeImage, setActiveImage] = useState(0);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('10:00');
    const [bookingNotes, setBookingNotes] = useState('');
    const [propertyReviews, setPropertyReviews] = useState<Review[]>([]);

    useEffect(() => {
        // تحميل البيانات إذا لم تكن موجودة
        if (properties.length === 0) {
            setProperties(seedProperties as Property[]);
        }
    }, []);

    useEffect(() => {
        const found = properties.find(p => p.id === id);
        if (found) {
            setProperty(found);
            setPropertyReviews(getPropertyReviews(found.id));
        }
    }, [id, properties, getPropertyReviews]);

    if (!property) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل تفاصيل السكن...</p>
                </div>
            </div>
        );
    }

    const isFavorite = favorites.includes(property.id);
    const ownerBadge = getOwnerBadge(property.ownerStats);

    const handleStartChat = () => {
        setActiveConversation(property.ownerId);
        navigate('/dashboard/expat/messages');
    };

    const handleBookingSubmit = () => {
        if (!bookingDate) {
            toast.error('يرجى اختيار تاريخ المعاينة');
            return;
        }

        const newBooking: Booking = {
            id: 'book-' + Date.now(),
            propertyId: property.id,
            expatId: user?.id || 'expat-001',
            status: 'pending',
            visitDate: new Date(`${bookingDate}T${bookingTime}`),
            notes: bookingNotes,
            createdAt: new Date()
        };

        addBooking(newBooking);
        setIsBookingOpen(false);
        toast.success('تم إرسال طلب المعاينة للمالك!');
        navigate('/dashboard/expat/bookings');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Back Button & Actions */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600"
                >
                    <ArrowRight className="w-4 h-4 ml-1" />
                    رجوع
                </Button>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => toggleFavorite(property.id)}
                    >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-video rounded-2xl overflow-hidden bg-gray-200 shadow-sm">
                                <img
                                    src={property.images[activeImage]}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {property.images.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                    {property.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`relative flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#1e3a5f]' : 'border-transparent opacity-70'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title & Info */}
                        <Card className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-medium">
                                            {property.type === 'shared_bed' ? 'سرير في غرفة مشتركة' :
                                                property.type === 'private_room' ? 'غرفة خاصة' : 'شقة كاملة'}
                                        </Badge>
                                        {property.featured && (
                                            <Badge className="bg-[#f4a261] text-white">مميز</Badge>
                                        )}
                                    </div>
                                    <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">{property.title}</h1>
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <MapPin className="w-4 h-4" />
                                        <span>{property.location}، {property.city}</span>
                                    </div>
                                </div>
                                <div className="text-left bg-gray-50 p-4 rounded-xl border">
                                    <span className="text-3xl font-bold text-[#1e3a5f]">{property.price.toLocaleString()}</span>
                                    <span className="text-gray-500 mr-1">ج/شهر</span>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 rounded-xl bg-gray-50">
                                    <Bed className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                                    <p className="text-xs text-gray-500">سراير</p>
                                    <p className="font-bold text-[#1e3a5f]">{property.beds}</p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-gray-50">
                                    <Bath className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                                    <p className="text-xs text-gray-500">حمامات</p>
                                    <p className="font-bold text-[#1e3a5f]">{property.bathrooms}</p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-gray-50">
                                    <Users className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                                    <p className="text-xs text-gray-500">غرف</p>
                                    <p className="font-bold text-[#1e3a5f]">{property.rooms}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Description */}
                        <Card className="p-6">
                            <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">الوصف</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {property.description}
                            </p>
                        </Card>

                        {/* Amenities */}
                        <Card className="p-6">
                            <h2 className="text-xl font-bold text-[#1e3a5f] mb-6">المرافق والخدمات</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                {property.amenities.map((amenity) => (
                                    <div key={amenity} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1e3a5f] shadow-sm">
                                            {amenityIcons[amenity]?.icon || <Check className="w-5 h-5" />}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {amenityIcons[amenity]?.label || amenity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Location Detail */}
                        <Card className="p-6">
                            <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">الموقع والمحيط</h2>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl border bg-gray-50">
                                    <p className="text-sm text-gray-500 mb-2 font-medium">على بعد خطوات من:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {property.nearTo.map((place) => (
                                            <Badge key={place} variant="secondary" className="bg-white border text-gray-600">
                                                {place}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                {/* Map Placeholder */}
                                <div className="h-64 rounded-xl bg-gray-200 overflow-hidden relative group">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <MapPin className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 font-medium tracking-wide">الخريطة التفاعلية قيد التجهيز</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar - Booking & Owner */}
                    <div className="space-y-6">
                        {/* Booking Card */}
                        <Card className="p-6 sticky top-24 shadow-lg border-2 border-blue-100">
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-gray-500">طريقة الدفع</span>
                                    <Badge variant="outline">شهري</Badge>
                                </div>
                                <div className="flex items-end gap-1">
                                    <span className="text-3xl font-bold text-[#1e3a5f]">{property.price.toLocaleString()}</span>
                                    <span className="text-gray-500 mb-1">حميع المصاريف شاملة</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    className="w-full h-12 bg-[#2a9d8f] hover:bg-[#2a9d8f]/90 text-lg font-bold"
                                    onClick={() => setIsBookingOpen(true)}
                                >
                                    <Calendar className="w-5 h-5 ml-2" />
                                    حجز معاينة
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full h-12 border-[#1e3a5f] text-[#1e3a5f] hover:bg-blue-50 text-lg font-bold"
                                    onClick={handleStartChat}
                                >
                                    <MessageCircle className="w-5 h-5 ml-2" />
                                    تحدث مع المالك
                                </Button>
                            </div>

                            <p className="text-center text-xs text-gray-400 mt-4">
                                لا يتم خصم أي مبالغ الآن. طلب المعاينة مجاني.
                            </p>
                        </Card>

                        {/* Owner Card */}
                        <Card className="p-6">
                            <h3 className="font-bold text-[#1e3a5f] mb-4">بيانات المعلن</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-[#1e3a5f]">
                                    {property.owner?.name.charAt(0) || 'M'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{property.owner?.name || 'محمد حسن'}</h4>
                                    <div className="flex items-center gap-1">
                                        <Badge variant="secondary" className={ownerBadge.color}>
                                            {ownerBadge.text}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">عقارات منشورة</span>
                                    <span className="font-medium text-gray-700">12 عقار</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">معدل التقييم</span>
                                    <span className="font-medium text-green-600">4.8 / 5</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">عضو منذ</span>
                                    <span className="font-medium text-gray-700">يناير 2024</span>
                                </div>
                            </div>

                            {property.verified && (
                                <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                                    <BadgeCheck className="w-5 h-5 text-green-600" />
                                    <span className="text-xs text-green-700 font-medium">هذا المالك قام بتوثيق هويته وأوراق العقار</span>
                                </div>
                            )}
                        </Card>

                        {/* Trust Score Card */}
                        {property.ownerStats && (
                            <Card className="p-6 bg-gradient-to-br from-[#1e3a5f] to-[#2d3748] text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold">Trust Score</h3>
                                    <Badge className="bg-green-500">{property.ownerStats.averageTrustScore}%</Badge>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>دقة الصور</span>
                                            <span>{property.ownerStats.photosAccuracy}%</span>
                                        </div>
                                        <div className="w-full bg-white/20 h-1.5 rounded-full">
                                            <div
                                                className="bg-green-400 h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${property.ownerStats.photosAccuracy}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>مطابقة الوصف</span>
                                            <span>{property.ownerStats.descriptionAccuracy}%</span>
                                        </div>
                                        <div className="w-full bg-white/20 h-1.5 rounded-full">
                                            <div
                                                className="bg-blue-400 h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${property.ownerStats.descriptionAccuracy}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-white/60 mt-4 leading-relaxed">
                                    يتم حساب هذه النسب بناءً على زيارات ميدانية سابقة من فريق "سكنك" وتقييمات مستخدمين آخرين.
                                </p>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">آراء الطلاب السابقين</h2>
                    {propertyReviews.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {propertyReviews.map((review) => (
                                <Card key={review.id} className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#1e3a5f]">
                                                {review.reviewerId.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">مغترب سكن سابقاً</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className={`w-3 h-3 ${review.overallRating >= s ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm italic mb-4">"{review.comment}"</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Badge variant="outline" className="text-[10px] py-0 h-5">دقة الصور: {review.photosAccuracy}/5</Badge>
                                        <Badge variant="outline" className="text-[10px] py-0 h-5">الأمان: {review.safetyAccuracy}/5</Badge>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 text-center text-gray-500">
                            <p>لا يوجد تقييمات لهذا السكن بعد. كن أول من يكتب تقييماً!</p>
                        </Card>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-right">حجز ميعاد معاينة</DialogTitle>
                        <DialogDescription className="text-right">
                            اختر التاريخ والوقت المناسب ليك لمقابلة المالك ومعاينة السكن.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold block text-right">تاريخ المعاينة</label>
                            <Input
                                type="date"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                className="text-right"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold block text-right">الوقت</label>
                            <Input
                                type="time"
                                value={bookingTime}
                                onChange={(e) => setBookingTime(e.target.value)}
                                className="text-right"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold block text-right">ملاحظات للمالك</label>
                            <Textarea
                                placeholder="مثلاً: عايز أتأكد من قوة الـ WiFi..."
                                value={bookingNotes}
                                onChange={(e) => setBookingNotes(e.target.value)}
                                className="text-right"
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex sm:justify-between gap-2">
                        <Button variant="ghost" onClick={() => setIsBookingOpen(false)}>إلغاء</Button>
                        <Button className="bg-[#1e3a5f]" onClick={handleBookingSubmit}>تأكيد الطلب</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
