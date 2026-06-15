import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import DarkBackdrop from '@/components/ui/DarkBackdrop';

// Финальный призыв — кинематографичный тёмный финал, перекликается с hero:
// эйбров с линиями, крупная serif-строка, золотая кнопка заказа.
export default function FinalCta() {
  const t = useTranslations('finalCta');

  return (
    <section className="relative overflow-hidden bg-dark py-28 text-cream sm:py-36">
      {/* Центральное мягкое золотое сияние под заголовком */}
      <DarkBackdrop glow="50% 45%" glowSize="75% 65%" glowOpacity={0.12} />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          {/* Эйбров: — ТЕКСТ — с тонкими линиями (как в hero) */}
          <Reveal>
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-gold/50" />
              <span className="font-body text-[10px] uppercase tracking-[0.4em] text-gold">
                {t('eyebrow')}
              </span>
              <span className="h-px w-8 bg-gold/50" />
            </div>
          </Reveal>

          {/* Крупная serif-строка */}
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-heading text-4xl leading-[1.05] tracking-tight text-cream sm:text-5xl lg:text-6xl">
              {t('title')}
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-xl font-body text-sm font-light leading-relaxed text-cream/60 sm:text-base">
              {t('subtitle')}
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="mt-10">
              <Button href="/order" variant="solid">{t('button')}</Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
