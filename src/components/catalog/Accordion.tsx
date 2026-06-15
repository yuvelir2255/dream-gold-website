'use client';

import {useState} from 'react';

// Розкривний блок з плавною анімацією — для деталей і секцій на сторінці виробу.
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
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-heading text-lg text-charcoal">{title}</span>
        <span
          className="ml-4 shrink-0 text-gold text-xl leading-none transition-transform duration-300"
          aria-hidden="true"
          style={{transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'}}
        >
          +
        </span>
      </button>

      {/* Плавне відкриття через grid-rows трюк (без JS виміру висоти) */}
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{gridTemplateRows: isOpen ? '1fr' : '0fr'}}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-sm font-body text-charcoal leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
