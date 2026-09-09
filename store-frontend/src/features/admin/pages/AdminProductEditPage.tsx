import { useNavigate, useParams } from 'react-router-dom';

import { useProduct } from '@/features/products/hooks/useProduct';
import { ProductForm } from '../components/ProductForm';
import { useUpdateProduct } from '../hooks/useAdminProducts';
import {
  useResolveBrand,
  useResolveCategory,
} from '../hooks/useTaxonomyResolvers';

import { useToast } from '@/app/providers/ToastProvider';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTranslation } from 'react-i18next';

import type { ProductFormInput, ProductFormValues } from '../utils/validation';

export function AdminProductEditPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('admin.editProduct'));

  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data: product, isLoading } = useProduct(productId);

  const updateProduct = useUpdateProduct(productId);
  const resolveBrand = useResolveBrand();
  const resolveCategory = useResolveCategory();

  async function handleSubmit(values: ProductFormValues): Promise<void> {
    try {
      const [brand, category] = await Promise.all([
        resolveBrand.mutateAsync(values.brandName),
        resolveCategory.mutateAsync(values.categoryName),
      ]);

      await updateProduct.mutateAsync({
        name: values.name,
        description: values.description,
        price: values.price,
        stock: values.stock,
        imageUrl: values.imageUrl,
        brandId: brand.id,
        categoryId: category.id,
      });

      showToast(t('admin.productUpdated'), 'success');

      navigate('/admin/products');
    } catch {
      showToast(t('admin.productUpdateFailed'), 'error');
    }
  }

  const isSubmitting =
    updateProduct.isPending ||
    resolveBrand.isPending ||
    resolveCategory.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg px-6 py-10">
        <Skeleton className="h-96 max-w-lg mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-danger">المنتج غير موجود.</p>
      </div>
    );
  }

  const defaultValues: Partial<ProductFormInput> = {
    name: product.name,
    description: product.description ?? '',
    price: product.price,
    stock: product.stock,
    imageUrl: product.imageUrl,
    brandName: product.brandName,
    categoryName: product.categoryName,
  };

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-lg mx-auto">
        <h1 className="font-display text-3xl text-accent mb-8">
          {t('admin.editProduct')}
        </h1>
        <ProductForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={t('admin.saveChanges')}
        />
      </div>
    </div>
  );
}
