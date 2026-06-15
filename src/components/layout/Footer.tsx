import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Logo from './Logo';

// Контакты бренда (из CLAUDE.md). Instagram добавим, когда будет ссылка.
const PHONE = '0672605244';
const TELEGRAM_USER = 'IrinaBabii1982';
const TELEGRAM_CHANNEL = 'DG_jewelry';

export default function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="bg-dark text-cream/70">
      <Container className="py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo tone="light" />
            <p className="mt-3 text-sm text-cream/60">{t('tagline')}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <a href={`tel:${PHONE}`} className="hover:text-gold transition-colors">
              {t('phone')}: {PHONE}
            </a>
            <a href={`https://t.me/${TELEGRAM_USER}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
              {t('telegram')}: @{TELEGRAM_USER}
            </a>
            <a href={`https://t.me/${TELEGRAM_CHANNEL}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
              {t('telegram')}: t.me/{TELEGRAM_CHANNEL}
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-cream/10 pt-6 text-xs text-cream/40">
          © Dream Gold. {t('rights')}.
        </div>
      </Container>
    </footer>
  );
}
