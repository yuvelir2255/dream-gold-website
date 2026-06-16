'use client';
import {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Container from '@/components/ui/Container';
import Logo from './Logo';
import LangSwitcher from './LangSwitcher';
import WishlistLink from '@/components/favorites/WishlistLink';

// Шапка на тёмном фоне (белый логотип).
// При прокрутке > 24px: backdrop-blur + тёмная подложка (glass-эффект).
// Навигация: увеличенный трекинг букв, золотой underline на ховере без сдвига layout.
export default function Header() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 text-cream transition-all duration-500 ${
        scrolled
          ? 'bg-dark/80 backdrop-blur-md border-b border-gold/15 py-0'
          : 'bg-dark border-b border-transparent py-0'
      }`}
    >
      <Container
        className={`flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-6'
        }`}
      >
        {/* Логотип */}
        <Link href="/" className="flex-shrink-0">
          <Logo tone="light" />
        </Link>

        {/* Навигация: тонкий текст, широкий трекинг, gold-underline hover */}
        <nav className="hidden md:flex items-center gap-10 text-[10px] uppercase tracking-[0.32em] text-cream/70">
          {(
            [
              {key: 'catalog', href: '/catalog'},
              {key: 'order',   href: '/order'},
              {key: 'about',   href: '/about'},
              {key: 'contacts',href: '/contacts'},
            ] as const
          ).map(({key, href}) => (
            <Link
              key={key}
              href={href}
              className="relative py-1 transition-colors duration-300 hover:text-cream
                after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-gold
                after:transition-all after:duration-300 hover:after:w-full"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Избранное + переключатель языка */}
        <div className="flex items-center gap-5">
          <WishlistLink />
          <LangSwitcher />
        </div>
      </Container>
    </header>
  );
}
