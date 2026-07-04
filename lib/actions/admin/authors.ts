'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireEditorialUser } from '@/lib/auth/editorial';
import { slugify } from '@/lib/slug';
import type { AuthorRole } from '@/lib/types';

export interface AuthorFormInput {
  name: string;
  slug: string;
  bio?: string;
  role: AuthorRole;
  instagram?: string;
  twitter?: string;
  email?: string;
  avatar_url?: string;
  user_id?: string;
}

export async function createAuthor(input: AuthorFormInput) {
  await requireEditorialUser();
  const supabase = await createClient();

  const { error } = await supabase.from('authors').insert({
    name: input.name,
    slug: input.slug || slugify(input.name),
    bio: input.bio || null,
    role: input.role,
    instagram: input.instagram || null,
    twitter: input.twitter || null,
    email: input.email || null,
    avatar_url: input.avatar_url || null,
    user_id: input.user_id || null,
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/autores');
  return { ok: true };
}

export async function updateAuthor(id: string, input: AuthorFormInput) {
  await requireEditorialUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from('authors')
    .update({
      name: input.name,
      slug: input.slug,
      bio: input.bio || null,
      role: input.role,
      instagram: input.instagram || null,
      twitter: input.twitter || null,
      email: input.email || null,
      avatar_url: input.avatar_url || null,
      user_id: input.user_id || null,
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/autores');
  return { ok: true };
}

export async function deleteAuthor(id: string) {
  await requireEditorialUser();
  const supabase = await createClient();

  const { count } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', id);

  if ((count ?? 0) > 0) {
    return { error: 'Este autor possui notícias vinculadas.' };
  }

  const { error } = await supabase.from('authors').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/autores');
  return { ok: true };
}
