'use client';

/**
 * Клиентская обёртка студии Sanity.
 * Импорт sanity.config и тяжёлых плагинов студии (structureTool, visionTool)
 * держим строго за границей 'use client' — иначе при сборке Next пытается
 * выполнить код студии на сервере и падает с ошибкой createContext.
 */
import {NextStudio} from 'next-sanity/studio';
import config from '../../../../sanity.config';

export default function Studio() {
  return <NextStudio config={config} />;
}
