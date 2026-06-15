'use client';

import {useState} from 'react';

// Розкривний блок з плавною анімацією — для деталей і секцій на сторінці виробу.
// Елегантний перемикач +/− зроблений з двох тонких ліній: горизонтальна завжди,
// вертикальна «складається» при відкритті. Заголовок serif, золотий ховер.
interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Accordion({title, children, defaultOpen = false}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex w-full cursor-pointer items-center justify-between py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-heading text-lg text-charcoal transition-colors duration-300 group-hover:text-gold-deep">
          {title}
        </span>

        {/* Перемикач +/− з двох ліній (без emoji/font-символів) */}
        <span
          aria-hidden="true"
          className="relative ml-4 block h-3 w-3 shrink-0"
        >
          {/* Горизонтальна лінія — завжди видима */}
          <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-gold" />
          {/* Вертикальна лінія — зникає при відкритті */}
          <span
            className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-gold transition-all duration-300"
            style={{opacity: isOpen ? 0 : 1, transform: `translateX(-50%) rotate(${isOpen ? 90 : 0}deg)`}}
          />
        </span>
      </button>

      {/* Плавне відкриття через grid-rows трюк (без JS виміру висоти) */}
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{gridTemplateRows: isOpen ? '1fr' : '0fr'}}
      >
        <div className="overflow-hidden">
          <div className="pb-6 font-body text-sm font-light leading-relaxed text-muted">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
