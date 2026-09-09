import { z } from 'zod';
import type { TFunction } from 'i18next';

export function createLoginSchema(t: TFunction) {
  return z.object({
    email: z
      .string()
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    password: z.string().min(1, t('validation.passwordRequired')),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export function createRegisterSchema(t: TFunction) {
  return z.object({
    displayName: z.string().min(2, t('validation.nameMinLength', { count: 2 })),
    email: z
      .string()
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    password: z
      .string()
      .min(6, t('validation.passwordMinLength', { count: 6 }))
      .regex(/[A-Z]/, t('validation.passwordUppercase'))
      .regex(/[a-z]/, t('validation.passwordLowercase'))
      .regex(/[0-9]/, t('validation.passwordDigit')),
  });
}

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;
