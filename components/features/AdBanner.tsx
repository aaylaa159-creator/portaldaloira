import Script from 'next/script';
import { getActiveAds } from '@/lib/data/ads';
import { AdBannerCarousel } from '@/components/features/AdBannerCarousel';
import type { AdBannerSlide } from '@/components/features/AdBannerCarousel';
import type { AdPlacement } from '@/lib/types';

interface AdBannerProps {
  placement: AdPlacement;
}

/** Dimensões reservadas por posição para evitar CLS (layout shift). */
const PLACEMENT_SIZES: Record<
  AdPlacement,
  { width: number; height: number; minHeightClass: string }
> = {
  header_top: { width: 728, height: 90, minHeightClass: 'min-h-[90px]' },
  sidebar_right: { width: 300, height: 250, minHeightClass: 'min-h-[250px]' },
  sidebar_skyscraper: { width: 300, height: 600, minHeightClass: 'min-h-[600px]' },
  sidebar_card_1: { width: 300, height: 300, minHeightClass: 'min-h-[300px]' },
  sidebar_card_2: { width: 300, height: 300, minHeightClass: 'min-h-[300px]' },
  in_content_1: { width: 728, height: 90, minHeightClass: 'min-h-[90px]' },
  in_content_2: { width: 728, height: 90, minHeightClass: 'min-h-[90px]' },
  popup_overlay: { width: 400, height: 400, minHeightClass: 'min-h-[400px]' },
};

/** Posições que rotacionam vários banners em carrossel (estilo portal de notícias). */
const CAROUSEL_PLACEMENTS: AdPlacement[] = [
  'header_top',
  'sidebar_right',
  'sidebar_skyscraper',
  'sidebar_card_1',
  'sidebar_card_2',
];

const DEMO_SLIDES: Record<AdPlacement, AdBannerSlide[]> = {
  header_top: [
    {
      id: 'demo-header-1',
      image_url: 'https://picsum.photos/seed/ad-leaderboard-1/728/90',
      target_url: 'https://example.com',
    },
    {
      id: 'demo-header-2',
      image_url: 'https://picsum.photos/seed/ad-leaderboard-2/728/90',
      target_url: 'https://example.com',
    },
    {
      id: 'demo-header-3',
      image_url: 'https://picsum.photos/seed/ad-leaderboard-3/728/90',
      target_url: 'https://example.com',
    },
  ],
  sidebar_right: [
    {
      id: 'demo-sidebar-1',
      image_url: 'https://picsum.photos/seed/ad-sidebar-1/300/250',
      target_url: 'https://example.com',
    },
    {
      id: 'demo-sidebar-2',
      image_url: 'https://picsum.photos/seed/ad-sidebar-2/300/250',
      target_url: 'https://example.com',
    },
  ],
  sidebar_skyscraper: [
    {
      id: 'demo-skyscraper-1',
      image_url: 'https://picsum.photos/seed/ad-skyscraper-1/300/600',
      target_url: 'https://example.com',
    },
    {
      id: 'demo-skyscraper-2',
      image_url: 'https://picsum.photos/seed/ad-skyscraper-2/300/600',
      target_url: 'https://example.com',
    },
  ],
  sidebar_card_1: [
    {
      id: 'demo-sidebar-card-1a',
      image_url: 'https://picsum.photos/seed/ad-sidebar-card-1a/300/300',
      target_url: 'https://example.com',
    },
    {
      id: 'demo-sidebar-card-1b',
      image_url: 'https://picsum.photos/seed/ad-sidebar-card-1b/300/300',
      target_url: 'https://example.com',
    },
  ],
  sidebar_card_2: [
    {
      id: 'demo-sidebar-card-2a',
      image_url: 'https://picsum.photos/seed/ad-sidebar-card-2a/300/300',
      target_url: 'https://example.com',
    },
    {
      id: 'demo-sidebar-card-2b',
      image_url: 'https://picsum.photos/seed/ad-sidebar-card-2b/300/300',
      target_url: 'https://example.com',
    },
  ],
  in_content_1: [],
  in_content_2: [],
  popup_overlay: [],
};

function toSlides(
  ads: { id: string; image_url: string | null; target_url: string | null }[]
): AdBannerSlide[] {
  return ads
    .filter((ad): ad is typeof ad & { image_url: string } => Boolean(ad.image_url))
    .map((ad) => ({
      id: ad.id,
      image_url: ad.image_url,
      target_url: ad.target_url,
    }));
}

/**
 * Bloco de anúncio com espaço reservado (anti-CLS) e carrossel animado
 * quando há múltiplos banners na mesma posição.
 */
export async function AdBanner({ placement }: AdBannerProps) {
  const ads = await getActiveAds();
  const placementAds = ads.filter((item) => item.placement === placement);
  const scriptAd = placementAds.find((item) => item.type === 'script' && item.script_code);
  const imageAds = placementAds.filter((item) => item.type === 'image');
  const { width, height, minHeightClass } = PLACEMENT_SIZES[placement];
  const useCarousel = CAROUSEL_PLACEMENTS.includes(placement);

  if (scriptAd?.script_code) {
    return (
      <div
        className={`flex w-full items-center justify-center ${minHeightClass}`}
        style={{ maxWidth: width }}
      >
        <Script
          id={`ad-${scriptAd.id}`}
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{ __html: scriptAd.script_code }}
        />
      </div>
    );
  }

  let slides = toSlides(imageAds);

  if (slides.length === 0 && useCarousel) {
    slides = DEMO_SLIDES[placement];
  }

  if (useCarousel && slides.length > 0) {
    return (
      <AdBannerCarousel
        slides={slides}
        width={width}
        height={height}
        minHeightClass={minHeightClass}
      />
    );
  }

  const single = slides[0];

  if (single) {
    return (
      <AdBannerCarousel
        slides={[single]}
        width={width}
        height={height}
        minHeightClass={minHeightClass}
      />
    );
  }

  return (
    <div
      className={`mx-auto flex w-full items-center justify-center ${minHeightClass}`}
      style={{ maxWidth: width }}
    >
      <div
        className="flex w-full items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        Publicidade
      </div>
    </div>
  );
}
