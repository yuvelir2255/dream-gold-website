import {defineRouting} from 'next-intl/routing';

// Локали сайта. Украинский — по умолчанию. Другие языки добавляются сюда позже.
export const routing = defineRouting({
  locales: ['uk', 'en'],
  defaultLocale: 'uk'
});
