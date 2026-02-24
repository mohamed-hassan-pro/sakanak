// Owner Add Property Page
// صفحة إضافة عقار جديد للمالك

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Wallet,
  Bed,
  Bath,
  Users,
  Check,
  Upload,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePropertiesStore, useAuthStore } from '@/lib/store';
import { SUPPORTED_CITIES, PROPERTY_TYPES, AMENITIES } from '@/types';

export function OwnerAddProperty() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addProperty } = usePropertiesStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 1000,
    priceType: 'per_bed' as const,
    city: '',
    location: '',
    type: 'shared_bed' as const,
    rooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: [] as string[],
    nearTo: [] as string[],
    images: [] as string[],
  });

  const handleAmenityToggle = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // محاكاة إضافة العقار
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const newProperty = {
      id: 'prop-' + Date.now(),
      ...formData,
      verified: false,
      featured: false,
      available: true,
      ownerId: user?.id || 'owner-001',
      coordinates: null,
      distanceTo: null,
      createdAt: new Date(),
      images: formData.images.length > 0 
        ? formData.images 
        : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    };

    addProperty(newProperty as any);
    setIsSubmitting(false);
    navigate('/dashboard/owner/properties');
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.city && formData.location;
      case 2:
        return formData.price > 0 && formData.type;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/owner/dashboard')}
              className="text-gray-500 hover:text-[#1e3a5f]"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a5f]">إضافة عقار جديد</h1>
              <p className="text-gray-500 text-sm mt-1">
                الخطوة {step} من {steps.length}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mt-6">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`flex-1 h-2 rounded-full ${
                  s.id <= step ? 'bg-[#1e3a5f]' : 'bg-gray-200'
                }`}
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
                  placeholder="مثال: سرير في غرفة مفروشة قرب الجامعة"
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
                  placeholder="صف العقار بالتفصيل..."
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
                    <option value="">اختر المدينة</option>
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
                      placeholder="المنطقة، الشارع، رقم العمارة"
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
                      className={`p-4 border-2 rounded-lg text-right transition-all ${
                        formData.type === type.id
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
                    عدد الغرف
                  </label>
                  <div className="relative">
                    <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min={1}
                      value={formData.rooms}
                      onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
                      className="w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عدد السراير
                  </label>
                  <div className="relative">
                    <Bed className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min={1}
                      value={formData.beds}
                      onChange={(e) => setFormData({ ...formData, beds: Number(e.target.value) })}
                      className="w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عدد الحمامات
                  </label>
                  <div className="relative">
                    <Bath className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min={1}
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                      className="w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  المرافق المتاحة
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {AMENITIES.map((amenity) => (
                    <button
                      key={amenity.id}
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`flex items-center gap-2 p-3 border rounded-lg transition-all ${
                        formData.amenities.includes(amenity.id)
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

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 نصيحة: كل ما زادت المرافق المتاحة، زادت فرصة إيجاد مستأجر مناسب!
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  صور العقار
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1e3a5f] transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    اسحب الصور هنا أو اضغط للاختيار
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG حتى 5MB
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-700">
                  ⚠️ تأكد من أن الصور واضحة وحقيقية. الصور المضللة ممكن تؤدي لحذف العقار.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1) as any)}
              disabled={step === 1}
            >
              رجوع
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep((s) => Math.min(4, s + 1) as any)}
                disabled={!canProceed()}
                className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90"
              >
                التالي
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#f4a261] hover:bg-[#f4a261]/90"
              >
                {isSubmitting ? 'جاري الإضافة...' : 'إضافة العقار'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
