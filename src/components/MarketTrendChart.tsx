'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { MarketTrend } from '@/lib/types';
import { useTheme } from 'next-themes'; // Assuming next-themes is or will be used for dark mode

interface MarketTrendChartProps {
  trendData: MarketTrend;
}

export default function MarketTrendChart({ trendData }: MarketTrendChartProps) {
  const { theme: mode } = useTheme(); // For adapting colors if needed, or use CSS variables

  const chartData = trendData.data.map(d => ({ ...d, date: new Date(d.date).toLocaleDateString('en-US', { month: 'short' }) }));

  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--primary))", // Use CSS variable for primary color
    },
  } satisfies ChartConfig;


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">{trendData.commodityName} Price Trend</CardTitle>
        <CardDescription>Monthly average prices for {trendData.commodityName}.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                tickFormatter={(value) => value.slice(0, 3)}
                stroke="hsl(var(--foreground))"
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                stroke="hsl(var(--foreground))"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="price" fill="var(--color-price)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
