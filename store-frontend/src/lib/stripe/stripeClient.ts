import { loadStripe, type Stripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    'VITE_STRIPE_PUBLISHABLE_KEY is not defined. Check your .env file.',
  );
}

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripePromise(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}
