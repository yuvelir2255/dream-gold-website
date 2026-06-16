'use client';

import {useEffect, useState} from 'react';
import {Link} from '@/i18n/navigation';

// Плавающая CTA-кнопка внизу экрана (только мобильный): появляется после прокрутки вниз
// и прячется у самого футера, чтобы его не перекрывать.
export default function StickyOrderCta({href, label}: {href: string; label: string}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolledEnough = window.scrollY > 500;
      const footer = document.querySelector('footer');
      const footerVisible = footer
        ? footer.getBoundingClientRect().top < window.innerHeight - 24
        : false;
      setShow(scrolledEnough && !footerVisible);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 p-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <Link
        href={href}
        className="flex w-full items-center justify-center rounded-sm bg-gold px-7 py-3.5 font-body text-xs uppercase tracking-[0.2em] text-dark transition-colors duration-300 hover:bg-gold-deep"
      >
        {label}
      </Link>
    </div>
  );
}
