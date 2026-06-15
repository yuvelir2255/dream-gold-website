import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';

// Сердце концепции B: путь индивидуального заказа.
export default function CreateYourOwn() {
  const t = useTranslations('create');
  const steps = [
    {n: '01', title: t('step1Title'), desc: t('step1Desc')},
    {n: '02', title: t('step2Title'), desc: t('step2Desc')},
    {n: '03', title: t('step3Title'), desc: t('step3Desc')},
    {n: '04', title: t('step4Title'), desc: t('step4Desc')}
  ];
  return (
    <Section className="bg-ivory">
      <Container>
        <Reveal className="text-center">
          <h2 className="text-3xl sm:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-muted">{t('subtitle')}</p>
        </Reveal>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="h-full border-t border-line pt-6">
                <span className="font-heading text-3xl text-gold">{s.n}</span>
                <h3 className="mt-3 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
