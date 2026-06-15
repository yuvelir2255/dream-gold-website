import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

// Финальный призыв оставить заявку.
export default function FinalCta() {
  const t = useTranslations('finalCta');
  return (
    <Section className="bg-champagne">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-muted">{t('subtitle')}</p>
          <div className="mt-8">
            <Button href="/order" variant="solid">{t('button')}</Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
