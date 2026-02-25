// Post Visit Review Page
// صفحة تقييم ما بعد المعاينة

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Star,
    Check,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useBookingsStore, useReviewsStore, useAuthStore, usePropertiesStore } from '@/lib/store';
import { seedBookings, seedProperties } from '@/lib/seed-data';
import type { Booking, Property, Review } from '@/types';

export function PostVisitReview() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { bookings, completeBooking } = useBookingsStore();
    const { properties, setProperties } = usePropertiesStore();
    const { addReview } = useReviewsStore();

    const [step, setStep] = useState(1);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [property, setProperty] = useState<Property | null>(null);

    // Form State
    const [photosAccuracy, setPhotosAccuracy] = useState<number>(0);
    const [honestyRating, setHonestyRating] = useState<number>(0);
    const [amenitiesMatch, setAmenitiesMatch] = useState<Record<string, boolean>>({});
    const [safetyRating, setSafetyRating] = useState<string>('');
    const [wouldRecommend, setWouldRecommend] = useState<string>('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (properties.length === 0) setProperties(seedProperties as Property[]);

        const foundBooking = bookings.find(b => b.id === bookingId) || seedBookings.find(b => b.id === bookingId);
        if (foundBooking) {
            setBooking(foundBooking as Booking);
            const foundProp = properties.find(p => p.id === foundBooking.propertyId) || seedProperties.find(p => p.id === foundBooking.propertyId);
            if (foundProp) setProperty(foundProp as Property);

            // Initialize amenities checklist
            const initialAmenities: Record<string, boolean> = {};
            foundProp?.amenities?.forEach(a => {
                initialAmenities[a] = true;
            });
            setAmenitiesMatch(initialAmenities);
        }
    }, [bookingId, bookings, properties]);

    if (!booking || !property) {
        return <div className="p-20 text-center">جاري التحميل...</div>;
    }

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = () => {
        const newReview: Review = {
            id: 'rev-' + Date.now(),
            bookingId: booking.id,
            propertyId: property.id,
            reviewerId: user?.id || 'expat-001',
            ownerId: property.ownerId,
            photosAccuracy,
            descriptionAccuracy: honestyRating,
            amenitiesMatch: Object.values(amenitiesMatch).filter(v => v).length,
            safetyAccuracy: safetyRating === 'yes' || safetyRating === 'better' ? 5 : 2,
            overallRating: Math.round((photosAccuracy + honestyRating) / 2),
            wouldRecommend: wouldRecommend === 'yes' || wouldRecommend === 'strongly_yes',
            comment,
            visitPhotos: [],
            visitDate: new Date(),
            createdAt: new Date(),
            trustScore: Math.round(((photosAccuracy + honestyRating + 4) / 14) * 100) // Simple mock calc
        };

        addReview(newReview);
        completeBooking(booking.id);
        navigate('/dashboard/expat/bookings');
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-[#1e3a5f] mb-2">الصور كانت مطابقة للواقع؟</h2>
                            <p className="text-sm text-gray-500">مهم جداً للطلاب التانيين يعرفوا الحقيقة</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { val: 5, label: 'مطابقة تماماً', emoji: '😍' },
                                { val: 4, label: 'متشابهة جداً', emoji: '🙂' },
                                { val: 3, label: 'مختلفة شوية', emoji: '😐' },
                                { val: 1, label: 'خداع تماماً', emoji: '😠' },
                            ].map((opt) => (
                                <button
                                    key={opt.val}
                                    onClick={() => setPhotosAccuracy(opt.val)}
                                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${photosAccuracy === opt.val ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <span className="text-4xl">{opt.emoji}</span>
                                    <span className="font-medium text-sm">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-[#1e3a5f] mb-2">المواصفات موجودة؟</h2>
                            <p className="text-sm text-gray-500">علم على الحاجات اللي شوفتها بنفسك</p>
                        </div>
                        <Card className="p-4 space-y-4">
                            {property.amenities.map((amenity) => (
                                <div key={amenity} className="flex items-center justify-between">
                                    <span className="text-gray-700 capitalize">{amenity}</span>
                                    <Checkbox
                                        checked={amenitiesMatch[amenity]}
                                        onCheckedChange={(checked) => setAmenitiesMatch(prev => ({ ...prev, [amenity]: !!checked }))}
                                    />
                                </div>
                            ))}
                        </Card>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-[#1e3a5f] mb-2">المالك كان صادق في وصفه؟</h2>
                            <p className="text-sm text-gray-500">قيم أداء المالك معاك</p>
                        </div>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => setHonestyRating(star)}>
                                    <Star className={`w-12 h-12 transition-colors ${honestyRating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-[#1e3a5f] mb-2">المنطقة آمنة؟</h2>
                            <p className="text-sm text-gray-500">رأيك في أمان عمارة والشارع</p>
                        </div>
                        <div className="space-y-3">
                            {[
                                { id: 'yes', label: 'آمنة جداً' },
                                { id: 'better', label: 'أحسن مما توقعت' },
                                { id: 'no', label: 'غير آمنة' },
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setSafetyRating(opt.id)}
                                    className={`w-full p-4 rounded-xl border-2 text-right transition-all flex items-center justify-between ${safetyRating === opt.id ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-100'
                                        }`}
                                >
                                    <span className="font-medium">{opt.label}</span>
                                    {safetyRating === opt.id && <Check className="w-5 h-5 text-[#1e3a5f]" />}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-[#1e3a5f] mb-2">توصي بالسكن ده لغيرك؟</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { id: 'strongly_yes', label: 'أوصي بشدة 👍', color: 'text-green-600' },
                                { id: 'yes', label: 'أوصي 👌', color: 'text-blue-600' },
                                { id: 'neutral', label: 'محايد 🤔', color: 'text-gray-600' },
                                { id: 'no', label: 'لا أوصي 👎', color: 'text-red-600' },
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setWouldRecommend(opt.id)}
                                    className={`p-4 rounded-xl border-2 text-right transition-all flex items-center justify-between ${wouldRecommend === opt.id ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-100'
                                        }`}
                                >
                                    <span className={`font-bold ${opt.color}`}>{opt.label}</span>
                                    {wouldRecommend === opt.id && <Check className="w-5 h-5 text-[#1e3a5f]" />}
                                </button>
                            ))}
                        </div>
                        <Separator className="my-4" />
                        <div>
                            <label className="text-sm font-bold text-[#1e3a5f] mb-2 block">كلمة أخيرة (اختياري)</label>
                            <Textarea
                                placeholder="مثلاً: المطبخ فيه مشكلة في السباكة، أو الجيران هاديين جداً..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="h-24"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <Card className="w-full max-w-lg overflow-hidden shadow-2xl">
                {/* Progress Header */}
                <div className="bg-[#1e3a5f] text-white p-6 relative">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20">
                            <img src={property.images[0]} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 className="font-bold">تقييم المعاينة</h1>
                            <p className="text-xs text-white/70">{property.title}</p>
                        </div>
                    </div>

                    <div className="flex justify-between text-xs mb-1">
                        <span>الخطوة {step} من 5</span>
                        <span>{Math.round((step / 5) * 100)}% مكتمل</span>
                    </div>
                    <div className="w-full bg-white/20 h-1.5 rounded-full">
                        <div
                            className="bg-[#f4a261] h-full rounded-full transition-all duration-500"
                            style={{ width: `${(step / 5) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-8 min-h-[400px]">
                    {renderStep()}
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 flex items-center justify-between border-t">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={step === 1}
                        className="flex items-center gap-1"
                    >
                        <ChevronRight className="w-4 h-4 ml-1" />
                        السابق
                    </Button>

                    {step < 5 ? (
                        <Button
                            onClick={handleNext}
                            disabled={(step === 1 && !photosAccuracy) || (step === 3 && !honestyRating) || (step === 4 && !safetyRating)}
                            className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90"
                        >
                            التالي
                            <ChevronLeft className="w-4 h-4 mr-1" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={!wouldRecommend}
                            className="bg-[#2a9d8f] hover:bg-[#2a9d8f]/90"
                        >
                            إرسال التقييم
                            <Check className="w-4 h-4 mr-1" />
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}
