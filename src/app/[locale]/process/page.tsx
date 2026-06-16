import {setRequestLocale, getTranslations} from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import DarkBackdrop from '@/components/ui/DarkBackdrop';
import PhotoSlot from '@/components/ui/PhotoSlot';

// Страница «Как проходит заказ» — премиальный вертикальный timeline этапов
// (заявка → расчёт → задаток → производство → доставка) + атмосферный фото-слот + CTA.
export default async function ProcessPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'process'});

  const steps = [1, 2, 3, 4, 5, 6].map((n) => ({
    n: `0${n}`,
    title: t(`step${n}Title`),
    desc: t(`step${n}Desc`),
  }));

  return (
    <>
      <Header />
      <main>
        {/* Кинематографичная тёмная «шапка» */}
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

        {/* Светлая секция: атмосферный кадр + timeline этапов */}
        <Section className="bg-ivory">
          <Container>
            {/* Большой атмосферный фото-слот */}
            <Reveal>
              <div className="mx-auto max-w-4xl">
                <PhotoSlot
                  ratio="16 / 9"
                  label={t('photoLabel')}
                  hint="16:9 · 2400×1350"
                  note={t('photoNote')}
                />
              </div>
            </Reveal>

            {/* Вертикальный timeline */}
            <div className="relative mx-auto mt-16 max-w-3xl sm:mt-20">
              {/* Золотая вертикальная линия по центру нумерации */}
              <div
                aria-hidden="true"
                className="absolute bottom-6 left-6 top-6 w-px bg-line"
              />
              <ol className="space-y-12 sm:space-y-14">
                {steps.map((s, i) => (
                  <Reveal key={s.n} delay={(i % 3) * 0.06}>
                    <li className="relative flex gap-6 sm:gap-8">
                      {/* Узел с номером — «прерывает» линию */}
                      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-ivory">
                        <span className="font-heading text-lg text-gold">{s.n}</span>
                      </div>
                      <div className="pt-1.5">
                        <h2 className="font-heading text-xl tracking-tight text-charcoal sm:text-2xl">
                          {s.title}
                        </h2>
                        <p className="mt-2 max-w-xl font-body text-sm font-light leading-relaxed text-muted sm:text-base">
                          {s.desc}
                        </p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </Container>
        </Section>

        {/* Финальный CTA */}
        <section className="relative overflow-hidden bg-dark py-24 text-cream sm:py-28">
          <DarkBackdrop glow="50% 45%" glowSize="75% 65%" glowOpacity={0.12} />
          <Container className="relative">
            <div className="mx-auto max-w-2xl text-center">
              <Reveal>
                <h2 className="font-heading text-3xl leading-[1.05] tracking-tight text-cream sm:text-4xl lg:text-5xl">
                  {t('ctaTitle')}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mx-auto mt-5 max-w-xl font-body text-sm font-light leading-relaxed text-cream/60 sm:text-base">
                  {t('ctaText')}
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-9">
                  <Button href="/order" variant="solid">
                    {t('ctaButton')}
                  </Button>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
