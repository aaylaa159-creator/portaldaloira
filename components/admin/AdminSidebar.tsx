'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FieldTooltip } from '@/components/admin/FieldTooltip';
import { createClient } from '@/lib/supabase/client';
import type { EditorialUser } from '@/lib/auth/editorial';

const NAV: { href: string; label: string; tooltip: string; exact?: boolean }[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    tooltip: 'Visão geral com totais de matérias, rascunhos e visualizações.',
    exact: true,
  },
  {
    href: '/admin/posts',
    label: 'Notícias',
    tooltip: 'Criar, editar e publicar matérias do portal.',
  },
  {
    href: '/admin/categorias',
    label: 'Editorias',
    tooltip: 'Gerenciar seções do site (Política, Esportes, etc.) e ordem no menu.',
  },
  {
    href: '/admin/autores',
    label: 'Autores',
    tooltip: 'Cadastrar jornalistas, colunistas e editores creditados nas matérias.',
  },
  {
    href: '/admin/banners',
    label: 'Banners',
    tooltip: 'Configurar anúncios e publicidade nos espaços do site.',
  },
  {
    href: '/admin/analytics',
    label: 'Acessos',
    tooltip: 'Relatório de visualizações das matérias publicadas no portal.',
  },
];

interface AdminSidebarProps {
  user: EditorialUser;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-5">
        <Link href="/admin" className="font-display text-lg font-bold text-brand-600">
          Redação
        </Link>
        <p className="mt-1 truncate text-xs text-gray-500">{user.email}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="rounded bg-brand-600/10 px-2 py-0.5 text-xs font-medium text-brand-600">
            {user.role}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="admin-logout-btn rounded px-3 py-1.5 text-xs font-bold text-white transition-[background-color] duration-200"
          >
            Sair
          </button>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <div
              key={item.href}
              className={`flex items-center gap-1 rounded-lg pr-2 transition ${
                active ? 'bg-brand-600' : 'hover:bg-gray-100'
              }`}
            >
              <Link
                href={item.href}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                  active ? 'text-white' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Link>
              <span className={active ? '[&_button]:border-white/40 [&_button]:bg-white/10 [&_button]:text-white' : ''}>
                <FieldTooltip content={item.tooltip} />
              </span>
            </div>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-gray-200 p-3">
        <Link
          href="/"
          target="_blank"
          className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          Ver site ↗
        </Link>
      </div>
    </aside>
  );
}
