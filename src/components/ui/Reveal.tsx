'use client';

import {motion, useReducedMotion} from 'framer-motion';

// Плавное появление блока при прокрутке (снизу вверх + проявление).
// ВАЖНО: всегда рендерим ОДИН И ТОТ ЖЕ motion.div (и на сервере, и на клиенте).
// Если менять структуру дерева по useReducedMotion (на сервере он null, в браузере
// может быть true), возникает hydration mismatch и контент застывает невидимым.
// Режим reduced-motion учитываем только через длительность (мгновенно), форму не меняем.
export default function Reveal({children, delay = 0, className = ''}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{opacity: 0, y: 24}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.2}}
      transition={{
        duration: prefersReduced ? 0 : 0.7,
        delay: prefersReduced ? 0 : delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
}
