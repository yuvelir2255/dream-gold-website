import {getTranslations, getLocale} from 'next-intl/server';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCard from '@/components/catalog/ProductCard';
import type {ProductCardData} from '@/components/catalog/ProductCard';
import PhotoSlot from '@/components/ui/PhotoSlot';
import {client} from '@/sanity/client';
import {FEATURED_PRODUCTS} from '@/lib/queries';

// Витрина вибраних робіт на головній — як редакційна галерея.
// Дані з CMS; якщо порожньо — елегантні плейсхолдери. Логіка fetch не змінена.
export default async function FeaturedWorks() {
  const t = await getTranslations('works');
  const locale = await getLocale();

  const products: ProductCardData[] = await client.fetch(FEATURED_PRODUCTS);

  const placeholders = [1, 2, 3];

  return (
    <Section className="bg-champagne">
      <Container>
        {/* Редакционная «шапка»: заголовок слева, CTA справа (на десктопе) */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            subtitle={t('subtitle')}
            tone="light"
            align="left"
            className="md:max-w-xl"
          />
          {/* CTA в одну строку с заголовком на десктопе */}
          <Reveal delay={0.2} className="hidden shrink-0 md:block">
            <Button href="/catalog" variant="outline">{t('cta')}</Button>
          </Reveal>
        </div>

        {/* Тонкая золотая линия-разделитель под шапкой */}
        <Reveal delay={0.1}>
          <div className="mt-10 h-px w-full bg-gold/20" />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {products.length > 0
            ? products.map((product, i) => (
                <Reveal key={product._id} delay={i * 0.1}>
                  <ProductCard product={product} locale={locale} />
                </Reveal>
              ))
            : placeholders.map((n, i) => (
                <Reveal key={n} delay={i * 0.1}>
                  {/* Слот под будущее фото изделия (4:5) */}
                  <PhotoSlot ratio="4 / 5" hint="4:5 · 1600×2000" note="Виріб на світлому фоні" />
                </Reveal>
              ))}
        </div>

        {/* CTA для мобильных (на десктопе он в шапке) */}
        <Reveal className="mt-12 text-center md:hidden">
          <Button href="/catalog" variant="outline">{t('cta')}</Button>
        </Reveal>
      </Container>
    </Section>
  );
}
