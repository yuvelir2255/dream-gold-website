# Этап 1 · План 2 — Каталог + CMS Sanity

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Подключить headless CMS **Sanity** (встроенная студия в сайте), завести схему каталога ювелирных изделий (двуязычно укр/англ), и сделать страницу каталога с фильтрами + карточку изделия. Заменить заглушки «Избранных работ» на главной реальными изделиями из CMS.

**Architecture:** Sanity Studio встроена в Next.js по адресу `/studio` (один репозиторий, один деплой). Контент — документы `product` с двуязычными полями. Сайт читает данные через `next-sanity` (GROQ-запросы). Изображения — через `@sanity/image-url` + `next/image`. Студия и сайт делят один проект Sanity (бесплатный тариф).

**Tech Stack:** Next.js 16, TypeScript, Tailwind v3, next-intl v4 (уже есть), + `sanity`, `next-sanity`, `@sanity/vision`, `@sanity/image-url`.

---

## Пререквизит (действие владельца): создать проект Sanity

1. Зайти на https://www.sanity.io → Sign up (Google/GitHub/email) — бесплатно.
2. Create new project → имя **Dream Gold**.
3. Dataset: **production** (visibility: **Public** — для чтения каталога на сайте; это не секрет).
4. Скопировать **Project ID** (виден в проекте → Settings/API, или в URL вида `…/project/<projectId>`).
5. Передать мне **Project ID**. (API-токен НЕ нужен: студия авторизуется через браузер-логин, а чтение идёт из публичного датасета.)

Эти значения пойдут в `.env.local` (он в `.gitignore`, в репозиторий НЕ попадает):
```
NEXT_PUBLIC_SANITY_PROJECT_ID=<projectId>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01
```
Также добавить `.env.example` (без значений) в репозиторий как образец.

---

## Карта плана (3 батча)

- **Батч 1 — CMS работает:** установка пакетов, конфиг Sanity, схемы, встроенная студия `/studio`, env, корневой passthrough-layout, исключение `/studio` из i18n-middleware. Итог: мама может зайти в `/studio` и добавлять изделия.
- **Батч 2 — Каталог:** клиент Sanity, GROQ-запросы, помощник изображений, помощник локали, страница `/[locale]/catalog` с фильтрами (тип, металл, проба, «в стиле»).
- **Батч 3 — Карточка + главная:** страница `/[locale]/catalog/[slug]` (галерея медиа + аккордеон-секции + «Хочу таке саме»), и замена заглушек «Избранных работ» на главной реальными изделиями (featured).

---

## Структура новых файлов

```
src/
  sanity/
    env.ts                # чтение env (projectId, dataset, apiVersion)
    client.ts             # next-sanity client (для чтения)
    image.ts              # urlFor() — построение URL картинок
    structure.ts          # (опц.) структура студии
    schemaTypes/
      index.ts            # экспорт всех схем
      localeString.ts     # объект {uk, en} для строк
      localeText.ts       # объект {uk, en} для многострочного текста
      product.ts          # документ "изделие"
  lib/
    locale.ts             # helper: достать значение текущей локали из localeString/localeText
    queries.ts            # GROQ-запросы (все изделия, по slug, featured)
    catalogOptions.ts     # списки значений (категории, металлы, пробы, стили) + их переводы
  app/
    layout.tsx            # НОВЫЙ корневой passthrough-layout (return children)
    studio/[[...tool]]/
      layout.tsx          # <html><body> для студии
      page.tsx            # <NextStudio config={config} />
    [locale]/
      catalog/
        page.tsx          # список каталога + фильтры
        [slug]/page.tsx   # карточка изделия
  components/
    catalog/
      ProductCard.tsx     # карточка в сетке каталога
      CatalogFilters.tsx  # панель фильтров (client)
      ProductGallery.tsx  # галерея медиа на странице изделия (client)
      Accordion.tsx       # раскрывающаяся секция (client)
sanity.config.ts          # конфиг студии (projectId, dataset, plugins, schema)
.env.local                # значения (НЕ в git)
.env.example              # образец (в git)
```

---

## Батч 1 — CMS работает

### Task 1: Установка пакетов
- [ ] `npm install sanity next-sanity @sanity/vision @sanity/image-url`
- [ ] Проверить, что `npm run build` всё ещё проходит (пакеты установлены, код пока не подключён).
- [ ] Commit: `Этап 2: установка пакетов Sanity`.

### Task 2: env + клиент + image helper
- [ ] `.env.local` — с значениями Project ID (получены от владельца). НЕ коммитить.
- [ ] `.env.example` — те же ключи без значений; закоммитить.
- [ ] `src/sanity/env.ts`:
```ts
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01';
export const dataset = assert(
  process.env.NEXT_PUBLIC_SANITY_DATASET, 'NEXT_PUBLIC_SANITY_DATASET'
);
export const projectId = assert(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, 'NEXT_PUBLIC_SANITY_PROJECT_ID'
);
function assert(v: string | undefined, name: string): string {
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}
```
- [ ] `src/sanity/client.ts`:
```ts
import {createClient} from 'next-sanity';
import {apiVersion, dataset, projectId} from './env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true // для чтения published-контента; быстрее и дешевле
});
```
- [ ] `src/sanity/image.ts`:
```ts
import imageUrlBuilder from '@sanity/image-url';
import type {SanityImageSource} from '@sanity/image-url/lib/types/types';
import {client} from './client';

const builder = imageUrlBuilder(client);
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```
- [ ] Commit: `Этап 2: env, клиент Sanity, image helper`.

### Task 3: Схемы (двуязычные)
- [ ] `src/sanity/schemaTypes/localeString.ts` — объект с полями `uk` (string) и `en` (string).
- [ ] `src/sanity/schemaTypes/localeText.ts` — объект с полями `uk` (text) и `en` (text).
- [ ] `src/sanity/schemaTypes/product.ts` — документ `product`:
  - `title` (localeString, required)
  - `slug` (slug, source: `title.uk`, required)
  - `images` (array of image с `hotspot:true`, required, min 1)
  - `video` (url, optional)
  - `category` (string, list: ring, earrings, necklace, bracelet, chain, brooch — значения латиницей, лейблы в студии человеческие)
  - `metal` (string, list: white, yellow, rose)
  - `purity` (string, list: '585', '750')
  - `style` (string, list: classic, modern, vintage — БЕЗ названий брендов; лейблы «класичні доми», «сучасна класика», «вінтаж»)
  - `stones` (array of string, list: natural, lab — optional)
  - `description` (localeText)
  - `details` (localeText, optional — для секции «Деталі»)
  - `featured` (boolean, default false — показывать на главной)
  - preview: показывать `title.uk` + первое фото.
- [ ] `src/sanity/schemaTypes/index.ts` — экспорт массива `[localeString, localeText, product]`.
- [ ] Commit: `Этап 2: схемы каталога (изделие, двуязычно)`.

> Значения category/metal/purity/style/stones хранятся машинными строками (латиницей),
> а переводы лейблов для сайта берём из `src/lib/catalogOptions.ts` (Task 6) и из i18n.

### Task 4: Конфиг студии + встроенная студия
> Используй официальную интеграцию `next-sanity` Embedded Studio для Next.js App Router
> (актуальную под установленные версии). Ключевые точки ниже обязательны.

- [ ] `sanity.config.ts` (корень): `defineConfig` с `projectId`, `dataset` (из `src/sanity/env`), `basePath: '/studio'`, плагины `structureTool()` и `visionTool()`, `schema: {types: schemaTypes}`.
- [ ] `src/app/studio/[[...tool]]/page.tsx`: рендерит `<NextStudio config={config} />` (`'use client'` если требуется по докам; `export const dynamic = 'force-static'` по докам Sanity).
- [ ] `src/app/studio/[[...tool]]/layout.tsx`: оборачивает в `<html lang="en"><body>{children}</body></html>` (студии нужен свой html, т.к. она вне `[locale]`).
- [ ] Commit: `Этап 2: встроенная студия Sanity (/studio)`.

### Task 5: Корневой layout + исключение /studio из i18n
> Сейчас `<html>` живёт в `app/[locale]/layout.tsx`, и это работает, пока все маршруты под
> `[locale]`. Добавляя `/studio` (вне локали), нужен корневой passthrough-layout.

- [ ] Создать `src/app/layout.tsx`:
```tsx
// Корневой passthrough-layout. <html> рендерится глубже:
// в app/[locale]/layout.tsx (сайт) и в app/studio/.../layout.tsx (студия).
export default function RootLayout({children}: {children: React.ReactNode}) {
  return children;
}
```
- [ ] Обновить `src/proxy.ts` matcher, чтобы НЕ трогать `/studio`:
```ts
export const config = {
  matcher: ['/((?!api|studio|_next|_vercel|.*\\..*).*)']
};
```
- [ ] `npm run build` — должно собраться; маршруты: `/uk`, `/en`, `/studio/[[...tool]]`.
- [ ] Запустить `npm run dev`, открыть `/studio` — студия грузится, можно войти Sanity-аккаунтом.
- [ ] Commit: `Этап 2: корневой layout + /studio вне i18n`.

### Task 6 (владелец + проверка): добавить 2–3 тестовых изделия
- [ ] Владелец заходит в `/studio`, логинится, создаёт 2–3 изделия (с фото, заполнив укр+англ, отметив 1–2 как featured) — это нужно, чтобы проверить каталог в следующих батчах.

---

## Батч 2 — Каталог (список + фильтры)

### Task 7: helper локали + опции каталога + запросы
- [ ] `src/lib/locale.ts`:
```ts
// Достаёт значение текущей локали из объекта {uk, en}. Падать не должен.
export type LocaleValue = {uk?: string; en?: string} | null | undefined;
export function pickLocale(value: LocaleValue, locale: string): string {
  if (!value) return '';
  return (locale === 'en' ? value.en : value.uk) || value.uk || value.en || '';
}
```
- [ ] `src/lib/catalogOptions.ts` — массивы значений и ключи переводов:
```ts
export const CATEGORIES = ['ring','earrings','necklace','bracelet','chain','brooch'] as const;
export const METALS = ['white','yellow','rose'] as const;
export const PURITIES = ['585','750'] as const;
export const STYLES = ['classic','modern','vintage'] as const;
export type Category = typeof CATEGORIES[number];
```
(Переводы лейблов — в `messages/uk.json` и `messages/en.json` под ключом `catalog.options.*`, Task 8.)
- [ ] `src/lib/queries.ts`:
```ts
import {groq} from 'next-sanity';

export const ALL_PRODUCTS = groq`*[_type == "product"]|order(_createdAt desc){
  _id, title, slug, images, category, metal, purity, style, featured
}`;

export const PRODUCT_BY_SLUG = groq`*[_type == "product" && slug.current == $slug][0]{
  _id, title, slug, images, video, category, metal, purity, style, stones,
  description, details
}`;

export const FEATURED_PRODUCTS = groq`*[_type == "product" && featured == true]
  |order(_createdAt desc)[0...3]{ _id, title, slug, images, category }`;
```
- [ ] Commit: `Этап 2: запросы GROQ, helper локали, опции каталога`.

### Task 8: переводы для каталога
- [ ] Добавить в `messages/uk.json` и `messages/en.json` ключи:
  - `catalog.title`, `catalog.empty` («Поки що немає виробів»)
  - `catalog.filters.*` (label фильтров: all/category/metal/purity/style)
  - `catalog.options.category.*`, `catalog.options.metal.*`, `catalog.options.purity.*`, `catalog.options.style.*` (человеческие лейблы значений)
  - `product.cta` («Хочу таке саме / Замовити»), `product.sections.*` (заголовки аккордеона: description/details/shipping/packaging/care), и сам статический текст `product.static.shipping`, `product.static.packaging`, `product.static.care` (несколько пунктов про доставку/упаковку/уход — красиво, в стиле референса).
- [ ] Commit: `Этап 2: переводы каталога и карточки`.

### Task 9: компоненты карточки в сетке + фильтры
- [ ] `src/components/catalog/ProductCard.tsx` (server-friendly): фото (urlFor + next/image), название (pickLocale), категория-лейбл; ссылка на `/catalog/[slug]` через `@/i18n/navigation` Link.
- [ ] `src/components/catalog/CatalogFilters.tsx` (`'use client'`): кнопки/чекбоксы фильтров (category, metal, purity, style); фильтрация клиентская через состояние, отдаёт наружу выбранные значения (или фильтрует переданный список через колбэк/URL searchParams).
- [ ] Commit: `Этап 2: ProductCard и CatalogFilters`.

### Task 10: страница каталога
- [ ] `src/app/[locale]/catalog/page.tsx`: `setRequestLocale`, грузит `ALL_PRODUCTS` через `client.fetch`, рендерит `<Header/>`, заголовок, `<CatalogFilters/>` + сетку `<ProductCard/>`, `<Footer/>`. Если изделий нет — показать `catalog.empty`.
- [ ] `npm run build` + проверка `/uk/catalog` и `/en/catalog` в браузере (с тестовыми изделиями из Task 6).
- [ ] Commit: `Этап 2: страница каталога с фильтрами`.

---

## Батч 3 — Карточка изделия + главная

### Task 11: аккордеон + галерея
- [ ] `src/components/catalog/Accordion.tsx` (`'use client'`): заголовок + раскрытие/скрытие, плавно; «−/+» как в референсе.
- [ ] `src/components/catalog/ProductGallery.tsx` (`'use client'`): крупное фото + миниатюры; если есть `video` — показать.
- [ ] Commit: `Этап 2: Accordion и ProductGallery`.

### Task 12: страница изделия
- [ ] `src/app/[locale]/catalog/[slug]/page.tsx`: `setRequestLocale`, грузит `PRODUCT_BY_SLUG` (если нет — `notFound()`); рендерит `<Header/>`, две колонки (галерея | информация): название, краткие характеристики (метал/проба/стиль/камни — через лейблы), аккордеон-секции:
  - «Опис» (description, pickLocale)
  - «Деталі» (details, если есть)
  - «Доставка та повернення» (статический текст из i18n)
  - «Пакування» (статический)
  - «Догляд та безпека» (статический)
  - кнопка `product.cta` → ведёт на `/order` (форма заказа — План 3).
- [ ] `generateStaticParams` по slug (опц., можно динамически).
- [ ] `npm run build` + проверка страницы изделия в браузере.
- [ ] Commit: `Этап 2: страница изделия (галерея + аккордеон)`.

### Task 13: «Избранные работы» на главной из CMS
- [ ] Обновить `src/components/home/FeaturedWorks.tsx`: вместо заглушек — грузить `FEATURED_PRODUCTS` и рендерить реальные изделия (фото + название + ссылка). Если featured нет — оставить аккуратную заглушку/скрыть секцию.
- [ ] `npm run build` + проверка главной.
- [ ] Commit: `Этап 2: избранные работы на главной из CMS`.

---

## Проверка плана (verification)
- `npm run build` зелёный после каждого батча.
- `/studio` грузится, можно добавить изделие.
- `/uk/catalog` и `/en/catalog` показывают изделия, фильтры работают.
- Страница изделия: галерея, характеристики, аккордеон, кнопка «Хочу таке саме».
- Главная: featured-изделия вместо заглушек.

## Не входит (следующие планы)
- Форма заказа + Telegram (План 3) — кнопка «Хочу таке саме» пока ведёт на `/order` (заглушка/появится в Плане 3).
- Страницы «О бренде», «Контакты», определитель размера (План 4).
- SEO + деплой (План 5).
- Реальные фото/тексты — добавляет владелец через `/studio`.
