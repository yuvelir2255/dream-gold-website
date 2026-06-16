import {getTranslations} from 'next-intl/server';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import PhotoSlot from '@/components/ui/PhotoSlot';

// Editorial-разворот (лукбук) — большие «объёмные» фото, как у Mejuri/Cartier.
// Пока фото нет — стоят понятные слоты-заглушки с подписями (формат + что за кадр).
// Когда фото появятся, PhotoSlot заменяется на <Image>.
export default async function EditorialSplit() {
  const t = await getTranslations('editorial');

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
      </Container>

      {/* Широкая «кампанийная» полоса + два портретных кадра — почти во всю ширину */}
      <div className="mx-auto mt-16 max-w-screen-2xl px-4 sm:px-6">
        {/* Большой горизонтальный кадр */}
        <Reveal>
          <PhotoSlot
            ratio="16 / 9"
            src="/look-wide-2.jpg"
            alt={t('shot1')}
            sizes="100vw"
          />
        </Reveal>

        {/* Два вертикальных кадра */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:mt-6 lg:gap-6">
          <Reveal>
            <PhotoSlot
              ratio="4 / 5"
              src="/look-model.jpg"
              alt={t('shot2')}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <PhotoSlot
              ratio="4 / 5"
              src="/look-detail.jpg"
              alt={t('shot3')}
            />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
