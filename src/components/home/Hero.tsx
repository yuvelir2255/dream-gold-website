'use client';

import {useRef} from 'react';
import {motion, useScroll, useTransform, useReducedMotion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

// Кино-обложка на тёмном фоне с лёгким параллаксом.
// Фоновый слой движется медленнее контента — создаёт глубину при прокрутке.
// При prefers-reduced-motion параллакс отключается, всё статично.
export default function Hero() {
  const t = useTranslations('hero');
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  // Отслеживаем прокрутку hero-секции (от верха до её конца)
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Фон движется медленнее (опускается), создавая параллакс-эффект.
  // Слой увеличен на 30% (±15%), поэтому края никогда не обнажаются.
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  // Контент слегка уплывает вверх и растворяется при прокрутке вниз
  const contentY = useTransform(scrollYProgress, [0, 0.85], ['0%', '10%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-dark text-cream">
      {/* Фоновый слой: увеличен ±15% по вертикали, чтобы движение не обнажало края */}
      <motion.div
        className="absolute -inset-x-0 -top-[15%] -bottom-[15%] bg-gradient-to-b from-[#15120E] via-[#221b12] to-[#15120E]"
        style={prefersReduced ? undefined : {y: bgY}}
      />

      {/* Контент hero: плавно уплывает вверх и гаснет при скролле */}
      <Container className="relative">
        <motion.div
          className="flex min-h-[78vh] flex-col items-center justify-center py-24 text-center"
          style={
            prefersReduced
              ? undefined
              : {y: contentY, opacity: contentOpacity}
          }
        >
          <Reveal>
            <p className="mb-6 text-xs uppercase tracking-[0.45em] text-gold">Dream Gold</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="max-w-3xl text-4xl leading-tight sm:text-6xl">{t('title')}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-base font-light text-cream/70">{t('subtitle')}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href="/order" variant="solid">{t('ctaPrimary')}</Button>
              <Button href="/catalog" variant="outline">{t('ctaSecondary')}</Button>
            </div>
          </Reveal>
        </motion.div>
      </Container>
    </section>
  );
}
