'use client';

import {useRef} from 'react';
import {motion, useScroll, useTransform} from 'framer-motion';
import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';

// Сердце концепции B: путь индивидуального заказа.
// Золотая линия «прорисовывается» слева направо при прокрутке секции в вьюпорт.
// При prefers-reduced-motion линия сразу показана полностью, без анимации.
export default function CreateYourOwn() {
  const t = useTranslations('create');
  const sectionRef = useRef<HTMLElement>(null);

  const steps = [
    {n: '01', title: t('step1Title'), desc: t('step1Desc')},
    {n: '02', title: t('step2Title'), desc: t('step2Desc')},
    {n: '03', title: t('step3Title'), desc: t('step3Desc')},
    {n: '04', title: t('step4Title'), desc: t('step4Desc')}
  ];

  // Отслеживаем, как секция проходит через вьюпорт
  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 60%'],
  });

  // Прогресс прорисовки линии: от 0 до 1 вместе с прокруткой секции
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    // Инлайним section напрямую (нужен ref), сохраняем те же отступы, что у <Section>
    <section ref={sectionRef} className="py-20 sm:py-28 bg-ivory">
      <Container>
        <Reveal className="text-center">
          <h2 className="text-3xl sm:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-muted">{t('subtitle')}</p>
        </Reveal>

        {/* Обёртка шагов с позиционированием для линии */}
        <div className="relative mt-14">
          {/*
            Золотая горизонтальная линия — только на lg (когда шаги в ряд).
            Позиционирована примерно по центру нумерации (top ~1.5rem — середина цифр 3xl).
            scaleX анимируется от 0 → 1 по мере прокрутки секции.
          */}
          <div className="hidden lg:block absolute left-0 right-0 top-[1.5rem] z-0">
            <motion.div
              className="h-px bg-gold origin-left"
              style={{scaleX: lineProgress}}
            />
          </div>

          {/* Сетка шагов */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                {/* z-10, чтобы шаги были поверх линии */}
                <div className="relative z-10 h-full border-t border-line pt-6">
                  {/* Цифра на фоне ivory — «прерывает» линию, как в схемах */}
                  <span className="inline-block bg-ivory pr-2 font-heading text-3xl text-gold">
                    {s.n}
                  </span>
                  <h3 className="mt-3 text-xl">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
