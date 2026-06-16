'use client';

import {useState, useMemo} from 'react';
import {useSearchParams} from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Reveal from '@/components/ui/Reveal';
import {CATEGORIES, METALS, PURITIES} from '@/lib/catalogOptions';

// Контакт мами для фолбеку, якщо відправка не вдалась.
const TELEGRAM_FALLBACK = 'https://t.me/IrinaBabii1982';

type Status = 'idle' | 'sending' | 'success' | 'error';

// ─── Дрібні переюзабельні шматочки UI у стилі maison ───

// Підпис поля: золота розрядка + опціональна позначка «обов’язково» / «необов’язково».
function FieldLabel({
  htmlFor,
  children,
  required,
  optionalText,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  optionalText?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.24em] text-muted"
    >
      {children}
      {required && <span className="text-gold">*</span>}
      {optionalText && (
        <span className="tracking-[0.16em] text-muted/60 normal-case">({optionalText})</span>
      )}
    </label>
  );
}

// Єдиний стиль для input/textarea.
const fieldClass =
  'w-full rounded-sm border bg-cream px-4 py-3 font-body text-sm text-charcoal placeholder:text-muted/50 outline-none transition-colors duration-300 focus:border-gold focus:ring-1 focus:ring-gold/30';

// Пілюля вибору (тип / метал / проба) — як у фільтрах каталогу. Повторний клік знімає вибір.
function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`cursor-pointer rounded-full px-4 py-1.5 font-body text-[13px] tracking-wide transition-all duration-300 ${
        active
          ? 'bg-gold text-dark shadow-sm shadow-gold/30'
          : 'border border-line text-muted hover:border-gold/60 hover:text-charcoal'
      }`}
    >
      {children}
    </button>
  );
}

// Шапка нумерованої секції: крупна золота цифра + засічка + заголовок + підказка.
function StepHeader({n, title, hint}: {n: string; title: string; hint: string}) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-4">
        <span className="font-heading text-3xl leading-none text-gold sm:text-4xl">{n}</span>
        <h2 className="font-heading text-xl tracking-tight text-charcoal sm:text-2xl">{title}</h2>
      </div>
      <div className="mt-3 h-px w-10 bg-gold/30" />
      <p className="mt-3 font-body text-sm font-light leading-relaxed text-muted">{hint}</p>
    </div>
  );
}

export default function OrderForm() {
  const t = useTranslations('order');
  const tCatalog = useTranslations('catalog');
  const locale = useLocale();
  const searchParams = useSearchParams();

  // «Натхнення» — назва виробу, переданого з картки через ?ref=
  const refFromUrl = searchParams.get('ref') ?? '';
  const [ref, setRef] = useState(refFromUrl);

  // Поля форми
  const [idea, setIdea] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [size, setSize] = useState('');
  const [category, setCategory] = useState('');
  const [metal, setMetal] = useState('');
  const [purity, setPurity] = useState('');
  const [company, setCompany] = useState(''); // honeypot (приховане поле-пастка для ботів)

  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<{idea?: boolean; name?: boolean; contact?: boolean}>({});

  // Перемикач пілюль: повторний клік знімає вибір
  const toggle = (current: string, value: string, set: (v: string) => void) =>
    set(current === value ? '' : value);

  const categoryOptions = useMemo(
    () => CATEGORIES.map((c) => ({value: c, label: tCatalog(`options.category.${c}`)})),
    [tCatalog]
  );
  const metalOptions = useMemo(
    () => METALS.map((m) => ({value: m, label: tCatalog(`options.metal.${m}`)})),
    [tCatalog]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Клієнтська перевірка обов’язкових полів (сервер перевіряє повторно)
    const nextErrors = {
      idea: idea.trim() === '',
      name: name.trim() === '',
      contact: contact.trim() === '',
    };
    setErrors(nextErrors);
    if (nextErrors.idea || nextErrors.name || nextErrors.contact) {
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          idea, name, contact, size, category, metal, purity, ref, company, locale,
        }),
      });
      if (res.ok) {
        setStatus('success');
        // Прокрутка до верху форми, щоб користувач побачив подяку
        window.scrollTo({top: 0, behavior: 'smooth'});
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  // ─── Екран подяки ───
  if (status === 'success') {
    return (
      <Reveal>
        <div className="rounded-sm border border-line bg-cream p-10 text-center shadow-[0_20px_60px_-40px_rgba(31,27,22,0.5)] sm:p-14">
          {/* Золота галочка в колі */}
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7" stroke="#C4A052" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl tracking-tight text-charcoal sm:text-3xl">
            {t('successTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-md font-body text-sm font-light leading-relaxed text-muted">
            {t('successText')}
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-sm bg-gold px-7 py-3 font-body text-xs uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-deep hover:shadow-lg hover:shadow-black/20"
          >
            {t('successBack')}
          </Link>
        </div>
      </Reveal>
    );
  }

  const sending = status === 'sending';

  // ─── Форма ───
  return (
    <Reveal>
      <form onSubmit={handleSubmit} noValidate className="space-y-14">
        {/* Honeypot: приховане від людей поле. Якщо заповнене — це бот. */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        {/* ─── Секція 01 · Ваша ідея ─── */}
        <section>
          <StepHeader n="01" title={t('step1')} hint={t('step1Hint')} />

          {/* Чип «натхнення», якщо прийшли з картки виробу */}
          {ref && (
            <div className="mb-6 flex flex-wrap items-center gap-3 rounded-sm border border-gold/30 bg-champagne/40 px-4 py-3">
              <span className="font-body text-[10px] uppercase tracking-[0.24em] text-gold-deep">
                {t('refLabel')}
              </span>
              <span className="font-body text-sm text-charcoal">{ref}</span>
              <button
                type="button"
                onClick={() => setRef('')}
                className="ml-auto cursor-pointer font-body text-[11px] uppercase tracking-[0.18em] text-muted transition-colors duration-300 hover:text-gold-deep"
              >
                {t('refClear')}
              </button>
            </div>
          )}

          <FieldLabel htmlFor="idea" required>
            {t('ideaLabel')}
          </FieldLabel>
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value);
              if (errors.idea) setErrors((p) => ({...p, idea: false}));
            }}
            rows={5}
            placeholder={t('ideaPlaceholder')}
            aria-invalid={errors.idea || undefined}
            className={`${fieldClass} resize-y ${errors.idea ? 'border-red-400' : 'border-line'}`}
          />
          {errors.idea && (
            <p className="mt-2 font-body text-xs text-red-500">{t('required')}</p>
          )}
        </section>

        {/* ─── Секція 02 · Деталі виробу (необов’язково) ─── */}
        <section>
          <StepHeader n="02" title={t('step2')} hint={t('step2Hint')} />

          <div className="space-y-7">
            {/* Тип виробу */}
            <div>
              <FieldLabel optionalText={t('optional')}>{t('categoryLabel')}</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((o) => (
                  <Pill
                    key={o.value}
                    active={category === o.value}
                    onClick={() => toggle(category, o.value, setCategory)}
                  >
                    {o.label}
                  </Pill>
                ))}
              </div>
            </div>

            {/* Метал */}
            <div>
              <FieldLabel optionalText={t('optional')}>{t('metalLabel')}</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {metalOptions.map((o) => (
                  <Pill
                    key={o.value}
                    active={metal === o.value}
                    onClick={() => toggle(metal, o.value, setMetal)}
                  >
                    {o.label}
                  </Pill>
                ))}
              </div>
            </div>

            {/* Проба + Розмір в один ряд на широких екранах */}
            <div className="grid gap-7 sm:grid-cols-2">
              <div>
                <FieldLabel optionalText={t('optional')}>{t('purityLabel')}</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {PURITIES.map((p) => (
                    <Pill
                      key={p}
                      active={purity === p}
                      onClick={() => toggle(purity, p, setPurity)}
                    >
                      {p}
                    </Pill>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="size" optionalText={t('optional')}>
                  {t('sizeLabel')}
                </FieldLabel>
                <input
                  id="size"
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder={t('sizePlaceholder')}
                  className={`${fieldClass} border-line`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Секція 03 · Ваші контакти ─── */}
        <section>
          <StepHeader n="03" title={t('step3')} hint={t('step3Hint')} />

          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="name" required>
                {t('nameLabel')}
              </FieldLabel>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({...p, name: false}));
                }}
                placeholder={t('namePlaceholder')}
                autoComplete="name"
                aria-invalid={errors.name || undefined}
                className={`${fieldClass} ${errors.name ? 'border-red-400' : 'border-line'}`}
              />
              {errors.name && (
                <p className="mt-2 font-body text-xs text-red-500">{t('required')}</p>
              )}
            </div>

            <div>
              <FieldLabel htmlFor="contact" required>
                {t('contactLabel')}
              </FieldLabel>
              <input
                id="contact"
                type="text"
                value={contact}
                onChange={(e) => {
                  setContact(e.target.value);
                  if (errors.contact) setErrors((p) => ({...p, contact: false}));
                }}
                placeholder={t('contactPlaceholder')}
                aria-invalid={errors.contact || undefined}
                className={`${fieldClass} ${errors.contact ? 'border-red-400' : 'border-line'}`}
              />
              {errors.contact && (
                <p className="mt-2 font-body text-xs text-red-500">{t('required')}</p>
              )}
            </div>
          </div>
        </section>

        {/* ─── Помилка відправки ─── */}
        {status === 'error' && (
          <div className="rounded-sm border border-red-300 bg-red-50 p-5 text-center">
            <p className="font-body text-sm font-medium text-red-700">{t('errorTitle')}</p>
            <p className="mt-1 font-body text-sm text-red-600">{t('errorText')}</p>
            <a
              href={TELEGRAM_FALLBACK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block font-body text-xs uppercase tracking-[0.2em] text-gold-deep underline underline-offset-4"
            >
              {t('errorTelegram')}
            </a>
          </div>
        )}

        {/* ─── Підпис про згоду + кнопка ─── */}
        <div className="border-t border-line pt-8">
          <p className="font-body text-xs font-light leading-relaxed text-muted">{t('privacy')}</p>
          <button
            type="submit"
            disabled={sending}
            className="mt-5 inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 font-body text-xs uppercase tracking-[0.2em] text-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-deep hover:shadow-lg hover:shadow-black/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-gold disabled:hover:shadow-none cursor-pointer"
          >
            {sending ? t('sending') : t('submit')}
          </button>
        </div>
      </form>
    </Reveal>
  );
}
