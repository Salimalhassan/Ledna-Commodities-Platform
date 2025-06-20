'use client';

import { Bell, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import type { Notification } from "@/lib/types";
import { collection, query, where, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { markAllNotificationsAsRead, markNotificationAsRead } from "@/actions/notificationActions";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

function NotificationItem({ notification }: { notification: Notification }) {
  const router = useRouter();

  const handleNotificationClick = async () => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id);
    }
    router.push(notification.link);
  };

  return (
    <SheetClose asChild>
      <button
        onClick={handleNotificationClick}
        className={cn(
          "w-full text-left p-4 rounded-lg transition-colors",
          notification.isRead ? "bg-transparent hover:bg-muted/50" : "bg-primary/10 hover:bg-primary/20"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-1">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      </button>
    </SheetClose>
  );
}

export default function NotificationBell() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!currentUser?.uid) {
      setIsLoading(false);
      return;
    }

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      } as Notification));
      
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter(n => !n.isRead).length);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const handleMarkAllAsRead = async () => {
    if (!currentUser?.uid || unreadCount === 0) return;
    await markAllNotificationsAsRead(currentUser.uid);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative overflow-visible rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          {isLoading ? (
            <div className="space-y-4 py-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-2 py-4">
              {notifications.map(n => <NotificationItem key={n.id} notification={n} />)}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <Bell className="h-12 w-12 mb-4" />
              <p>You have no notifications.</p>
            </div>
          )}
        </div>
        {notifications.length > 0 && (
          <SheetFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
