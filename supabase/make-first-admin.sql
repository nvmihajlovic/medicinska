-- First create the user in Supabase Authentication, then replace the email below.
insert into public.school_admins (user_id)
select id
from auth.users
where lower(email) = lower('replace-with-admin-email@example.com')
on conflict (user_id) do nothing;
