-- anime_wise_sayings: 배경 이미지 URL (Tavily 등으로 수집한 장면/캐릭터 이미지)
alter table public.anime_wise_sayings
  add column if not exists image_url text;

comment on column public.anime_wise_sayings.image_url is 'Optional background image URL (e.g. anime scene or character image from Tavily search).';
