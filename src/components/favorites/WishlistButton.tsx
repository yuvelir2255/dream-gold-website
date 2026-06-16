'use client';

import {useTranslations} from 'next-intl';
import {useWishlist} from './WishlistContext';

// Кнопка-сердце на карточке изделия. Лежит ПОВЕРХ карточки (вне ссылки),
// поэтому клик по ней не открывает изделие — только добавляет/убирает из «Избранного».
export default function WishlistButton({
  productId,
  className = '',
}: {
  productId: string;
  className?: string;
}) {
  const {has, toggle, hydrated} = useWishlist();
  const t = useTranslations('favorites');
  const active = hydrated && has(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-pressed={active}
      aria-label={active ? t('remove') : t('add')}
      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-all duration-300 ${
        active
          ? 'border-gold/55 bg-cream/95 text-gold-deep'
          : 'border-line bg-cream/85 text-charcoal/55 hover:border-gold/60 hover:text-gold-deep'
      } ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        aria-hidden="true"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
