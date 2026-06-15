'use client';

import {useState} from 'react';
import Image from 'next/image';
import type {SanityImageSource} from '@sanity/image-url';
import {urlFor} from '@/sanity/image';

// Галерея виробу: велике фото + ряд мініатюр для перемикання, опційне відео.
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
    <div className="flex flex-col gap-4">
      {/* Головне зображення */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-champagne">
        {mainUrl ? (
          <Image
            src={mainUrl}
            alt={alt || 'Dream Gold'}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-body text-sm text-muted">Dream Gold</span>
          </div>
        )}
      </div>

      {/* Мініатюри (якщо більше одного фото) */}
      {hasImages && images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => {
            const thumbUrl = urlFor(img).width(160).height(200).fit('crop').url();
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`relative shrink-0 aspect-[4/5] w-16 overflow-hidden rounded-sm border-2 transition-colors duration-200 ${
                  i === activeIndex ? 'border-gold' : 'border-line hover:border-muted'
                }`}
                aria-label={`Фото ${i + 1}`}
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
        <div className="mt-2">
          <video
            src={video}
            controls
            className="w-full rounded-sm"
            aria-label={`Відео виробу: ${alt}`}
          />
        </div>
      )}
    </div>
  );
}
