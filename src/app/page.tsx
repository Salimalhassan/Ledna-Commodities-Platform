

import PublicHeader from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Package, BarChart3, Users, ShieldCheck } from 'lucide-react';
import appLogo from '@/assets/logo.png';

export default function LandingPage() {
  const features = [
    {
      icon: <Package className="h-10 w-10 text-primary" />,
      title: 'Wide Range of Commodities',
      description: 'Explore and trade various agricultural products from trusted sellers.',
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      title: 'Market Insights',
      description: 'Stay updated with the latest market trends and price fluctuations.',
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'Verified Sellers',
      description: 'Connect with sellers whose identities are verified for secure transactions.',
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: 'Secure Platform',
      description: 'A robust platform ensuring safe and transparent commodity trading.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-secondary/30 to-background">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="https://placehold.co/1920x1080.png"
              alt="Agricultural background"
              fill
              style={{objectFit: 'cover'}}
              data-ai-hint="farm landscape"
            />
          </div>
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <Image src={appLogo} alt="Ledna Commodities Logo" width={480} height={480} className="mx-auto mb-6" data-ai-hint="company logo large" />
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 text-foreground">
              Welcome to Ledna Commodities
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Your trusted platform for sourcing and trading agricultural commodities. Connect with sellers, explore products, and grow your business.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary/10">
                <Link href="/dashboard/market-trends">View Market Trends</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12 text-foreground">
              Why Choose Ledna?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="items-center text-center">
                    {feature.icon}
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6 text-foreground">
              Ready to Grow Your Agri-Business?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join our community of farmers, traders, and businesses today.
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/auth/signup">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-card border-t">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Ledna Commodities Platform. All rights reserved.</p>
          <p className="text-sm mt-1">Empowering Agriculture, Connecting Markets.</p>
        </div>
      </footer>
    </div>
  );
}
