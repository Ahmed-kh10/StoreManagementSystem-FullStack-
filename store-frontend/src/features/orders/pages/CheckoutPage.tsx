import { useMemo } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useBasketActions } from '@/features/basket/hooks/useBasketActions';
import { useCreateOrder } from '../hooks/useCreateOrder';
import { useToast } from '@/app/providers/ToastProvider';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  createShippingAddressSchema,
  type ShippingAddressFormValues,
} from '../utils/validation';

export function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const shippingAddressSchema = useMemo(
    () => createShippingAddressSchema(t),
    [i18n.language],
  );
  useDocumentTitle(t('checkout.title'));
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { basket } = useBasketActions();
  const createOrder = useCreateOrder();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddressFormValues>({
    resolver: zodResolver(shippingAddressSchema),
  });

  async function onSubmit(values: ShippingAddressFormValues): Promise<void> {
    setServerError(null);

    try {
      const order = await createOrder.mutateAsync({ shippingAddress: values });
      showToast(t('checkout.orderCreated'), 'success');
      navigate(`/payment/${order.id}`);
    } catch {
      setServerError(t('checkout.orderError'));
      showToast(t('checkout.orderFailed'), 'error');
    }
  }

  if (!basket || basket.items.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="font-body text-text">{t('checkout.emptyBasket')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-lg mx-auto">
        <h1 className="font-display text-3xl text-accent mb-8">
          {t('checkout.title')}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('checkout.firstName')}
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label={t('checkout.lastName')}
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label={t('checkout.street')}
            error={errors.street?.message}
            {...register('street')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('checkout.city')}
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label={t('checkout.state')}
              error={errors.state?.message}
              {...register('state')}
            />
          </div>

          <Input
            label={t('checkout.zipCode')}
            error={errors.zipCode?.message}
            {...register('zipCode')}
          />

          {serverError && (
            <p className="text-sm text-danger text-center">{serverError}</p>
          )}

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full mt-2"
          >
            {t('checkout.continueToPayment')}
          </Button>
        </form>
      </div>
    </div>
  );
}
