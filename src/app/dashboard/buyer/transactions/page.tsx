
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { sampleTransactions, getCurrentUser } from "@/data/placeholder";
import { ShoppingCart } from "lucide-react";
import { format } from 'date-fns';

export default function BuyerTransactionsPage() {
  const currentUser = getCurrentUser();
  // In a real app, transactions would be filtered by buyerId
  const transactions = sampleTransactions; 

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8 font-headline flex items-center">
        <ShoppingCart className="mr-3 h-8 w-8 text-primary" /> My Transaction History
      </h1>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Your Past Orders</CardTitle>
          <CardDescription>Review your previous commodity purchases.</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{format(new Date(txn.date), 'PPP')}</TableCell>
                    <TableCell className="font-medium">{txn.commodityName}</TableCell>
                    <TableCell>{txn.sellerName}</TableCell>
                    <TableCell className="text-right">{txn.quantity} {txn.unit}</TableCell>
                    <TableCell className="text-right">${txn.totalPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={
                          txn.status === 'Completed' ? 'default' : 
                          txn.status === 'Pending' ? 'secondary' : 
                          'destructive'
                        }
                        className={
                           txn.status === 'Completed' ? 'bg-green-500/80 hover:bg-green-500/70 text-white' :
                           txn.status === 'Pending' ? 'bg-yellow-500/80 hover:bg-yellow-500/70 text-black' : ''
                        }
                      >
                        {txn.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Transactions Yet</h2>
              <p className="text-muted-foreground">You haven&apos;t made any purchases. Start exploring commodities!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
