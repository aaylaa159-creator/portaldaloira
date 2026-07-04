'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slug';
import { ImageUpload } from '@/components/admin/ImageUpload';
import {
  createAuthor,
  updateAuthor,
  deleteAuthor,
  type AuthorFormInput,
} from '@/lib/actions/admin/authors';
import type { Author, AuthorRole } from '@/lib/types';

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600';

interface AuthorFormProps {
  author?: Author;
}

export function AuthorForm({ author }: AuthorFormProps) {
  const router = useRouter();
  const [name, setName] = useState(author?.name ?? '');
  const [slug, setSlug] = useState(author?.slug ?? '');
  const [bio, setBio] = useState(author?.bio ?? '');
  const [role, setRole] = useState<AuthorRole>(author?.role ?? 'journalist');
  const [instagram, setInstagram] = useState(author?.instagram ?? '');
  const [twitter, setTwitter] = useState(author?.twitter ?? '');
  const [email, setEmail] = useState(author?.email ?? '');
  const [avatarUrl, setAvatarUrl] = useState(author?.avatar_url ?? '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const input: AuthorFormInput = {
      name,
      slug: slug || slugify(name),
      bio,
      role,
      instagram,
      twitter,
      email,
      avatar_url: avatarUrl || undefined,
    };

    const result = author
      ? await updateAuthor(author.id, input)
      : await createAuthor(input);

    if ('error' in result && result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push('/admin/autores');
    router.refresh();
  }

  async function handleDelete() {
    if (!author || !confirm('Excluir este autor?')) return;
    const result = await deleteAuthor(author.id);
    if ('error' in result && result.error) {
      setError(result.error);
      return;
    }
    router.push('/admin/autores');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Nome</label>
        <input
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!author) setSlug(slugify(e.target.value));
          }}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>
        <input required value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Função</label>
        <select value={role} onChange={(e) => setRole(e.target.value as AuthorRole)} className={inputClass}>
          <option value="journalist">Jornalista</option>
          <option value="columnist">Colunista</option>
          <option value="editor">Editor</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Bio</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className={inputClass} />
      </div>
      <ImageUpload value={avatarUrl} onChange={setAvatarUrl} folder="avatars" label="Foto" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Instagram</label>
          <input value={instagram} onChange={(e) => setInstagram(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
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
        {author ? (
          <button type="button" onClick={handleDelete} className="text-sm text-red-600">
            Excluir
          </button>
        ) : null}
      </div>
    </form>
  );
}
