-- Zera views fictícias do seed.sql; visitas reais acumulam via increment_post_views.
update public.posts set views_count = 0;
