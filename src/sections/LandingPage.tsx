// Landing Page for Sakanak
// الصفحة الرئيسية التسويقية لمنصة سكنك

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Search,
  MessageCircle,
  Shield,
  Star,
  MapPin,
  Users,
  Sparkles,
  CheckCircle,
  ArrowLeft,
  Menu,
  X,
  Play,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/src/assets/logo.png" alt="Sakanak" className="h-10 w-auto object-contain" />
              <span className={`font-bold text-2xl ${isScrolled ? 'text-[#1e3a5f]' : 'text-white'} tracking-tight`}>
                سكنك
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={`hover:opacity-80 transition-opacity ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                المميزات
              </a>
              <a href="#how-it-works" className={`hover:opacity-80 transition-opacity ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                كيف يعمل
              </a>
              <a href="#testimonials" className={`hover:opacity-80 transition-opacity ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                آراء المستخدمين
              </a>
              <a href="#cities" className={`hover:opacity-80 transition-opacity ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                المدن
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/auth/login">
                <Button variant="ghost" className={isScrolled ? 'text-gray-700' : 'text-white'}>
                  تسجيل الدخول
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button className="bg-[#f4a261] hover:bg-[#f4a261]/90 text-white">
                  إنشاء حساب
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-gray-700">المميزات</a>
              <a href="#how-it-works" className="block py-2 text-gray-700">كيف يعمل</a>
              <a href="#testimonials" className="block py-2 text-gray-700">آراء المستخدمين</a>
              <a href="#cities" className="block py-2 text-gray-700">المدن</a>
              <div className="pt-3 border-t space-y-2">
                <Link to="/auth/login" className="block w-full">
                  <Button variant="outline" className="w-full">تسجيل الدخول</Button>
                </Link>
                <Link to="/auth/register" className="block w-full">
                  <Button className="w-full bg-[#f4a261] hover:bg-[#f4a261]/90">إنشاء حساب</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2a9d8f]" />

        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <Badge className="mb-6 px-4 py-2 bg-white/20 text-white border-0 text-sm">
            <Sparkles className="w-4 h-4 ml-1" />
            جزء من برنامج TIEC Start-IT 2025
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            سكنك في مصر
            <span className="block text-[#f4a261]">بذكاء</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            أول منصة ذكية للسكن في مصر باستخدام AI. نساعدك تلاقي سكنك المثالي في دقائق!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="bg-[#f4a261] hover:bg-[#f4a261]/90 text-white px-8 py-6 text-lg">
                ابحث عن سكنك الآن
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                <Play className="w-5 h-5 ml-2" />
                شاهد كيف يعمل
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">48K+</div>
              <div className="text-white/70 text-sm">طالب وافد سنوياً</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">20+</div>
              <div className="text-white/70 text-sm">سكن متاح</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">8</div>
              <div className="text-white/70 text-sm">مدن مغطاة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">25%</div>
              <div className="text-white/70 text-sm">عمولة فقط</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              المشكلة اللي بنحلها
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              آلاف الطلاب الوافدين بيواجهوا صعوبات كبيرة في إيجاد سكن مناسب في مصر
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-4xl font-bold text-red-500 mb-2">67%</h3>
              <p className="text-gray-600">
                من الطلاب يتعرضون لخداع في الصور أو الوصف
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-4xl font-bold text-orange-500 mb-2">25-50%</h3>
              <p className="text-gray-600">
                عمولة السماسرة من قيمة الإيجار
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-4xl font-bold text-yellow-600 mb-2">3-4</h3>
              <p className="text-gray-600">
                أسابيع متوسط وقت البحث عن سكن
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              كيف يعمل سكنك؟
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              أربع خطوات بسيطة وتحصل على السكن المثالي
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'أجب 5 أسئلة',
                description: 'جاوب على أسئلة بسيطة عن جامعتك وميزانيتك وتفضيلاتك',
                icon: Sparkles,
                color: 'bg-[#f4a261]',
              },
              {
                step: '02',
                title: 'AI يقترح',
                description: 'الذكاء الاصطناعي يحلل إجاباتك ويقترح أفضل 5 خيارات',
                icon: Search,
                color: 'bg-[#2a9d8f]',
              },
              {
                step: '03',
                title: 'تواصل مباشر',
                description: 'تواصل مباشر مع المالك واطلب معاينة في الوقت اللي يناسبك',
                icon: MessageCircle,
                color: 'bg-[#1e3a5f]',
              },
              {
                step: '04',
                title: 'استلم مفتاحك',
                description: 'بعد المعاينة، قيّم التجربة واستلم مفتاح سكنك الجديد',
                icon: Home,
                color: 'bg-[#e76f51]',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className={`w-20 h-20 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-gray-200 mb-2">{item.step}</div>
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/4 -left-4 w-8 h-0.5 bg-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              مميزات سكنك
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              كل اللي تحتاجه في منصة واحدة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'توثيق العقارات',
                description: 'كل سكن على المنصة بيتم توثيقه ومراجعته يدوياً',
                icon: CheckCircle,
                color: 'text-green-500',
              },
              {
                title: 'AI Matching',
                description: 'أول مرة في مصر - ذكاء اصطناعي يلاقيلك السكن المثالي',
                icon: Sparkles,
                color: 'text-[#f4a261]',
              },
              {
                title: 'عمولة 25% فقط',
                description: 'أقل بكثير من السماسرة اللي بياخدوا 50%',
                icon: Star,
                color: 'text-yellow-500',
              },
              {
                title: 'نظام التقييمات',
                description: 'تقييمات حقيقية من طلاب سكنوا قبل كده',
                icon: Shield,
                color: 'text-blue-500',
              },
              {
                title: 'مجتمع المغتربين',
                description: 'تواصل مع مغتربين تانيين في نفس جامعتك',
                icon: Users,
                color: 'text-purple-500',
              },
              {
                title: 'تغطية شاملة',
                description: 'متاح في 8 مدن مصرية رئيسية',
                icon: MapPin,
                color: 'text-red-500',
              },
            ].map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className={`w-10 h-10 ${feature.color} mb-4`} />
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              آراء المستخدمين
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              شوف كلام الطلاب اللي استخدموا سكنك
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'أحمد من السودان',
                role: 'طبيب تكليف - القصر العيني',
                content: 'سكنك وفرتلي وقت كبير. في يوم واحد لقيت سكن قريب من المستشفى والسعر كان مناسب جداً. المالك كان صادق والصور كانت مطابقة للواقع.',
                rating: 5,
              },
              {
                name: 'سارة من الأردن',
                role: 'ماجستير - AUC',
                content: 'AI Matching بتاع سكنك رهيب! اقترح عليا سكن بالظبط حسب متطلباتي. الأمان كان أولويتي ولقيت سكن في كمبوند ممتاز.',
                rating: 5,
              },
              {
                name: 'يوسف من اليمن',
                role: 'بكالوريوس هندسة - عين شمس',
                content: 'كنت خايف من النصب لكن نظام التقييمات في سكنك طمني. قريت تجارب طلاب تانيين واتأكدت إن المالك صادق قبل ما أروح أشوف السكن.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="p-6 relative">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-[#f4a261]/30" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3a5f]">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section id="cities" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-4">
              المدن المتاحة
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              سكنك متاح في 8 مدن مصرية رئيسية
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'القاهرة', universities: 'القاهرة، عين شمس، AUC', image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400' },
              { name: 'الإسكندرية', universities: 'الإسكندرية، الفرنسية', image: 'https://images.unsplash.com/photo-1570789210967-2cac24f2b7a7?w=400' },
              { name: 'المنصورة', universities: 'المنصورة', image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400' },
              { name: 'طنطا', universities: 'طنطا', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400' },
              { name: 'أسيوط', universities: 'أسيوط', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400' },
              { name: 'قنا', universities: 'قنا', image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=400' },
              { name: 'سوهاج', universities: 'سوهاج', image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=400' },
              { name: 'الزقازيق', universities: 'الزقازيق', image: 'https://images.unsplash.com/photo-1578895210405-907db4866baa?w=400' },
            ].map((city, index) => (
              <Card key={index} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative h-32">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 right-3 text-white">
                    <h3 className="font-bold text-lg">{city.name}</h3>
                    <p className="text-xs opacity-80">{city.universities}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a9d8f] rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              جاهز تلاقي سكنك؟
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              انضم لآلاف المغتربين اللي لقوا سكنهم من خلال سكنك. التسجيل مجاني!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register">
                <Button size="lg" className="bg-[#f4a261] hover:bg-[#f4a261]/90 text-white px-8">
                  سجل مجاناً
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                  عندي حساب
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e3a5f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-[#1e3a5f]" />
                </div>
                <span className="font-bold text-xl">سكنك</span>
              </div>
              <p className="text-white/70 text-sm">
                منصة سكن ذكية للمغتربين في مصر. جزء من برنامج TIEC Start-IT 2025.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link to="/" className="hover:text-white transition-colors">الرئيسية</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">المميزات</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">كيف يعمل</a></li>
                <li><Link to="/auth/register" className="hover:text-white transition-colors">التسجيل</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold mb-4">الدعم</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">مركز المساعدة</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الأسئلة الشائعة</a></li>
                <li><a href="#" className="hover:text-white transition-colors">تواصل معنا</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4">تواصل معنا</h4>
              <ul className="space-y-2 text-white/70">
                <li>contact@sakanakeg.com</li>
                <li>+20 123 456 7890</li>
                <li>القاهرة، مصر</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-white/60 text-sm">
            <p>© 2025 سكنك. جميع الحقوق محفوظة. | Sky Vision Team - TIEC Start-IT</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
