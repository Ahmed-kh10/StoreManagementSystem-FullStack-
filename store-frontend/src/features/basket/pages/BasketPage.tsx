import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBasketActions } from '../hooks/useBasketActions';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/app/providers/ToastProvider';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function BasketPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('basket.title'));
  const { showToast } = useToast();

  const { basket, updateQuantity, removeItem, clearBasket, isSaving } =
    useBasketActions();

  const items = basket?.items ?? [];

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bg px-6 py-10">
        <EmptyState
          title={t('basket.empty')}
          description={t('basket.emptyDesc')}
          action={
            <Link to="/products">
              <Button variant="secondary">{t('common.browseProducts')}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <h1 className="font-display text-4xl text-accent">
          {t('basket.title')}
        </h1>

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col sm:flex-row sm:items-center gap-4 border border-border rounded-sm bg-surface p-4"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-sm bg-surface"
              />

              <div className="flex-1 flex flex-col gap-1">
                <h3 className="font-body font-semibold text-text">
                  {item.name}
                </h3>
                <p className="text-accent font-display">
                  {(item.price ?? 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <QuantitySelector
                  value={item.quantity}
                  onChange={(q) => updateQuantity(item.productId, q)}
                />

                <button
                  onClick={async () => {
                    try {
                      await removeItem(item.productId);
                      showToast(t('basket.removed'), 'info');
                    } catch {
                      showToast(t('basket.removeFailed'), 'error');
                    }
                  }}
                  disabled={isSaving}
                  className="text-sm text-danger hover:underline disabled:opacity-40"
                >
                  {t('common.remove')}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-end gap-3 border-t border-border pt-6">
          <p className="font-display text-2xl text-text">
            {t('basket.approxTotal')}{' '}
            <span className="text-accent">
              {subtotal.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </p>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={async () => {
                try {
                  await clearBasket();
                  showToast(t('basket.cleared'), 'info');
                } catch {
                  showToast(t('basket.clearFailed'), 'error');
                }
              }}
              disabled={isSaving}
            >
              {t('basket.clear')}
            </Button>
            <Link to="/checkout">
              <Button>{t('basket.checkout')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
