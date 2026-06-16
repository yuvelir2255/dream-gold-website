'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {useWishlist} from './WishlistContext';

// Сердце со счётчиком в шапке → ведёт на /favorites.
export default function WishlistLink() {
  const {count, hydrated} = useWishlist();
  const t = useTranslations('favorites');

  return (
    <Link
      href="/favorites"
      aria-label={t('nav')}
      className="relative flex items-center text-cream/75 transition-colors duration-300 hover:text-cream"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      {hydrated && count > 0 && (
        <span className="absolute -right-2.5 -top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gold px-1 text-[9px] font-semibold leading-none text-dark">
          {count}
        </span>
      )}
    </Link>
  );
}
