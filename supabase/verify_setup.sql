-- Read-only check of the Naturals Beauty Academy database setup.
-- Supabase → SQL Editor → New query → paste → Run. Changes nothing.
-- Every row should say PASS. Run it after setup_all.sql, and again after adding your admin.

select check_name, case when ok then 'PASS' else 'FAIL' end as result, detail
from (
  select 1 as n, 'Table public.enquiries exists' as check_name, to_regclass('public.enquiries') is not null as ok, '' as detail
  union all select 2, 'Table public.courses exists', to_regclass('public.courses') is not null, ''
  union all select 3, 'Table public.admin_users exists', to_regclass('public.admin_users') is not null, ''
  union all select 4, 'Function public.is_admin() exists', to_regprocedure('public.is_admin()') is not null, ''
  union all select 5, 'RLS enabled on enquiries, courses, admin_users',
    (select count(*) = 3 from pg_class c join pg_namespace s on s.oid = c.relnamespace
      where s.nspname = 'public' and c.relname in ('enquiries', 'courses', 'admin_users') and c.relrowsecurity),
    ''
  union all select 6, 'Policies on courses (1 public read + 4 admin)',
    (select count(*) = 5 from pg_policies where schemaname = 'public' and tablename = 'courses'),
    (select count(*)::text || ' found' from pg_policies where schemaname = 'public' and tablename = 'courses')
  union all select 7, 'Policies on enquiries (1 public insert + 3 admin)',
    (select count(*) = 4 from pg_policies where schemaname = 'public' and tablename = 'enquiries'),
    (select count(*)::text || ' found' from pg_policies where schemaname = 'public' and tablename = 'enquiries')
  union all select 8, 'Visitors cannot write courses',
    not (has_table_privilege('anon', 'public.courses', 'insert') or has_table_privilege('anon', 'public.courses', 'update') or has_table_privilege('anon', 'public.courses', 'delete')),
    ''
  union all select 9, 'Visitors cannot read enquiries',
    not has_table_privilege('anon', 'public.enquiries', 'select'),
    ''
  union all select 10, 'Visitors cannot call is_admin()',
    not has_function_privilege('anon', 'public.is_admin()', 'execute'),
    ''
  union all select 11, 'Courses imported (20 expected)',
    (select count(*) >= 20 from public.courses),
    (select count(*)::text || ' courses, ' || count(*) filter (where is_published)::text || ' published' from public.courses)
  union all select 12, 'At least one admin configured',
    (select count(*) >= 1 from public.admin_users),
    (select coalesce(string_agg(u.email || ' (' || a.role || ')', ', '), 'none — run the admin_users insert') from public.admin_users a join auth.users u on u.id = a.user_id)
) checks
order by n;
