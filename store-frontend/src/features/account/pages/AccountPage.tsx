import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { authApi } from '@/features/auth/api/authApi';
import { useAuth } from '@/app/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function AccountPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('account.title'));
  const { user, logout } = useAuth();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: authApi.getCurrentUser,
  });

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-md mx-auto flex flex-col gap-8">
        <h1 className="font-display text-3xl text-accent">
          {t('account.title')}
        </h1>

        <div className="border border-border rounded-sm bg-surface p-6 flex flex-col gap-4">
          {isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted uppercase tracking-wide">
                  {t('account.name')}
                </span>
                <span className="text-text font-body">{user?.displayName}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted uppercase tracking-wide">
                  {t('account.email')}
                </span>
                <span className="text-text font-body">
                  {currentUser?.email ?? user?.email}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted uppercase tracking-wide">
                  {t('account.permissions')}
                </span>
                <span className="text-text font-body">
                  {user?.roles.length
                    ? user.roles.join(', ')
                    : t('account.regularUser')}
                </span>
              </div>
            </>
          )}
        </div>

        <Button variant="secondary" onClick={() => logout()}>
          {t('account.logout')}
        </Button>
      </div>
    </div>
  );
}
