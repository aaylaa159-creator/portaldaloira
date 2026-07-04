/**
 * Tipagens centrais do Portal da Loira.
 * Espelham o schema do banco (Supabase/PostgreSQL), que usa snake_case.
 */

export type AuthorRole = "journalist" | "columnist" | "editor";

export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar_url: string | null;
  bio: string | null;
  role: AuthorRole;
  instagram: string | null;
  twitter: string | null;
  email: string | null;
  user_id?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color_code: string | null;
  display_order: number;
}

export type PostStatus = "draft" | "published" | "scheduled";

export type FeaturedPosition = "main" | "secondary" | "carousel" | "none";

export interface Post {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  content: string;
  cover_image: string;
  cover_caption: string | null;
  author_id: string;
  category_id: string;
  tags: string[];
  status: PostStatus;
  published_at: string;
  views_count: number;
  allow_comments: boolean;
  featured_position: FeaturedPosition;
  created_at: string;
  updated_at: string;
}

/** Post com os relacionamentos expandidos (join de autor e categoria). */
export interface PostWithRelations extends Post {
  author: Author;
  category: Category;
}

/** Versão resumida para listagens (cards, sidebars, grades). */
export interface PostSummary {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  cover_image: string;
  published_at: string;
  views_count: number;
  featured_position: FeaturedPosition;
  category: Category;
  author: Pick<Author, "id" | "name" | "slug" | "avatar_url" | "role">;
}

export type AdPlacement =
  | "header_top"
  | "sidebar_right"
  | "in_content_1"
  | "in_content_2"
  | "popup_overlay";

export type AdType = "image" | "script";

export interface AdBanner {
  id: string;
  placement: AdPlacement;
  type: AdType;
  image_url: string | null;
  target_url: string | null;
  script_code: string | null;
  active: boolean;
  expires_at: string | null;
}
