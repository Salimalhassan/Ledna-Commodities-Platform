

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import appLogo from '@/assets/logo.png';

export default function PublicHeader() {
  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Image src={appLogo} alt="Ledna Commodities Logo" width={84} height={84} data-ai-hint="company logo" />
          <span className="font-headline">Ledna Commodities</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
