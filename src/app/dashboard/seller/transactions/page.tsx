
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Transaction } from "@/lib/types";
import { fetchSellerTransactions, updateTransactionStatus } from "@/actions/transactionActions";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Status = 'Completed' | 'Pending' | 'Cancelled';

const statusConfig: Record<Status, { icon: React.ElementType, color: string, text: string }> = {
  Completed: { icon: CheckCircle, color: 'bg-green-500/80 hover:bg-green-500/70 text-white', text: 'Completed' },
  Pending: { icon: Clock, color: 'bg-yellow-500/80 hover:bg-yellow-500/70 text-black', text: 'Pending' },
  Cancelled: { icon: XCircle, color: 'bg-red-500/80 hover:bg-red-500/70 text-white', text: 'Cancelled' },
};

function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;
  return (
    <Badge variant="default" className={cn("gap-1.5", config.color)}>
      <Icon className="h-3.5 w-3.5" />
      {config.text}
    </Badge>
  );
}


export default function SellerTransactionsPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [updatingStatusFor, setUpdatingStatusFor] = useState<string | null>(null);

  useEffect(() => {
    async function loadTransactions() {
      if (currentUser?.uid && currentUser.userType === 'seller') {
        setIsLoadingTransactions(true);
        try {
          const fetchedTransactions = await fetchSellerTransactions(currentUser.uid);
          setTransactions(fetchedTransactions);
        } catch (error) {
          console.error("Failed to fetch transactions:", error);
          toast({ variant: "destructive", title: "Error", description: "Could not load your sales history." });
        } finally {
          setIsLoadingTransactions(false);
        }
      } else if (!currentUser && !authLoading) {
         setIsLoadingTransactions(false);
      }
    }
     if (!authLoading) {
        loadTransactions();
    }
  }, [currentUser, authLoading, toast]);
  
  const handleStatusUpdate = async (transactionId: string, newStatus: Status) => {
    setUpdatingStatusFor(transactionId);
    const result = await updateTransactionStatus(transactionId, newStatus);
    if (result.success) {
      toast({ title: "Status Updated", description: result.message });
      // Update local state to reflect change immediately
      setTransactions(prev => 
        prev.map(t => t.id === transactionId ? { ...t, status: newStatus } : t)
      );
    } else {
      toast({ variant: "destructive", title: "Update Failed", description: result.error });
    }
    setUpdatingStatusFor(null);
  };

  if (authLoading || (currentUser?.userType === 'seller' && isLoadingTransactions && transactions.length === 0)) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Skeleton className="h-9 w-1/2 mb-8" />
        <Card className="shadow-xl">
          <CardHeader>
            <Skeleton className="h-7 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center p-2 border-b">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-60" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUser) {
    router.push('/auth/login');
    return null;
  }

  if (currentUser.userType !== 'seller') {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">Only sellers can view sales history.</p>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8 font-headline flex items-center">
        <ShoppingCart className="mr-3 h-8 w-8 text-primary" /> My Sales History
      </h1>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Your Past Sales</CardTitle>
          <CardDescription>Review and manage your commodity sales.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions && transactions.length === 0 ? (
             <div className="text-center py-12">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
                <p>Loading your sales...</p>
            </div>
          ) : transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{format(new Date(txn.date), 'PPP')}</TableCell>
                    <TableCell className="font-medium">{txn.commodityName}</TableCell>
                    <TableCell>{txn.buyerName}</TableCell>
                    <TableCell className="text-right">{txn.quantity} {txn.unit}</TableCell>
                    <TableCell className="text-right">${txn.totalPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                        <StatusBadge status={txn.status} />
                    </TableCell>
                    <TableCell className="text-right">
                       {updatingStatusFor === txn.id ? (
                        <Loader2 className="h-5 w-5 animate-spin ml-auto" />
                       ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {(Object.keys(statusConfig) as Status[]).map((status) => (
                                    <DropdownMenuItem 
                                        key={status} 
                                        onClick={() => handleStatusUpdate(txn.id, status)}
                                        disabled={txn.status === status}
                                    >
                                        Mark as {status}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                       )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Sales Yet</h2>
              <p className="text-muted-foreground">You haven&apos;t made any sales through the platform.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
