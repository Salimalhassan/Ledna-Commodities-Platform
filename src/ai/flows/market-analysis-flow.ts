'use server';
/**
 * @fileOverview AI-powered market analysis flow for generating commodity price trends.
 *
 * - generateMarketTrend - A function that handles the market trend data generation.
 * - MarketTrendInput - The input type for the generateMarketTrend function.
 * - MarketTrend - The return type for the generateMarketTrend function (re-using from lib/types).
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { MarketTrend } from '@/lib/types';
import { MarketTrendDataPointSchema, MarketTrendSchema } from '@/lib/schemas';


const MarketTrendInputSchema = z.object({
  commodityName: z.string().min(2, { message: 'Commodity name must be specified.' })
    .describe('The name of the agricultural commodity to analyze (e.g., "Maize", "Coffee").'),
});
export type MarketTrendInput = z.infer<typeof MarketTrendInputSchema>;

// We can re-use the MarketTrend type from lib/types, but we need the Zod schema for output validation.
export { type MarketTrend };


export async function generateMarketTrend(input: MarketTrendInput): Promise<MarketTrend> {
  return marketAnalysisFlow(input);
}


const marketAnalysisPrompt = ai.definePrompt({
  name: 'marketAnalysisPrompt',
  input: { schema: MarketTrendInputSchema },
  output: { schema: MarketTrendSchema },
  prompt: `You are a commodity market analyst for an African agricultural platform. Your task is to generate plausible, realistic market price trend data for a given commodity.

Generate a 7-month price history for "{{commodityName}}". The dates should be the first of each of the last 7 months, formatted as 'YYYY-MM-DD'. The prices should be realistic for the commodity, denominated in USD, and show some plausible fluctuation month-to-month.

Commodity to analyze: {{{commodityName}}}

Your response must be a JSON object that strictly adheres to the output schema. Do not include any introductory text, just the JSON.
`,
});

const marketAnalysisFlow = ai.defineFlow(
  {
    name: 'marketAnalysisFlow',
    inputSchema: MarketTrendInputSchema,
    outputSchema: MarketTrendSchema,
  },
  async (input) => {
    const { output } = await marketAnalysisPrompt(input);
    if (!output) {
      throw new Error("Market analysis failed to produce an output.");
    }
    // Ensure the commodity name in the output matches the input
    output.commodityName = input.commodityName;
    return output;
  }
);
