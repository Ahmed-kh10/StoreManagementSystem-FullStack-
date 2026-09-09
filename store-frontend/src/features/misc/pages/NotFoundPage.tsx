import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('الصفحة غير موجودة');

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="font-display text-8xl text-accent">404</span>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl text-text">
          الصفحة اللي بتدور عليها مش موجودة
        </h1>
        <p className="font-body text-muted max-w-sm">
          يمكن الرابط اتغيّر أو الصفحة اتشالت. جرّب ترجع للرئيسية.
        </p>
      </div>
      <Link to="/">
        <Button>الرجوع للرئيسية</Button>
      </Link>
    </div>
  );
}
