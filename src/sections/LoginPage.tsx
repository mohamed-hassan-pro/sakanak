// Login Page
// صفحة تسجيل الدخول

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password);
      
      // التوجيه حسب نوع المستخدم (للتجربة)
      if (formData.email.includes('owner')) {
        navigate('/dashboard/owner/dashboard');
      } else {
        navigate('/dashboard/expat/onboarding');
      }
    } catch (err) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
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

        {/* Login Card */}
        <Card className="p-8 bg-white shadow-2xl">
          <h1 className="text-2xl font-bold text-[#1e3a5f] mb-2 text-center">
            تسجيل الدخول
          </h1>
          <p className="text-gray-500 text-center mb-6">
            أهلاً بيك! سجل دخولك للمتابعة
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Forgot Password */}
            <div className="text-left">
              <Link to="#" className="text-sm text-[#2a9d8f] hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 py-3"
              disabled={isLoading}
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">حسابات للتجربة:</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>مالك: owner@test.com / 123456</p>
              <p>مغترب: expat@test.com / 123456</p>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              لسه معندكش حساب؟{' '}
              <Link to="/auth/register" className="text-[#2a9d8f] hover:underline font-medium">
                سجل الآن
              </Link>
            </p>
          </div>
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
