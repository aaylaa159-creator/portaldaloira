'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

type CopyTarget = 'link' | 'instagram';

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState<CopyTarget | null>(null);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink(target: CopyTarget = 'link') {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(target);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard indisponível (http ou permissão negada): ignora silenciosamente
    }
  }

  const buttonClass =
    'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold text-white transition hover:opacity-90';

  return (
    <div className="flex flex-col items-end gap-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Compartilhar com
      </p>
      <div
        className="flex flex-wrap items-center justify-end gap-2"
        role="group"
        aria-label="Compartilhar matéria"
      >
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} bg-[#25D366]`}
          aria-label="Compartilhar no WhatsApp"
        >
          WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} bg-[#1877F2]`}
          aria-label="Compartilhar no Facebook"
        >
          Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} bg-black`}
          aria-label="Compartilhar no X"
        >
          X
        </a>
        <a
          href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} bg-[#26A5E4]`}
          aria-label="Compartilhar no Telegram"
        >
          Telegram
        </a>
        <button
          type="button"
          onClick={() => copyLink('instagram')}
          className={`${buttonClass} bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af]`}
          aria-label="Copiar link para compartilhar no Instagram"
        >
          {copied === 'instagram' ? 'Copiado!' : 'Instagram'}
        </button>
        <button
          type="button"
          onClick={() => copyLink('link')}
          className={`${buttonClass} bg-brand-700 hover:bg-brand-800`}
          aria-label="Copiar link da matéria"
        >
          {copied === 'link' ? 'Copiado!' : 'Copiar link'}
        </button>
      </div>
    </div>
  );
}
