

import Link from 'next/link';
import Image from 'next/image';
import AppSidebarNav from './AppSidebarNav';

export default function AppSidebar() {
  return (
    <aside className="hidden border-r bg-sidebar text-sidebar-foreground md:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b border-sidebar-border px-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-sidebar-primary">
            <Image src="https://placehold.co/28x28.png" alt="Ledna Platform Logo" width={28} height={28} data-ai-hint="company logo" />
            <span className="font-headline">Ledna Platform</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <AppSidebarNav />
        </div>
        {/* Optional Footer in Sidebar */}
        {/* <div className="mt-auto p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/70">&copy; {new Date().getFullYear()} Ledna</p>
        </div> */}
      </div>
    </aside>
  );
}
