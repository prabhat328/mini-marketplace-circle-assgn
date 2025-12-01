-- Update public.users with name and phone from auth.users metadata
update public.users
set
  name = auth.users.raw_user_meta_data->>'name',
  phone = auth.users.raw_user_meta_data->>'phone'
from auth.users
where public.users.id = auth.users.id
and public.users.name is null;
