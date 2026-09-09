import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/features/home/pages/HomePage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ProductsPage } from '@/features/products/pages/ProductsPage';
import { ProductDetailsPage } from '@/features/products/pages/ProductDetailsPage';
import { BasketPage } from '@/features/basket/pages/BasketPage';
import { CheckoutPage } from '@/features/orders/pages/CheckoutPage';
import { OrdersPage } from '@/features/orders/pages/OrdersPage';
import { OrderDetailsPage } from '@/features/orders/pages/OrderDetailsPage';
import { PaymentPage } from '@/features/payments/pages/PaymentPage';
import { AccountPage } from '@/features/account/pages/AccountPage';
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage';
import { AdminProductsPage } from '@/features/admin/pages/AdminProductsPage';
import { AdminProductCreatePage } from '@/features/admin/pages/AdminProductCreatePage';
import { AdminProductEditPage } from '@/features/admin/pages/AdminProductEditPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { NotFoundPage } from '@/features/misc/pages/NotFoundPage';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:id', element: <ProductDetailsPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/basket', element: <BasketPage /> },
          { path: '/checkout', element: <CheckoutPage /> },
          { path: '/orders', element: <OrdersPage /> },
          { path: '/orders/:id', element: <OrderDetailsPage /> },
          { path: '/payment/:orderId', element: <PaymentPage /> },
          { path: '/account', element: <AccountPage /> },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          { path: '/admin', element: <AdminDashboardPage /> },
          { path: '/admin/products', element: <AdminProductsPage /> },
          { path: '/admin/products/new', element: <AdminProductCreatePage /> },
          {
            path: '/admin/products/:id/edit',
            element: <AdminProductEditPage />,
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
