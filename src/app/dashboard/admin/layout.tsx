
import AdminRoute from '@/components/auth/AdminRoute';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Ledna Commodities',
  description: 'Manage users, listings, and platform content.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminRoute>{children}</AdminRoute>;
}
