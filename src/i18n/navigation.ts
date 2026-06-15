import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

// Локализованные обёртки навигации (ставят /uk или /en автоматически).
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
