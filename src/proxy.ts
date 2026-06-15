import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Применяем ко всем путям, кроме статики, api, студии Sanity и файлов с расширением.
  matcher: ['/((?!api|studio|_next|_vercel|.*\\..*).*)']
};
