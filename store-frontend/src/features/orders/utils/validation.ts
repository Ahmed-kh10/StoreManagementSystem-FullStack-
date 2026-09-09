import { z } from 'zod';
import type { TFunction } from 'i18next';

export function createShippingAddressSchema(t: TFunction) {
  return z.object({
    firstName: z.string().min(1, t('validation.firstNameRequired')),
    lastName: z.string().min(1, t('validation.lastNameRequired')),
    street: z.string().min(1, t('validation.streetRequired')),
    city: z.string().min(1, t('validation.cityRequired')),
    state: z.string().min(1, t('validation.stateRequired')),
    zipCode: z.string().min(1, t('validation.zipRequired')),
  });
}

export type ShippingAddressFormValues = z.infer<
  ReturnType<typeof createShippingAddressSchema>
>;
