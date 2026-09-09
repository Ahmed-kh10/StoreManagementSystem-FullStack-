import { useTranslation } from 'react-i18next';
import type { ProductDto } from '../types/product.types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

interface ProductGridProps {
  products: ProductDto[];
  isLoading: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title={t('products.empty')}
        description={t('products.emptyDesc')}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
