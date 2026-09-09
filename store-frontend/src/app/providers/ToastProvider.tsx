import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let idCounter = 0;

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-border/40 text-accent',
  error: 'border-danger/40 text-danger',
  info: 'border-ivory/20 text-text',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, variant }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed bottom-4 inset-x-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto max-w-sm w-full sm:w-auto px-4 py-3 rounded-sm border bg-surface text-sm font-body shadow-lg animate-[toast-in_0.2s_ease-out] ${variantStyles[toast.variant]}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
