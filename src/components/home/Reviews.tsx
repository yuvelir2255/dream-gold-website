import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';

// Отзывы — секцией на главной (отдельной вкладки нет). Пока заглушки.
export default function Reviews() {
  const t = useTranslations('reviews');
  const placeholders = [1, 2, 3];
  return (
    <Section className="bg-ivory">
      <Container>
        <Reveal className="text-center">
          <h2 className="text-3xl sm:text-4xl">{t('title')}</h2>
          <p className="mt-3 text-muted">{t('subtitle')}</p>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {placeholders.map((n, i) => (
            <Reveal key={n} delay={i * 0.1}>
              <div className="h-full rounded-sm border border-line bg-cream p-7">
                <div className="text-gold">★★★★★</div>
                <p className="mt-4 text-sm italic leading-relaxed text-muted">
                  «Отзыв клиента появится здесь.»
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
