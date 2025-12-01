-- Backfill missing users from auth.users to public.users
insert into public.users (id, email)
select id, email from auth.users
where id not in (select id from public.users);
