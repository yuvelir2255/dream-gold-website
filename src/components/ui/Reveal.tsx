'use client';

import {motion, useReducedMotion} from 'framer-motion';

// Плавное появление блока при прокрутке (снизу вверх + проявление).
// При prefers-reduced-motion: анимация отключается, контент сразу виден.
export default function Reveal({children, delay = 0, className = ''}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{opacity: 0, y: 24}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.2}}
      transition={{duration: 0.7, delay, ease: 'easeOut'}}
    >
      {children}
    </motion.div>
  );
}
