'use client';

import {useEffect, useRef, useState} from 'react';
import dynamic from 'next/dynamic';
import {motion, useScroll, useTransform, useReducedMotion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

// 3D-бриллиант грузим лениво и только на клиенте (ssr: false):
// он не должен исполняться на сервере и тянуться в бандл без нужды.
const Gem = dynamic(() => import('@/components/three/Gem'), {ssr: false});

// Кино-обложка на тёмном фоне с лёгким параллаксом.
// Фоновый слой движется медленнее контента — создаёт глубину при прокрутке.
// При prefers-reduced-motion параллакс отключается, всё статично.
export default function Hero() {
  const t = useTranslations('hero');
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  // Показываем 3D-акцент ТОЛЬКО на десктопе и если пользователь не просил
  // уменьшить анимацию. Стартуем с false и включаем в useEffect — так не будет
  // расхождения при гидрации (на сервере состояние всегда false).
  const [show3D, setShow3D] = useState(false);
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)').matches;
    const notReduced = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Проверяем поддержку WebGL — без него 3D мог бы уронить страницу.
    let webgl = false;
    try {
      webgl = !!document.createElement('canvas').getContext('webgl');
    } catch {
      webgl = false;
    }
    setShow3D(wide && notReduced && webgl);
  }, []);

  // Отслеживаем прокрутку hero-секции (от верха до её конца)
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Диапазоны зависят от reduced-motion, НО выход при scroll=0 одинаков ('0%' и opacity 1),
  // поэтому inline-стиль на сервере и клиенте совпадает → нет hydration mismatch.
  // (Раньше мы переключали сам style по reduced-motion — это и ломало гидрацию.)
  const bgY = useTransform(scrollYProgress, [0, 1], prefersReduced ? ['0%', '0%'] : ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 0.85], prefersReduced ? ['0%', '0%'] : ['0%', '10%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], prefersReduced ? [1, 1] : [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-dark text-cream">
      {/* Фоновый слой: увеличен ±15% по вертикали, чтобы движение не обнажало края */}
      <motion.div
        className="absolute -inset-x-0 -top-[15%] -bottom-[15%] bg-gradient-to-b from-[#15120E] via-[#221b12] to-[#15120E]"
        style={{y: bgY}}
      />

      {/* Контент hero: плавно уплывает вверх и гаснет при скролле */}
      <Container className="relative">
        <motion.div
          className="flex min-h-[78vh] flex-col items-center justify-center py-24 text-center"
          style={{y: contentY, opacity: contentOpacity}}
        >
          {/* 3D-бриллиант — лёгкий акцент над заголовком. Фиксированный размер,
              не накладывается на текст. На мобайле / при reduced-motion не рендерится. */}
          {show3D && (
            <div className="mx-auto mb-2 h-40 w-40" aria-hidden="true">
              <Gem />
            </div>
          )}
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
