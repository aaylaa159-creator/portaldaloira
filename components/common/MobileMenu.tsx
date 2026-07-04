'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/types';

interface MobileMenuProps {
  categories: Category[];
}

export function MobileMenu({ categories }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open ? (
        <nav
          aria-label="Menu de editorias"
          className="absolute inset-x-0 top-full z-50 border-t border-white/10 bg-brand-900 shadow-xl"
        >
          <ul className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/editoria/${category.slug}`}
                  onClick={() => setOpen(false)}
                  className="block border-b border-white/10 py-3 font-display font-bold uppercase tracking-wide text-white last:border-0 hover:text-accent-400"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
