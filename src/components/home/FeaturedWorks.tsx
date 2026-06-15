import {getTranslations, getLocale} from 'next-intl/server';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import ProductCard from '@/components/catalog/ProductCard';
import type {ProductCardData} from '@/components/catalog/ProductCard';
import {client} from '@/sanity/client';
import {FEATURED_PRODUCTS} from '@/lib/queries';

// Витрина вибраних робіт на головній. Дані з CMS; якщо порожньо — плейсхолдери.
export default async function FeaturedWorks() {
  const t = await getTranslations('works');
  const locale = await getLocale();

  const products: ProductCardData[] = await client.fetch(FEATURED_PRODUCTS);

  const placeholders = [1, 2, 3];

  return (
    <Section className="bg-champagne">
      <Container>
        <Reveal className="text-center">
          <h2 className="text-3xl sm:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-muted">{t('subtitle')}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {products.length > 0
            ? products.map((product, i) => (
                <Reveal key={product._id} delay={i * 0.1}>
                  <ProductCard product={product} locale={locale} />
                </Reveal>
              ))
            : placeholders.map((n, i) => (
                <Reveal key={n} delay={i * 0.1}>
                  <div className="flex aspect-[3/4] items-center justify-center rounded-sm bg-cream text-sm text-muted">
                    фото виробу
                  </div>
                </Reveal>
              ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Button href="/catalog" variant="outline">{t('cta')}</Button>
        </Reveal>
      </Container>
    </Section>
  );
}
