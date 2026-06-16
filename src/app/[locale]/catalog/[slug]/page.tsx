import {notFound} from 'next/navigation';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import Accordion from '@/components/catalog/Accordion';
import ProductGallery from '@/components/catalog/ProductGallery';
import StickyOrderCta from '@/components/catalog/StickyOrderCta';
import {client} from '@/sanity/client';
import {PRODUCT_BY_SLUG} from '@/lib/queries';
import {pickLocale} from '@/lib/locale';

// Сторінка окремого виробу: галерея, характеристики, акордеони, CTA.
export default async function ProductPage({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  const product = await client.fetch(PRODUCT_BY_SLUG, {slug});
  if (!product) {
    notFound();
  }

  // Переклади двох просторів імен
  const tProduct = await getTranslations({locale, namespace: 'product'});
  const tCatalog = await getTranslations({locale, namespace: 'catalog'});

  const title = pickLocale(product.title, locale);
  const description = pickLocale(product.description, locale);
  const details = pickLocale(product.details, locale);

  // Масив порад по догляду з перекладів
  const careItems = tProduct.raw('static.care') as string[];

  // Перекладена назва категорії — для эйброва над заголовком (якщо є)
  let categoryLabel = '';
  if (product.category) {
    try { categoryLabel = tCatalog(`options.category.${product.category}`); } catch {}
  }

  // Список характеристик (показуємо лише якщо є значення)
  const specs: {label: string; value: string}[] = [];
  if (product.category) {
    // tCatalog може не мати цього ключа — захищаємось через try/catch-подібний підхід
    let val = '';
    try { val = tCatalog(`options.category.${product.category}`); } catch {}
    if (val) specs.push({label: tProduct('spec.category'), value: val});
  }
  if (product.metal) {
    let val = '';
    try { val = tCatalog(`options.metal.${product.metal}`); } catch {}
    if (val) specs.push({label: tProduct('spec.metal'), value: val});
  }
  if (product.purity) {
    let val = '';
    try { val = tCatalog(`options.purity.${product.purity}`); } catch {}
    if (val) specs.push({label: tProduct('spec.purity'), value: val});
  }
  if (product.style) {
    let val = '';
    try { val = tCatalog(`options.style.${product.style}`); } catch {}
    if (val) specs.push({label: tProduct('spec.style'), value: val});
  }
  if (product.stones) {
    let val = '';
    try { val = tCatalog(`options.stones.${product.stones}`); } catch {}
    if (val) specs.push({label: tProduct('spec.stones'), value: val});
  }

  // Эйбров над заголовком: категорія, якщо є, інакше нейтральне «Виріб»
  const eyebrow = categoryLabel || tProduct('eyebrow');

  return (
    <>
      <Header />
      <main>
        <Section className="bg-ivory">
          <Container>
            {/* Хлібна крихта / повернення до каталогу */}
            <Reveal>
              <Link
                href="/catalog"
                className="group inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.26em] text-muted transition-colors duration-300 hover:text-gold-deep"
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-px w-6 bg-gold transition-all duration-300 group-hover:w-9"
                />
                {tProduct('back')}
              </Link>
            </Reveal>

            {/* Двоколоночний макет: фото зліва, деталі справа */}
            <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">

              {/* Галерея */}
              <Reveal>
                <ProductGallery
                  images={product.images || []}
                  alt={title}
                  video={product.video}
                />
              </Reveal>

              {/* Права колонка: эйбров, назва, характеристики, акордеони, CTA.
                  На десктопе «прилипает» при прокрутке (sticky), пока листается галерея. */}
              <div className="flex flex-col md:sticky md:top-28 md:self-start">
                {/* Эйбров: золота лінія + категорія вразрядку */}
                <Reveal>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-gold/50" />
                    <span className="font-body text-[10px] uppercase tracking-[0.4em] text-gold">
                      {eyebrow}
                    </span>
                  </div>
                </Reveal>

                {/* Назва виробу — крупний serif */}
                <Reveal delay={0.08}>
                  <h1 className="mt-5 font-heading text-3xl leading-[1.05] tracking-tight text-charcoal sm:text-4xl lg:text-5xl">
                    {title}
                  </h1>
                </Reveal>

                {/* Характеристики */}
                {specs.length > 0 && (
                  <Reveal delay={0.14}>
                    <div className="mt-8 border-t border-line pt-8">
                      <span className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.3em] text-gold">
                        <span aria-hidden="true" className="h-px w-4 bg-gold/50" />
                        {tProduct('specsTitle')}
                      </span>
                      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
                        {specs.map(({label, value}) => (
                          <div key={label}>
                            <dt className="font-body text-[10px] uppercase tracking-[0.24em] text-muted">
                              {label}
                            </dt>
                            <dd className="mt-1 font-body text-sm text-charcoal">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </Reveal>
                )}

                {/* Акордеони */}
                <Reveal delay={0.2}>
                  <div className="mt-8 border-t border-line">

                    {/* Опис */}
                    {description && (
                      <Accordion title={tProduct('sections.description')} defaultOpen>
                        <p>{description}</p>
                      </Accordion>
                    )}

                    {/* Деталі (тільки якщо є) */}
                    {details && (
                      <Accordion title={tProduct('sections.details')}>
                        <p>{details}</p>
                      </Accordion>
                    )}

                    {/* Доставка */}
                    <Accordion title={tProduct('sections.shipping')}>
                      <p>{tProduct('static.shipping')}</p>
                    </Accordion>

                    {/* Пакування */}
                    <Accordion title={tProduct('sections.packaging')}>
                      <p>{tProduct('static.packaging')}</p>
                    </Accordion>

                    {/* Догляд */}
                    <Accordion title={tProduct('sections.care')}>
                      <ul className="list-disc space-y-1.5 pl-5">
                        {careItems.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </Accordion>
                  </div>
                </Reveal>

                {/* CTA */}
                <Reveal delay={0.26}>
                  <div className="mt-10">
                    {/* Передаємо назву виробу у форму як «натхнення» (?ref=) */}
                    <Button href={`/order?ref=${encodeURIComponent(title)}`} variant="solid">
                      {tProduct('cta')}
                    </Button>
                  </div>
                </Reveal>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      {/* Плавающая CTA внизу (мобильный): появляется при прокрутке, прячется у футера */}
      <StickyOrderCta href={`/order?ref=${encodeURIComponent(title)}`} label={tProduct('cta')} />
      <Footer />
    </>
  );
}
