import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type EditorialRole = 'admin' | 'editor';

export interface EditorialUser {
  id: string;
  email: string;
  role: EditorialRole;
}

function parseRole(appMetadata: Record<string, unknown> | undefined): EditorialRole | null {
  const role = appMetadata?.role;
  if (role === 'admin' || role === 'editor') {
    return role;
  }
  return null;
}

/** Retorna o usuário editorial logado ou null. */
export async function getEditorialUser(): Promise<EditorialUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user?.email) {
    return null;
  }

  const role = parseRole(data.user.app_metadata as Record<string, unknown> | undefined);
  if (!role) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email,
    role,
  };
}

/** Exige usuário editorial; redireciona para login se ausente. */
export async function requireEditorialUser(): Promise<EditorialUser> {
  const user = await getEditorialUser();
  if (!user) {
    redirect('/admin/login');
  }
  return user;
}

/** Checa role a partir do JWT (uso no proxy). */
export function getEditorialRoleFromClaims(
  claims: Record<string, unknown> | null | undefined
): EditorialRole | null {
  if (!claims) return null;
  const appMetadata = claims.app_metadata as Record<string, unknown> | undefined;
  return parseRole(appMetadata);
}
