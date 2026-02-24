// Expat Navbar Component
// شريط التنقل للمغتربين

import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  Search,
  Heart,
  MessageSquare,
  Menu,
  X,
  Bell,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store';

const navItems = [
  { id: 'dashboard', label: 'الرئيسية', icon: Home, path: '/dashboard/expat/dashboard' },
  { id: 'search', label: 'البحث', icon: Search, path: '/dashboard/expat/search' },
  { id: 'favorites', label: 'المفضلة', icon: Heart, path: '/dashboard/expat/favorites' },
  { id: 'messages', label: 'الرسائل', icon: MessageSquare, path: '/dashboard/expat/messages', badge: 2 },
];

export function ExpatNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-[#1e3a5f] hidden sm:block">سكنك</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'bg-[#1e3a5f] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* AI Match Button */}
              <NavLink
                to="/dashboard/expat/onboarding"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f4a261] to-[#e76f51] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Matching</span>
              </NavLink>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              {/* User Menu */}
              <div className="hidden md:flex items-center gap-2">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-[#1e3a5f] text-white text-sm">
                    {user?.name?.charAt(0) || 'م'}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-1">
              {/* AI Match Button Mobile */}
              <NavLink
                to="/dashboard/expat/onboarding"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#f4a261] to-[#e76f51] text-white rounded-lg mb-3"
              >
                <Sparkles className="w-5 h-5" />
                <span>AI Matching</span>
              </NavLink>

              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-[#1e3a5f] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge className="bg-red-500 text-white">
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                );
              })}

              {/* User Info Mobile */}
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-[#1e3a5f] text-white">
                      {user?.name?.charAt(0) || 'م'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{user?.name || 'مغترب تجريبي'}</p>
                    <p className="text-sm text-gray-500">{user?.email || 'expat@example.com'}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
