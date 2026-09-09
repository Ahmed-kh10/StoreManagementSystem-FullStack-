import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/ProductGrid';
import { ProductFilters } from '../components/ProductFilters';
import { Pagination } from '@/components/ui/Pagination';
import type { ProductSort, ProductSpecParams } from '../types/product.types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 8;

export function ProductsPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('products.title'));
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') ?? '';
  const sort = searchParams.get('sort') ?? '';
  const brandId = searchParams.get('brandId');
  const categoryId = searchParams.get('categoryId');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const pageIndex = Number(searchParams.get('page') ?? '1');

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [priceInput, setPriceInput] = useState<{
    min?: number;
    max?: number;
  }>({
    min: minPrice ? Number(minPrice) : undefined,
    max: maxPrice ? Number(maxPrice) : undefined,
  });

  function updateParams(
    patch: Record<string, string | undefined>,
    resetPage = true,
  ) {
    const next = new URLSearchParams(searchParams);

    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });

    if (resetPage) next.set('page', '1');

    setSearchParams(next);
  }

  useEffect(() => {
    const handle = setTimeout(() => {
      updateParams({ search: searchInput || undefined });
    }, 400);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    const handle = setTimeout(() => {
      updateParams({
        minPrice: priceInput.min?.toString(),
        maxPrice: priceInput.max?.toString(),
      });
    }, 500);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceInput.min, priceInput.max]);

  const params: ProductSpecParams = useMemo(
    () => ({
      search: urlSearch || undefined,
      sort: (sort as ProductSort) || undefined,
      brandId: brandId ? Number(brandId) : undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      pageIndex,
      pageSize: PAGE_SIZE,
    }),
    [urlSearch, sort, brandId, categoryId, minPrice, maxPrice, pageIndex],
  );

  const { data, isLoading, isError } = useProducts(params);
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0;

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <h1 className="font-display text-4xl text-accent">
          {t('products.title')}
        </h1>
        <ProductFilters
          search={searchInput}
          onSearchChange={setSearchInput}
          sort={sort}
          onSortChange={(value) => updateParams({ sort: value || undefined })}
          brandId={brandId ? Number(brandId) : undefined}
          onBrandChange={(value) =>
            updateParams({ brandId: value?.toString() })
          }
          categoryId={categoryId ? Number(categoryId) : undefined}
          onCategoryChange={(value) =>
            updateParams({ categoryId: value?.toString() })
          }
          minPrice={priceInput.min}
          maxPrice={priceInput.max}
          onPriceChange={(min, max) => setPriceInput({ min, max })}
        />

        {isError && (
          <p className="text-danger text-center py-10">{t('common.error')}</p>
        )}

        {!isError && (
          <ProductGrid products={data?.data ?? []} isLoading={isLoading} />
        )}

        {!isLoading && data && data.count > 0 && (
          <Pagination
            currentPage={pageIndex}
            totalPages={totalPages}
            onPageChange={(page) =>
              updateParams({ page: page.toString() }, false)
            }
          />
        )}
      </div>
    </div>
  );
}
