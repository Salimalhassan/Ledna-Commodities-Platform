
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Languages, ArrowRightLeft } from 'lucide-react';
import { TranslateMessageInputSchema, type TranslateMessageInput } from '@/ai/flows/translate-message-flow';
import { handleTranslateMessage } from '@/actions/aiActions';

const languageOptions = [
  { value: 'Auto-detect', label: 'Auto-detect Source Language' },
  { value: 'English', label: 'English' },
  { value: 'Swahili', label: 'Swahili' },
  { value: 'French', label: 'French' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'German', label: 'German' },
  { value: 'Chinese (Simplified)', label: 'Chinese (Simplified)' },
  { value: 'Hausa', label: 'Hausa' },
  { value: 'Yoruba', label: 'Yoruba' },
  { value: 'Igbo', label: 'Igbo' },
  { value: 'Zulu', label: 'Zulu' },
  { value: 'Amharic', label: 'Amharic' },
  { value: 'Somali', label: 'Somali' },
  { value: 'Oromo', label: 'Oromo' },
  { value: 'Afrikaans', label: 'Afrikaans' },
  { value: 'Kinyarwanda', label: 'Kinyarwanda' },
];

const targetLanguageOptions = languageOptions.filter(lang => lang.value !== 'Auto-detect');


export default function CommunicationHelperPage() {
  const { toast } = useToast();
  const [translatedText, setTranslatedText] = useState('');
  const [detectedSourceLanguage, setDetectedSourceLanguage] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const form = useForm<z.infer<typeof TranslateMessageInputSchema>>({
    resolver: zodResolver(TranslateMessageInputSchema),
    defaultValues: {
      textToTranslate: '',
      sourceLanguage: 'Auto-detect',
      targetLanguage: 'English',
    },
  });

  async function onSubmit(values: z.infer<typeof TranslateMessageInputSchema>) {
    setIsTranslating(true);
    setTranslatedText('');
    setDetectedSourceLanguage('');

    try {
      const result = await handleTranslateMessage(values);
      if (result.translatedText.startsWith('Error:')) {
         const errorMessage = result.translatedText.substring('Error:'.length).trim();
         toast({
            variant: 'destructive',
            title: 'Translation Error',
            description: errorMessage || 'An unexpected error occurred during translation.',
          });
          setTranslatedText('');
      } else {
        setTranslatedText(result.translatedText);
        if (result.detectedSourceLanguage) {
          setDetectedSourceLanguage(result.detectedSourceLanguage);
          toast({
            title: 'Translation Successful',
            description: `Detected source language: ${result.detectedSourceLanguage}`,
          });
        } else {
           toast({
            title: 'Translation Successful',
          });
        }
      }
    } catch (error) {
      console.error('Translation submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Translate',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
      setTranslatedText('');
    } finally {
      setIsTranslating(false);
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline flex items-center">
            <Languages className="mr-3 h-7 w-7 text-primary" /> AI Communication Helper
          </CardTitle>
          <CardDescription>
            Bridge language gaps. Enter your message, select languages, and get a translation.
            The AI will try its best even with informal or misspelled text.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="textToTranslate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message to Translate</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter the message you want to translate..." {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <FormField
                  control={form.control}
                  name="sourceLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languageOptions.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select target language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {targetLanguageOptions.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full md:w-auto" disabled={isTranslating}>
                <ArrowRightLeft className="mr-2 h-5 w-5" />
                {isTranslating ? 'Translating...' : 'Translate Message'}
              </Button>
            </form>
          </Form>

          {translatedText && (
            <Card className="mt-8 bg-muted/30">
              <CardHeader>
                <CardTitle className="font-headline text-lg">Translated Message</CardTitle>
                {detectedSourceLanguage && (
                   <CardDescription>Original language detected as: {detectedSourceLanguage}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <Textarea value={translatedText} readOnly rows={5} className="bg-background cursor-text" />
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
