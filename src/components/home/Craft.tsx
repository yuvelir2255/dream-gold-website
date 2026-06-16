import {getTranslations} from 'next-intl/server';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import PhotoSlot from '@/components/ui/PhotoSlot';

// Секция «Savoir-faire / Мастерская» — слой доверия: своё производство, руки мастера, процесс.
// Editorial-композиция: текст + крупные фото-слоты (макро процесса). Фото добавим позже.
export default async function Craft() {
  const t = await getTranslations('craft');

  return (
    <Section className="bg-ivory">
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
          {/* Текст (на мобильном — под фото) */}
          <div className="order-2 md:order-1">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold/50" />
                <span className="font-body text-[10px] uppercase tracking-[0.4em] text-gold">
                  {t('eyebrow')}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-heading text-4xl leading-[1.03] tracking-tight text-charcoal sm:text-5xl">
                {t('title')}
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 font-body text-sm font-light leading-relaxed text-muted sm:text-base">
                {t('p1')}
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-4 font-body text-sm font-light leading-relaxed text-muted sm:text-base">
                {t('p2')}
              </p>
            </Reveal>
          </div>

          {/* Фото-слоты (на мобильном — сверху) */}
          <div className="order-1 flex flex-col gap-4 md:order-2 lg:gap-6">
            <Reveal>
              <PhotoSlot ratio="4 / 5" label={t('photoLabel')} hint="4:5 · 1600×2000" note={t('photo1')} />
            </Reveal>
            <Reveal delay={0.1}>
              <PhotoSlot ratio="16 / 9" label={t('photoLabel')} hint="16:9 · 2000×1125" note={t('photo2')} />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
