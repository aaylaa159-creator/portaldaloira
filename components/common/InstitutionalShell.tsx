import type { ReactNode } from 'react';

interface InstitutionalShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  actions?: ReactNode;
}

/** Layout compartilhado das páginas institucionais (sobre, contato, anuncie). */
export function InstitutionalShell({
  title,
  subtitle,
  children,
  actions,
}: InstitutionalShellProps) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold text-brand-900 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-gray-500">{subtitle}</p>

      <article className="prose prose-slate mt-8 max-w-none prose-headings:font-display prose-a:text-brand-700 prose-a:no-underline hover:prose-a:text-accent-600 lg:prose-lg">
        {children}
      </article>

      {actions ? (
        <div className="mt-10 flex flex-wrap gap-3">{actions}</div>
      ) : null}
    </main>
  );
}
