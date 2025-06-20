
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import type { Conversation } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function ConversationListItem({ conversation, currentUserId }: { conversation: Conversation; currentUserId: string }) {
  const otherParticipantId = conversation.participantIds.find(id => id !== currentUserId);
  if (!otherParticipantId) return null;

  const otherParticipantInfo = conversation.participantInfo[otherParticipantId];
  const lastMessage = conversation.lastMessage;
  const initials = otherParticipantInfo.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';

  return (
    <Link href={`/dashboard/messages/${conversation.id}`} className="block">
      <Card className="hover:bg-muted/50 transition-colors">
        <CardContent className="flex items-center gap-4 p-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={otherParticipantInfo.avatarUrl} alt={otherParticipantInfo.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold truncate">{otherParticipantInfo.name}</h3>
              {lastMessage && (
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true })}
                </p>
              )}
            </div>
            {lastMessage ? (
              <p className="text-sm text-muted-foreground truncate">
                {lastMessage.senderId === currentUserId ? 'You: ' : ''}
                {lastMessage.text}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No messages yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function MessagesPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
        if (!authLoading) setIsLoading(false);
        return;
    };

    setIsLoading(true);
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participantIds', 'array-contains', currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const convos = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          lastMessage: data.lastMessage ? {
              ...data.lastMessage,
              timestamp: (data.lastMessage.timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          } : null
        } as Conversation;
      });
      setConversations(convos);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching conversations: ", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-8 font-headline">Your Messages</h1>
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="flex items-center gap-4 p-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8 font-headline flex items-center">
        <MessageSquare className="mr-3 h-8 w-8 text-primary" /> Your Messages
      </h1>
      {conversations.length > 0 ? (
        <div className="space-y-4">
          {conversations.map(convo => (
            <ConversationListItem key={convo.id} conversation={convo} currentUserId={currentUser!.uid} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
            <CardHeader>
                <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle>No Conversations Yet</CardTitle>
                <CardDescription>
                    When you contact a seller, your conversation will appear here.
                </CardDescription>
            </CardHeader>
        </Card>
      )}
    </div>
  );
}
