import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOrders } from '../hooks/useOrders';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function OrdersPage() {
  const { t, i18n } = useTranslation();
  useDocumentTitle(t('orders.title'));
  const { data: orders, isLoading, isError } = useOrders();

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <h1 className="font-display text-4xl text-accent">
          {t('orders.title')}
        </h1>

        {isLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-danger text-center py-10">
            {t('orders.loadError')}
          </p>
        )}

        {!isLoading && orders?.length === 0 && (
          <EmptyState
            title={t('orders.empty')}
            description={t('orders.emptyDesc')}
            action={
              <Link to="/products">
                <Button variant="secondary">
                  {t('common.browseProducts')}
                </Button>
              </Link>
            }
          />
        )}

        {orders && orders.length > 0 && (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex items-center justify-between border border-border hover:border-accent rounded-sm bg-surface p-4 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-body text-text">
                    {t('orders.orderNumber', { id: order.id })}
                  </span>
                  <span className="text-sm text-muted">
                    {new Date(order.orderDate).toLocaleDateString(
                      i18n.language,
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-display text-accent">
                    {order.total.toFixed(2)}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
