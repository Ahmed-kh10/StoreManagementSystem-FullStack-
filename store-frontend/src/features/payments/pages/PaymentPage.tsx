import { useParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { getStripePromise } from '@/lib/stripe/stripeClient';
import { usePaymentIntent } from '../hooks/usePaymentIntent';
import { PaymentForm } from '../components/PaymentForm';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function PaymentPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('payment.title'));
  const { theme } = useTheme();
  const { orderId } = useParams<{ orderId: string }>();
  const numericOrderId = Number(orderId);

  const { data, isLoading, isError } = usePaymentIntent(numericOrderId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg px-6 py-10 flex justify-center">
        <Skeleton className="h-96 w-full max-w-md" />
      </div>
    );
  }

  if (isError || !data?.clientSecret) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-danger">{t('payment.initError')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-3xl text-accent mb-8 text-center">
          {t('payment.title')}
        </h1>

        <Elements
          stripe={getStripePromise()}
          options={{
            clientSecret: data.clientSecret,
            appearance: {
              theme: theme === 'dark' ? 'night' : 'stripe',
              variables: {
                colorPrimary: theme === 'dark' ? '#f2f2f2' : '#0a0a0a',
                colorBackground: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                colorText: theme === 'dark' ? '#f2f2f2' : '#0a0a0a',
                colorDanger: theme === 'dark' ? '#f2938c' : '#b3261e',
                borderRadius: '4px',
                fontFamily: 'Public Sans, sans-serif',
              },
            },
          }}
        >
          <PaymentForm orderId={numericOrderId} />
        </Elements>
      </div>
    </div>
  );
}
