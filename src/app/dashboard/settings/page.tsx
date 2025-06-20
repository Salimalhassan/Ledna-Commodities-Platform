
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Cog, ShieldAlert, KeyRound, Bell, Loader2 } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Mock state for notification preferences ---
  const [notificationPrefs, setNotificationPrefs] = useState({
    newMessages: true,
    newReviews: true,
    transactionUpdates: false,
  });

  const handlePasswordReset = async () => {
    if (!currentUser?.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find your email address.",
      });
      return;
    }
    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      toast({
        title: "Password Reset Email Sent",
        description: `An email has been sent to ${currentUser.email} with instructions to reset your password.`,
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Failed to Send Email",
        description: "There was a problem sending the password reset email. Please try again later.",
      });
    } finally {
      setIsSendingReset(false);
    }
  };
  
  const handleAccountDeletion = async () => {
    setIsDeleting(true);
    // In a real app, this would call a secure backend function (e.g., a Firebase Cloud Function)
    // that verifies the user's identity and deletes all their associated data (listings, messages, etc.)
    // from Firestore before deleting the user from Firebase Auth.
    // For this demonstration, we'll just show a toast.
    setTimeout(() => {
        toast({
            variant: "destructive",
            title: "Account Deletion Initiated (Demo)",
            description: "In a real application, your account and all associated data would be scheduled for deletion.",
        });
        setIsDeleting(false);
    }, 2000);
  };

  const handleSaveNotificationPrefs = () => {
    // In a real app, this would call a server action to save preferences to the user's profile in Firestore.
    toast({
        title: "Preferences Saved (Demo)",
        description: "Your notification settings have been updated.",
    });
  };

  if (authLoading) {
    return (
       <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
         <Skeleton className="h-9 w-1/4 mb-4" />
         <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </CardContent>
                <CardFooter><Skeleton className="h-10 w-24" /></CardFooter>
            </Card>
             <Card>
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
         </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8 font-headline flex items-center">
        <Cog className="mr-3 h-8 w-8 text-primary" /> Settings
      </h1>
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
      
        {/* Notification Settings Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Bell className="mr-2 h-5 w-5"/>Notification Preferences</CardTitle>
            <CardDescription>
              Manage how you receive notifications from the platform. (This is a UI demo)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label htmlFor="notif-messages" className="text-base">New Messages</Label>
                    <p className="text-sm text-muted-foreground">Notify me when I receive a new message.</p>
                </div>
                <Switch 
                    id="notif-messages"
                    checked={notificationPrefs.newMessages}
                    onCheckedChange={(checked) => setNotificationPrefs(p => ({ ...p, newMessages: checked }))}
                />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label htmlFor="notif-reviews" className="text-base">New Reviews</Label>
                    <p className="text-sm text-muted-foreground">Notify me when my profile receives a review.</p>
                </div>
                <Switch
                    id="notif-reviews"
                    checked={notificationPrefs.newReviews}
                    onCheckedChange={(checked) => setNotificationPrefs(p => ({ ...p, newReviews: checked }))}
                />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label htmlFor="notif-transactions" className="text-base">Transaction Updates</Label>
                    <p className="text-sm text-muted-foreground">Notify me about the status of my transactions.</p>
                </div>
                <Switch
                    id="notif-transactions"
                    checked={notificationPrefs.transactionUpdates}
                    onCheckedChange={(checked) => setNotificationPrefs(p => ({ ...p, transactionUpdates: checked }))}
                />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveNotificationPrefs}>Save Preferences</Button>
          </CardFooter>
        </Card>

        {/* Account Management Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><KeyRound className="mr-2 h-5 w-5"/>Account Management</CardTitle>
            <CardDescription>
              Manage your account settings and security.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Change Password</h3>
              <p className="text-sm text-muted-foreground mb-3">
                We will send a password reset link to your registered email address: <span className="font-medium text-foreground">{currentUser?.email}</span>
              </p>
              <Button variant="outline" onClick={handlePasswordReset} disabled={isSendingReset}>
                 {isSendingReset && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium text-destructive mb-2 flex items-center"><ShieldAlert className="mr-2 h-5 w-5" /> Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Deleting your account is permanent and cannot be undone. All your data, including listings and messages, will be lost.
              </p>
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>Delete My Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action is irreversible. You will permanently delete your account
                        and all associated data from our servers. Please confirm you wish to proceed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={handleAccountDeletion}
                        disabled={isDeleting}
                      >
                         {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Yes, delete my account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
