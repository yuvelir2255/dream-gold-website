// Слот-заглушка под БУДУЩЕЕ фото.
// Не пустое место, а понятная рамка с подписью: что сюда пойдёт и какого формата.
// Когда появится реальное фото — слот заменяется на <Image>.
//
// Пропсы:
//  ratio — соотношение сторон в формате CSS aspect-ratio ('4 / 5', '16 / 9', '1 / 1').
//  label — крупная подпись (по умолч. «Фото»).
//  hint  — формат/размер, напр. «4:5 · 1600×2000».
//  note  — что именно за кадр, напр. «На моделі · крупний план».
export default function PhotoSlot({
  ratio = '4 / 5',
  label = 'Фото',
  hint,
  note,
  className = '',
}: {
  ratio?: string;
  label?: string;
  hint?: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      style={{aspectRatio: ratio}}
      className={`relative flex w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-sm border border-dashed border-gold/45 bg-champagne/50 px-6 text-center ${className}`}
    >
      {/* Иконка «изображение» (SVG, не эмодзи) */}
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="1.5" stroke="#C4A052" strokeWidth="1" opacity="0.75" />
        <circle cx="8.5" cy="8.5" r="1.6" stroke="#C4A052" strokeWidth="1" opacity="0.75" />
        <path
          d="M21 14.5l-4.5-4.5L5 21"
          stroke="#C4A052"
          strokeWidth="1"
          opacity="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="font-body text-[11px] uppercase tracking-[0.34em] text-gold-deep">
        {label}
      </span>

      {hint && (
        <span className="font-body text-[10px] uppercase tracking-[0.22em] text-muted">
          {hint}
        </span>
      )}

      {note && (
        <span className="max-w-[26ch] font-body text-xs font-light leading-relaxed text-muted/80">
          {note}
        </span>
      )}
    </div>
  );
}
