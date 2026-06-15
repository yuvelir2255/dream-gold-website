import {Link} from '@/i18n/navigation';

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
};

// Кнопка-ссылка в стиле бренда: золотая заливка или золотой контур.
export default function Button({href, children, variant = 'solid'}: Props) {
  const base =
    'inline-flex items-center justify-center px-7 py-3 text-xs uppercase tracking-[0.2em] transition-colors duration-300 rounded-sm';
  const styles =
    variant === 'solid'
      ? 'bg-gold text-dark hover:bg-gold-deep'
      : 'border border-gold text-gold hover:bg-gold hover:text-dark';
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}
