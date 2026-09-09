import { useState, type FormEvent } from 'react';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/app/providers/ToastProvider';
import { useTranslation } from 'react-i18next';

interface PaymentFormProps {
  orderId: number;
}

export function PaymentForm({ orderId }: PaymentFormProps) {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message ?? t('payment.genericError'));
      showToast('فشلت عملية الدفع', 'error');
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      showToast('تم إرسال الدفع بنجاح', 'success');
      navigate(`/orders/${orderId}?paymentSubmitted=true`);
      return;
    }

    setErrorMessage(t('payment.pending'));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement />

      {errorMessage && (
        <p className="text-sm text-danger text-center">{errorMessage}</p>
      )}

      <Button type="submit" isLoading={isSubmitting} disabled={!stripe}>
        {t('payment.payNow')}
      </Button>
    </form>
  );
}
