import {notFound} from 'next/navigation';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Accordion from '@/components/catalog/Accordion';
import ProductGallery from '@/components/catalog/ProductGallery';
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

  return (
    <>
      <Header />
      <main>
        <Section className="bg-ivory">
          <Container>
            {/* Двоколоночний макет: фото зліва, деталі справа */}
            <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">

              {/* Галерея */}
              <ProductGallery
                images={product.images || []}
                alt={title}
                video={product.video}
              />

              {/* Права колонка: назва, характеристики, акордеони, CTA */}
              <div className="flex flex-col">
                <h1 className="font-heading text-3xl sm:text-4xl text-charcoal leading-tight">
                  {title}
                </h1>

                {/* Характеристики */}
                {specs.length > 0 && (
                  <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-6">
                    {specs.map(({label, value}) => (
                      <div key={label}>
                        <dt className="text-xs font-body uppercase tracking-widest text-muted">
                          {label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-body text-charcoal">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {/* Акордеони */}
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

                {/* CTA */}
                <div className="mt-10">
                  <Button href="/order" variant="solid">
                    {tProduct('cta')}
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
