import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useAdminProductsList,
  useDeleteProduct,
} from '../hooks/useAdminProducts';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { useToast } from '@/app/providers/ToastProvider';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function AdminProductsPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('admin.manageProducts'));
  const { showToast } = useToast();

  const [pageIndex, setPageIndex] = useState(1);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const { data, isLoading } = useAdminProductsList(pageIndex);
  const deleteProduct = useDeleteProduct();

  async function handleConfirmDelete() {
    if (productToDelete === null) return;

    try {
      await deleteProduct.mutateAsync(productToDelete);
      showToast(t('admin.productDeleted'), 'info');
    } catch {
      showToast(t('admin.deleteFailed'), 'error');
    } finally {
      setProductToDelete(null);
    }
  }

  const totalPages = data ? Math.ceil(data.count / 10) : 0;

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl text-accent">
            {t('admin.manageProducts')}
          </h1>
          <Link to="/admin/products/new">
            <Button>+ {t('admin.newProduct')}</Button>
          </Link>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        )}

        {!isLoading && data?.data.length === 0 && (
          <EmptyState
            title={t('admin.empty')}
            description={t('admin.emptyDesc')}
          />
        )}

        {data && data.data.length > 0 && (
          <div className="border border-border rounded-sm overflow-x-auto bg-surface">
            <table className="w-full text-sm text-text">
              <thead className="bg-bg text-muted text-xs uppercase">
                <tr>
                  <th className="text-start px-4 py-3">{t('admin.colName')}</th>
                  <th className="text-start px-4 py-3">
                    {t('admin.colBrand')}
                  </th>
                  <th className="text-start px-4 py-3">
                    {t('admin.colCategory')}
                  </th>
                  <th className="text-start px-4 py-3">
                    {t('admin.colPrice')}
                  </th>
                  <th className="text-start px-4 py-3">
                    {t('admin.colStock')}
                  </th>
                  <th className="text-start px-4 py-3">
                    {t('admin.colActions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((product) => (
                  <tr key={product.id} className="border-t border-border">
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3 text-muted">
                      {product.brandName}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {product.categoryName}
                    </td>
                    <td className="px-4 py-3 text-accent">
                      {product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="text-accent hover:underline"
                        >
                          {t('common.edit')}
                        </Link>
                        <button
                          onClick={() => setProductToDelete(product.id)}
                          className="text-danger hover:underline"
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={pageIndex}
            totalPages={totalPages}
            onPageChange={setPageIndex}
          />
        )}
      </div>

      <Dialog
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        title={t('admin.deleteTitle')}
      >
        <p className="text-text/70 text-sm">{t('admin.deleteConfirm')}</p>
        <div className="flex gap-3 justify-end mt-2">
          <Button variant="ghost" onClick={() => setProductToDelete(null)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="danger"
            isLoading={deleteProduct.isPending}
            onClick={handleConfirmDelete}
          >
            {t('admin.deleteFinal')}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
