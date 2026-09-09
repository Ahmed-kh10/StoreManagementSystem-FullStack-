import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth();

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

  return <Outlet />;
}
