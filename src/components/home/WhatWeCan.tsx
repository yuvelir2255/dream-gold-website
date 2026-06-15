import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import DarkBackdrop from '@/components/ui/DarkBackdrop';

// Сильные стороны бренда — кинематографичная тёмная секция.
// Асимметрия: слева «шапка», справа список возможностей с крупными цифрами
// и тонкими золотыми разделителями (никакой плоской ровной сетки).
export default function WhatWeCan() {
  const t = useTranslations('can');
  const items = [t('item1'), t('item2'), t('item3'), t('item4'), t('item5'), t('item6')];

  return (
    <section className="relative overflow-hidden bg-dark py-24 text-cream sm:py-32">
      {/* Сияние сверху-слева — отличается от Trust (там снизу-справа) */}
      <DarkBackdrop glow="22% 18%" glowSize="65% 60%" glowOpacity={0.1} />

      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* Левая колонка: редакционная шапка */}
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            tone="dark"
            align="left"
            className="lg:pt-2"
          />

          {/* Правая колонка: список возможностей */}
          <ul className="flex flex-col">
            {items.map((item, i) => (
              <Reveal key={i} delay={(i % 2) * 0.08}>
                <li className="group flex items-baseline gap-6 border-t border-cream/10 py-6 first:border-t-0 sm:gap-8 sm:py-7">
                  {/* Крупная золотая нумерация */}
                  <span className="shrink-0 font-heading text-3xl leading-none text-gold/80 sm:text-4xl">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-body text-base font-light leading-relaxed text-cream/85 sm:text-lg">
                    {item}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
