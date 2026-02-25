// Owner Properties Management Page
// صفحة إدارة العقارات للمالك

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Building2,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Edit3,
    Trash2,
    CheckCircle,
    TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { usePropertiesStore, useAuthStore, useBookingsStore } from '@/lib/store';
import { seedProperties, seedBookings } from '@/lib/seed-data';
import type { Property, Booking } from '@/types';

export function OwnerProperties() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { properties, setProperties } = usePropertiesStore();
    const { bookings, setBookings } = useBookingsStore();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (properties.length === 0) setProperties(seedProperties as Property[]);
        if (bookings.length === 0) setBookings(seedBookings as Booking[]);
    }, []);

    const ownerProperties = properties.filter(p => p.ownerId === (user?.id || 'owner-001'));

    const getPropertyStats = (propertyId: string) => {
        const propertyBookings = bookings.filter(b => b.propertyId === propertyId);
        return {
            totalBookings: propertyBookings.length,
            pendingBookings: propertyBookings.filter(b => b.status === 'pending').length,
            confirmedBookings: propertyBookings.filter(b => b.status === 'confirmed').length
        };
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1e3a5f]">عقاراتي</h1>
                    <p className="text-gray-500">إدارة السكنات الخاصة بك ومتابعة حالتها</p>
                </div>
                <Button onClick={() => navigate('/dashboard/owner/add-property')} className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 gap-2 h-12 px-6">
                    <Plus className="w-5 h-5" />
                    إضافة سكن جديد
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 flex items-center justify-between bg-blue-50 border-blue-100">
                    <div>
                        <p className="text-sm text-blue-600 font-medium">إجمالي السكنات</p>
                        <h3 className="text-3xl font-bold text-[#1e3a5f]">{ownerProperties.length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                        <Building2 className="w-6 h-6" />
                    </div>
                </Card>
                <Card className="p-6 flex items-center justify-between bg-green-50 border-green-100">
                    <div>
                        <p className="text-sm text-green-600 font-medium">سكنات نشطة</p>
                        <h3 className="text-3xl font-bold text-[#1e3a5f]">{ownerProperties.length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                </Card>
                <Card className="p-6 flex items-center justify-between bg-orange-50 border-orange-100">
                    <div>
                        <p className="text-sm text-orange-600 font-medium">طلبات معاينة معلقة</p>
                        <h3 className="text-3xl font-bold text-[#1e3a5f]">
                            {bookings.filter(b => b.status === 'pending' && ownerProperties.some(p => p.id === b.propertyId)).length}
                        </h3>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm border border-orange-100">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </Card>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="بحث عن سكن بالاسم أو المنطقة..."
                        className="pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    تصفية
                </Button>
            </div>

            {/* Properties List */}
            <div className="grid gap-6">
                {ownerProperties
                    .filter(p => p.title.includes(searchTerm) || p.location.includes(searchTerm))
                    .map((property) => {
                        const stats = getPropertyStats(property.id);
                        return (
                            <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow border-2 border-transparent hover:border-blue-100">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-64 h-40 md:h-auto">
                                        <img src={property.images[0]} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-xl font-bold text-[#1e3a5f]">{property.title}</h3>
                                                    <Badge variant="outline" className="text-[10px] py-0">
                                                        {property.type === 'shared_bed' ? 'سرير' : property.type === 'private_room' ? 'غرفة' : 'شقة'}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>125 مشاهدة هذا الأسبوع</span>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => navigate(`/dashboard/expat/property/${property.id}`)}>
                                                        <Eye className="w-4 h-4 ml-2" /> عرض التفاصيل
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => navigate(`/dashboard/owner/edit-property/${property.id}`)}>
                                                        <Edit3 className="w-4 h-4 ml-2" /> تعديل بيانات السكن
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-500">
                                                        <Trash2 className="w-4 h-4 ml-2" /> حذف السكن
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                            <div className="flex flex-col p-2 bg-gray-50 rounded-lg border border-gray-100">
                                                <span className="text-[10px] text-gray-500">إجمالي الطلبات</span>
                                                <span className="font-bold text-[#1e3a5f]">{stats.totalBookings}</span>
                                            </div>
                                            <div className="flex flex-col p-2 bg-orange-50 rounded-lg border border-orange-100">
                                                <span className="text-[10px] text-orange-600">طلبات معلقة</span>
                                                <span className="font-bold text-orange-600">{stats.pendingBookings}</span>
                                            </div>
                                            <div className="flex flex-col p-2 bg-green-50 rounded-lg border border-green-100">
                                                <span className="text-[10px] text-green-600">زيارات محددة</span>
                                                <span className="font-bold text-green-600">{stats.confirmedBookings}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-[#1e3a5f] font-bold">
                                                <span>{property.price.toLocaleString()}</span>
                                                <span className="text-xs font-normal text-gray-400">ج/شهر</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/owner/dashboard')}>
                                                    عرض الطلبات
                                                </Button>
                                                <Link to="/dashboard/owner/analytics">
                                                    <Button variant="ghost" size="sm" className="text-blue-600">
                                                        الإحصائيات
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
            </div>
        </div>
    );
}
