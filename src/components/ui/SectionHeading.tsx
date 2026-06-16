import Reveal from '@/components/ui/Reveal';

// Единый «редакционный» заголовок секции в стиле hero:
// маленький золотой эйбров с короткой линией → крупный serif-заголовок → подзаголовок.
// Опционально: акцентное слово золотым курсивом (accent) выводится отдельной строкой.
//
// tone:
//  - 'light' (по умолчанию) — для светлых секций (ivory/champagne): тёмный текст.
//  - 'dark'  — для тёмных секций (bg-dark): кремовый текст, приглушённые оттенки.
//
// align: 'left' | 'center' — выравнивание блока (по умолчанию center).

type Tone = 'light' | 'dark';
type Align = 'left' | 'center';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** Акцентное слово/фраза золотым курсивом, отдельной строкой под title */
  accent?: string;
  subtitle?: string;
  tone?: Tone;
  align?: Align;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  accent,
  subtitle,
  tone = 'light',
  align = 'center',
  className = ''
}: SectionHeadingProps) {
  const isDark = tone === 'dark';
  const titleColor = isDark ? 'text-cream' : 'text-charcoal';
  const subColor = isDark ? 'text-cream/55' : 'text-muted';
  const isCenter = align === 'center';

  return (
    <div
      className={`${isCenter ? 'mx-auto max-w-2xl text-center' : 'text-left'} ${className}`}
    >
      {/* Эйбров: короткая золотая линия + текст вразрядку */}
      <Reveal>
        <div
          className={`flex items-center gap-3 ${isCenter ? 'justify-center' : 'justify-start'}`}
        >
          <span className="h-px w-8 bg-gold/50" />
          <span className="text-[10px] font-body uppercase tracking-[0.4em] text-gold">
            {eyebrow}
          </span>
          {isCenter && <span className="h-px w-8 bg-gold/50" />}
        </div>
      </Reveal>

      {/* Заголовок: крупный serif; опциональное акцентное слово золотым курсивом.
          Премиум-масштаб — заголовки крупнее и «драматичнее». */}
      <Reveal delay={0.08}>
        <h2
          className={`mt-6 font-heading text-4xl leading-[1.03] tracking-tight sm:text-5xl lg:text-6xl ${titleColor}`}
        >
          {title}
          {accent && (
            <em className="block italic text-gold" style={{fontStyle: 'italic'}}>
              {accent}
            </em>
          )}
        </h2>
      </Reveal>

      {/* Подзаголовок */}
      {subtitle && (
        <Reveal delay={0.16}>
          <p
            className={`mt-5 font-body text-sm font-light leading-relaxed sm:text-base ${subColor}`}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
