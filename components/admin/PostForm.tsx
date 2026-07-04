'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slug';
import { FieldLabel } from '@/components/admin/FieldLabel';
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
          <FieldLabel tooltip="Manchete principal da notícia. Aparece no site, na home, nos compartilhamentos e nos resultados de busca.">
            Título
          </FieldLabel>
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
          <FieldLabel tooltip="Linha de apoio exibida abaixo do título. Opcional, mas recomendada para dar mais contexto ao leitor.">
            Subtítulo
          </FieldLabel>
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={inputClass} />
        </div>
        <div>
          <FieldLabel tooltip="Parte final do endereço da matéria (ex: /politica/nome-da-noticia). Gerado automaticamente a partir do título; edite apenas se precisar de uma URL específica.">
            Slug (URL)
          </FieldLabel>
          <input required value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
        </div>
        <div>
          <FieldLabel tooltip="Palavras-chave separadas por vírgula (ex: eleições, câmara, vereador). Ajudam na organização interna e no SEO da matéria.">
            Tags (vírgula)
          </FieldLabel>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} />
        </div>
      </div>

      <ImageUpload
        value={coverImage}
        onChange={setCoverImage}
        label="Capa"
        tooltip="Imagem principal obrigatória da matéria. Aparece na listagem, na home, na página da notícia e ao compartilhar em redes sociais. Use JPG, PNG ou WebP (máx. 2 MB)."
      />

      <div>
        <FieldLabel tooltip="Crédito ou descrição exibida abaixo da foto de capa na página da notícia (ex: Foto: João Silva / Agência).">
          Legenda da capa
        </FieldLabel>
        <input value={coverCaption} onChange={(e) => setCoverCaption(e.target.value)} className={inputClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel tooltip="Categoria editorial onde a matéria será publicada. Define o menu, a cor do badge e a URL base (ex: /politica/...).">
            Editoria
          </FieldLabel>
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
          <FieldLabel tooltip="Jornalista ou colunista creditado na matéria. O nome e a foto aparecem no topo e no rodapé da notícia.">
            Autor
          </FieldLabel>
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
          <FieldLabel tooltip="Rascunho: invisível no site. Publicado: visível imediatamente. Agendado: só aparece após a data de publicação definida abaixo.">
            Status
          </FieldLabel>
          <select value={status} onChange={(e) => setStatus(e.target.value as PostStatus)} className={inputClass}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="scheduled">Agendado</option>
          </select>
        </div>
        <div>
          <FieldLabel tooltip="Posição especial na página inicial. Manchete: destaque principal. Secundário: bloco ao lado. Carrossel: faixa de opinião/destaques. Use 'Nenhum' para matérias comuns.">
            Destaque na Home
          </FieldLabel>
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
          <FieldLabel tooltip="Data e hora exibidas no site e usadas para ordenar as matérias. Para agendar, escolha status 'Agendado' e defina uma data futura.">
            Data de publicação
          </FieldLabel>
          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <FieldLabel tooltip="Corpo da matéria em HTML. Use parágrafos (&lt;p&gt;), títulos (&lt;h2&gt;, &lt;h3&gt;), listas e links. Anúncios são inseridos automaticamente após o 3º e 7º parágrafos.">
          Conteúdo (HTML)
        </FieldLabel>
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
