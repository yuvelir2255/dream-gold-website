'use client';

import {useState} from 'react';
import Image from 'next/image';
import type {SanityImageSource} from '@sanity/image-url';
import {urlFor} from '@/sanity/image';

// Галерея виробу: велике фото + ряд мініатюр для перемикання, опційне відео.
// Стиль редакційний: хайрлайн-рамки, золоте кільце на активній мініатюрі.
interface ProductGalleryProps {
  images: SanityImageSource[];
  alt: string;
  video?: string;
}

export default function ProductGallery({images, alt, video}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = images && images.length > 0;

  const mainUrl = hasImages
    ? urlFor(images[activeIndex]).width(1000).height(1250).fit('crop').url()
    : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Головне зображення — хайрлайн-рамка + м'яка тінь + м'який зум по ховеру */}
      <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-line bg-champagne shadow-[0_24px_60px_-32px_rgba(31,27,22,0.5)]">
        {mainUrl ? (
          <Image
            src={mainUrl}
            alt={alt || 'Dream Gold'}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
            priority
          />
        ) : (
          /* Елегантний плейсхолдер: золотий ромб + підпис */
          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <svg
              width="44"
              height="44"
              viewBox="0 0 96 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <polygon
                points="48,8 88,40 48,88 8,40"
                stroke="#C4A052"
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />
              <polyline
                points="8,40 48,24 88,40"
                stroke="#C4A052"
                strokeWidth="1"
                fill="none"
                opacity="0.45"
              />
            </svg>
            <span className="font-body text-[11px] uppercase tracking-[0.3em] text-muted">
              Dream Gold
            </span>
          </div>
        )}
      </div>

      {/* Мініатюри (якщо більше одного фото) */}
      {hasImages && images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => {
            const thumbUrl = urlFor(img).width(160).height(200).fit('crop').url();
            const active = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`relative aspect-[4/5] w-16 shrink-0 cursor-pointer overflow-hidden rounded-sm border transition-all duration-300 ${
                  active
                    ? 'border-gold shadow-sm shadow-gold/30'
                    : 'border-line opacity-70 hover:border-gold/50 hover:opacity-100'
                }`}
                aria-label={`Фото ${i + 1}`}
                aria-current={active}
              >
                <Image
                  src={thumbUrl}
                  alt={`${alt} ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Відео (якщо є) */}
      {video && (
        <div className="mt-1">
          <video
            src={video}
            controls
            className="w-full rounded-sm border border-line"
            aria-label={`Відео виробу: ${alt}`}
          />
        </div>
      )}
    </div>
  );
}
