import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';

// Маленькая золотая звезда (inline SVG — не эмодзи).
function Star() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="#C4A052"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2l2.92 6.26L22 9.27l-5 5.02L18.18 22 12 18.27 5.82 22 7 14.29l-5-5.02 7.08-1.01L12 2z" />
    </svg>
  );
}

// Отзывы — секцией на главной (отдельной вкладки нет). Тихая, элегантная,
// редакционная подача. Пока заглушки до реальных отзывов из CMS.
export default function Reviews() {
  const t = useTranslations('reviews');
  const placeholders = [1, 2, 3];

  return (
    <Section className="bg-ivory">
      <Container>
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          tone="light"
          align="center"
        />

        <div className="mt-16 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {placeholders.map((n, i) => (
            <Reveal key={n} delay={i * 0.1}>
              <figure className="flex h-full flex-col bg-cream p-8">
                {/* Крупная serif-кавычка как редакционный акцент */}
                <span
                  className="font-heading text-5xl leading-none text-gold/30"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                <blockquote className="mt-3 font-heading text-lg font-normal italic leading-relaxed text-charcoal">
                  Відгук клієнта з’явиться тут.
                </blockquote>

                {/* Звёзды + подпись разделены тонкой золотой линией */}
                <figcaption className="mt-auto pt-6">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} />
                    ))}
                  </div>
                  <div className="mt-4 h-px w-8 bg-gold/30" />
                  <div className="mt-3 font-body text-[11px] uppercase tracking-[0.28em] text-muted">
                    Dream Gold
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
