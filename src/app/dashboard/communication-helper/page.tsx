
'use client';

import { useState, useEffect } from 'react';
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
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const baseLanguageOptions = [
  { value: 'Auto-detect', label: 'Auto-detect Source Language' },
  { value: 'Afrikaans', label: 'Afrikaans' },
  { value: 'Amharic', label: 'Amharic' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Chinese (Simplified)', label: 'Chinese (Simplified)' },
  { value: 'English', label: 'English' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
  { value: 'Hausa', label: 'Hausa' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Igbo', label: 'Igbo' },
  { value: 'Kinyarwanda', label: 'Kinyarwanda' },
  { value: 'Oromo', label: 'Oromo' },
  { value: 'Portuguese', label: 'Portuguese' },
  { value: 'Somali', label: 'Somali' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'Swahili', label: 'Swahili' },
  { value: 'Tiv', label: 'Tiv' },
  { value: 'Yoruba', label: 'Yoruba' },
  { value: 'Zulu', label: 'Zulu' },
].sort((a, b) => { // Sort alphabetically, keeping Auto-detect at the top
  if (a.value === 'Auto-detect') return -1;
  if (b.value === 'Auto-detect') return 1;
  return a.label.localeCompare(b.label);
});


export default function CommunicationHelperPage() {
  const { toast } = useToast();
  const { currentUser } = useAuth(); // Get current user
  const [translatedText, setTranslatedText] = useState('');
  const [detectedSourceLanguage, setDetectedSourceLanguage] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const [currentLanguageOptions, setCurrentLanguageOptions] = useState(baseLanguageOptions);
  const [currentTargetLanguageOptions, setCurrentTargetLanguageOptions] = useState(
    baseLanguageOptions.filter(lang => lang.value !== 'Auto-detect')
  );

  useEffect(() => {
    if (currentUser?.primarySpokenLanguage) {
      const userLang = currentUser.primarySpokenLanguage;
      const userLangValue = userLang; // Assuming value and label are same for user's language
      const userLangLabel = userLang;

      const alreadyExists = baseLanguageOptions.some(opt => opt.value.toLowerCase() === userLangValue.toLowerCase());

      if (!alreadyExists) {
        const newUserLangOption = { value: userLangValue, label: userLangLabel };
        
        const updatedOptions = [...baseLanguageOptions, newUserLangOption].sort((a,b) => {
            if (a.value === 'Auto-detect') return -1;
            if (b.value === 'Auto-detect') return 1;
            return a.label.localeCompare(b.label);
        });
        setCurrentLanguageOptions(updatedOptions);
        setCurrentTargetLanguageOptions(updatedOptions.filter(lang => lang.value !== 'Auto-detect'));
      }
    } else {
      // Reset to base if user has no language or logs out (though logout would navigate away)
      setCurrentLanguageOptions(baseLanguageOptions);
      setCurrentTargetLanguageOptions(baseLanguageOptions.filter(lang => lang.value !== 'Auto-detect'));
    }
  }, [currentUser]);


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
                          {currentLanguageOptions.map(lang => (
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
                          {currentTargetLanguageOptions.map(lang => (
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
