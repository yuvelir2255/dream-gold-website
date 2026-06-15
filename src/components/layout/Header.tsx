import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Container from '@/components/ui/Container';
import Logo from './Logo';
import LangSwitcher from './LangSwitcher';

// Шапка на тёмном фоне (под белый логотип).
export default function Header() {
  const t = useTranslations('nav');
  return (
    <header className="bg-dark text-cream">
      <Container className="flex items-center justify-between py-5">
        <Link href="/">
          <Logo tone="light" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] text-cream/80">
          <Link href="/catalog" className="hover:text-gold transition-colors">{t('catalog')}</Link>
          <Link href="/order" className="hover:text-gold transition-colors">{t('order')}</Link>
          <Link href="/about" className="hover:text-gold transition-colors">{t('about')}</Link>
          <Link href="/contacts" className="hover:text-gold transition-colors">{t('contacts')}</Link>
        </nav>
        <LangSwitcher />
      </Container>
    </header>
  );
}
