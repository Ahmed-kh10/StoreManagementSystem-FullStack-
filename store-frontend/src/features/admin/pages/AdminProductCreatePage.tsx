import { useNavigate } from 'react-router-dom';

import { ProductForm } from '../components/ProductForm';
import { useCreateProduct } from '../hooks/useAdminProducts';
import {
  useResolveBrand,
  useResolveCategory,
} from '../hooks/useTaxonomyResolvers';

import { useToast } from '@/app/providers/ToastProvider';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import type { ProductFormValues } from '../utils/validation';

import { useTranslation } from 'react-i18next';

export function AdminProductCreatePage() {
  const { t } = useTranslation();
  useDocumentTitle(t('admin.newProduct'));

  const navigate = useNavigate();
  const { showToast } = useToast();

  const createProduct = useCreateProduct();
  const resolveBrand = useResolveBrand();
  const resolveCategory = useResolveCategory();

  async function handleSubmit(values: ProductFormValues): Promise<void> {
    try {
      const [brand, category] = await Promise.all([
        resolveBrand.mutateAsync(values.brandName),
        resolveCategory.mutateAsync(values.categoryName),
      ]);

      await createProduct.mutateAsync({
        name: values.name,
        description: values.description,
        price: values.price,
        stock: values.stock,
        imageUrl: values.imageUrl,
        brandId: brand.id,
        categoryId: category.id,
      });

      showToast(t('admin.productAdded'), 'success');

      navigate('/admin/products');
    } catch {
      showToast(t('admin.productAddFailed'), 'error');
    }
  }

  const isSubmitting =
    createProduct.isPending ||
    resolveBrand.isPending ||
    resolveCategory.isPending;

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-lg mx-auto">
        <h1 className="font-display text-3xl text-accent mb-8">
          {t('admin.newProduct')}
        </h1>
        <ProductForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={t('admin.addProduct')}
        />
      </div>
    </div>
  );
}
