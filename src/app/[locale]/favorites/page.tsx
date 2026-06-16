import {setRequestLocale, getTranslations} from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import DarkBackdrop from '@/components/ui/DarkBackdrop';
import FavoritesGrid from '@/components/favorites/FavoritesGrid';
import {client} from '@/sanity/client';
import {ALL_PRODUCTS} from '@/lib/queries';
import type {ProductCardData} from '@/components/catalog/ProductCard';

// Страница «Избранное»: все изделия с сервера, фильтрация по сохранённым в браузере id.
export default async function FavoritesPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'favorites'});
  const products: ProductCardData[] = await client.fetch(ALL_PRODUCTS);

  return (
    <>
      <Header />
      <main>
        {/* Кинематографичная тёмная «шапка» (как в каталоге) */}
        <section className="relative overflow-hidden bg-dark text-cream">
          <DarkBackdrop glow="50% 18%" glowSize="75% 60%" glowOpacity={0.1} />
          <Container className="relative">
            <div className="mx-auto max-w-2xl py-28 text-center sm:py-32">
              <Reveal>
                <div className="flex items-center justify-center gap-4">
                  <span className="h-px w-10 bg-gold/40" />
                  <span className="font-body text-[10px] uppercase tracking-[0.42em] text-gold/80">
                    {t('eyebrow')}
                  </span>
                  <span className="h-px w-10 bg-gold/40" />
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-6 font-heading text-4xl leading-[1.02] tracking-tight text-cream sm:text-5xl lg:text-6xl">
                  {t('title')}
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mx-auto mt-6 max-w-xl font-body text-sm font-light leading-relaxed text-cream/60 sm:text-base">
                  {t('intro')}
                </p>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* Светлая секция: сетка избранного */}
        <Section className="bg-ivory">
          <Container>
            <FavoritesGrid products={products} locale={locale} />
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
