'use client';

import { useRef, useState } from 'react';
import { FieldLabel } from '@/components/admin/FieldLabel';
import { FieldTooltip } from '@/components/admin/FieldTooltip';
import { createClient } from '@/lib/supabase/client';

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  tooltip?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = 'covers',
  label = 'Imagem',
  tooltip = 'Envie uma imagem (JPG, PNG ou WebP, máx. 2 MB) ou cole a URL de uma imagem já hospedada.',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!ALLOWED.includes(file.type)) {
      setError('Use JPG, PNG ou WebP.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('Arquivo muito grande (máx. 2 MB).');
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from('news-media')
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('news-media').getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <FieldLabel tooltip={tooltip}>{label}</FieldLabel>
      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="h-40 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-2 rounded bg-white/90 px-2 py-1 text-xs text-red-600 shadow"
          >
            Remover
          </button>
        </div>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
        >
          {uploading ? 'Enviando…' : value ? 'Trocar imagem' : 'Enviar imagem'}
        </button>
      </div>
      <div>
        <span className="mb-1 flex items-center text-xs text-gray-500">
          URL da imagem
          <FieldTooltip content="Alternativa ao upload: cole aqui o endereço de uma imagem já hospedada na internet ou no Supabase Storage." />
        </span>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ou cole a URL da imagem"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
