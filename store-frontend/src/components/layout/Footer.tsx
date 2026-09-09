import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border mt-16">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-6">
        <span className="font-display text-2xl text-accent">Store</span>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Store. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
