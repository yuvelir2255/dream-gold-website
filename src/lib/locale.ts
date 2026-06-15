export type LocaleValue = {uk?: string; en?: string} | null | undefined;
export function pickLocale(value: LocaleValue, locale: string): string {
  if (!value) return '';
  return (locale === 'en' ? value.en : value.uk) || value.uk || value.en || '';
}
