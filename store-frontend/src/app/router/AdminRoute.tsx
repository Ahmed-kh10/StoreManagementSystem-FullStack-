import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

export function AdminRoute() {
  const { user, isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="font-body text-text">جارٍ التحميل...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.roles.includes('Admin')) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
