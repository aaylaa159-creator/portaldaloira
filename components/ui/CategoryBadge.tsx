import Link from 'next/link';
import type { Category } from '@/lib/types';

interface CategoryBadgeProps {
  category: Pick<Category, 'name' | 'slug' | 'color_code'>;
  size?: 'sm' | 'md';
  /**
   * Quando o selo está dentro de um card que já é um link (<a>),
   * deve renderizar como <span> — HTML proíbe <a> aninhado em <a>.
   */
  linked?: boolean;
}

export function CategoryBadge({
  category,
  size = 'sm',
  linked = true,
}: CategoryBadgeProps) {
  const sizeClasses =
    size === 'md' ? 'text-sm px-3 py-1' : 'text-xs px-2 py-0.5';
  const baseClasses = `inline-block font-display font-bold uppercase tracking-wide text-white rounded ${sizeClasses}`;
  const backgroundColor = category.color_code ?? '#7C22B8';

  if (!linked) {
    return (
      <span className={baseClasses} style={{ backgroundColor }}>
        {category.name}
      </span>
    );
  }

  return (
    <Link
      href={`/editoria/${category.slug}`}
      className={`${baseClasses} transition-opacity hover:opacity-85`}
      style={{ backgroundColor }}
    >
      {category.name}
    </Link>
  );
}
