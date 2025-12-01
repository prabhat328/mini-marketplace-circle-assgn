-- Create a table for public profiles (optional, but good for storing extra user data like phone)
-- We will link this to auth.users
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique,
  name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on users
alter table public.users enable row level security;

-- Policies for users
create policy "Public profiles are viewable by everyone."
  on public.users for select
  using ( true );

create policy "Users can insert their own profile."
  on public.users for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.users for update
  using ( auth.uid() = id );

-- Create products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric not null,
  category text,
  images text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on products
alter table public.products enable row level security;

-- Policies for products
create policy "Products are viewable by everyone."
  on public.products for select
  using ( true );

create policy "Authenticated users can insert products."
  on public.products for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own products."
  on public.products for update
  using ( auth.uid() = user_id );

create policy "Users can delete own products."
  on public.products for delete
  using ( auth.uid() = user_id );

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage Bucket Setup (Instructional)
-- 1. Create a new bucket called 'product-images'
-- 2. Set it to public
-- 3. Add policy: "Give users access to own folder 1cc6d_0" -> (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1])
--    OR simpler for this demo:
--    INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
--    CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'product-images' );
--    CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
