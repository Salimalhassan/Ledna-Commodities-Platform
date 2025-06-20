
'use server';
/**
 * @fileOverview AI-powered message translation flow.
 *
 * - translateMessage - A function that handles message translation.
 * - TranslateMessageInput - The input type for the translateMessage function.
 * - TranslateMessageOutput - The return type for the translateMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const TranslateMessageInputSchema = z.object({
  textToTranslate: z.string().min(1, {message: 'Message to translate cannot be empty.'})
    .describe('The text message that needs to be translated.'),
  sourceLanguage: z.string().describe("The language of the input text (e.g., 'English', 'Swahili', 'Auto-detect'). If 'Auto-detect', the AI will try to determine the source language."),
  targetLanguage: z.string().min(2, {message: 'Target language must be specified.'})
    .describe("The language to translate the text into (e.g., 'English', 'Swahili')."),
});
export type TranslateMessageInput = z.infer<typeof TranslateMessageInputSchema>;

const TranslateMessageOutputSchema = z.object({
  translatedText: z.string().describe('The translated text message.'),
  detectedSourceLanguage: z.string().optional().describe('The language detected by the AI if sourceLanguage was set to "Auto-detect".'),
});
export type TranslateMessageOutput = z.infer<typeof TranslateMessageOutputSchema>;

export async function translateMessage(input: TranslateMessageInput): Promise<TranslateMessageOutput> {
  return translateMessageFlow(input);
}

const translateMessagePrompt = ai.definePrompt({
  name: 'translateMessagePrompt',
  input: {schema: TranslateMessageInputSchema},
  output: {schema: TranslateMessageOutputSchema},
  prompt: `You are a helpful translation assistant designed to bridge language gaps between local farmers and international buyers.
Many users may have limited literacy or may not be native speakers of the input language.
Therefore, be robust to misspellings, grammatical errors, and informal language. Focus on conveying the core meaning and intent of the message accurately.
If any specific regional nuances or formality levels are particularly important for the {{{targetLanguage}}}, please consider them in your translation, while still prioritizing clear communication of the original intent.

Translate the following text:
Input Text: {{{textToTranslate}}}
Source Language: {{{sourceLanguage}}}
Target Language: {{{targetLanguage}}}

If the Source Language is 'Auto-detect', please first determine the source language of the Input Text.

Provide the translation in the Target Language.
If you detected the source language, also provide the name of the detected source language.
Your response should contain *only* the JSON object matching the output schema. Do not include any introductory or concluding remarks, just the direct JSON output for the translation and, if applicable, the detected source language.
`,
});

const translateMessageFlow = ai.defineFlow(
  {
    name: 'translateMessageFlow',
    inputSchema: TranslateMessageInputSchema,
    outputSchema: TranslateMessageOutputSchema,
  },
  async (input) => {
    const {output} = await translateMessagePrompt(input);
    if (!output) {
      throw new Error("Translation failed to produce an output.");
    }
    return output;
  }
);
