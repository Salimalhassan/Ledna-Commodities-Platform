
'use client';

import type { Message } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { currentUser } = useAuth();
  const isSender = currentUser?.uid === message.senderId;

  // Function to format timestamp, handles potential invalid dates
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "sending..."; // Or some other placeholder for invalid/pending timestamps
      }
      return format(date, 'h:mm a');
    } catch (e) {
      return "invalid time";
    }
  };

  return (
    <div
      className={cn(
        'flex w-full items-end gap-2',
        isSender ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-1',
          isSender ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'max-w-xs rounded-2xl px-4 py-2 md:max-w-md',
            isSender
              ? 'rounded-br-none bg-primary text-primary-foreground'
              : 'rounded-bl-none bg-muted'
          )}
        >
          <p className="whitespace-pre-wrap text-sm">{message.text}</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
