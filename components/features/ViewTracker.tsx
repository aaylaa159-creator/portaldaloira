'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ViewTrackerProps {
  slug: string;
}

/**
 * Registra a visualização da notícia a partir do navegador.
 * Necessário porque a página é estática (ISR) — o servidor não roda a cada acesso.
 */
export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    const supabase = createClient();
    supabase
      .rpc('increment_post_views', { post_slug: slug })
      .then(({ error }) => {
        if (error) {
          console.error('[ViewTracker]', error.message);
        }
      });
  }, [slug]);

  return null;
}
