-- ============================================================
-- Ali Zawad Studio — Supabase schema
-- Run this once in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. PROFILES (extends Supabase auth.users with role + display info)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  company text,
  role text not null default 'client' check (role in ('client','admin')),
  created_at timestamptz default now()
);

-- 2. PROJECTS (one client can have many; admin sees all)
create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles(id) on delete cascade,
  title text not null,
  stage text not null default 'discovery' check (stage in ('discovery','design','build','delivered')),
  progress int not null default 0,
  target_delivery date,
  created_at timestamptz default now()
);

-- 3. MILESTONES (belong to a project)
create table milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  due_date date,
  done boolean default false,
  sort_order int default 0
);

-- 4. MESSAGES (project thread between client and admin)
create table messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  sender_id uuid references profiles(id),
  body text not null,
  created_at timestamptz default now()
);

-- 5. INVOICES
create table invoices (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  label text not null,
  amount_cents int not null,
  status text not null default 'due' check (status in ('due','paid')),
  created_at timestamptz default now()
);

-- 6. FILES (metadata only here; actual files go in Supabase Storage bucket "project-files")
create table project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  size_bytes bigint,
  uploaded_at timestamptz default now()
);

-- 7. LEADS (contact form / chatbot enquiries — admin only)
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  budget text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz default now()
);

-- 8. TESTIMONIALS (client-submitted, admin-approved, shown on public site)
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles(id),
  quote text not null,
  stars int default 5 check (stars between 1 and 5),
  approved boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles enable row level security;
alter table projects enable row level security;
alter table milestones enable row level security;
alter table messages enable row level security;
alter table invoices enable row level security;
alter table project_files enable row level security;
alter table leads enable row level security;
alter table testimonials enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean language sql security definer stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- PROFILES: a user reads/updates their own row; admin reads all
create policy "profiles_self_select" on profiles for select using (id = auth.uid() or is_admin());
create policy "profiles_self_update" on profiles for update using (id = auth.uid());
create policy "profiles_self_insert" on profiles for insert with check (id = auth.uid());

-- PROJECTS: client sees their own; admin sees/manages all
create policy "projects_client_select" on projects for select using (client_id = auth.uid() or is_admin());
create policy "projects_admin_write" on projects for insert with check (is_admin());
create policy "projects_admin_update" on projects for update using (is_admin());
create policy "projects_admin_delete" on projects for delete using (is_admin());

-- MILESTONES: visible if you can see the parent project
create policy "milestones_select" on milestones for select using (
  exists (select 1 from projects p where p.id = project_id and (p.client_id = auth.uid() or is_admin()))
);
create policy "milestones_admin_write" on milestones for insert with check (is_admin());
create policy "milestones_admin_update" on milestones for update using (is_admin());

-- MESSAGES: client can read/write on own project; admin on all
create policy "messages_select" on messages for select using (
  exists (select 1 from projects p where p.id = project_id and (p.client_id = auth.uid() or is_admin()))
);
create policy "messages_insert" on messages for insert with check (
  sender_id = auth.uid() and
  exists (select 1 from projects p where p.id = project_id and (p.client_id = auth.uid() or is_admin()))
);

-- INVOICES: client reads own; admin manages all
create policy "invoices_select" on invoices for select using (
  exists (select 1 from projects p where p.id = project_id and (p.client_id = auth.uid() or is_admin()))
);
create policy "invoices_admin_write" on invoices for insert with check (is_admin());
create policy "invoices_admin_update" on invoices for update using (is_admin());

-- FILES: client reads own; admin manages all
create policy "files_select" on project_files for select using (
  exists (select 1 from projects p where p.id = project_id and (p.client_id = auth.uid() or is_admin()))
);
create policy "files_admin_write" on project_files for insert with check (is_admin());

-- LEADS: admin only
create policy "leads_admin_all" on leads for all using (is_admin()) with check (is_admin());
-- allow public/anon contact-form inserts from the marketing site
create policy "leads_public_insert" on leads for insert with check (true);

-- TESTIMONIALS: anyone can read approved ones (for the public site); client manages own; admin manages all
create policy "testimonials_public_select" on testimonials for select using (approved = true or client_id = auth.uid() or is_admin());
create policy "testimonials_client_insert" on testimonials for insert with check (client_id = auth.uid());
create policy "testimonials_admin_update" on testimonials for update using (is_admin());

-- ============================================================
-- Auto-create a profile row whenever a new auth user signs up
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'client');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- To make yourself (Ali) an admin after signing up once via the
-- portal, run this manually (replace with your real email):
--
-- update profiles set role = 'admin' where email = 'ali@example.com';
-- ============================================================