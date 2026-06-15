import GrainOverlay from '@/components/ui/GrainOverlay';

// Кинематографичная «подложка» для тёмных секций — повторяет язык hero:
// мягкое радиальное золотое сияние + плёночное зерно + виньет по краям.
// Параметризована, чтобы соседние тёмные секции отличались композицией света.
//
// glow — позиция и форма золотого сияния (CSS-значение для radial-gradient at ...).
//   Примеры: '50% 30%' (сверху по центру), '20% 60%' (слева снизу).
// glowSize — размер эллипса сияния (ellipse W% H%).
// glowOpacity — насыщенность золота (0..1).
// vignette — рисовать ли тёмный виньет по краям (по умолчанию да).

interface DarkBackdropProps {
  glow?: string;
  glowSize?: string;
  glowOpacity?: number;
  vignette?: boolean;
}

export default function DarkBackdrop({
  glow = '50% 35%',
  glowSize = '70% 55%',
  glowOpacity = 0.1,
  vignette = true
}: DarkBackdropProps) {
  return (
    <>
      {/* Базовый тёмный градиент (как в hero, но статичный — без параллакса) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(170deg, #15120E 0%, #1e1710 45%, #221b12 65%, #15120E 100%)'
        }}
      />

      {/* Мягкое радиальное золотое сияние */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse ${glowSize} at ${glow}, rgba(196,160,82,${glowOpacity}) 0%, transparent 70%)`
        }}
      />

      {/* Тёмный виньет по краям */}
      {vignette && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 110% 100% at 50% 50%, transparent 50%, rgba(15,10,6,0.65) 100%)'
          }}
        />
      )}

      {/* Плёночное зерно */}
      <GrainOverlay />
    </>
  );
}
