'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { EditorialUser } from '@/lib/auth/editorial';

const NAV = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/posts', label: 'Notícias' },
  { href: '/admin/categorias', label: 'Editorias' },
  { href: '/admin/autores', label: 'Autores' },
  { href: '/admin/banners', label: 'Banners' },
  { href: '/admin/analytics', label: 'Acessos' },
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
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
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
