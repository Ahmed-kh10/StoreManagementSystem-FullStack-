import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOrder } from '../hooks/useOrder';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function OrderDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, isLoading, isError } = useOrder(orderId);
  useDocumentTitle(
    order ? t('orders.orderNumber', { id: order.id }) : t('orders.title'),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg px-6 py-10">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-danger">{t('orders.notFound')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl text-accent">
            {t('orders.orderNumber', { id: order.id })}
          </h1>
          <StatusBadge status={order.status} />
        </div>

        <div className="border border-border rounded-sm bg-surface p-5 flex flex-col gap-2">
          <h2 className="font-body font-semibold text-text mb-1">
            {t('orders.shippingAddress')}
          </h2>
          <p className="text-text/70 text-sm">
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </p>
          <p className="text-text/70 text-sm">
            {order.shippingAddress.street}, {order.shippingAddress.city}
          </p>
          <p className="text-text/70 text-sm">
            {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
        </div>

        <div className="border border-border rounded-sm bg-surface p-5 flex flex-col gap-4">
          <h2 className="font-body font-semibold text-text">
            {t('orders.productsSection')}
          </h2>

          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-text">
                {item.productName} × {item.quantity}
              </span>
              <span className="text-accent">{item.total.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border border-border rounded-sm bg-surface p-5 flex flex-col gap-1 items-end text-sm">
          <p className="text-text/70">
            {t('orders.subtotal', { amount: order.subtotal.toFixed(2) })}
          </p>
          <p className="text-text/70">
            {t('orders.shipping', { amount: order.shippingPrice.toFixed(2) })}
          </p>
          <p className="font-display text-xl text-accent mt-1">
            {t('orders.total', { amount: order.total.toFixed(2) })}
          </p>
          <p className="text-text/50 text-xs mt-2">
            {t('orders.paymentStatus', { status: order.paymentStatus })}
          </p>
        </div>
      </div>
    </div>
  );
}
