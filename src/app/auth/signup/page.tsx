
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';
import appLogo from '@/assets/logo.png';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SignupSchema } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: 'buyer', // Default to buyer, or could be undefined
    },
  });

  function onSubmit(values: z.infer<typeof SignupSchema>) {
    // Placeholder for actual signup logic
    console.log('Signup submitted:', values);
     toast({
      title: "Signup Attempted",
      description: `Account creation for ${values.userType} is a placeholder.`,
    });
    // Simulate successful signup redirect
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Link href="/" className="flex items-center gap-2 text-2xl font-semibold text-primary mb-8">
          <Image src={appLogo} alt="Ledna Commodities Logo" width={96} height={96} data-ai-hint="company logo" />
          <span className="font-headline">Ledna Commodities</span>
        </Link>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Join Ledna to start trading commodities.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>I am a...</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="seller" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Seller / Farmer
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="buyer" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Buyer
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
