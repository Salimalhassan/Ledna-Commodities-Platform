
'use server';

import { stripe } from '@/lib/stripe';
import { z } from 'zod';

const CreateCheckoutSessionSchema = z.object({
  commodityId: z.string(),
  commodityName: z.string(),
  priceInCents: z.number().int().positive(),
});

interface ActionResult {
  sessionId?: string;
  error?: string;
}

export async function createCheckoutSession(
  input: z.infer<typeof CreateCheckoutSessionSchema>
): Promise<ActionResult> {
  const validation = CreateCheckoutSessionSchema.safeParse(input);
  if (!validation.success) {
    return { error: 'Invalid input data.' };
  }

  const { commodityId, commodityName, priceInCents } = validation.data;
  
  // Construct the success and cancel URLs from the request headers
  // In a real app, you might want to get this from environment variables
  const origin = 'http://localhost:9002'; // Replace with your actual domain in production
  const successUrl = `${origin}/dashboard/commodities/my-listings?payment=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/dashboard/commodities/my-listings?payment=cancelled`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd', // Or your desired currency
            product_data: {
              name: `Feature Listing: ${commodityName}`,
              description: `One-time fee to feature the commodity listing "${commodityName}".`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Store the commodityId in metadata to retrieve it in the webhook
      metadata: {
        commodityId: commodityId,
      },
    });

    if (!session.id) {
       return { error: "Could not create Stripe session." };
    }

    return { sessionId: session.id };
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { error: `Failed to create payment session: ${errorMessage}` };
  }
}
