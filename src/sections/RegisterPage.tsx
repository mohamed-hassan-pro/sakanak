// Register Page
// صفحة التسجيل

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Home, ArrowRight, Building2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';

type UserRole = 'OWNER' | 'EXPAT';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (!role) {
      setError('يرجى اختيار نوع الحساب');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,
      });

      // التوجيه حسب نوع المستخدم
      if (role === 'OWNER') {
        navigate('/dashboard/owner/dashboard');
      } else {
        navigate('/dashboard/expat/onboarding');
      }
    } catch (err) {
      setError('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] to-[#2a9d8f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Home className="w-7 h-7 text-[#1e3a5f]" />
            </div>
            <span className="font-bold text-2xl text-white">سكنك</span>
          </Link>
          <p className="text-white/70 mt-2">سكنك في مصر، بذكاء</p>
        </div>

        {/* Register Card */}
        <Card className="p-8 bg-white shadow-2xl">
          {step === 1 ? (
            // Step 1: Select Role
            <>
              <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2 text-center">
                إنشاء حساب جديد
              </h1>
              <p className="text-gray-500 text-center mb-6">
                اختار نوع الحساب اللي يناسبك
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handleRoleSelect('EXPAT')}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-[#1e3a5f] hover:bg-[#1e3a5f]/5 transition-all text-right"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#2a9d8f]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-7 h-7 text-[#2a9d8f]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#1e3a5f]">مغترب</h3>
                      <p className="text-gray-500 text-sm">
                        أنا طلاب/طبيب وأبحث عن سكن في مصر
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('OWNER')}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-[#1e3a5f] hover:bg-[#1e3a5f]/5 transition-all text-right"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#f4a261]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-7 h-7 text-[#f4a261]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#1e3a5f]">مالك</h3>
                      <p className="text-gray-500 text-sm">
                        عندي سكن/عقار وأحب أعرضه للإيجار
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  عندك حساب؟{' '}
                  <Link to="/auth/login" className="text-[#2a9d8f] hover:underline font-medium">
                    سجل دخول
                  </Link>
                </p>
              </div>
            </>
          ) : (
            // Step 2: Fill Details
            <>
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-[#1e3a5f] transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">
                  أكمل بياناتك
                </h1>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الكامل
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="محمد أحمد"
                      className="w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@email.com"
                      className="w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="01xxxxxxxxx"
                      className="w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pr-10 pl-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 py-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                </Button>
              </form>
            </>
          )}
        </Card>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4" />
            رجوع للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
