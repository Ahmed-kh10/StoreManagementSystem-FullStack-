import { useTranslation } from 'react-i18next';
import { useBrands } from '../hooks/useBrands';
import { useCategories } from '../hooks/useCategories';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  brandId: number | undefined;
  onBrandChange: (value: number | undefined) => void;
  categoryId: number | undefined;
  onCategoryChange: (value: number | undefined) => void;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onPriceChange: (min: number | undefined, max: number | undefined) => void;
}

export function ProductFilters({
  search,
  onSearchChange,
  sort,
  onSortChange,
  brandId,
  onBrandChange,
  categoryId,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
}: ProductFiltersProps) {
  const { t } = useTranslation();
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();

  const inputClass =
    'bg-surface border border-border rounded-sm px-3 py-2 text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent';

  return (
    <div className="flex flex-wrap gap-3">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t('products.searchPlaceholder')}
        className={`${inputClass} w-full sm:w-auto sm:min-w-[200px]`}
      />

      <select
        value={brandId ?? ''}
        onChange={(e) =>
          onBrandChange(e.target.value ? Number(e.target.value) : undefined)
        }
        className={inputClass}
      >
        <option value="">{t('products.allBrands')}</option>
        {brands?.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <select
        value={categoryId ?? ''}
        onChange={(e) =>
          onCategoryChange(e.target.value ? Number(e.target.value) : undefined)
        }
        className={inputClass}
      >
        <option value="">{t('products.allCategories')}</option>
        {categories?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={minPrice ?? ''}
        onChange={(e) =>
          onPriceChange(
            e.target.value ? Number(e.target.value) : undefined,
            maxPrice,
          )
        }
        placeholder={t('products.minPrice')}
        className={`${inputClass} w-28`}
      />

      <input
        type="number"
        value={maxPrice ?? ''}
        onChange={(e) =>
          onPriceChange(
            minPrice,
            e.target.value ? Number(e.target.value) : undefined,
          )
        }
        placeholder={t('products.maxPrice')}
        className={`${inputClass} w-28`}
      />

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className={inputClass}
      >
        <option value="">{t('products.defaultSort')}</option>
        <option value="priceAsc">{t('products.sortPriceAsc')}</option>
        <option value="priceDesc">{t('products.sortPriceDesc')}</option>
      </select>
    </div>
  );
}
