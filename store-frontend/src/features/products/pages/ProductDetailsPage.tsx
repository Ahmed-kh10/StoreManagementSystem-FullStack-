import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { useBasketActions } from '@/features/basket/hooks/useBasketActions';
import { useProduct } from '../hooks/useProduct';

import { useTranslation } from 'react-i18next';

export function ProductDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useProduct(productId);

  const { addItem, isSaving } = useBasketActions();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useDocumentTitle(product?.name ?? 'تفاصيل المنتج');

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!product) return;

    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity,
      });
      showToast(t('products.addedToCart'), 'success');
    } catch {
      showToast(t('products.addToCartFailed'), 'error');
    }
  }
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg px-6 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="aspect-square w-full" />

          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-danger">{t('products.notFound')}</p>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square bg-surface rounded-sm overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-xs text-accent/70 uppercase tracking-wide">
            {product.brandName} · {product.categoryName}
          </span>

          <h1 className="font-display text-3xl text-text">{product.name}</h1>

          <p className="font-display text-2xl text-accent">
            {product.price.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          {product.description && (
            <p className="font-body text-text/70 leading-relaxed">
              {product.description}
            </p>
          )}

          <p className="text-sm text-muted">
            {isOutOfStock
              ? t('products.outOfStock')
              : t('products.inStock', { count: product.stock })}
          </p>

          {!isOutOfStock && (
            <div className="flex items-center gap-4 mt-2">
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={product.stock}
              />

              <Button isLoading={isSaving} onClick={handleAddToCart}>
                {t('products.addToCart')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
