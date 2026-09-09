import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // في مشروع حقيقي هنا مكان إرسال الخطأ لخدمة مراقبة زي Sentry
    console.error('Unhandled UI error:', error, errorInfo);
  }

  handleReload = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-6 text-center">
          <span className="font-display text-6xl text-danger">!</span>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-2xl text-text">
              حصلت مشكلة غير متوقعة
            </h1>
            <p className="font-body text-muted max-w-sm">
              حاولنا نعرض الصفحة ومقدرناش. جرّب ترجع للرئيسية.
            </p>
          </div>
          <button
            onClick={this.handleReload}
            className="font-body font-semibold rounded-sm bg-accent text-bg px-6 py-2.5 hover:opacity-90 transition-opacity"
          >
            الرجوع للرئيسية
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
