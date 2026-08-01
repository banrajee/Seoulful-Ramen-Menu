-- Run this once in Supabase SQL Editor to attach the Shin Ramyeon packet image.

update public.menu_items
set image_url = '/ramen-shin-ramyeon.png'
where lower(trim(name)) in (
  'nongshim shin ramyeon',
  'shin ramyeon',
  'shin ramen',
  'shin ramyun'
);
