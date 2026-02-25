// Owner Edit Property Page
// صفحة تعديل العقار للمالك

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    MapPin,
    Wallet,
    Check,
    Upload,
    ArrowRight,
    Save,
    Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePropertiesStore, useAuthStore } from '@/lib/store';
import { SUPPORTED_CITIES, PROPERTY_TYPES, AMENITIES } from '@/types';

export function OwnerEditProperty() {
    const { propertyId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { properties, updateProperty, deleteProperty } = usePropertiesStore();

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        const existingProperty = properties.find(p => p.id === propertyId);
        if (!existingProperty) {
            navigate('/dashboard/owner/properties');
            return;
        }

        // Check ownership
        if (existingProperty.ownerId !== (user?.id || 'owner-001')) {
            navigate('/dashboard/owner/properties');
            return;
        }

        setFormData({
            ...existingProperty,
        });
    }, [propertyId, properties, user, navigate]);

    if (!formData) return <div className="p-8 text-center text-gray-500">جاري تحميل البيانات...</div>;

    const handleAmenityToggle = (amenityId: string) => {
        setFormData((prev: any) => ({
            ...prev,
            amenities: prev.amenities.includes(amenityId)
                ? prev.amenities.filter((a: string) => a !== amenityId)
                : [...prev.amenities, amenityId],
        }));
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        updateProperty(formData);
        setIsSubmitting(false);
        navigate('/dashboard/owner/properties');
    };

    const handleDelete = () => {
        if (window.confirm('هل أنت متأكد من حذف هذا السكن نهائياً؟')) {
            deleteProperty(propertyId!);
            navigate('/dashboard/owner/properties');
        }
    };

    const steps = [
        { id: 1, title: 'المعلومات الأساسية' },
        { id: 2, title: 'السعر والتفاصيل' },
        { id: 3, title: 'المرافق' },
        { id: 4, title: 'الصور' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard/owner/properties')}
                                className="text-gray-500 hover:text-[#1e3a5f]"
                            >
                                <ArrowRight className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-[#1e3a5f]">تعديل السكن</h1>
                                <p className="text-gray-500 text-sm mt-1">
                                    تحديث بيانات وتفاصيل السكن
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 gap-2"
                            onClick={handleDelete}
                        >
                            <Trash2 className="w-4 h-4" />
                            حذف السكن
                        </Button>
                    </div>

                    {/* Progress */}
                    <div className="flex gap-2 mt-6">
                        {steps.map((s) => (
                            <div
                                key={s.id}
                                className={`flex-1 h-2 rounded-full cursor-pointer transition-colors ${s.id === step ? 'bg-[#1e3a5f]' : s.id < step ? 'bg-[#1e3a5f]/40' : 'bg-gray-200'
                                    }`}
                                onClick={() => setStep(s.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    عنوان العقار
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    الوصف
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent resize-none"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        المدينة
                                    </label>
                                    <select
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                                    >
                                        {SUPPORTED_CITIES.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        العنوان التفصيلي
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        السعر (جنيه/شهر)
                                    </label>
                                    <div className="relative">
                                        <Wallet className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            className="w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        نوع السعر
                                    </label>
                                    <select
                                        value={formData.priceType}
                                        onChange={(e) => setFormData({ ...formData, priceType: e.target.value as any })}
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                                    >
                                        <option value="per_bed">للسرير</option>
                                        <option value="per_room">للغرفة</option>
                                        <option value="per_apartment">للشقة</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    نوع السكن
                                </label>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {PROPERTY_TYPES.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setFormData({ ...formData, type: type.id as any })}
                                            className={`p-4 border-2 rounded-lg text-right transition-all ${formData.type === type.id
                                                ? 'border-[#1e3a5f] bg-[#1e3a5f]/5'
                                                : 'border-gray-200 hover:border-[#1e3a5f]/50'
                                                }`}
                                        >
                                            <div className="font-medium">{type.name}</div>
                                            <div className="text-sm text-gray-500">{type.nameEn}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        الغرف
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={formData.rooms}
                                        onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        السراير
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={formData.beds}
                                        onChange={(e) => setFormData({ ...formData, beds: Number(e.target.value) })}
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        الحمامات
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={formData.bathrooms}
                                        onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {AMENITIES.map((amenity) => (
                                    <button
                                        key={amenity.id}
                                        onClick={() => handleAmenityToggle(amenity.id)}
                                        className={`flex items-center gap-2 p-3 border rounded-lg transition-all ${formData.amenities.includes(amenity.id)
                                            ? 'border-[#1e3a5f] bg-[#1e3a5f]/5 text-[#1e3a5f]'
                                            : 'border-gray-200 hover:border-[#1e3a5f]/50'
                                            }`}
                                    >
                                        {formData.amenities.includes(amenity.id) && (
                                            <Check className="w-4 h-4" />
                                        )}
                                        <span className="text-sm">{amenity.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                {formData.images.map((img: string, idx: number) => (
                                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setFormData({ ...formData, images: formData.images.filter((_: any, i: number) => i !== idx) })}
                                            className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg aspect-video flex flex-col items-center justify-center hover:border-[#1e3a5f] transition-colors cursor-pointer group">
                                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#1e3a5f]" />
                                    <span className="text-xs text-gray-500 mt-2">إضافة صور</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <Button
                            variant="outline"
                            onClick={() => step === 1 ? navigate('/dashboard/owner/properties') : setStep(s => s - 1)}
                        >
                            {step === 1 ? 'إلغاء' : 'رجوع'}
                        </Button>

                        <div className="flex gap-3">
                            {step < 4 && (
                                <Button
                                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-none"
                                    onClick={() => setStep(s => s + 1)}
                                >
                                    التالي
                                </Button>
                            )}
                            <Button
                                onClick={handleSave}
                                disabled={isSubmitting}
                                className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 min-w-[120px]"
                            >
                                {isSubmitting ? 'جاري الحفظ...' : (
                                    <>
                                        <Save className="w-4 h-4 ml-2" />
                                        حفظ التعديلات
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
