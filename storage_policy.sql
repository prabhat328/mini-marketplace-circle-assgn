-- 1. Create the 'product-images' bucket and set it to public
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 2. Allow public access to view images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'product-images' );

-- 3. Allow authenticated users to upload images
create policy "Auth Upload"
on storage.objects for insert
with check ( bucket_id = 'product-images' and auth.role() = 'authenticated' );
