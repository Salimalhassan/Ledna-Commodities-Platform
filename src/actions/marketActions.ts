'use server';

import { generateMarketTrend, type MarketTrend } from '@/ai/flows/market-analysis-flow';

export async function fetchMarketData(commodityName: string): Promise<MarketTrend | null> {
  try {
    const result = await generateMarketTrend({ commodityName });
    return result;
  } catch (error) {
    console.error(`Error fetching market data for ${commodityName}:`, error);
    // In a real app, you might want more robust error handling or logging
    return null;
  }
}
