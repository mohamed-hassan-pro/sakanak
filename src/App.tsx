// Sakanak - Main App Component
// التطبيق الرئيسي لمنصة سكنك

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from '@/lib/store';

// Layouts
import { ExpatNavbar } from '@/components/expat-navbar/ExpatNavbar';
import { OwnerSidebar } from '@/components/owner-sidebar/OwnerSidebar';

// Public Pages
import { LandingPage } from '@/sections/LandingPage';
import { LoginPage } from '@/sections/LoginPage';
import { RegisterPage } from '@/sections/RegisterPage';

// Expat Pages
import { ExpatDashboard } from '@/sections/ExpatDashboard';
import { ExpatSearch } from '@/sections/ExpatSearch';
import { ExpatFavorites } from '@/sections/ExpatFavorites';
import { ExpatMessages } from '@/sections/ExpatMessages';
import { ExpatPropertyDetails } from '@/sections/ExpatPropertyDetails';
import { ExpatBookings } from '@/sections/ExpatBookings';
import { PostVisitReview } from '@/sections/PostVisitReview';
import { OnboardingWizard } from '@/components/onboarding-wizard/OnboardingWizard';

// Owner Pages
import { OwnerDashboard } from '@/sections/OwnerDashboard';
import { OwnerAddProperty } from '@/sections/OwnerAddProperty';
import { OwnerProperties } from '@/sections/OwnerProperties';
import { OwnerAnalytics } from '@/sections/OwnerAnalytics';
import { OwnerMessages } from '@/sections/OwnerMessages';
import { OwnerEditProperty } from '@/sections/OwnerEditProperty';

// Protected Route Component
function ProtectedRoute({
  children,
  allowedRole
}: {
  children: React.ReactNode;
  allowedRole?: 'OWNER' | 'EXPAT';
}) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Expat Layout
function ExpatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExpatNavbar />
      <main>{children}</main>
    </div>
  );
}

// Owner Layout
function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <OwnerSidebar />
      <main className="flex-1 lg:mr-72">{children}</main>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Expat Routes */}
        <Route
          path="/dashboard/expat/onboarding"
          element={
            <ProtectedRoute allowedRole="EXPAT">
              <OnboardingWizard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/expat/dashboard"
          element={
            <ProtectedRoute allowedRole="EXPAT">
              <ExpatLayout>
                <ExpatDashboard />
              </ExpatLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/expat/search"
          element={
            <ProtectedRoute allowedRole="EXPAT">
              <ExpatLayout>
                <ExpatSearch />
              </ExpatLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/expat/favorites"
          element={
            <ProtectedRoute allowedRole="EXPAT">
              <ExpatLayout>
                <ExpatFavorites />
              </ExpatLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/expat/property/:id"
          element={
            <ProtectedRoute allowedRole="EXPAT">
              <ExpatLayout>
                <ExpatPropertyDetails />
              </ExpatLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/expat/messages"
          element={
            <ProtectedRoute allowedRole="EXPAT">
              <ExpatLayout>
                <ExpatMessages />
              </ExpatLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/expat/bookings"
          element={
            <ProtectedRoute allowedRole="EXPAT">
              <ExpatLayout>
                <ExpatBookings />
              </ExpatLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/expat/review/:bookingId"
          element={
            <ProtectedRoute allowedRole="EXPAT">
              <ExpatLayout>
                <PostVisitReview />
              </ExpatLayout>
            </ProtectedRoute>
          }
        />

        {/* Owner Routes */}
        <Route
          path="/dashboard/owner/dashboard"
          element={
            <ProtectedRoute allowedRole="OWNER">
              <OwnerLayout>
                <OwnerDashboard />
              </OwnerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/owner/properties"
          element={
            <ProtectedRoute allowedRole="OWNER">
              <OwnerLayout>
                <OwnerProperties />
              </OwnerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/owner/edit-property/:propertyId"
          element={
            <ProtectedRoute allowedRole="OWNER">
              <OwnerLayout>
                <OwnerEditProperty />
              </OwnerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/owner/add-property"
          element={
            <ProtectedRoute allowedRole="OWNER">
              <OwnerLayout>
                <OwnerAddProperty />
              </OwnerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/owner/messages"
          element={
            <ProtectedRoute allowedRole="OWNER">
              <OwnerLayout>
                <OwnerMessages />
              </OwnerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/owner/analytics"
          element={
            <ProtectedRoute allowedRole="OWNER">
              <OwnerLayout>
                <OwnerAnalytics />
              </OwnerLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </HashRouter>
  );
}

export default App;
