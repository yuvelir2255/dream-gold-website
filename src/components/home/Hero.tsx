import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

// Кино-обложка на тёмном фоне. Позже заменим градиент на фото/видео.
export default function Hero() {
  const t = useTranslations('hero');
  return (
    <section className="relative bg-dark text-cream">
      <div className="absolute inset-0 bg-gradient-to-b from-[#15120E] via-[#221b12] to-[#15120E]" />
      <Container className="relative flex min-h-[78vh] flex-col items-center justify-center py-24 text-center">
        <Reveal>
          <p className="mb-6 text-xs uppercase tracking-[0.45em] text-gold">Dream Gold</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="max-w-3xl text-4xl leading-tight sm:text-6xl">{t('title')}</h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-base font-light text-cream/70">{t('subtitle')}</p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/order" variant="solid">{t('ctaPrimary')}</Button>
            <Button href="/catalog" variant="outline">{t('ctaSecondary')}</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
