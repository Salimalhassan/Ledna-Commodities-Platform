
import { headers } from 'next/headers';
import type { Stripe } from 'stripe';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

/**
 * This is the webhook handler for Stripe events.
 * It listens for payment confirmations and updates the database accordingly.
 * It's crucial for securely confirming payments before granting access to features.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  if (!webhookSecret) {
      console.error('Stripe webhook secret is not set.');
      return new Response('Webhook secret not configured. Cannot process event.', { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the 'checkout.session.completed' event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Retrieve commodityId from metadata
    const commodityId = session.metadata?.commodityId;

    if (session.payment_status === 'paid' && commodityId) {
      try {
        const commodityRef = doc(db, 'commodities', commodityId);
        // Update the commodity in Firestore to be featured
        await updateDoc(commodityRef, { isFeatured: true });
        console.log(`SUCCESS: Featured commodity with ID: ${commodityId}`);
      } catch (error) {
        console.error(`Error updating commodity ${commodityId} to featured:`, error);
        // Return a 500 error to tell Stripe to retry the webhook
        return new Response('Webhook handler failed to update database. Please retry.', { status: 500 });
      }
    } else {
      console.log(`Unhandled checkout session status: ${session.payment_status} for commodity: ${commodityId}`);
    }
  } else {
    console.warn(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return new Response(null, { status: 200 });
}

