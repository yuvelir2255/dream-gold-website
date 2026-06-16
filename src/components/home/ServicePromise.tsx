import {getTranslations} from 'next-intl/server';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';

// Полоса сервис-обещаний (как у Messika/Mejuri): доставка, сертификаты, упаковка, консультация.
// Тонкие золотые line-иконки (SVG, не эмодзи) + короткая подпись.
const GOLD = '#C4A052';

function TruckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6.5h11v9H3z" stroke={GOLD} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M14 10h3.5l3 3v2.5H14z" stroke={GOLD} strokeWidth="1.1" strokeLinejoin="round" />
      <circle cx="7" cy="17.5" r="1.7" stroke={GOLD} strokeWidth="1.1" />
      <circle cx="17.5" cy="17.5" r="1.7" stroke={GOLD} strokeWidth="1.1" />
    </svg>
  );
}
function SealIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="9" r="5" stroke={GOLD} strokeWidth="1.1" />
      <path d="M9 9.2l2 2 4-4" stroke={GOLD} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13.5l-1.5 6 4.5-2.6 4.5 2.6L15 13.5" stroke={GOLD} strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}
function GiftIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.5 9.5h15V20h-15z" stroke={GOLD} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M3.5 6.5h17v3h-17zM12 6.5V20" stroke={GOLD} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M12 6.5C10.7 4 7 4 7 6c0 .5.5.5 5 .5zM12 6.5C13.3 4 17 4 17 6c0 .5-.5.5-5 .5z" stroke={GOLD} strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5.5h16v10H9.5L5.5 19v-3.5H4z" stroke={GOLD} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M8 9.5h8M8 12h5" stroke={GOLD} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export default async function ServicePromise() {
  const t = await getTranslations('service');

  const items = [
    {Icon: TruckIcon, label: t('delivery'), note: t('deliveryNote')},
    {Icon: SealIcon, label: t('certificate'), note: t('certificateNote')},
    {Icon: GiftIcon, label: t('packaging'), note: t('packagingNote')},
    {Icon: ChatIcon, label: t('consult'), note: t('consultNote')},
  ];

  return (
    <section className="border-y border-line bg-cream py-14 sm:py-16">
      <Container>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {items.map(({Icon, label, note}, i) => (
            <Reveal key={label} delay={i * 0.08}>
              <div className="flex flex-col items-center text-center">
                <Icon />
                <h3 className="mt-4 font-body text-[11px] uppercase tracking-[0.18em] text-charcoal">
                  {label}
                </h3>
                <p className="mt-2 max-w-[24ch] font-body text-xs font-light leading-relaxed text-muted">
                  {note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
