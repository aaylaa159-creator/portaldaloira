'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slug';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryFormInput,
} from '@/lib/actions/admin/categories';
import type { Category } from '@/lib/types';

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600';

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [colorCode, setColorCode] = useState(category?.color_code ?? '#7C22B8');
  const [displayOrder, setDisplayOrder] = useState(category?.display_order ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const input: CategoryFormInput = {
      name,
      slug: slug || slugify(name),
      color_code: colorCode,
      display_order: displayOrder,
    };

    const result = category
      ? await updateCategory(category.id, input)
      : await createCategory(input);

    if ('error' in result && result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push('/admin/categorias');
    router.refresh();
  }

  async function handleDelete() {
    if (!category || !confirm('Excluir esta editoria?')) return;
    const result = await deleteCategory(category.id);
    if ('error' in result && result.error) {
      setError(result.error);
      return;
    }
    router.push('/admin/categorias');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Nome</label>
        <input
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!category) setSlug(slugify(e.target.value));
          }}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>
        <input required value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Cor</label>
        <input type="color" value={colorCode} onChange={(e) => setColorCode(e.target.value)} className="h-10 w-20" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Ordem no menu</label>
        <input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(Number(e.target.value))}
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
        {category ? (
          <button type="button" onClick={handleDelete} className="text-sm text-red-600">
            Excluir
          </button>
        ) : null}
      </div>
    </form>
  );
}
