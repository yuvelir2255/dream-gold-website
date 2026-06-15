// Вертикальные отступы секции + опциональный фон.
export default function Section({children, className = ''}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-20 sm:py-28 ${className}`}>
      {children}
    </section>
  );
}
