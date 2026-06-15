'use client';

import {usePathname, useRouter} from '@/i18n/navigation';
import {useLocale} from 'next-intl';
import {routing} from '@/i18n/routing';

// Переключает локаль, сохраняя текущий путь.
export default function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 text-xs tracking-widest">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-2">
          {i > 0 && <span className="text-line">/</span>}
          <button
            onClick={() => router.replace(pathname, {locale: loc})}
            className={
              loc === locale
                ? 'text-gold'
                : 'text-muted hover:text-gold transition-colors'
            }
            aria-current={loc === locale ? 'true' : undefined}
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
