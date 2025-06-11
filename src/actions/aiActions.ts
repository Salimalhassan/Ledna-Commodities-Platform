
'use server';

import { translateMessage, type TranslateMessageInput, type TranslateMessageOutput } from '@/ai/flows/translate-message-flow';

export async function handleTranslateMessage(input: TranslateMessageInput): Promise<TranslateMessageOutput> {
  try {
    const result = await translateMessage(input);
    return result;
  } catch (error) {
    console.error('Error in handleTranslateMessage:', error);
    // Consider returning a more user-friendly error object or re-throwing a custom error
    if (error instanceof Error) {
      return { translatedText: `Error: ${error.message}` };
    }
    return { translatedText: "An unexpected error occurred during translation." };
  }
}
