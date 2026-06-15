import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Применяем ко всем путям, кроме статики, api и файлов с расширением.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
