import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

// Витрина работ. Пока — заглушки-плейсхолдеры; реальные изделия придут из CMS (План 2).
export default function FeaturedWorks() {
  const t = useTranslations('works');
  const placeholders = [1, 2, 3];
  return (
    <Section className="bg-champagne">
      <Container>
        <Reveal className="text-center">
          <h2 className="text-3xl sm:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-muted">{t('subtitle')}</p>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {placeholders.map((n, i) => (
            <Reveal key={n} delay={i * 0.1}>
              <div className="flex aspect-[3/4] items-center justify-center rounded-sm bg-cream text-sm text-muted">
                фото изделия
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Button href="/catalog" variant="outline">{t('cta')}</Button>
        </Reveal>
      </Container>
    </Section>
  );
}
