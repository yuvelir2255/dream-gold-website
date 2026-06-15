import {Link} from '@/i18n/navigation';

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
};

// Кнопка-ссылка в стиле бренда: золотая заливка или золотой контур.
// Hover: лёгкий подъём + тень без сдвига соседей (translate-y в пределах себя).
export default function Button({href, children, variant = 'solid'}: Props) {
  const base =
    'inline-flex items-center justify-center px-7 py-3 text-xs uppercase tracking-[0.2em] transition-all duration-300 rounded-sm cursor-pointer';
  const styles =
    variant === 'solid'
      ? 'bg-gold text-dark hover:bg-gold-deep hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20'
      : 'border border-gold text-gold hover:bg-gold hover:text-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20';
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}
