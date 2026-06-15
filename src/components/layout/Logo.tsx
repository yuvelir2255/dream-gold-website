// Текстовый логотип-заглушка (пока нет файла логотипа).
// tone: 'light' — для тёмного фона, 'dark' — для светлого фона.
export default function Logo({tone = 'dark'}: {tone?: 'light' | 'dark'}) {
  const color = tone === 'light' ? 'text-cream' : 'text-charcoal';
  return (
    <span className={`font-heading text-xl tracking-[0.25em] ${color}`}>
      DREAM GOLD
    </span>
  );
}
