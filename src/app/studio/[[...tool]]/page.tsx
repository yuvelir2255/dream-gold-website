/**
 * Встроенная студия Sanity (/studio).
 * Сама студия рендерится в клиентской обёртке Studio.tsx ('use client'),
 * чтобы её код не выполнялся на сервере при сборке.
 */
import Studio from './Studio';

export const dynamic = 'force-static';

export {metadata, viewport} from 'next-sanity/studio';

export default function StudioPage() {
  return <Studio />;
}
