import { StrictMode } from 'react';
import '@/lib/i18n';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { AuthProvider } from './app/providers/AuthProvider';
import { ToastProvider } from './app/providers/ToastProvider';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { AppRouter } from './app/router/AppRouter';
import { ErrorBoundary } from './app/ErrorBoundary';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AuthProvider>
              <AppRouter />
            </AuthProvider>
          </ToastProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
