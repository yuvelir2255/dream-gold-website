'use client';

import {usePathname} from 'next/navigation';
import {motion, useReducedMotion} from 'framer-motion';

// Плавное появление контента при переходе между страницами.
// ВАЖНО: анимируем ТОЛЬКО opacity (не transform) — иначе transform создаёт containing block
// и ломает `position: sticky` шапки и fixed-элементы. key=путь → при навигации контейнер
// ремонтируется и новая страница плавно проявляется (enter-only, без рывков).
export default function PageTransition({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: prefersReduced ? 0 : 0.45, ease: 'easeOut'}}
    >
      {children}
    </motion.div>
  );
}
