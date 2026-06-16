'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Reveal from '@/components/ui/Reveal';
import ProductCard, {type ProductCardData} from '@/components/catalog/ProductCard';
import {useWishlist} from './WishlistContext';

// Сетка «Избранного». Все изделия приходят с сервера, фильтруем по сохранённым id (из браузера).
export default function FavoritesGrid({
  products,
  locale,
}: {
  products: ProductCardData[];
  locale: string;
}) {
  const {ids, hydrated} = useWishlist();
  const t = useTranslations('favorites');
  const tCatalog = useTranslations('catalog');

  // До гидрации избранное неизвестно — держим место, чтобы не было скачка/мерцания.
  if (!hydrated) {
    return <div className="min-h-[40vh]" />;
  }

  const favorites = products.filter((p) => ids.includes(p._id));

  // Пустое состояние
  if (favorites.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-heading text-2xl tracking-tight text-charcoal sm:text-3xl">
          {t('empty')}
        </p>
        <p className="mx-auto mt-4 max-w-md font-body text-sm font-light leading-relaxed text-muted">
          {t('emptyHint')}
        </p>
        <Link
          href="/catalog"
          className="mt-8 inline-flex items-center justify-center rounded-sm bg-gold px-7 py-3 font-body text-xs uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-deep hover:shadow-lg hover:shadow-black/20"
        >
          {t('emptyCta')}
        </Link>
      </div>
    );
  }

  const getCategoryLabel = (cat?: string): string => {
    if (!cat) return '';
    try {
      return tCatalog(`options.category.${cat}`);
    } catch {
      return '';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {favorites.map((product, i) => (
        <Reveal key={product._id} delay={(i % 3) * 0.08}>
          <ProductCard
            product={product}
            locale={locale}
            categoryLabel={getCategoryLabel(product.category)}
          />
        </Reveal>
      ))}
    </div>
  );
}
