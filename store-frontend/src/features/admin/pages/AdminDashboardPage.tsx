import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Package, PlusCircle } from 'lucide-react';
import { productsApi } from '@/features/products/api/productsApi';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function AdminDashboardPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('admin.dashboard'));

  const { data } = useQuery({
    queryKey: ['admin-products', 'overview'],
    queryFn: () => productsApi.getAll({ pageIndex: 1, pageSize: 1 }),
  });

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <h1 className="font-display text-3xl text-accent">
          {t('admin.dashboard')}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            to="/admin/products"
            className="border border-border hover:border-accent rounded-sm bg-surface p-6 flex items-center gap-4 transition-colors"
          >
            <Package className="text-accent" size={32} />
            <div>
              <h2 className="font-body font-semibold text-text">
                {t('admin.manageProducts')}
              </h2>
              <p className="text-sm text-muted">
                {data ? t('admin.totalProducts', { count: data.count }) : '...'}
              </p>
            </div>
          </Link>

          <Link
            to="/admin/products/new"
            className="border border-border hover:border-accent rounded-sm bg-surface p-6 flex items-center gap-4 transition-colors"
          >
            <PlusCircle className="text-accent" size={32} />
            <div>
              <h2 className="font-body font-semibold text-text">
                {t('admin.addNewProduct')}
              </h2>
              <p className="text-sm text-muted">{t('admin.addProductDesc')}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
