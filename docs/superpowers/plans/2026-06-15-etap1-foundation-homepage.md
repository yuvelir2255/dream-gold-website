# Этап 1 · План 1 — Каркас + дизайн-система + главная страница

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Поднять рабочий двуязычный (укр/англ) сайт Dream Gold на Next.js с дизайн-системой бренда, шапкой, подвалом и полностью свёрстанной главной страницей (контент — заглушки).

**Architecture:** Next.js (App Router, TypeScript) + Tailwind CSS v4 (цветовые токены бренда через `@theme`). Мультиязычность — next-intl с локализованными маршрутами `/uk` (по умолчанию) и `/en`. Анимации — Framer Motion через клиентский компонент-обёртку `<Reveal>`. Главная собрана из независимых секций-компонентов.

**Tech Stack:** Next.js 16 (App Router), TypeScript, **Tailwind CSS v3** (токены бренда в `tailwind.config.ts`), next-intl v4, Framer Motion, next/font (EB Garamond + Montserrat).

> ⚠️ **Обновление среды (2026-06-15):** на машине владельца Windows **Smart App Control**
> блокирует нативный бинарник Tailwind v4 (`@tailwindcss/oxide`) → сборка с v4 локально
> невозможна. Решение: используем **Tailwind v3** (чистый JS). Task 1 выполняется в
> v3-форме (см. «Task 1 (v3)» ниже), а не через `@theme`. Остальные задачи без изменений.

### Task 1 (v3) — ЗАМЕНЯЕТ Task 1 (версию с `@theme`)

**Переход на v3:**
```powershell
npm uninstall tailwindcss @tailwindcss/postcss
npm install -D tailwindcss@^3 postcss autoprefixer
```

**Создать `tailwind.config.ts`:**
```ts
import type {Config} from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F4ED',
        cream: '#FFFFFF',
        champagne: '#EFE7D6',
        gold: '#C4A052',
        'gold-deep': '#A07E32',
        charcoal: '#1F1B16',
        muted: '#6E665A',
        line: '#E3DAC9',
        dark: '#15120E'
      },
      fontFamily: {
        heading: ['var(--font-eb-garamond)', 'Georgia', 'serif'],
        body: ['var(--font-montserrat)', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
```

**Заменить `postcss.config.mjs`:**
```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
```

**Заменить `src/app/globals.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-ivory text-charcoal font-body antialiased;
  }
  h1, h2, h3, h4 {
    @apply font-heading;
    font-weight: 600;
    letter-spacing: 0.01em;
  }
}
```

> Классы `bg-ivory`, `text-charcoal`, `font-heading`, `font-body` приходят из
> `tailwind.config.ts`. В компонентах ниже вместо
> `font-[family-name:var(--font-eb-garamond)]` используем `font-heading`.

---

## Карта плана (Этап 1 целиком)

- **План 1 (этот):** каркас, дизайн-система, i18n, шапка/подвал, главная страница.
- **План 2:** Sanity CMS + каталог + карточка изделия.
- **План 3:** форма индивидуального заказа + отправка заявки в Telegram.
- **План 4:** страницы «О бренде» и «Контакты» + определитель размера кольца.
- **План 5:** SEO (мета, sitemap, OG) + деплой на Vercel.

## Подход к проверке (важно для новичка)

Это сайт-витрина, где главное — вёрстка и вид, а не бизнес-логика. Поэтому проверяем так:
- **`npm run build`** — ловит ошибки типов и сборки (главная страховка).
- **`npm run dev` + браузер** — глазами проверяем вид на `/uk` и `/en`, на телефоне и десктопе.

Юнит-тесты (Vitest) подключим в Плане 3, где появится реальная логика (валидация формы,
форматирование заявки в Telegram, расчёт размера кольца) — там тесты действительно полезны.
Здесь, в Плане 1, тесты на чисто визуальные компоненты дали бы мало пользы и усложнили старт.

## Структура файлов (что создаём)

```
src/
  app/
    [locale]/
      layout.tsx          # корневой layout локали (шрифты, провайдер i18n, html/body)
      page.tsx            # главная страница (сборка секций)
    globals.css           # Tailwind v4 + токены бренда (@theme)
  i18n/
    routing.ts            # список локалей + дефолтная
    navigation.ts         # локализованные Link/useRouter/usePathname
    request.ts            # загрузка переводов на сервере
  middleware.ts           # маршрутизация локалей
  components/
    layout/
      Header.tsx          # шапка: лого, навигация, переключатель языка
      Footer.tsx          # подвал: контакты, соцсети, языки
      LangSwitcher.tsx    # переключатель UA/EN (client)
      Logo.tsx            # текстовый логотип-заглушка (варианты цвета)
    ui/
      Container.tsx       # ограничитель ширины контента
      Section.tsx         # секция с отступами
      Button.tsx          # кнопка-ссылка (золотая / контурная)
      Reveal.tsx          # обёртка с анимацией появления (client, framer-motion)
    home/
      Hero.tsx            # 1. кино-обложка
      CreateYourOwn.tsx   # 2. путь заказа «создай своё»
      FeaturedWorks.tsx   # 3. избранные работы (заглушки)
      WhatWeCan.tsx       # 4. что мы можем
      Trust.tsx           # 5. доверие / своё производство
      Reviews.tsx         # 6. отзывы (заглушки)
      FinalCta.tsx        # 7. финальный призыв
messages/
  uk.json                 # переводы (украинский)
  en.json                 # переводы (английский)
next.config.ts            # подключение next-intl
```

---

### Task 0: Создание проекта Next.js поверх существующего репозитория

> Папка уже содержит `CLAUDE.md`, `README.md`, `docs/`, `.git` — поэтому
> `create-next-app` запускаем во временную подпапку и переносим файлы в корень.

**Files:**
- Create: весь каркас Next.js в корне проекта
- Keep (НЕ перезаписывать): `README.md`, `.gitignore`, `CLAUDE.md`, `docs/`

- [ ] **Step 1: Сгенерировать проект во временную папку (без установки зависимостей)**

Run (PowerShell, из корня проекта):
```powershell
npx create-next-app@latest nextapp-temp --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --skip-install --yes
```
Expected: создана папка `nextapp-temp/` с файлами Next.js.

- [ ] **Step 2: Перенести сгенерированные файлы в корень (кроме README и .gitignore)**

Run (PowerShell):
```powershell
$src = "nextapp-temp"
# Переносим всё, КРОМЕ README.md и .gitignore (у нас свои)
Get-ChildItem -Path $src -Force | Where-Object { $_.Name -notin @("README.md",".gitignore") } | ForEach-Object {
  Move-Item -Path $_.FullName -Destination (Join-Path "." $_.Name) -Force
}
Remove-Item -Recurse -Force $src
```
Expected: в корне появились `package.json`, `tsconfig.json`, `next.config.ts`,
`postcss.config.mjs`, `eslint.config.mjs`, `src/`, `public/`. Папка `nextapp-temp` удалена.

- [ ] **Step 3: Установить зависимости проекта + next-intl + framer-motion**

Run:
```powershell
npm install
npm install next-intl framer-motion
```
Expected: установка без ошибок, создан `node_modules/` и `package-lock.json`.

- [ ] **Step 4: Проверить, что заготовка собирается**

Run:
```powershell
npm run build
```
Expected: сборка успешна (это стандартная стартовая страница Next.js — её заменим дальше).

- [ ] **Step 5: Коммит**

```powershell
git add -A
git commit -m "Этап 1: каркас Next.js (App Router, TS, Tailwind)"
```

---

### Task 1: Дизайн-система — шрифты и цветовые токены

**Files:**
- Modify: `src/app/globals.css` (полностью заменить содержимое)
- Note: шрифты подключим в layout (Task 4)

- [ ] **Step 1: Заменить `src/app/globals.css`**

```css
@import "tailwindcss";

/* Цветовые токены бренда Dream Gold (Tailwind v4: доступны как bg-ivory, text-charcoal и т.д.) */
@theme {
  --color-ivory: #F7F4ED;       /* основной фон */
  --color-cream: #FFFFFF;       /* карточки/поверхности */
  --color-champagne: #EFE7D6;   /* мягкие блоки */
  --color-gold: #C4A052;        /* акцент */
  --color-gold-deep: #A07E32;   /* ховер/активное */
  --color-charcoal: #1F1B16;    /* основной текст */
  --color-muted: #6E665A;       /* вторичный текст */
  --color-line: #E3DAC9;        /* границы/разделители */
  --color-dark: #15120E;        /* тёмные секции, фон под белый логотип */

  /* Шрифтовые семейства (переменные приходят из next/font в layout) */
  --font-heading: var(--font-eb-garamond), Georgia, serif;
  --font-body: var(--font-montserrat), system-ui, sans-serif;
}

/* Базовые стили */
body {
  background-color: var(--color-ivory);
  color: var(--color-charcoal);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: 600;
  letter-spacing: 0.01em;
}
```

- [ ] **Step 2: Коммит**

```powershell
git add src/app/globals.css
git commit -m "Этап 1: дизайн-система — цветовые токены и шрифты"
```

---

### Task 2: Конфигурация i18n (next-intl)

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/navigation.ts`
- Create: `src/i18n/request.ts`
- Create: `src/middleware.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: `src/i18n/routing.ts`**

```ts
import {defineRouting} from 'next-intl/routing';

// Локали сайта. Украинский — по умолчанию. Другие языки добавляются сюда позже.
export const routing = defineRouting({
  locales: ['uk', 'en'],
  defaultLocale: 'uk'
});
```

- [ ] **Step 2: `src/i18n/navigation.ts`**

```ts
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

// Локализованные обёртки навигации (ставят /uk или /en автоматически).
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
```

- [ ] **Step 3: `src/i18n/request.ts`**

```ts
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

// Загружает нужный файл переводов под текущую локаль.
export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

- [ ] **Step 4: `src/middleware.ts`**

```ts
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Применяем ко всем путям, кроме статики, api и файлов с расширением.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
```

- [ ] **Step 5: Заменить `next.config.ts`**

```ts
import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 6: Коммит**

```powershell
git add src/i18n next.config.ts src/middleware.ts
git commit -m "Этап 1: i18n — маршрутизация локалей (next-intl)"
```

---

### Task 3: Файлы переводов

**Files:**
- Create: `messages/uk.json`
- Create: `messages/en.json`

- [ ] **Step 1: `messages/uk.json`**

```json
{
  "nav": {
    "catalog": "Каталог",
    "order": "Замовлення",
    "about": "Про бренд",
    "contacts": "Контакти"
  },
  "hero": {
    "title": "Прикраси, створені під ваше бажання",
    "subtitle": "Власне виробництво в Україні. Індивідуальні вироби та робота за вашим референсом.",
    "ctaPrimary": "Створити виріб",
    "ctaSecondary": "Дивитися роботи"
  },
  "create": {
    "title": "Створіть свій виріб",
    "subtitle": "Простий шлях від ідеї до готової прикраси",
    "step1Title": "Ідея або фото",
    "step1Desc": "Надішліть нам ідею чи фото-референс бажаного виробу.",
    "step2Title": "Метал і камінь",
    "step2Desc": "Обираємо метал (585/750) та камінь — природний чи лабораторний діамант.",
    "step3Title": "Розрахунок",
    "step3Desc": "Рахуємо індивідуальну ціну саме під ваш виріб.",
    "step4Title": "Виготовлення",
    "step4Desc": "Створюємо виріб на власному виробництві та доставляємо вам."
  },
  "works": {
    "title": "Обрані роботи",
    "subtitle": "Кілька наших виробів",
    "cta": "Дивитися весь каталог"
  },
  "can": {
    "title": "Що ми можемо",
    "item1": "Виріб за вашим фото або ідеєю",
    "item2": "У стилі відомих ювелірних домів",
    "item3": "Переплавлення вашого старого золота у новий виріб",
    "item4": "Природні та лабораторні діаманти з сертифікатами",
    "item5": "Проби 585 та 750",
    "item6": "Доставка Україною та Європою"
  },
  "trust": {
    "title": "Власне виробництво. Якість. Досвід.",
    "subtitle": "Ми контролюємо кожен етап — від ідеї до готової прикраси.",
    "item1Value": "Власне",
    "item1Label": "виробництво",
    "item2Value": "585 / 750",
    "item2Label": "проби золота",
    "item3Value": "Сертифікати",
    "item3Label": "на діаманти",
    "item4Value": "Україна + Європа",
    "item4Label": "доставка"
  },
  "reviews": {
    "title": "Що кажуть клієнти",
    "subtitle": "Відгуки наших замовників"
  },
  "finalCta": {
    "title": "Створимо прикрасу вашої мрії",
    "subtitle": "Залиште заявку — розрахуємо індивідуально",
    "button": "Залишити заявку"
  },
  "footer": {
    "tagline": "Ювелірний дім · індивідуальні замовлення",
    "phone": "Телефон",
    "telegram": "Telegram",
    "instagram": "Instagram",
    "rights": "Усі права захищені"
  }
}
```

- [ ] **Step 2: `messages/en.json`**

```json
{
  "nav": {
    "catalog": "Catalog",
    "order": "Order",
    "about": "About",
    "contacts": "Contacts"
  },
  "hero": {
    "title": "Jewelry born from your desire",
    "subtitle": "Own production in Ukraine. Bespoke pieces and work from your reference.",
    "ctaPrimary": "Create a piece",
    "ctaSecondary": "View works"
  },
  "create": {
    "title": "Create your own piece",
    "subtitle": "A simple path from idea to finished jewelry",
    "step1Title": "Idea or photo",
    "step1Desc": "Send us your idea or a photo reference of the piece you want.",
    "step2Title": "Metal and stone",
    "step2Desc": "We choose the metal (585/750) and stone — natural or lab-grown diamond.",
    "step3Title": "Calculation",
    "step3Desc": "We calculate an individual price for your exact piece.",
    "step4Title": "Crafting",
    "step4Desc": "We craft the piece at our own production and deliver it to you."
  },
  "works": {
    "title": "Selected works",
    "subtitle": "A few of our pieces",
    "cta": "View the full catalog"
  },
  "can": {
    "title": "What we can do",
    "item1": "A piece from your photo or idea",
    "item2": "In the style of renowned jewelry houses",
    "item3": "Melting your old gold into a new piece",
    "item4": "Natural and lab-grown diamonds with certificates",
    "item5": "585 and 750 gold",
    "item6": "Delivery across Ukraine and Europe"
  },
  "trust": {
    "title": "Own production. Quality. Experience.",
    "subtitle": "We control every step — from idea to finished jewelry.",
    "item1Value": "Own",
    "item1Label": "production",
    "item2Value": "585 / 750",
    "item2Label": "gold purity",
    "item3Value": "Certificates",
    "item3Label": "for diamonds",
    "item4Value": "Ukraine + Europe",
    "item4Label": "delivery"
  },
  "reviews": {
    "title": "What clients say",
    "subtitle": "Reviews from our customers"
  },
  "finalCta": {
    "title": "Let's create the jewelry of your dreams",
    "subtitle": "Leave a request — we'll calculate individually",
    "button": "Leave a request"
  },
  "footer": {
    "tagline": "Jewelry house · bespoke orders",
    "phone": "Phone",
    "telegram": "Telegram",
    "instagram": "Instagram",
    "rights": "All rights reserved"
  }
}
```

- [ ] **Step 3: Коммит**

```powershell
git add messages
git commit -m "Этап 1: переводы (укр + англ)"
```

---

### Task 4: Корневой layout локали (шрифты + провайдер i18n)

> Старый `src/app/layout.tsx` от create-next-app удаляем — теперь корень внутри `[locale]`.

**Files:**
- Delete: `src/app/layout.tsx` (если есть) и `src/app/page.tsx` (стартовая заглушка)
- Create: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Удалить стартовые файлы**

```powershell
Remove-Item -Force src/app/page.tsx -ErrorAction SilentlyContinue
Remove-Item -Force src/app/layout.tsx -ErrorAction SilentlyContinue
```

- [ ] **Step 2: `src/app/[locale]/layout.tsx`**

```tsx
import type {Metadata} from 'next';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {EB_Garamond, Montserrat} from 'next/font/google';
import {routing} from '@/i18n/routing';
import '../globals.css';

// Заголовочный serif с кириллицей + латиницей
const ebGaramond = EB_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-eb-garamond',
  display: 'swap'
});

// Основной текстовый шрифт с кириллицей
const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Dream Gold — ювелірний дім',
  description: 'Індивідуальні ювелірні вироби. Власне виробництво в Україні.'
};

// Генерируем статические страницы для всех локалей
export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${ebGaramond.variable} ${montserrat.variable}`}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Коммит**

```powershell
git add src/app
git commit -m "Этап 1: layout локали — шрифты и провайдер i18n"
```

---

### Task 5: UI-примитивы (Container, Section, Button, Reveal)

**Files:**
- Create: `src/components/ui/Container.tsx`
- Create: `src/components/ui/Section.tsx`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Reveal.tsx`

- [ ] **Step 1: `src/components/ui/Container.tsx`**

```tsx
// Ограничивает ширину контента и центрирует его.
export default function Container({children, className = ''}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: `src/components/ui/Section.tsx`**

```tsx
// Вертикальные отступы секции + опциональный фон.
export default function Section({children, className = ''}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-20 sm:py-28 ${className}`}>
      {children}
    </section>
  );
}
```

- [ ] **Step 3: `src/components/ui/Button.tsx`**

```tsx
import {Link} from '@/i18n/navigation';

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
};

// Кнопка-ссылка в стиле бренда: золотая заливка или золотой контур.
export default function Button({href, children, variant = 'solid'}: Props) {
  const base =
    'inline-flex items-center justify-center px-7 py-3 text-xs uppercase tracking-[0.2em] transition-colors duration-300 rounded-sm';
  const styles =
    variant === 'solid'
      ? 'bg-gold text-dark hover:bg-gold-deep'
      : 'border border-gold text-gold hover:bg-gold hover:text-dark';
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}
```

- [ ] **Step 4: `src/components/ui/Reveal.tsx`**

```tsx
'use client';

import {motion} from 'framer-motion';

// Плавное появление блока при прокрутке (снизу вверх + проявление).
export default function Reveal({children, delay = 0, className = ''}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{opacity: 0, y: 24}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.2}}
      transition={{duration: 0.7, delay, ease: 'easeOut'}}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 5: Коммит**

```powershell
git add src/components/ui
git commit -m "Этап 1: UI-примитивы (Container, Section, Button, Reveal)"
```

---

### Task 6: Логотип-заглушка

**Files:**
- Create: `src/components/layout/Logo.tsx`

- [ ] **Step 1: `src/components/layout/Logo.tsx`**

```tsx
// Текстовый логотип-заглушка (пока нет файла логотипа).
// tone: 'light' — для тёмного фона, 'dark' — для светлого фона.
export default function Logo({tone = 'dark'}: {tone?: 'light' | 'dark'}) {
  const color = tone === 'light' ? 'text-cream' : 'text-charcoal';
  return (
    <span className={`font-[family-name:var(--font-eb-garamond)] text-xl tracking-[0.25em] ${color}`}>
      DREAM GOLD
    </span>
  );
}
```

- [ ] **Step 2: Коммит**

```powershell
git add src/components/layout/Logo.tsx
git commit -m "Этап 1: логотип-заглушка (текстовый)"
```

---

### Task 7: Переключатель языков

**Files:**
- Create: `src/components/layout/LangSwitcher.tsx`

- [ ] **Step 1: `src/components/layout/LangSwitcher.tsx`**

```tsx
'use client';

import {usePathname, useRouter} from '@/i18n/navigation';
import {useLocale} from 'next-intl';
import {routing} from '@/i18n/routing';

// Переключает локаль, сохраняя текущий путь.
export default function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 text-xs tracking-widest">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-2">
          {i > 0 && <span className="text-line">/</span>}
          <button
            onClick={() => router.replace(pathname, {locale: loc})}
            className={
              loc === locale
                ? 'text-gold'
                : 'text-muted hover:text-gold transition-colors'
            }
            aria-current={loc === locale ? 'true' : undefined}
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Коммит**

```powershell
git add src/components/layout/LangSwitcher.tsx
git commit -m "Этап 1: переключатель языков UA/EN"
```

---

### Task 8: Шапка (Header)

**Files:**
- Create: `src/components/layout/Header.tsx`

- [ ] **Step 1: `src/components/layout/Header.tsx`**

```tsx
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Container from '@/components/ui/Container';
import Logo from './Logo';
import LangSwitcher from './LangSwitcher';

// Шапка на тёмном фоне (под белый логотип).
export default function Header() {
  const t = useTranslations('nav');
  return (
    <header className="bg-dark text-cream">
      <Container className="flex items-center justify-between py-5">
        <Link href="/">
          <Logo tone="light" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] text-cream/80">
          <Link href="/catalog" className="hover:text-gold transition-colors">{t('catalog')}</Link>
          <Link href="/order" className="hover:text-gold transition-colors">{t('order')}</Link>
          <Link href="/about" className="hover:text-gold transition-colors">{t('about')}</Link>
          <Link href="/contacts" className="hover:text-gold transition-colors">{t('contacts')}</Link>
        </nav>
        <LangSwitcher />
      </Container>
    </header>
  );
}
```

> Примечание: страницы `/catalog`, `/order`, `/about`, `/contacts` появятся в следующих
> планах. Сейчас ссылки ведут на пока несуществующие маршруты — это нормально (404 до сборки тех страниц).

- [ ] **Step 2: Коммит**

```powershell
git add src/components/layout/Header.tsx
git commit -m "Этап 1: шапка сайта (лого, навигация, языки)"
```

---

### Task 9: Подвал (Footer)

**Files:**
- Create: `src/components/layout/Footer.tsx`

- [ ] **Step 1: `src/components/layout/Footer.tsx`**

```tsx
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
```

- [ ] **Step 2: Коммит**

```powershell
git add src/components/layout/Footer.tsx
git commit -m "Этап 1: подвал сайта (контакты, соцсети)"
```

---

### Task 10: Секция Hero (кино-обложка)

**Files:**
- Create: `src/components/home/Hero.tsx`

- [ ] **Step 1: `src/components/home/Hero.tsx`**

```tsx
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
```

- [ ] **Step 2: Коммит**

```powershell
git add src/components/home/Hero.tsx
git commit -m "Этап 1: секция Hero"
```

---

### Task 11: Секция «Создай своё» (шаги заказа)

**Files:**
- Create: `src/components/home/CreateYourOwn.tsx`

- [ ] **Step 1: `src/components/home/CreateYourOwn.tsx`**

```tsx
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
                <span className="font-[family-name:var(--font-eb-garamond)] text-3xl text-gold">{s.n}</span>
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
```

- [ ] **Step 2: Коммит**

```powershell
git add src/components/home/CreateYourOwn.tsx
git commit -m "Этап 1: секция «Создай своё» (шаги заказа)"
```

---

### Task 12: Секция «Избранные работы» (заглушки)

**Files:**
- Create: `src/components/home/FeaturedWorks.tsx`

- [ ] **Step 1: `src/components/home/FeaturedWorks.tsx`**

```tsx
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
```

- [ ] **Step 2: Коммит**

```powershell
git add src/components/home/FeaturedWorks.tsx
git commit -m "Этап 1: секция «Избранные работы» (заглушки)"
```

---

### Task 13: Секция «Что мы можем»

**Files:**
- Create: `src/components/home/WhatWeCan.tsx`

- [ ] **Step 1: `src/components/home/WhatWeCan.tsx`**

```tsx
import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';

// Сильные стороны бренда.
export default function WhatWeCan() {
  const t = useTranslations('can');
  const items = [t('item1'), t('item2'), t('item3'), t('item4'), t('item5'), t('item6')];
  return (
    <Section className="bg-ivory">
      <Container>
        <Reveal className="text-center">
          <h2 className="text-3xl sm:text-4xl">{t('title')}</h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08}>
              <div className="h-full bg-cream p-7">
                <span className="font-[family-name:var(--font-eb-garamond)] text-2xl text-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-charcoal">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 2: Коммит**

```powershell
git add src/components/home/WhatWeCan.tsx
git commit -m "Этап 1: секция «Что мы можем»"
```

---

### Task 14: Секция «Доверие / своё производство»

**Files:**
- Create: `src/components/home/Trust.tsx`

- [ ] **Step 1: `src/components/home/Trust.tsx`**

```tsx
import {useTranslations} from 'next-intl';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';

// Блок доверия. Акцент на собственном производстве.
export default function Trust() {
  const t = useTranslations('trust');
  const stats = [
    {value: t('item1Value'), label: t('item1Label')},
    {value: t('item2Value'), label: t('item2Label')},
    {value: t('item3Value'), label: t('item3Label')},
    {value: t('item4Value'), label: t('item4Label')}
  ];
  return (
    <Section className="bg-dark text-cream">
      <Container>
        <Reveal className="text-center">
          <h2 className="text-3xl sm:text-4xl text-cream">{t('title')}</h2>
          <p className="mt-3 text-cream/60">{t('subtitle')}</p>
        </Reveal>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.1} className="text-center">
              <div className="font-[family-name:var(--font-eb-garamond)] text-2xl text-gold">{s.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-cream/50">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 2: Коммит**

```powershell
git add src/components/home/Trust.tsx
git commit -m "Этап 1: секция «Доверие / своё производство»"
```

---

### Task 15: Секция «Отзывы» (заглушки)

**Files:**
- Create: `src/components/home/Reviews.tsx`

- [ ] **Step 1: `src/components/home/Reviews.tsx`**

```tsx
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
```

- [ ] **Step 2: Коммит**

```powershell
git add src/components/home/Reviews.tsx
git commit -m "Этап 1: секция «Отзывы» (заглушки)"
```

---

### Task 16: Секция «Финальный призыв» (CTA)

**Files:**
- Create: `src/components/home/FinalCta.tsx`

- [ ] **Step 1: `src/components/home/FinalCta.tsx`**

```tsx
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
```

- [ ] **Step 2: Коммит**

```powershell
git add src/components/home/FinalCta.tsx
git commit -m "Этап 1: секция финального призыва (CTA)"
```

---

### Task 17: Сборка главной страницы

**Files:**
- Create: `src/app/[locale]/page.tsx`

- [ ] **Step 1: `src/app/[locale]/page.tsx`**

```tsx
import {setRequestLocale} from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import CreateYourOwn from '@/components/home/CreateYourOwn';
import FeaturedWorks from '@/components/home/FeaturedWorks';
import WhatWeCan from '@/components/home/WhatWeCan';
import Trust from '@/components/home/Trust';
import Reviews from '@/components/home/Reviews';
import FinalCta from '@/components/home/FinalCta';

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <CreateYourOwn />
        <FeaturedWorks />
        <WhatWeCan />
        <Trust />
        <Reviews />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Коммит**

```powershell
git add src/app/[locale]/page.tsx
git commit -m "Этап 1: сборка главной страницы"
```

---

### Task 18: Финальная проверка и публикация

- [ ] **Step 1: Сборка проекта**

Run:
```powershell
npm run build
```
Expected: сборка без ошибок; в выводе видно маршруты `/uk` и `/en`.

- [ ] **Step 2: Запуск и проверка в браузере**

Run:
```powershell
npm run dev
```
Открыть `http://localhost:3000` (должен редиректить на `/uk`) и `http://localhost:3000/en`.
Проверить глазами:
- шрифты бренда подхватились (заголовки — serif EB Garamond, текст — Montserrat);
- цвета бренда (слоновая кость, золото, тёмные секции);
- переключатель UA/EN меняет язык, путь сохраняется;
- все 7 секций главной на месте, анимации появления работают;
- вид нормальный на узком экране (телефон) — открыть DevTools → мобильный размер.

- [ ] **Step 3: Финальный коммит и push на GitHub**

```powershell
git add -A
git commit -m "Этап 1: главная страница готова (двуязычная витрина)"
git push
```
Expected: изменения на https://github.com/yuvelir2255/dream-gold-website

---

## Что НЕ входит в этот план (следующие планы)
- Каталог, CMS Sanity, карточка изделия → План 2.
- Форма заказа + Telegram → План 3.
- О бренде, Контакты, определитель размера кольца → План 4.
- SEO (sitemap, OG, мета по страницам) + деплой на Vercel → План 5.
- Реальный логотип (перекраска), реальные фото, реальные тексты от владельца.
