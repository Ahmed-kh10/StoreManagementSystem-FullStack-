import { useMemo } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  createRegisterSchema,
  type RegisterFormValues,
} from '../utils/validation';
export function RegisterPage() {
  const { t, i18n } = useTranslation();
  const registerSchema = useMemo(
    () => createRegisterSchema(t),
    [i18n.language],
  );
  useDocumentTitle(t('auth.registerTitle'));

  const { register: registerUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues): Promise<void> {
    setServerError(null);

    try {
      await registerUser(values);
      showToast(t('auth.registerSuccess'), 'success');
      navigate('/');
    } catch {
      setServerError(t('auth.registerError'));
      showToast(t('auth.registerFailed'), 'error');
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-surface border border-border rounded-sm p-8 flex flex-col gap-5"
      >
        <h1 className="font-display text-3xl text-accent text-center mb-2">
          {t('auth.registerTitle')}
        </h1>

        <Input
          label={t('auth.displayName')}
          error={errors.displayName?.message}
          {...register('displayName')}
        />

        <Input
          label={t('auth.email')}
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label={t('auth.password')}
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />

        {serverError && (
          <p className="text-sm text-danger text-center">{serverError}</p>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          {t('auth.registerButton')}
        </Button>

        <p className="text-sm text-muted text-center">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="text-accent hover:underline">
            {t('auth.signIn')}
          </Link>
        </p>
      </form>
    </div>
  );
}
