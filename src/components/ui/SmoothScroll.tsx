'use client';
import {useEffect} from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Плавный скролл через Lenis — не активируется при prefers-reduced-motion.
export default function SmoothScroll({children}: {children: React.ReactNode}) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({duration: 1.1, smoothWheel: true});
    let id = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}
