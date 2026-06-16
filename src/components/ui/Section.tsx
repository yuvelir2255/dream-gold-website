// Вертикальные отступы секции + опциональный фон.
// Премиум-ритм: больше «воздуха» (как у люкс-домов) — секции дышат.
export default function Section({children, className = ''}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-24 sm:py-32 lg:py-40 ${className}`}>
      {children}
    </section>
  );
}
