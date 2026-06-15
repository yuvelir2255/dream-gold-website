import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';

// Блок доверия. Акцент на собственном производстве.
export default function Trust() {
  const t = useTranslations('trust');
  const stats = [
    {value: t('item1Value'), label: t('item1Label')},
    {value: t('item2Value'), label: t('item2Label')},
    {value: t('item3Value'), label: t('item3Label')},
    {value: t('item4Value'), label: t('item4Label')}
  ];
  return (
    <Section className="bg-dark text-cream">
      <Container>
        <Reveal className="text-center">
          <h2 className="text-3xl sm:text-4xl text-cream">{t('title')}</h2>
          <p className="mt-3 text-cream/60">{t('subtitle')}</p>
        </Reveal>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.1} className="text-center">
              <div className="font-heading text-2xl text-gold">{s.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-cream/50">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
