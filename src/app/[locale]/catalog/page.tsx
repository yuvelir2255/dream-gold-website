import {setRequestLocale} from 'next-intl/server';
import {getTranslations} from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import DarkBackdrop from '@/components/ui/DarkBackdrop';
import CatalogFilters from '@/components/catalog/CatalogFilters';
import {client} from '@/sanity/client';
import {ALL_PRODUCTS} from '@/lib/queries';
import type {ProductCardData} from '@/components/catalog/ProductCard';

export default async function CatalogPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'catalog'});

  // Серверный fetch — нет CORS, работает в любом окружении
  const products: ProductCardData[] = await client.fetch(ALL_PRODUCTS);

  return (
    <>
      <Header />
      <main>
        {/* ─── Кинематографичная тёмная «шапка» каталога ─── */}
        <section className="relative overflow-hidden bg-dark text-cream">
          {/* Сияние сверху по центру — атмосфера как в hero/тёмных секциях */}
          <DarkBackdrop glow="50% 18%" glowSize="75% 60%" glowOpacity={0.1} />

          <Container className="relative">
            <div className="mx-auto max-w-2xl py-28 text-center sm:py-32">
              {/* Эйбров: золотая линия + текст вразрядку */}
              <Reveal>
                <div className="flex items-center justify-center gap-4">
                  <span className="h-px w-10 bg-gold/40" />
                  <span className="font-body text-[10px] uppercase tracking-[0.42em] text-gold/80">
                    {t('eyebrow')}
                  </span>
                  <span className="h-px w-10 bg-gold/40" />
                </div>
              </Reveal>

              {/* Крупный serif-заголовок */}
              <Reveal delay={0.08}>
                <h1 className="mt-6 font-heading text-4xl leading-[1.02] tracking-tight text-cream sm:text-5xl lg:text-6xl">
                  {t('title')}
                </h1>
              </Reveal>

              {/* Вступление */}
              <Reveal delay={0.16}>
                <p className="mx-auto mt-6 max-w-xl font-body text-sm font-light leading-relaxed text-cream/60 sm:text-base">
                  {t('intro')}
                </p>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ─── Светлая секция: фильтры + сетка изделий ─── */}
        <Section className="bg-ivory">
          <Container>
            <CatalogFilters products={products} locale={locale} />
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
