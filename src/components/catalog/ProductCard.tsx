import Image from 'next/image';
import type {SanityImageSource} from '@sanity/image-url';
import {Link} from '@/i18n/navigation';
import {urlFor} from '@/sanity/image';
import {pickLocale, type LocaleValue} from '@/lib/locale';
import WishlistButton from '@/components/favorites/WishlistButton';

// Тип одного продукту з каталогу (мінімальні поля для картки)
export interface ProductCardData {
  _id: string;
  title: LocaleValue;
  slug: {current: string};
  images?: SanityImageSource[];
  category?: string;
}

interface ProductCardProps {
  product: ProductCardData;
  locale: string;
  /** Уже перекладена назва категорії */
  categoryLabel?: string;
}

// Редакционная карточка изделия: высокое фото 4:5 с мягким зумом / hover-свапом на 2-й кадр,
// сердце «в избранное» поверх карточки, тонкая золотая засечка и serif-название.
export default function ProductCard({product, locale, categoryLabel}: ProductCardProps) {
  const title = pickLocale(product.title, locale);
  const images = product.images ?? [];

  const imageUrl = images.length > 0
    ? urlFor(images[0]).width(800).height(1000).fit('crop').url()
    : null;
  // Второй кадр — для премиум-эффекта «смена фото при наведении» (как у Messika/Mejuri).
  const secondUrl = images.length > 1
    ? urlFor(images[1]).width(800).height(1000).fit('crop').url()
    : null;

  return (
    <div className="group relative overflow-hidden rounded-sm border border-line bg-cream transition-all duration-500 hover:border-gold/50 hover:shadow-[0_18px_50px_-24px_rgba(31,27,22,0.45)]">
      <Link href={`/catalog/${product.slug.current}`} className="block">
        {/* Обёртка изображения 4:5 — мягкий зум / hover-свап + лёгкое затемнение */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-champagne">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={title || 'Dream Gold'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover transition-all duration-[1200ms] ease-out ${
                  secondUrl ? 'group-hover:opacity-0' : 'group-hover:scale-[1.06]'
                }`}
              />
              {/* Второй кадр плавно проявляется по ховеру (если он есть) */}
              {secondUrl && (
                <Image
                  src={secondUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover opacity-0 transition-all duration-[1200ms] ease-out group-hover:scale-[1.04] group-hover:opacity-100"
                />
              )}
              {/* Тонкая градиентная вуаль снизу — глубина, не перекрывает фото */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </>
          ) : (
            /* Элегантный плейсхолдер: тонкий золотой ромб + подпись */
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
              <svg
                width="36"
                height="36"
                viewBox="0 0 96 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <polygon
                  points="48,8 88,40 48,88 8,40"
                  stroke="#C4A052"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.6"
                />
                <polyline
                  points="8,40 48,24 88,40"
                  stroke="#C4A052"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.45"
                />
              </svg>
              <span className="font-body text-[11px] uppercase tracking-[0.3em] text-muted">
                Dream Gold
              </span>
            </div>
          )}
        </div>

        {/* Текстовая часть карточки */}
        <div className="px-6 pb-7 pt-6">
          {categoryLabel && (
            <p className="mb-2 font-body text-[10px] uppercase tracking-[0.32em] text-gold">
              {categoryLabel}
            </p>
          )}
          <h3 className="font-heading text-lg leading-snug text-charcoal transition-colors duration-300 group-hover:text-gold-deep">
            {title || '—'}
          </h3>
          {/* Тонкая золотая засечка, «прорастающая» по ховеру */}
          <span
            aria-hidden="true"
            className="mt-3 block h-px w-8 bg-gold/40 transition-all duration-500 group-hover:w-14 group-hover:bg-gold"
          />
        </div>
      </Link>

      {/* Сердце «в избранное» — поверх карточки, вне ссылки */}
      <WishlistButton productId={product._id} className="absolute right-3 top-3 z-20" />
    </div>
  );
}
