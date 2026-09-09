import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { productsApi } from '@/features/products/api/productsApi';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { Button } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { HeroGraphic } from '../components/HeroGraphic';

export function HomePage() {
  const { t } = useTranslation();
  useDocumentTitle(t('nav.home'));

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.getAll({ pageIndex: 1, pageSize: 4 }),
  });

  return (
    <div>
      <section className="border-b border-border section-divider">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 px-6 py-16 md:py-24">
          <div className="flex flex-col gap-6">
            <span className="text-accent/70 text-sm tracking-widest uppercase">
              {t('home.badge')}
            </span>
            <h1 className="font-display text-5xl md:text-6xl leading-tight text-text">
              {t('home.titleLine1')}{' '}
              <span className="text-accent">{t('home.titleHighlight')}</span>
            </h1>
            <p className="font-body text-text/60 max-w-md">
              {t('home.subtitle')}
            </p>
            <div>
              <Link to="/products">
                <Button size="lg">{t('home.browseProducts')}</Button>
              </Link>
            </div>
          </div>

          <div className="relative aspect-square md:aspect-[4/3] rounded-sm overflow-hidden bg-surface flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-accent)_0%,transparent_70%)] opacity-[0.06]" />
            <div className="w-3/4 max-w-xs">
              <HeroGraphic />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border section-divider">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 px-6 py-12">
          <div className="flex flex-col items-center text-center gap-3 border border-border rounded-sm bg-surface p-6">
            <Truck className="text-accent" size={28} />
            <h3 className="font-body font-semibold text-text">
              {t('home.shippingTitle')}
            </h3>
            <p className="text-sm text-text/50">{t('home.shippingDesc')}</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3 border border-border rounded-sm bg-surface p-6">
            <ShieldCheck className="text-accent" size={28} />
            <h3 className="font-body font-semibold text-text">
              {t('home.paymentTitle')}
            </h3>
            <p className="text-sm text-text/50">{t('home.paymentDesc')}</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3 border border-border rounded-sm bg-surface p-6">
            <RotateCcw className="text-accent" size={28} />
            <h3 className="font-body font-semibold text-text">
              {t('home.returnsTitle')}
            </h3>
            <p className="text-sm text-text/50">{t('home.returnsDesc')}</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl text-accent">
            {t('home.featuredProducts')}
          </h2>
          <Link to="/products" className="text-sm text-accent hover:underline">
            {t('common.seeAll')} ←
          </Link>
        </div>

        <ProductGrid products={data?.data ?? []} isLoading={isLoading} />
      </section>
    </div>
  );
}
