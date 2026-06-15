'use client';

import {useRef} from 'react';
import {motion, useScroll, useTransform} from 'framer-motion';
import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';

// Сердце концепции B: путь индивидуального заказа — как редакционный разворот.
// Золотая линия «прорисовывается» слева направо при прокрутке секции в вьюпорт.
// Контент (крупные цифры, тексты) появляется через Reveal и НЕ зависит от линии —
// поэтому при prefers-reduced-motion всё всегда читаемо, а линия остаётся декором.
export default function CreateYourOwn() {
  const t = useTranslations('create');
  const sectionRef = useRef<HTMLElement>(null);

  const steps = [
    {n: '01', title: t('step1Title'), desc: t('step1Desc')},
    {n: '02', title: t('step2Title'), desc: t('step2Desc')},
    {n: '03', title: t('step3Title'), desc: t('step3Desc')},
    {n: '04', title: t('step4Title'), desc: t('step4Desc')}
  ];

  // Отслеживаем, как секция проходит через вьюпорт.
  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 60%']
  });

  // Прогресс прорисовки золотой линии: 0 → 1 вместе с прокруткой.
  // ВАЖНО: диапазон НЕ зависит от reduced-motion → начальное значение (scaleX=0)
  // одинаково на сервере и клиенте — нет hydration mismatch.
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    // Инлайним <section> напрямую (нужен ref); те же вертикальные отступы, что у <Section>.
    <section ref={sectionRef} className="relative overflow-hidden bg-ivory py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          tone="light"
          align="center"
        />

        {/* Обёртка шагов с позиционированием для золотой линии */}
        <div className="relative mt-20">
          {/*
            Золотая горизонтальная линия — только на lg (когда шаги в ряд).
            Позиционирована по центру крупной нумерации. scaleX 0 → 1 при прокрутке.
          */}
          <div className="absolute left-0 right-0 top-[2.75rem] z-0 hidden lg:block">
            <div className="h-px w-full bg-line" />
            <motion.div
              className="absolute inset-x-0 top-0 h-px origin-left bg-gold"
              style={{scaleX: lineProgress}}
            />
          </div>

          {/* Сетка шагов */}
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                {/* z-10, чтобы шаги были поверх линии */}
                <div className="relative z-10 h-full">
                  {/* Крупная цифра на фоне ivory — «прерывает» линию, как в схемах */}
                  <span className="inline-block bg-ivory pr-4 font-heading text-6xl leading-none text-gold lg:text-7xl">
                    {s.n}
                  </span>

                  {/* Тонкая золотая засечка под цифрой */}
                  <div className="mt-6 h-px w-10 bg-gold/30" />

                  <h3 className="mt-5 font-heading text-xl tracking-tight text-charcoal">
                    {s.title}
                  </h3>
                  <p className="mt-3 font-body text-sm font-light leading-relaxed text-muted">
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
