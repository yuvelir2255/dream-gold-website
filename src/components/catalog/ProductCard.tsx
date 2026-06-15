import Image from 'next/image';
import type {SanityImageSource} from '@sanity/image-url';
import {Link} from '@/i18n/navigation';
import {urlFor} from '@/sanity/image';
import {pickLocale, type LocaleValue} from '@/lib/locale';

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

export default function ProductCard({product, locale, categoryLabel}: ProductCardProps) {
  const title = pickLocale(product.title, locale);
  const hasImage = product.images && product.images.length > 0;

  const imageUrl = hasImage
    ? urlFor(product.images![0]).width(800).height(1000).fit('crop').url()
    : null;

  return (
    <Link
      href={`/catalog/${product.slug.current}`}
      className="group block bg-cream border border-line rounded-sm overflow-hidden hover:shadow-lg hover:border-gold/40 transition-all duration-300"
    >
      {/* Обёртка изображения с соотношением сторон 4:5 */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-champagne">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title || 'Dream Gold'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Плейсхолдер если нет фото */
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-muted text-sm font-body">Dream Gold</span>
          </div>
        )}
      </div>

      {/* Текстовая часть карточки */}
      <div className="p-4">
        {categoryLabel && (
          <p className="mb-1 text-xs font-body uppercase tracking-widest text-gold">
            {categoryLabel}
          </p>
        )}
        <h3 className="font-heading text-lg text-charcoal leading-snug group-hover:text-gold transition-colors duration-200">
          {title || '—'}
        </h3>
      </div>
    </Link>
  );
}
