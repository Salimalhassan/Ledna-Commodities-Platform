
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import type { Metadata } from 'next';
import ProtectedRoute from '@/components/auth/ProtectedRoute'; // Import ProtectedRoute

export const metadata: Metadata = {
  title: 'Dashboard - Ledna Commodities',
  description: 'Manage your commodities and profile.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute> {/* Wrap content with ProtectedRoute */}
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-4 sm:px-6 sm:py-0 gap-4 bg-muted/40">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
