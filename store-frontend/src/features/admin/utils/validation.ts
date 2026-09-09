import { z } from 'zod';
import type { TFunction } from 'i18next';

export function createProductFormSchema(t: TFunction) {
  return z.object({
    name: z
      .string()
      .min(3, t('validation.productNameMin', { count: 3 }))
      .max(100, t('validation.productNameMax', { count: 100 })),
    description: z.string().optional(),
    price: z.coerce.number().positive(t('validation.priceInvalid')),
    stock: z.coerce.number().int().min(0, t('validation.stockInvalid')),
    imageUrl: z.string().min(1, t('validation.imageRequired')),
    brandName: z.string().min(1, t('validation.brandRequired')),
    categoryName: z.string().min(1, t('validation.categoryRequired')),
  });
}

export type ProductFormInput = z.input<
  ReturnType<typeof createProductFormSchema>
>;
export type ProductFormValues = z.output<
  ReturnType<typeof createProductFormSchema>
>;
