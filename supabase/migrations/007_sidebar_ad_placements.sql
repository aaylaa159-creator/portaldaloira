-- Novos espaços publicitários na sidebar (skyscraper + cards laterais).

alter table public.ad_banners
  drop constraint if exists ad_banners_placement_check;

alter table public.ad_banners
  add constraint ad_banners_placement_check
  check (placement in (
    'header_top',
    'sidebar_right',
    'sidebar_skyscraper',
    'sidebar_card_1',
    'sidebar_card_2',
    'in_content_1',
    'in_content_2',
    'popup_overlay'
  ));
