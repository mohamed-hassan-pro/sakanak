// Onboarding Wizard Component
// مكون خطوات التسجيل الذكي للمغتربين

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Wallet, 
  Home, 
  Star, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft,
  MapPin,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useOnboardingStore } from '@/lib/store';
import { SUPPORTED_UNIVERSITIES, PROPERTY_TYPES, SEARCH_PRIORITIES } from '@/types';

const steps = [
  { id: 1, title: 'الجامعة', icon: Building2 },
  { id: 2, title: 'الميزانية', icon: Wallet },
  { id: 3, title: 'نوع السكن', icon: Home },
  { id: 4, title: 'الأولويات', icon: Star },
  { id: 5, title: 'ملاحظات', icon: MessageSquare },
];

export function OnboardingWizard() {
  const navigate = useNavigate();
  const { step, criteria, setStep, completeOnboarding } = useOnboardingStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (step < 5) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      completeOnboarding();
      navigate('/dashboard/expat/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(step - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!criteria.university;
      case 2:
        return criteria.budget > 0;
      case 3:
        return !!criteria.type;
      case 4:
        return true; // الأولويات اختيارية
      case 5:
        return true; // الملاحظات اختيارية
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <UniversityStep />;
      case 2:
        return <BudgetStep />;
      case 3:
        return <PropertyTypeStep />;
      case 4:
        return <PrioritiesStep />;
      case 5:
        return <NotesStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] to-[#2a9d8f] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            أهلاً بيك في سكنك! 🏠
          </h1>
          <p className="text-white/80">
            جاوب على 5 أسئلة بسيطة وهنلاقيلك السكن المثالي
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isCompleted = s.id < step;
            
            return (
              <div key={s.id} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-[#f4a261] text-white scale-110'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-white/20 text-white/60'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-sm ${
                    isActive ? 'text-white font-medium' : 'text-white/60'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main Card */}
        <Card className="p-8 bg-white shadow-2xl">
          <div
            className={`transition-all duration-300 ${
              isAnimating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
            }`}
          >
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4" />
              رجوع
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90"
            >
              {step === 5 ? 'إنهاء' : 'التالي'}
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Step Indicator */}
        <div className="text-center mt-4 text-white/60 text-sm">
          الخطوة {step} من 5
        </div>
      </div>
    </div>
  );
}

// خطوة 1: اختيار الجامعة
function UniversityStep() {
  const { criteria, setCriteria } = useOnboardingStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUniversities = SUPPORTED_UNIVERSITIES.filter(
    u => 
      u.name.includes(searchTerm) ||
      u.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.city.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
          في أي جامعة هتدرس؟ 🎓
        </h2>
        <p className="text-gray-500">
          اختيارك هيساعدنا نلاقيلك سكن قريب
        </p>
      </div>

      <div className="relative">
        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="ابحث عن جامعتك..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
        {filteredUniversities.map((uni) => (
          <button
            key={uni.id}
            onClick={() => setCriteria({ university: uni.id })}
            className={`p-4 rounded-lg border-2 text-right transition-all ${
              criteria.university === uni.id
                ? 'border-[#1e3a5f] bg-[#1e3a5f]/5'
                : 'border-gray-200 hover:border-[#1e3a5f]/50'
            }`}
          >
            <div className="font-medium text-lg">{uni.name}</div>
            <div className="text-sm text-gray-500">{uni.nameEn}</div>
            <div className="text-sm text-[#2a9d8f] mt-1">{uni.city}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// خطوة 2: الميزانية
function BudgetStep() {
  const { criteria, setCriteria } = useOnboardingStore();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
          الميزانية الشهرية المتوقعة؟ 💰
        </h2>
        <p className="text-gray-500">
          حدد الحد الأقصى للإيجار الشهري
        </p>
      </div>

      <div className="text-center">
        <div className="text-5xl font-bold text-[#1e3a5f] mb-2">
          {criteria.budget.toLocaleString()}
        </div>
        <div className="text-gray-500">جنيه مصري / شهر</div>
      </div>

      <div className="px-4">
        <Slider
          value={[criteria.budget]}
          onValueChange={([value]) => setCriteria({ budget: value })}
          min={500}
          max={3000}
          step={50}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>500 ج</span>
          <span>3000 ج</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[800, 1500, 2500].map((amount) => (
          <button
            key={amount}
            onClick={() => setCriteria({ budget: amount })}
            className={`py-3 rounded-lg border-2 transition-all ${
              criteria.budget === amount
                ? 'border-[#1e3a5f] bg-[#1e3a5f]/5'
                : 'border-gray-200 hover:border-[#1e3a5f]/50'
            }`}
          >
            {amount.toLocaleString()} ج
          </button>
        ))}
      </div>

      <div className="bg-[#f4a261]/10 p-4 rounded-lg">
        <p className="text-sm text-[#f4a261]">
          💡 تلميح: متوسط أسعار السكن للمغتربين بين 800-1500 جنيه للسرير
        </p>
      </div>
    </div>
  );
}

// خطوة 3: نوع السكن
function PropertyTypeStep() {
  const { criteria, setCriteria } = useOnboardingStore();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
          تفضل إيه؟ 🏡
        </h2>
        <p className="text-gray-500">
          اختار نوع السكن اللي يناسبك
        </p>
      </div>

      <div className="space-y-4">
        {PROPERTY_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setCriteria({ type: type.id as any })}
            className={`w-full p-5 rounded-lg border-2 text-right transition-all ${
              criteria.type === type.id
                ? 'border-[#1e3a5f] bg-[#1e3a5f]/5'
                : 'border-gray-200 hover:border-[#1e3a5f]/50'
            }`}
          >
            <div className="font-medium text-lg">{type.name}</div>
            <div className="text-sm text-gray-500">{type.nameEn}</div>
          </button>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          ℹ️ السرير في غرفة مشتركة هو الأكثر شيوعاً والأوفر للطلاب
        </p>
      </div>
    </div>
  );
}

// خطوة 4: الأولويات
function PrioritiesStep() {
  const { criteria, setCriteria } = useOnboardingStore();

  const togglePriority = (priorityId: string) => {
    const current = criteria.preferences || [];
    if (current.includes(priorityId)) {
      setCriteria({
        preferences: current.filter((p) => p !== priorityId),
      });
    } else {
      setCriteria({ preferences: [...current, priorityId] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
          أهم حاجة بالنسبالك؟ ⭐
        </h2>
        <p className="text-gray-500">
          اختار كل اللي ينطبق عليك (اختياري)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {SEARCH_PRIORITIES.map((priority) => {
          const isSelected = criteria.preferences?.includes(priority.id);
          return (
            <button
              key={priority.id}
              onClick={() => togglePriority(priority.id)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                isSelected
                  ? 'border-[#1e3a5f] bg-[#1e3a5f]/5'
                  : 'border-gray-200 hover:border-[#1e3a5f]/50'
              }`}
            >
              <div className="font-medium">{priority.name}</div>
            </button>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-500">
        اخترت: {criteria.preferences?.length || 0} من {SEARCH_PRIORITIES.length}
      </div>
    </div>
  );
}

// خطوة 5: ملاحظات إضافية
function NotesStep() {
  const { criteria, setCriteria } = useOnboardingStore();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
          عندك أي preferences تانية؟ 📝
        </h2>
        <p className="text-gray-500">
          أي تفاصيل إضافية تساعدنا نلاقيلك السكن المثالي (اختياري)
        </p>
      </div>

      <textarea
        value={criteria.additionalNotes || ''}
        onChange={(e) => setCriteria({ additionalNotes: e.target.value })}
        placeholder="مثلاً: قرب مترو، مطبخ مجهز، سكن هادي للمذاكرة..."
        className="w-full h-40 p-4 border-2 rounded-lg resize-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
      />

      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-700">
          🎉 جاهزين! هنحلل إجاباتك ونقترح عليك أفضل الخيارات
        </p>
      </div>
    </div>
  );
}
