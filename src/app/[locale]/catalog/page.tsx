import {setRequestLocale} from 'next-intl/server';
import {getTranslations} from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
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
        <Section className="bg-ivory">
          <Container>
            {/* Заголовок страницы */}
            <h1 className="mb-10 font-heading text-4xl sm:text-5xl text-charcoal">
              {t('title')}
            </h1>

            {/* Фильтры + сетка товаров */}
            <CatalogFilters products={products} locale={locale} />
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
