
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type * as z from 'zod';
import { TransactionSchema } from '@/lib/schemas';
import type { Commodity } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { addTransaction } from '@/actions/transactionActions';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, ShoppingCart } from 'lucide-react';

interface TransactionDialogProps {
  commodity: Commodity;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionComplete: () => void;
}

export default function TransactionDialog({
  commodity,
  isOpen,
  onOpenChange,
  onTransactionComplete,
}: TransactionDialogProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof TransactionSchema>>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const quantity = form.watch('quantity');
  const totalPrice = isNaN(quantity) || quantity <= 0 ? 0 : commodity.price * quantity;

  useEffect(() => {
    // Reset form when commodity changes
    form.reset({ quantity: 1 });
  }, [commodity, form]);

  async function onSubmit(values: z.infer<typeof TransactionSchema>) {
    if (!currentUser || currentUser.userType !== 'buyer') {
      toast({ variant: 'destructive', title: 'Error', description: 'Only buyers can make transactions.' });
      return;
    }
    setIsSubmitting(true);

    try {
      const result = await addTransaction({
        commodityId: commodity.id,
        commodityName: commodity.name,
        sellerId: commodity.sellerId,
        sellerName: commodity.sellerName,
        buyerId: currentUser.uid,
        buyerName: currentUser.name,
        quantity: values.quantity,
        unit: commodity.unit,
        totalPrice: totalPrice,
        status: 'Pending', // All new transactions are pending
      });

      if (result.success) {
        toast({
          title: 'Transaction Submitted',
          description: `Your purchase request for ${values.quantity} ${commodity.unit} of ${commodity.name} has been sent.`,
        });
        onTransactionComplete();
        onOpenChange(false);
        form.reset();
      } else {
        toast({ variant: 'destructive', title: 'Transaction Failed', description: result.error || 'An unexpected error occurred.' });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to submit transaction.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center">
            <ShoppingCart className="mr-2 h-6 w-6 text-primary" /> Purchase Commodity
          </DialogTitle>
          <DialogDescription>
            You are about to purchase "{commodity.name}" from {commodity.sellerName}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div>
              <p><strong>Commodity:</strong> {commodity.name}</p>
              <p><strong>Price:</strong> ${commodity.price.toFixed(2)} / {commodity.unit}</p>
            </div>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity ({commodity.unit})</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      step="any"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-lg font-bold text-primary">
              Total Price: ${totalPrice.toFixed(2)}
            </div>
             <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || quantity <= 0}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Purchase
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
