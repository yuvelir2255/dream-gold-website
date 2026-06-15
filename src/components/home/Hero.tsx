'use client';

import {useRef} from 'react';
import {motion, useScroll, useTransform, useReducedMotion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import GrainOverlay from '@/components/ui/GrainOverlay';

// (3D-бриллиант убран по просьбе владельца — в hero статичный золотой контур.)

// Статичная SVG-иконка алмаза — показывается по умолчанию (сервер + первый рендер клиента),
// потом меняется на 3D, если устройство/настройки подходят.
function DiamondIcon() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Тонкий контурный ромб в стиле maison */}
      <polygon
        points="48,8 88,40 48,88 8,40"
        stroke="#C4A052"
        strokeWidth="1"
        fill="none"
        opacity="0.9"
      />
      {/* Верхняя грань */}
      <polyline
        points="8,40 48,24 88,40"
        stroke="#C4A052"
        strokeWidth="0.75"
        fill="none"
        opacity="0.6"
      />
      {/* Вертикальная ось от вершины до пояса */}
      <line x1="48" y1="8" x2="48" y2="24" stroke="#C4A052" strokeWidth="0.75" opacity="0.5" />
      {/* Нижние грани */}
      <line x1="8" y1="40" x2="48" y2="88" stroke="#C4A052" strokeWidth="0.75" opacity="0.5" />
      <line x1="88" y1="40" x2="48" y2="88" stroke="#C4A052" strokeWidth="0.75" opacity="0.5" />
      <line x1="48" y1="24" x2="48" y2="88" stroke="#C4A052" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

// Тонкий рамочный акцент — линии по углам viewport, маньеристская «маисон-рамка».
function MaisonFrame() {
  const cornerLen = 28; // длина уголков в пикселях
  const inset = 28;    // отступ от края

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Горизонтальные линии (верх и низ) */}
      <div
        className="absolute left-0 right-0"
        style={{top: inset, height: '1px', background: 'linear-gradient(to right, transparent 0%, rgba(196,160,82,0.22) 15%, rgba(196,160,82,0.22) 85%, transparent 100%)'}}
      />
      <div
        className="absolute left-0 right-0"
        style={{bottom: inset, height: '1px', background: 'linear-gradient(to right, transparent 0%, rgba(196,160,82,0.22) 15%, rgba(196,160,82,0.22) 85%, transparent 100%)'}}
      />

      {/* Вертикальные линии (лево и право) */}
      <div
        className="absolute top-0 bottom-0"
        style={{left: inset, width: '1px', background: 'linear-gradient(to bottom, transparent 0%, rgba(196,160,82,0.22) 15%, rgba(196,160,82,0.22) 85%, transparent 100%)'}}
      />
      <div
        className="absolute top-0 bottom-0"
        style={{right: inset, width: '1px', background: 'linear-gradient(to bottom, transparent 0%, rgba(196,160,82,0.22) 15%, rgba(196,160,82,0.22) 85%, transparent 100%)'}}
      />

      {/* Угловые акценты — TL */}
      <div style={{position: 'absolute', top: inset - 1, left: inset - 1}}>
        <div style={{width: cornerLen, height: 1, background: 'rgba(196,160,82,0.55)'}} />
        <div style={{width: 1, height: cornerLen, background: 'rgba(196,160,82,0.55)'}} />
      </div>
      {/* TR */}
      <div style={{position: 'absolute', top: inset - 1, right: inset - 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
        <div style={{width: cornerLen, height: 1, background: 'rgba(196,160,82,0.55)'}} />
        <div style={{width: 1, height: cornerLen, background: 'rgba(196,160,82,0.55)', alignSelf: 'flex-end'}} />
      </div>
      {/* BL */}
      <div style={{position: 'absolute', bottom: inset - 1, left: inset - 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
        <div style={{width: 1, height: cornerLen, background: 'rgba(196,160,82,0.55)'}} />
        <div style={{width: cornerLen, height: 1, background: 'rgba(196,160,82,0.55)'}} />
      </div>
      {/* BR */}
      <div style={{position: 'absolute', bottom: inset - 1, right: inset - 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
        <div style={{width: 1, height: cornerLen, background: 'rgba(196,160,82,0.55)', alignSelf: 'flex-end'}} />
        <div style={{width: cornerLen, height: 1, background: 'rgba(196,160,82,0.55)'}} />
      </div>
    </div>
  );
}

// Кино-обложка: тёмная атмосфера + золотое сияние + зерно плёнки + вигнет.
// Параллакс — безопасный (выход при scroll=0 одинаков для reduced и normal).
export default function Hero() {
  const t = useTranslations('hero');
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  // Параллакс: диапазоны разные при reduced-motion, но НАЧАЛЬНОЕ значение (scroll=0)
  // всегда '0%' / 1 — поэтому inline-style на сервере и клиенте совпадает, нет mismatch.
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ['0%', '0%'] : ['0%', '18%']
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, 0.85],
    prefersReduced ? ['0%', '0%'] : ['0%', '10%']
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    prefersReduced ? [1, 1] : [1, 0]
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-dark text-cream"
      style={{minHeight: '100svh'}}
    >
      {/* ─── Слой 1: тёмный градиентный фон с параллаксом ─── */}
      <motion.div
        className="absolute -inset-x-0 -top-[15%] -bottom-[15%]"
        style={{
          y: bgY,
          background:
            'linear-gradient(170deg, #15120E 0%, #1e1710 40%, #221b12 60%, #15120E 100%)',
        }}
      />

      {/* ─── Слой 2: мягкое радиальное золотое сияние (за headline/gem) ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(196,160,82,0.10) 0%, transparent 70%)',
        }}
      />

      {/* ─── Слой 3: тёмный виньет по краям ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 110% 100% at 50% 50%, transparent 45%, rgba(15,10,6,0.75) 100%)',
        }}
      />

      {/* ─── Слой 4: плёночное зерно ─── */}
      <GrainOverlay />

      {/* ─── Слой 5: маньеристская золотая рамка ─── */}
      <MaisonFrame />

      {/* ─── Контент ─── */}
      <Container className="relative">
        <motion.div
          className="flex flex-col items-center justify-center py-32 text-center"
          style={{minHeight: '100svh', y: contentY, opacity: contentOpacity}}
        >

          {/* Эйбров: — ТЕКСТ — с тонкими линиями по сторонам */}
          <Reveal>
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-12 bg-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.42em] text-gold/70">
                {t('eyebrow')}
              </span>
              <div className="h-px w-12 bg-gold/40" />
            </div>
          </Reveal>

          {/* Золотой контур-бриллиант — статичный изящный акцент */}
          <Reveal delay={0.08}>
            <div
              className="mx-auto mb-6 flex items-center justify-center lg:mb-8"
              style={{width: 208, height: 208}}
              aria-hidden="true"
            >
              <DiamondIcon />
            </div>
          </Reveal>

          {/* Крупный заголовок: Line 1 обычный, Line 2 — золотой курсив */}
          <Reveal delay={0.18}>
            <h1
              className="font-heading text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
              style={{maxWidth: '14ch'}}
            >
              <span className="block text-cream">{t('titleLead')}</span>
              <em className="block italic text-gold" style={{fontStyle: 'italic'}}>
                {t('titleRest')}
              </em>
            </h1>
          </Reveal>

          {/* Подзаголовок */}
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-xl font-body text-sm font-light leading-relaxed text-cream/60 sm:text-base lg:mt-8">
              {t('subtitle')}
            </p>
          </Reveal>

          {/* CTA-кнопки */}
          <Reveal delay={0.42}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:mt-12">
              <Button href="/order" variant="solid">{t('ctaPrimary')}</Button>
              <Button href="/catalog" variant="outline">{t('ctaSecondary')}</Button>
            </div>
          </Reveal>

          {/* Scroll-кью: текст + анимированная тонкая линия вниз */}
          <Reveal delay={0.58}>
            <div className="mt-16 flex flex-col items-center gap-3 lg:mt-20">
              <span className="text-[9px] uppercase tracking-[0.5em] text-gold/40">
                {t('scrollCue')}
              </span>
              <div className="relative h-10 w-px overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gold/50 to-transparent" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-gold to-transparent"
                  animate={prefersReduced ? {} : {y: ['-100%', '200%']}}
                  transition={
                    prefersReduced
                      ? {}
                      : {duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4}
                  }
                />
              </div>
            </div>
          </Reveal>

        </motion.div>
      </Container>
    </section>
  );
}
