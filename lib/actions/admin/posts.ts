'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireEditorialUser } from '@/lib/auth/editorial';
import { slugify } from '@/lib/slug';
import { normalizePostPublication } from '@/lib/posts/publication';
import type { FeaturedPosition, PostStatus } from '@/lib/types';

export interface PostFormInput {
  title: string;
  subtitle?: string;
  slug: string;
  content: string;
  cover_image: string;
  cover_caption?: string;
  author_id: string;
  category_id: string;
  tags: string;
  status: PostStatus;
  featured_position: FeaturedPosition;
  published_at: string;
}

function parseTags(tags: string): string[] {
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function revalidatePostPaths(categorySlug?: string, postSlug?: string) {
  revalidatePath('/');
  if (categorySlug) {
    revalidatePath(`/editoria/${categorySlug}`);
    if (postSlug) {
      revalidatePath(`/${categorySlug}/${postSlug}`);
    }
  }
  revalidatePath('/admin/posts');
  revalidatePath('/admin');
  revalidatePath('/admin/analytics');
}

function getCategorySlug(category: unknown): string | undefined {
  if (!category || typeof category !== 'object') return undefined;
  const slug = (category as { slug?: string }).slug;
  return typeof slug === 'string' ? slug : undefined;
}

export async function createPost(input: PostFormInput) {
  await requireEditorialUser();
  const supabase = await createClient();

  const slug = input.slug || slugify(input.title);
  const publication = normalizePostPublication(input.status, input.published_at);
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: input.title,
      subtitle: input.subtitle || null,
      slug,
      content: input.content,
      cover_image: input.cover_image,
      cover_caption: input.cover_caption || null,
      author_id: input.author_id,
      category_id: input.category_id,
      tags: parseTags(input.tags),
      status: publication.status,
      featured_position: input.featured_position,
      published_at: publication.published_at,
    })
    .select('id, slug, category:categories!inner ( slug )')
    .single();

  if (error) {
    return { error: error.message };
  }

  const categorySlug = getCategorySlug(data.category);
  revalidatePostPaths(categorySlug, data.slug);
  return { id: data.id };
}

export async function updatePost(id: string, input: PostFormInput) {
  await requireEditorialUser();
  const supabase = await createClient();

  const publication = normalizePostPublication(input.status, input.published_at);
  const { data, error } = await supabase
    .from('posts')
    .update({
      title: input.title,
      subtitle: input.subtitle || null,
      slug: input.slug,
      content: input.content,
      cover_image: input.cover_image,
      cover_caption: input.cover_caption || null,
      author_id: input.author_id,
      category_id: input.category_id,
      tags: parseTags(input.tags),
      status: publication.status,
      featured_position: input.featured_position,
      published_at: publication.published_at,
    })
    .eq('id', id)
    .select('slug, category:categories!inner ( slug )')
    .single();

  if (error) {
    return { error: error.message };
  }

  const categorySlug = getCategorySlug(data.category);
  revalidatePostPaths(categorySlug, data.slug);
  return { ok: true };
}

export async function deletePost(id: string) {
  await requireEditorialUser();
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('posts')
    .select('slug, category:categories!inner ( slug )')
    .eq('id', id)
    .single();

  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) {
    return { error: error.message };
  }

  if (post) {
    const categorySlug = getCategorySlug(post.category);
    revalidatePostPaths(categorySlug, post.slug);
  } else {
    revalidatePostPaths();
  }
  return { ok: true };
}
