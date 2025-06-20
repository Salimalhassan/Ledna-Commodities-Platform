
'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { currentUser, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and the user is not an admin, redirect them.
    if (!loading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [currentUser, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Verifying permissions...</p>
      </div>
    );
  }

  if (!isAdmin) {
    // This is a fallback view while the redirect is in progress.
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <ShieldAlert className="h-12 w-12 text-destructive" />
            <h2 className="mt-4 text-xl font-semibold">Access Denied</h2>
            <p className="mt-2 text-muted-foreground">You do not have permission to view this page.</p>
            <p className="mt-1 text-sm text-muted-foreground">Redirecting...</p>
        </div>
    );
  }

  // If the user is an admin, render the children.
  return <>{children}</>;
}
