'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/admin/ImageUpload';
import {
  createBanner,
  updateBanner,
  deleteBanner,
  type BannerFormInput,
} from '@/lib/actions/admin/banners';
import type { AdBanner, AdPlacement, AdType } from '@/lib/types';

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600';

const PLACEMENTS: { value: AdPlacement; label: string }[] = [
  { value: 'header_top', label: 'Topo (leaderboard)' },
  { value: 'sidebar_right', label: 'Sidebar direita' },
  { value: 'in_content_1', label: 'Dentro do conteúdo 1' },
  { value: 'in_content_2', label: 'Dentro do conteúdo 2' },
  { value: 'popup_overlay', label: 'Popup overlay' },
];

interface BannerFormProps {
  banner?: AdBanner;
}

export function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter();
  const [placement, setPlacement] = useState<AdPlacement>(banner?.placement ?? 'header_top');
  const [type, setType] = useState<AdType>(banner?.type ?? 'image');
  const [imageUrl, setImageUrl] = useState(banner?.image_url ?? '');
  const [targetUrl, setTargetUrl] = useState(banner?.target_url ?? '');
  const [scriptCode, setScriptCode] = useState(banner?.script_code ?? '');
  const [active, setActive] = useState(banner?.active ?? true);
  const [expiresAt, setExpiresAt] = useState(
    banner?.expires_at ? banner.expires_at.slice(0, 16) : ''
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const input: BannerFormInput = {
      placement,
      type,
      image_url: imageUrl || undefined,
      target_url: targetUrl || undefined,
      script_code: scriptCode || undefined,
      active,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : undefined,
    };

    const result = banner
      ? await updateBanner(banner.id, input)
      : await createBanner(input);

    if ('error' in result && result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push('/admin/banners');
    router.refresh();
  }

  async function handleDelete() {
    if (!banner || !confirm('Excluir este banner?')) return;
    const result = await deleteBanner(banner.id);
    if ('error' in result && result.error) {
      setError(result.error);
      return;
    }
    router.push('/admin/banners');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Posição</label>
        <select
          value={placement}
          onChange={(e) => setPlacement(e.target.value as AdPlacement)}
          className={inputClass}
        >
          {PLACEMENTS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Tipo</label>
        <select value={type} onChange={(e) => setType(e.target.value as AdType)} className={inputClass}>
          <option value="image">Imagem</option>
          <option value="script">Script</option>
        </select>
      </div>
      {type === 'image' ? (
        <>
          <ImageUpload value={imageUrl} onChange={setImageUrl} folder="banners" label="Imagem do banner" />
          <div>
            <label className="mb-1 block text-sm font-medium">URL de destino</label>
            <input type="url" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} className={inputClass} />
          </div>
        </>
      ) : (
        <div>
          <label className="mb-1 block text-sm font-medium">Código do script</label>
          <textarea
            value={scriptCode}
            onChange={(e) => setScriptCode(e.target.value)}
            rows={6}
            className={`${inputClass} font-mono text-xs`}
          />
        </div>
      )}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Ativo
      </label>
      <div>
        <label className="mb-1 block text-sm font-medium">Expira em (opcional)</label>
        <input
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className={inputClass}
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          Salvar
        </button>
        {banner ? (
          <button type="button" onClick={handleDelete} className="text-sm text-red-600">
            Excluir
          </button>
        ) : null}
      </div>
    </form>
  );
}
