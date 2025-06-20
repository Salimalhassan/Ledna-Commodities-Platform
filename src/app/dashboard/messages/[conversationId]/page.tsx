
'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc, Timestamp } from 'firebase/firestore';
import { ArrowLeft, Languages, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { Message, Conversation, User } from '@/lib/types';
import { handleTranslateMessage } from '@/actions/aiActions';
import { sendMessage } from '@/actions/messageActions';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import MessageBubble from '@/components/MessageBubble';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Swahili', label: 'Swahili' },
  { value: 'French', label: 'French' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Tiv', label: 'Tiv' },
  { value: 'Yoruba', label: 'Yoruba' },
  { value: 'Igbo', label: 'Igbo' },
  { value: 'Hausa', label: 'Hausa' },
];

export default function ConversationPage({ params }: { params: { conversationId: string } }) {
  const { conversationId } = params;
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherParticipant, setOtherParticipant] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [isTranslating, setIsTranslating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!currentUser || !conversationId) return;

    // Fetch conversation metadata once
    const conversationRef = doc(db, 'conversations', conversationId);
    getDoc(conversationRef).then(async (docSnap) => {
      if (docSnap.exists()) {
        const convData = { id: docSnap.id, ...docSnap.data() } as Omit<Conversation, 'updatedAt'|'lastMessage'> & {updatedAt: Timestamp, lastMessage: {timestamp: Timestamp}};
        setConversation({
            ...convData,
            updatedAt: convData.updatedAt?.toDate().toISOString(),
            lastMessage: convData.lastMessage ? {
                ...convData.lastMessage,
                timestamp: convData.lastMessage.timestamp?.toDate().toISOString()
            } : null
        });

        const otherUserId = convData.participantIds.find(id => id !== currentUser.uid);
        if (otherUserId) {
          const userDoc = await getDoc(doc(db, 'users', otherUserId));
          if (userDoc.exists()) {
            const otherUserData = userDoc.data() as User;
            setOtherParticipant(otherUserData);
            // Set default translation to other user's language if available
            if (otherUserData.primarySpokenLanguage && languageOptions.some(l => l.value === otherUserData.primarySpokenLanguage)) {
                setTargetLanguage(otherUserData.primarySpokenLanguage);
            }
          }
        }
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Conversation not found.' });
        router.push('/dashboard/messages');
      }
      setIsLoading(false);
    });

    // Listen for real-time messages
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: (data.timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        } as Message;
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentUser, conversationId, router, toast]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    setIsSending(true);

    try {
      await sendMessage(conversationId, currentUser.uid, newMessage);
      setNewMessage('');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to send message.' });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleTranslate = async () => {
    if (!newMessage.trim()) return;
    setIsTranslating(true);
    try {
      const result = await handleTranslateMessage({
        textToTranslate: newMessage,
        sourceLanguage: 'Auto-detect',
        targetLanguage,
      });
       if (result.translatedText && !result.translatedText.startsWith('Error:')) {
         setNewMessage(result.translatedText);
         toast({ title: "Translation complete", description: `Translated to ${targetLanguage}` });
       } else {
         toast({ variant: 'destructive', title: 'Translation failed', description: result.translatedText });
       }
    } catch (error) {
       toast({ variant: 'destructive', title: 'Error', description: 'Could not perform translation.' });
    } finally {
        setIsTranslating(false);
    }
  };


  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-5rem)]">
        <header className="flex items-center gap-4 border-b bg-muted/40 px-4 lg:px-6 h-14">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-32" />
        </header>
        <main className="flex-1 overflow-auto p-4 space-y-4">
             <Skeleton className="h-16 w-3/4 my-2" />
             <Skeleton className="h-16 w-3/4 my-2 self-end ml-auto" />
             <Skeleton className="h-10 w-2/3 my-2" />
        </main>
      </div>
    )
  }
  
  if (!conversation || !otherParticipant) {
    return <div className="p-4">Conversation not found.</div>
  }
  
  const otherUserInitials = otherParticipant.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
        <header className="flex items-center gap-4 border-b bg-muted/40 px-4 lg:px-6 h-14">
            <Link href="/dashboard/messages" className="md:hidden">
                <Button variant="ghost" size="icon" >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            </Link>
            <Avatar className="h-10 w-10 border">
                <AvatarImage src={otherParticipant.avatarUrl} alt={otherParticipant.name}/>
                <AvatarFallback>{otherUserInitials}</AvatarFallback>
            </Avatar>
            <h2 className="font-semibold text-lg">{otherParticipant.name}</h2>
        </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <footer className="border-t p-4 bg-background">
        <form onSubmit={handleSendMessage} className="relative">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            rows={2}
            className="pr-24"
            disabled={isSending || isTranslating}
          />
          <Button type="submit" size="icon" className="absolute right-4 bottom-3" disabled={!newMessage.trim() || isSending || isTranslating}>
             {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
         <div className="flex items-center justify-end gap-2 mt-2">
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Translate to..." />
                </SelectTrigger>
                <SelectContent>
                    {languageOptions.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleTranslate} disabled={isTranslating || !newMessage.trim()}>
                {isTranslating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}
                Translate
            </Button>
        </div>
      </footer>
    </div>
  );
}
