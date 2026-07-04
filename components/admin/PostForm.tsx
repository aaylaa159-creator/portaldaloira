'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slug';
import { ImageUpload } from '@/components/admin/ImageUpload';
import {
  createPost,
  updatePost,
  deletePost,
  type PostFormInput,
} from '@/lib/actions/admin/posts';
import type {
  Author,
  Category,
  FeaturedPosition,
  PostStatus,
  PostWithRelations,
} from '@/lib/types';

interface PostFormProps {
  categories: Category[];
  authors: Author[];
  post?: PostWithRelations;
}

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600';

export function PostForm({ categories, authors, post }: PostFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(post?.title ?? '');
  const [subtitle, setSubtitle] = useState(post?.subtitle ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [content, setContent] = useState(post?.content ?? '<p></p>');
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? '');
  const [coverCaption, setCoverCaption] = useState(post?.cover_caption ?? '');
  const [authorId, setAuthorId] = useState(post?.author_id ?? authors[0]?.id ?? '');
  const [categoryId, setCategoryId] = useState(
    post?.category_id ?? categories[0]?.id ?? ''
  );
  const [tags, setTags] = useState(post?.tags?.join(', ') ?? '');
  const [status, setStatus] = useState<PostStatus>(post?.status ?? 'draft');
  const [featuredPosition, setFeaturedPosition] = useState<FeaturedPosition>(
    post?.featured_position ?? 'none'
  );
  const [publishedAt, setPublishedAt] = useState(
    post?.published_at
      ? new Date(post.published_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );

  function buildInput(): PostFormInput {
    return {
      title,
      subtitle,
      slug: slug || slugify(title),
      content,
      cover_image: coverImage,
      cover_caption: coverCaption,
      author_id: authorId,
      category_id: categoryId,
      tags,
      status,
      featured_position: featuredPosition,
      published_at: new Date(publishedAt).toISOString(),
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!coverImage) {
      setError('A imagem de capa é obrigatória.');
      return;
    }
    setLoading(true);
    setError(null);

    const input = buildInput();
    const result = post
      ? await updatePost(post.id, input)
      : await createPost(input);

    if ('error' in result && result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push('/admin/posts');
    router.refresh();
  }

  async function handleDelete() {
    if (!post || !confirm('Excluir esta notícia permanentemente?')) return;
    setLoading(true);
    const result = await deletePost(post.id);
    if ('error' in result && result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push('/admin/posts');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Título</label>
          <input
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!post) setSlug(slugify(e.target.value));
            }}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Subtítulo</label>
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Slug (URL)</label>
          <input required value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tags (vírgula)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} />
        </div>
      </div>

      <ImageUpload value={coverImage} onChange={setCoverImage} label="Capa" />

      <div>
        <label className="mb-1 block text-sm font-medium">Legenda da capa</label>
        <input value={coverCaption} onChange={(e) => setCoverCaption(e.target.value)} className={inputClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Editoria</label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Autor</label>
          <select
            required
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            className={inputClass}
          >
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as PostStatus)} className={inputClass}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="scheduled">Agendado</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Destaque na Home</label>
          <select
            value={featuredPosition}
            onChange={(e) => setFeaturedPosition(e.target.value as FeaturedPosition)}
            className={inputClass}
          >
            <option value="none">Nenhum</option>
            <option value="main">Manchete</option>
            <option value="secondary">Destaque secundário</option>
            <option value="carousel">Carrossel / Opinião</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Data de publicação</label>
          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Conteúdo (HTML)</label>
        <textarea
          required
          rows={16}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`${inputClass} font-mono text-xs`}
          placeholder="<p>Primeiro parágrafo...</p>"
        />
        <p className="mt-1 text-xs text-gray-500">
          Use tags: p, h2, h3, strong, em, a, ul, ol, li, blockquote, img
        </p>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600/90 disabled:opacity-60"
        >
          {loading ? 'Salvando…' : post ? 'Salvar alterações' : 'Criar notícia'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm hover:bg-gray-50"
        >
          Cancelar
        </button>
        {post ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="ml-auto rounded-lg border border-red-200 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            Excluir
          </button>
        ) : null}
      </div>
    </form>
  );
}
