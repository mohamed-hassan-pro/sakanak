// Owner Sidebar Component
// القائمة الجانبية للملاك

import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Settings,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store';

const menuItems = [
  { 
    id: 'dashboard', 
    label: 'لوحة التحكم', 
    icon: LayoutDashboard, 
    path: '/dashboard/owner/dashboard' 
  },
  { 
    id: 'properties', 
    label: 'عقاراتي', 
    icon: Building2, 
    path: '/dashboard/owner/properties' 
  },
  { 
    id: 'add-property', 
    label: 'إضافة عقار', 
    icon: PlusCircle, 
    path: '/dashboard/owner/add-property' 
  },
  { 
    id: 'messages', 
    label: 'الرسائل', 
    icon: MessageSquare, 
    path: '/dashboard/owner/messages',
    badge: 3
  },
  { 
    id: 'analytics', 
    label: 'الإحصائيات', 
    icon: BarChart3, 
    path: '/dashboard/owner/analytics' 
  },
];

export function OwnerSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 right-0 h-screen w-72 bg-white border-l shadow-lg z-40 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-[#1e3a5f]">سكنك</h1>
              <p className="text-xs text-gray-500">لوحة تحكم المالك</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-[#1e3a5f] text-white">
                {user?.name?.charAt(0) || 'م'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{user?.name || 'مالك تجريبي'}</h3>
              <p className="text-xs text-gray-500">{user?.email || 'owner@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#1e3a5f] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge className="bg-red-500 text-white">
                    {item.badge}
                  </Badge>
                )}
                {isActive && <ChevronRight className="w-4 h-4" />}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-600"
            >
              <Settings className="w-5 h-5" />
              الإعدادات
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-600"
            >
              <Bell className="w-5 h-5" />
              الإشعارات
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="w-5 h-5" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
