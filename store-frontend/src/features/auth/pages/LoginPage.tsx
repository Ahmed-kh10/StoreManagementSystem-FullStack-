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
import { createLoginSchema, type LoginFormValues } from '../utils/validation';
export function LoginPage() {
  const { t, i18n } = useTranslation();
  const loginSchema = useMemo(() => createLoginSchema(t), [i18n.language]);
  useDocumentTitle(t('auth.loginTitle'));

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues): Promise<void> {
    setServerError(null);

    try {
      await login(values);
      showToast(t('auth.loginSuccess'), 'success');
      navigate('/');
    } catch {
      setServerError(t('auth.loginError'));
      showToast(t('auth.loginFailed'), 'error');
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-surface border border-border rounded-sm p-8 flex flex-col gap-5"
      >
        <h1 className="font-display text-3xl text-accent text-center mb-2">
          {t('auth.loginTitle')}
        </h1>

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
          {t('auth.loginButton')}
        </Button>

        <p className="text-sm text-muted text-center">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-accent hover:underline">
            {t('auth.signUpNow')}
          </Link>
        </p>
      </form>
    </div>
  );
}
