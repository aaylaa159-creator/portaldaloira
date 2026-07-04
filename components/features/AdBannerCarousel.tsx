'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

export interface AdBannerSlide {
  id: string;
  image_url: string;
  target_url: string | null;
}

interface AdBannerCarouselProps {
  slides: AdBannerSlide[];
  width: number;
  height: number;
  minHeightClass: string;
  intervalMs?: number;
}

function NavChevron({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {direction === 'prev' ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

export function AdBannerCarousel({
  slides,
  width,
  height,
  minHeightClass,
  intervalMs = 5000,
}: AdBannerCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const hasMultiple = count > 1;

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (!hasMultiple || paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [count, hasMultiple, intervalMs, paused]);

  return (
    <div
      className={`group relative mx-auto w-full ${minHeightClass}`}
      style={{ maxWidth: width }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative w-full overflow-hidden rounded-lg border border-brand-200/60 bg-gradient-to-r from-brand-50 to-white shadow-sm"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <span className="pointer-events-none absolute right-2 top-1.5 z-20 rounded bg-black/45 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
          Publicidade
        </span>

        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === index;
          return (
            <a
              key={slide.id}
              href={slide.target_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer sponsored"
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
              className={`absolute inset-0 block transition-opacity duration-700 ease-in-out ${
                isActive ? 'z-10 opacity-100' : 'z-0 opacity-0'
              }`}
            >
              <Image
                src={slide.image_url}
                alt="Publicidade"
                fill
                sizes={`(max-width: ${width}px) 100vw, ${width}px`}
                className="object-cover"
                unoptimized
                priority={slideIndex === 0}
              />
            </a>
          );
        })}

        {hasMultiple ? (
          <>
            <button
              type="button"
              aria-label="Banner anterior"
              onClick={() => goTo(index - 1)}
              className="absolute left-1.5 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition hover:bg-[#f97316] group-hover:opacity-100 focus:opacity-100"
            >
              <NavChevron direction="prev" />
            </button>
            <button
              type="button"
              aria-label="Próximo banner"
              onClick={() => goTo(index + 1)}
              className="absolute right-1.5 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition hover:bg-[#f97316] group-hover:opacity-100 focus:opacity-100"
            >
              <NavChevron direction="next" />
            </button>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <div
          className="mt-2 flex items-center justify-center gap-1.5"
          role="tablist"
          aria-label="Slides de publicidade"
        >
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={slideIndex === index}
              aria-label={`Banner ${slideIndex + 1} de ${count}`}
              onClick={() => goTo(slideIndex)}
              className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                slideIndex === index
                  ? 'w-5 bg-brand-600'
                  : 'w-1.5 bg-brand-300 hover:bg-[#f97316]'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
