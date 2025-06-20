
import { headers } from 'next/headers';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import crypto from 'crypto';

/**
 * This is the webhook handler for Paystack events.
 * It listens for successful charges and updates the database accordingly.
 */
export async function POST(req: Request) {
  const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET;
  if (!webhookSecret) {
      console.error('Paystack webhook secret is not set.');
      return new Response('Webhook secret not configured.', { status: 500 });
  }

  const body = await req.text();
  const signature = headers().get('x-paystack-signature') as string;

  // Verify the webhook signature
  try {
    const hash = crypto.createHmac('sha512', webhookSecret).update(body).digest('hex');
    if (hash !== signature) {
      console.warn('Paystack webhook signature verification failed.');
      return new Response('Invalid signature', { status: 401 });
    }
  } catch (error) {
     console.error('Error during webhook signature verification:', error);
     return new Response('Invalid signature format.', { status: 400 });
  }


  const event = JSON.parse(body);

  // Handle the 'charge.success' event
  if (event.event === 'charge.success') {
    const { metadata, status } = event.data;
    
    // Retrieve commodityId from metadata
    const commodityId = metadata?.commodityId;

    if (status === 'success' && commodityId) {
      try {
        const commodityRef = doc(db, 'commodities', commodityId);
        // Update the commodity in Firestore to be featured
        await updateDoc(commodityRef, { isFeatured: true });
        console.log(`SUCCESS: Featured commodity with ID: ${commodityId} via Paystack.`);
      } catch (error) {
        console.error(`Error updating commodity ${commodityId} to featured:`, error);
        // Return a 500 error to tell Paystack to retry the webhook
        return new Response('Webhook handler failed to update database.', { status: 500 });
      }
    } else {
      console.log(`Unhandled Paystack charge status: ${status} for commodity: ${commodityId}`);
    }
  } else {
    console.warn(`Unhandled Paystack event type ${event.event}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return new Response(null, { status: 200 });
}
