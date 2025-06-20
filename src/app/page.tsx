
'use client';

import PublicHeader from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { Package, BarChart3, Users, ShieldCheck, Lightbulb, Zap, DollarSign, Leaf, Handshake, Search, UserPlus, ThumbsUp, MessageCircle, Smartphone, Mail } from 'lucide-react';
import appLogo from '@/assets/logo.png';
import cornImage from '@/assets/corn.jpg';
import coffeeImage from '@/assets/coffee.jpg';
import haybalesJpg from '@/assets/haybales.jpg';
import soyaJpg from '@/assets/soya.jpg';
import paddyJpg from '@/assets/paddy.jpg';
import farmerImage from '@/assets/farmer.jpg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface FeaturedCommodity {
  src: string | StaticImageData;
  alt: string;
  title: string;
  description: string;
  dataAiHint: string;
  placeholder?: "blur" | "empty";
}

export default function LandingPage() {
  const coreFeatures = [
    {
      icon: <Package className="h-10 w-10 text-primary group-hover:text-accent group-hover:scale-110 transition-all duration-300 ease-in-out" />,
      title: 'Direct Commodity Listings',
      description: 'Farmers showcase products; buyers discover a wide range of commodities directly.',
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-primary group-hover:text-accent group-hover:scale-110 transition-all duration-300 ease-in-out" />,
      title: 'AI Communication Helper',
      description: 'Overcome language and literacy barriers with AI-powered translation for seamless negotiation.',
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary group-hover:text-accent group-hover:scale-110 transition-all duration-300 ease-in-out" />,
      title: 'Verified Users & Trust',
      description: 'Connect with identity-verified sellers and buyers to foster secure and transparent transactions.',
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-primary group-hover:text-accent group-hover:scale-110 transition-all duration-300 ease-in-out" />,
      title: 'Market Insights',
      description: 'Access relevant market trends and pricing information to make informed decisions.',
    },
  ];

  const farmerBenefits = [
    { title: "Wider Market Access", description: "Reach beyond local markets to national and international buyers.", icon: <Zap className="h-8 w-8 text-primary group-hover:scale-110 group-hover:text-accent transition-all duration-300 ease-in-out" /> },
    { title: "Fairer Pricing", description: "Gain more control over your pricing by connecting directly with buyers.", icon: <DollarSign className="h-8 w-8 text-primary group-hover:scale-110 group-hover:text-accent transition-all duration-300 ease-in-out" /> },
    { title: "Reduced Barriers", description: "Our AI tools help bridge communication gaps, even with limited literacy.", icon: <MessageCircle className="h-8 w-8 text-primary group-hover:scale-110 group-hover:text-accent transition-all duration-300 ease-in-out" /> },
  ];

  const buyerBenefits = [
    { title: "Diverse Sourcing", description: "Find a wide variety of agricultural products from numerous verified farmers.", icon: <Search className="h-8 w-8 text-primary group-hover:scale-110 group-hover:text-accent transition-all duration-300 ease-in-out" /> },
    { title: "Direct from Farm", description: "Source fresh commodities directly from producers, ensuring quality.", icon: <Leaf className="h-8 w-8 text-primary group-hover:scale-110 group-hover:text-accent transition-all duration-300 ease-in-out" /> },
    { title: "Efficient Communication", description: "Connect and negotiate effectively, regardless of language differences.", icon: <Smartphone className="h-8 w-8 text-primary group-hover:scale-110 group-hover:text-accent transition-all duration-300 ease-in-out" /> },
  ];

  const featuredCommodities: FeaturedCommodity[] = [
    {
      src: cornImage,
      alt: "Kenyan Corn",
      title: "Fresh Corn",
      description: "Locally sourced Kenyan corn, fresh from the farm.",
      dataAiHint: "corn cob maize",
      placeholder: "blur",
    },
    {
      src: coffeeImage,
      alt: "Kenyan Coffee Beans",
      title: "Kenyan AA Coffee Beans",
      description: "Rich and aromatic Grade AA coffee beans.",
      dataAiHint: "coffee beans sack",
      placeholder: "blur",
    },
    {
      src: haybalesJpg,
      alt: "Hay Bales",
      title: "Quality Hay Bales",
      description: "Nutrient-rich hay for livestock feed.",
      dataAiHint: "hay bale farm",
      placeholder: "blur",
    },
    {
      src: soyaJpg,
      alt: "Soya Beans",
      title: "Soya Beans",
      description: "High-protein soya beans, versatile for many uses.",
      dataAiHint: "soya beans pile",
      placeholder: "blur",
    },
    {
      src: paddyJpg,
      alt: "Rice Paddy",
      title: "Rice Paddy",
      description: "Ready for harvest rice paddy.",
      dataAiHint: "rice paddy field",
      placeholder: "blur",
    },
    {
      src: coffeeImage, // Re-using coffee image for variety in example
      alt: "Roasted Coffee Blend",
      title: "Roasted Coffee Blend",
      description: "Perfectly roasted for a smooth and rich taste.",
      dataAiHint: "coffee cup roasted",
      placeholder: "blur",
    },
  ];


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PublicHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/20 via-background to-accent/10 overflow-hidden">
          <div className="absolute inset-0 opacity-10"> {/* Increased opacity slightly */}
            <Image
              src={coffeeImage} 
              alt="Coffee plantation background"
              fill
              style={{objectFit: 'cover'}}
              data-ai-hint="coffee plantation farm"
              placeholder="blur"
              priority
            />
          </div>
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <Image src={appLogo} alt="Ledna Commodities Logo" width={160} height={160} className="mx-auto mb-6 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out" data-ai-hint="company logo large" priority />
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6">
              Ledna Commodities
            </h1>
            <p className="text-2xl md:text-3xl font-light text-primary mb-8">
              Bridging Fields, Connecting Worlds.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Empowering local farmers and streamlining global agricultural trade through direct connections and AI-powered communication.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                <Link href="/auth/signup">Join Ledna</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary/10 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* The Challenge We Address Section */}
        <section id="challenge" className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">The Challenge We Address</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Millions of smallholder farmers face significant barriers to accessing fair markets and communicating effectively, limiting their growth and potential.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Users className="h-12 w-12 text-destructive group-hover:scale-110 transition-transform duration-300 ease-in-out mb-2" />, title: "Limited Market Access", desc: "Farmers often rely on local middlemen, receiving lower prices and missing out on larger opportunities." },
                { icon: <MessageCircle className="h-12 w-12 text-destructive group-hover:scale-110 transition-transform duration-300 ease-in-out mb-2" />, title: "Communication Gaps", desc: "Language and literacy differences hinder effective negotiation and trust-building with diverse buyers." },
                { icon: <BarChart3 className="h-12 w-12 text-destructive group-hover:scale-110 transition-transform duration-300 ease-in-out mb-2" />, title: "Information Asymmetry", desc: "Lack of transparent market data prevents farmers from making informed selling decisions." },
              ].map((item, idx) => (
                <Card key={idx} className="group shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:border-primary/30 hover:-translate-y-2">
                  <CardHeader className="items-center text-center">
                    {item.icon}
                    <CardTitle className="font-headline">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Solution Section */}
        <section id="solution" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Our Solution: Ledna Commodities Platform</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Ledna is a mobile-first platform designed to directly connect local farmers with a global network of buyers, leveraging AI to break down communication barriers and foster transparent trade.
              </p>
            </div>
             <div className="max-w-4xl mx-auto">
                <Image
                  src={farmerImage}
                  alt="Farmer using Ledna platform"
                  width={1200}
                  height={600}
                  className="rounded-lg shadow-2xl mb-12 hover:shadow-primary/20 transition-shadow duration-300 ease-in-out"
                  data-ai-hint="farmer technology"
                  placeholder="blur"
                />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">How Ledna Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {[
                { icon: <UserPlus className="h-10 w-10" />, title: "1. Sign Up & List", desc: "Farmers and buyers create profiles. Farmers easily list their commodities with details and images." },
                { icon: <Search className="h-10 w-10" />, title: "2. Discover & Connect", desc: "Buyers search and filter for specific commodities. Our AI translates messages for clear communication." },
                { icon: <ThumbsUp className="h-10 w-10" />, title: "3. Transact & Grow", desc: "Parties agree on terms and proceed with trade. Ledna fosters trust and opens new growth avenues." },
              ].map((step, idx) => (
                 <div key={idx} className="group flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-background/50 hover:shadow-lg">
                  <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 inline-flex shadow-md transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-foreground group-hover:rotate-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Sections */}
        <section id="benefits" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold font-headline mb-6">Empowering Farmers</h3>
                <ul className="space-y-6">
                  {farmerBenefits.map(benefit => (
                    <li key={benefit.title} className="group flex items-start gap-4 p-3 rounded-md hover:bg-muted/50 hover:shadow-sm transition-all duration-300 ease-in-out">
                      <div className="flex-shrink-0 mt-1">{benefit.icon}</div>
                      <div>
                        <h4 className="text-lg font-semibold">{benefit.title}</h4>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold font-headline mb-6">Advantaging Buyers</h3>
                 <ul className="space-y-6">
                  {buyerBenefits.map(benefit => (
                    <li key={benefit.title} className="group flex items-start gap-4 p-3 rounded-md hover:bg-muted/50 hover:shadow-sm transition-all duration-300 ease-in-out">
                      <div className="flex-shrink-0 mt-1">{benefit.icon}</div>
                      <div>
                        <h4 className="text-lg font-semibold">{benefit.title}</h4>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section id="features" className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
              Platform Core Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreFeatures.map((feature, index) => (
                <Card key={index} className="group shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-accent/50 hover:-translate-y-2 bg-card">
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

        {/* Our Vision Section */}
        <section id="vision" className="py-16 md:py-24 bg-primary/10">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <Lightbulb className="h-16 w-16 text-primary mx-auto mb-6 hover:text-accent hover:scale-110 transition-all duration-300 ease-in-out" />
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6 text-foreground">Our Vision</h2>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-3xl mx-auto">
              To create a world where every farmer, regardless of location or literacy, has an equal opportunity to thrive by participating in fair and transparent global trade. We envision Ledna as the leading catalyst for this transformation in Africa and beyond.
            </p>
          </div>
        </section>

        {/* Meet the Team (Placeholder) Section */}
        <section id="team" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">Meet the (Future) Team</h2>
            <p className="text-lg text-muted-foreground text-center max-w-xl mx-auto mb-10">
              We are a passionate group dedicated to leveraging technology for agricultural empowerment. (Full team details coming soon!)
            </p>
            <div className="flex justify-center">
              <Card className="w-full max-w-sm p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out">
                <CardHeader className="items-center text-center p-0">
                    <Avatar className="h-24 w-24 mb-4 group-hover:shadow-lg transition-shadow duration-300 ease-in-out">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="Founder" data-ai-hint="person professional" />
                        <AvatarFallback>LC</AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-headline text-xl">Your Name Here</CardTitle>
                    <CardDescription>Founder & CEO (Placeholder)</CardDescription>
                </CardHeader>
                <CardContent className="text-center mt-4 p-0">
                    <p className="text-sm text-muted-foreground">"Driven to connect communities and create sustainable impact through technology."</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">
              Ready to Transform Agricultural Trade?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join our community of farmers, traders, and businesses. Sign up today to start connecting and growing.
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg">
              <Link href="/auth/signup">Sign Up Now</Link>
            </Button>
          </div>
        </section>

        {/* Featured Commodities Carousel Section */}
        <section id="featured-commodities" className="py-16 md:py-24 bg-muted/20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12">
              Featured Commodities
            </h2>
            <Carousel
              plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
              className="w-full max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto"
              opts={{ loop: true }}
            >
              <CarouselContent>
                {featuredCommodities.map((commodity, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1.5 transform group">
                        <CardContent className="flex flex-col items-center justify-center p-4 aspect-[4/3]">
                          <Image
                            src={commodity.src}
                            alt={commodity.alt}
                            width={400}
                            height={300}
                            className="rounded-md mb-4 object-cover w-full h-40 group-hover:scale-105 transition-transform duration-300 ease-in-out"
                            data-ai-hint={commodity.dataAiHint}
                            placeholder={commodity.placeholder}
                          />
                          <h3 className="text-lg font-semibold font-headline">{commodity.title}</h3>
                          <p className="text-sm text-muted-foreground text-center px-2">{commodity.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex hover:bg-primary/20 transition-colors" />
              <CarouselNext className="hidden sm:flex hover:bg-primary/20 transition-colors" />
            </Carousel>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-primary mb-2 group">
                <Image src={appLogo} alt="Ledna Commodities Logo" width={48} height={48} data-ai-hint="company logo small" className="group-hover:rotate-[10deg] transition-transform duration-300 ease-in-out"/>
                <span className="font-headline">Ledna Commodities</span>
              </Link>
              <p className="text-sm text-muted-foreground">Empowering Agriculture, Connecting Markets.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="#solution" className="text-muted-foreground hover:text-primary hover:underline transition-colors duration-300 ease-in-out">Our Solution</Link></li>
                <li><Link href="#how-it-works" className="text-muted-foreground hover:text-primary hover:underline transition-colors duration-300 ease-in-out">How It Works</Link></li>
                <li><Link href="#features" className="text-muted-foreground hover:text-primary hover:underline transition-colors duration-300 ease-in-out">Features</Link></li>
                <li><Link href="/auth/signup" className="text-muted-foreground hover:text-primary hover:underline transition-colors duration-300 ease-in-out">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Contact (Placeholder)</h5>
               <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out group"><Mail className="h-4 w-4 text-primary/80 group-hover:text-primary" /> info@lednacommodities.com</li>
                <li className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out group"><Smartphone className="h-4 w-4 text-primary/80 group-hover:text-primary" /> +1 (234) 567-890</li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Ledna Commodities Platform. All rights reserved.</p>
            <p className="mt-1">
              <Link href="#" className="hover:text-primary hover:underline transition-colors">Privacy Policy (Placeholder)</Link> | <Link href="#" className="hover:text-primary hover:underline transition-colors">Terms of Service (Placeholder)</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
