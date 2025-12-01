# Supabase Storage Setup Guide

You have two options to set up the storage bucket and policies: **Option 1 (Recommended/Fastest)** using the SQL Editor, or **Option 2** using the Dashboard UI.

## Option 1: SQL Editor (Recommended)

This is the quickest way.

1.  Open your **Supabase Dashboard**.
2.  Go to the **SQL Editor** (icon on the left sidebar).
3.  Click **New Query**.
4.  Copy and paste the following SQL code:

```sql
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
```

5.  Click **Run**.

---

## Option 2: Dashboard UI (Manual)

If you prefer clicking through the interface:

### Step 1: Create Bucket
1.  Go to **Storage** in the left sidebar.
2.  Click **New Bucket**.
3.  Name the bucket: `product-images`.
4.  Toggle **Public bucket** to **ON**.
5.  Click **Save**.

### Step 2: Add Policies
1.  In the Storage page, click on the **Configuration** tab (or "Policies" depending on your view).
2.  Find your `product-images` bucket and click **New Policy** (or "New policy" under the bucket name).

#### Policy 1: Public Read Access
1.  Choose **"Get started quickly"** -> **"Give public access to a bucket"**.
2.  Select `SELECT` operation.
3.  Click **Review** and **Save**.

#### Policy 2: Authenticated Upload Access
1.  Click **New Policy** again.
2.  Choose **"Get started quickly"** -> **"Enable insert access for authenticated users"**.
3.  Select `INSERT` operation.
4.  Click **Review** and **Save**.
