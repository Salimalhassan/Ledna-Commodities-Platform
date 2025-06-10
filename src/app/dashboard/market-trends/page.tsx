import MarketTrendChart from '@/components/MarketTrendChart';
import { sampleMarketTrends } from '@/data/placeholder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MarketTrendsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8 font-headline">Commodity Market Trends</h1>
      
      <Tabs defaultValue={sampleMarketTrends[0]?.commodityName.toLowerCase() || 'maize'} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
          {sampleMarketTrends.map((trend) => (
            <TabsTrigger key={trend.commodityName} value={trend.commodityName.toLowerCase()}>
              {trend.commodityName}
            </TabsTrigger>
          ))}
           {/* Add more placeholder tabs if few trends */}
          {sampleMarketTrends.length < 3 && <TabsTrigger value="beans" disabled>Beans</TabsTrigger>}
          {sampleMarketTrends.length < 4 && <TabsTrigger value="coffee" disabled>Coffee</TabsTrigger>}
        </TabsList>

        {sampleMarketTrends.map((trend) => (
          <TabsContent key={trend.commodityName} value={trend.commodityName.toLowerCase()}>
            <MarketTrendChart trendData={trend} />
          </TabsContent>
        ))}
         {sampleMarketTrends.length < 3 && (
          <TabsContent value="beans">
            <Card>
              <CardHeader><CardTitle>Beans</CardTitle><CardDescription>No data available for Beans.</CardDescription></CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                Trend data coming soon.
              </CardContent>
            </Card>
          </TabsContent>
         )}
        {sampleMarketTrends.length < 4 && (
          <TabsContent value="coffee">
            <Card>
              <CardHeader><CardTitle>Coffee</CardTitle><CardDescription>No data available for Coffee.</CardDescription></CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                Trend data coming soon.
              </CardContent>
            </Card>
          </TabsContent>
         )}
      </Tabs>
       <Card className="mt-8 bg-accent/10 border-accent/30">
        <CardHeader>
          <CardTitle className="text-accent font-headline">Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-accent-foreground/80">
            The market trend data provided is for informational purposes only and should not be considered as financial advice. 
            Prices are illustrative and may not reflect real-time market conditions. Always conduct your own research before making any trading decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
