import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

import {
  createProductFormSchema,
  type ProductFormInput,
  type ProductFormValues,
} from '../utils/validation';

import { ImageUpload } from './ImageUpload';
import { useUploadProductImage } from '../hooks/useAdminProducts';

interface ProductFormProps {
  defaultValues?: Partial<ProductFormInput>;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: ProductFormProps) {
  const { t, i18n } = useTranslation();

  const productFormSchema = useMemo(
    () => createProductFormSchema(t),
    [t, i18n.language],
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const uploadImage = useUploadProductImage();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 max-w-lg"
    >
      <Input
        label={t('admin.productName')}
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="flex flex-col gap-1.5">
        <label className="font-body text-sm text-text/80">
          {t('admin.productDescription')}
        </label>

        <textarea
          rows={4}
          {...register('description')}
          className="bg-surface border border-border rounded-sm px-4 py-2.5 text-text placeholder:text-text/40 focus:outline-none focus:ring-1 focus:ring-accent"
        />

        {errors.description && (
          <span className="text-sm text-danger">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('admin.price')}
          type="number"
          step="0.01"
          error={errors.price?.message}
          {...register('price')}
        />

        <Input
          label={t('admin.stock')}
          type="number"
          error={errors.stock?.message}
          {...register('stock')}
        />
      </div>

      <Controller
        control={control}
        name="imageUrl"
        render={({ field }) => (
          <ImageUpload
            value={field.value}
            onChange={field.onChange}
            onUpload={(file) => uploadImage.mutateAsync(file)}
            error={errors.imageUrl?.message}
          />
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('admin.brand')}
          placeholder={t('admin.brandPlaceholder')}
          error={errors.brandName?.message}
          {...register('brandName')}
        />

        <Input
          label={t('admin.category')}
          placeholder={t('admin.categoryPlaceholder')}
          error={errors.categoryName?.message}
          {...register('categoryName')}
        />
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
        {submitLabel}
      </Button>
    </form>
  );
}
