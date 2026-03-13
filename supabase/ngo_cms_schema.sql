create table if not exists public.ngo_doctors (
  id uuid primary key default gen_random_uuid(),
  ngo_id uuid not null references public.ngos(id) on delete cascade,
  doctor_id uuid not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.ngo_donors (
  id uuid primary key default gen_random_uuid(),
  ngo_id uuid not null references public.ngos(id) on delete cascade,
  donor_id uuid not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.blog_images (
  id uuid primary key default gen_random_uuid(),
  ngo_id uuid not null references public.ngos(id) on delete cascade,
  image_url text not null,
  caption text,
  created_at timestamp with time zone default now()
);

create table if not exists public.ngo_blogs (
  id uuid primary key default gen_random_uuid(),
  ngo_id uuid not null references public.ngos(id) on delete cascade,
  title text not null,
  content text not null,
  cover_image text,
  created_at timestamp with time zone default now()
);

create index if not exists idx_ngo_doctors_ngo_id on public.ngo_doctors(ngo_id);
create index if not exists idx_ngo_donors_ngo_id on public.ngo_donors(ngo_id);
create index if not exists idx_blog_images_ngo_id on public.blog_images(ngo_id);
create index if not exists idx_ngo_blogs_ngo_id on public.ngo_blogs(ngo_id);
