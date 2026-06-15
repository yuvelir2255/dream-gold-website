// Тонкий «зернистый» оверлей — добавляет плёночную текстуру тёмным секциям.
// pointer-events-none, absolute inset-0 — дроп-ин поверх любого тёмного блока.
// Зерно почти невидимо (~5% opacity, soft-light blend) — это фактура, не шум.
export default function GrainOverlay() {
  // SVG feTurbulence генерирует случайный шум прямо в браузере — никаких PNG-файлов.
  // Кодируем в data-URI, чтобы не делать лишний сетевой запрос.
  const svgNoise = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/>
    </filter>
    <rect width='200' height='200' filter='url(#n)' opacity='1'/>
  </svg>`;
  const dataUri = `url("data:image/svg+xml,${encodeURIComponent(svgNoise)}")`;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage: dataUri,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
        opacity: 0.05,
        mixBlendMode: 'soft-light',
      }}
    />
  );
}
