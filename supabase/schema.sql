create extension if not exists "pgcrypto";

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('dog', 'cat')),
  name text not null,
  breed text not null,
  age text not null,
  gender text not null check (gender in ('公', '母')),
  weight text not null,
  vaccinated boolean not null default true,
  location text not null,
  distance text not null,
  tags text[] not null default '{}',
  image_url text not null,
  story text not null,
  health_status text not null,
  neutered_status text not null,
  requirements text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.adoption_applications (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  applicant_name text not null,
  applicant_phone text not null,
  city text not null,
  housing_type text not null check (housing_type in ('apartment', 'villa', 'rental')),
  has_yard boolean not null default false,
  experience_level text not null check (experience_level in ('first-time', 'experienced')),
  notes text not null,
  status text not null default '审核中' check (status in ('审核中', '资料待补充', '家访预定', '已确认')),
  progress integer not null default 15 check (progress between 0 and 100),
  created_at timestamptz not null default now()
);

alter table public.pets enable row level security;
alter table public.adoption_applications enable row level security;

drop policy if exists "pets are publicly readable" on public.pets;
create policy "pets are publicly readable"
  on public.pets
  for select
  using (true);

drop policy if exists "users can read own applications" on public.adoption_applications;
create policy "users can read own applications"
  on public.adoption_applications
  for select
  using (auth.uid() = user_id);

drop policy if exists "users can insert own applications" on public.adoption_applications;
create policy "users can insert own applications"
  on public.adoption_applications
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "users can update own applications" on public.adoption_applications;
create policy "users can update own applications"
  on public.adoption_applications
  for update
  using (auth.uid() = user_id);

insert into public.pets (
  category,
  name,
  breed,
  age,
  gender,
  weight,
  vaccinated,
  location,
  distance,
  tags,
  image_url,
  story,
  health_status,
  neutered_status,
  requirements
)
values
  (
    'dog',
    '布鲁诺',
    '金毛寻回犬',
    '2岁',
    '公',
    '28 kg',
    true,
    '上海市，徐汇区流浪动物保护中心',
    '2.4 km',
    array['已接种疫苗', '活泼亲人'],
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800',
    '布鲁诺曾在郊外流浪，经过救助后逐渐恢复了安全感。他喜欢奔跑、玩接球，也很享受安静地趴在脚边陪伴人。',
    '已完成体检与体内外驱虫，身体状况稳定。',
    '已绝育，恢复良好。',
    array['在上海有稳定住所，物业允许养犬', '承诺科学喂养，不离不弃', '同意接受定期线上回访']
  ),
  (
    'cat',
    '露娜',
    '英国短毛猫',
    '1岁',
    '母',
    '4.5 kg',
    true,
    '上海市，静安区宠物领养站',
    '0.8 km',
    array['已驱虫', '安静乖巧'],
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
    '露娜是一只很会观察人的猫咪，熟悉环境后会主动靠近，也喜欢在窗边安静地晒太阳。',
    '身体健康，基础疫苗已补齐。',
    '已绝育。',
    array['封窗领养', '按时接种疫苗', '不离不弃']
  )
on conflict do nothing;
