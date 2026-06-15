import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import DarkBackdrop from '@/components/ui/DarkBackdrop';

// Блок доверия — кинематографичная тёмная секция (как требует бриф).
// Акцент на собственном производстве. Композиция отличается от WhatWeCan:
// заголовок по центру, сияние снизу-справа, статистика — редакционные «фигуры»
// с тонкими золотыми вертикальными разделителями.
export default function Trust() {
  const t = useTranslations('trust');
  const stats = [
    {value: t('item1Value'), label: t('item1Label')},
    {value: t('item2Value'), label: t('item2Label')},
    {value: t('item3Value'), label: t('item3Label')},
    {value: t('item4Value'), label: t('item4Label')}
  ];

  return (
    <section className="relative overflow-hidden bg-dark py-24 text-cream sm:py-32">
      {/* Сияние снизу-справа — отличает Trust от WhatWeCan (там сверху-слева) */}
      <DarkBackdrop glow="78% 88%" glowSize="80% 70%" glowOpacity={0.11} />

      <Container className="relative">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          tone="dark"
          align="center"
        />

        {/* Статистика: редакционные фигуры с золотыми вертикальными хайрлайнами */}
        <div className="mt-20 grid grid-cols-2 gap-y-12 lg:grid-cols-4 lg:gap-y-0">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              {/* На десктопе разделители между колонками (кроме первой) */}
              <div className="px-4 text-center lg:border-l lg:border-cream/10 lg:first:border-l-0 lg:px-8">
                <div className="font-heading text-2xl leading-tight text-gold sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-3 font-body text-[11px] uppercase tracking-[0.28em] text-cream/55">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
