import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';

// Сильные стороны бренда.
export default function WhatWeCan() {
  const t = useTranslations('can');
  const items = [t('item1'), t('item2'), t('item3'), t('item4'), t('item5'), t('item6')];
  return (
    <Section className="bg-ivory">
      <Container>
        <Reveal className="text-center">
          <h2 className="text-3xl sm:text-4xl">{t('title')}</h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08}>
              <div className="h-full bg-cream p-7">
                <span className="font-heading text-2xl text-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-charcoal">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
