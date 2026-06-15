import type {Metadata} from 'next';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {EB_Garamond, Montserrat} from 'next/font/google';
import {routing} from '@/i18n/routing';
import SmoothScroll from '@/components/ui/SmoothScroll';
import '../globals.css';

// Заголовочный serif с кириллицей + латиницей
const ebGaramond = EB_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-eb-garamond',
  display: 'swap'
});

// Основной текстовый шрифт с кириллицей
const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Dream Gold — ювелірний дім',
  description: 'Індивідуальні ювелірні вироби. Власне виробництво в Україні.'
};

// Генерируем статические страницы для всех локалей
export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${ebGaramond.variable} ${montserrat.variable}`}>
      <body>
        <NextIntlClientProvider><SmoothScroll>{children}</SmoothScroll></NextIntlClientProvider>
      </body>
    </html>
  );
}
