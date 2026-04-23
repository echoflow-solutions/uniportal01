create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.demo_sessions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  assignment_name text not null,
  unit_name text not null,
  session_started_at timestamptz not null default now(),
  session_ended_at timestamptz,
  session_status text not null default 'active' check (session_status in ('active', 'completed', 'abandoned')),
  content_html text not null default '',
  word_count integer not null default 0,
  typed_words integer not null default 0,
  pasted_words integer not null default 0,
  pasted_chars integer not null default 0,
  paste_events integer not null default 0,
  checks_triggered integer not null default 0,
  checks_completed integer not null default 0,
  current_check_state text not null default 'idle',
  last_prompt_quote text,
  last_prompt_question text,
  last_pasted_text text,
  last_outcome_score integer,
  last_outcome_confidence text,
  last_outcome_feedback text,
  minutes_active integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.demo_session_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.demo_sessions(id) on delete cascade,
  kind text not null,
  message text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.demo_session_checks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.demo_sessions(id) on delete cascade,
  status text not null default 'warning' check (status in ('scheduled', 'warning', 'active', 'completed', 'expired')),
  prompt_quote text not null,
  prompt_question text not null,
  pasted_text text not null,
  answer_text text,
  score integer,
  confidence text,
  feedback text,
  follow_up boolean,
  warning_seconds integer not null default 10,
  duration_seconds integer,
  warning_started_at timestamptz,
  started_at timestamptz,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists demo_sessions_started_at_idx
  on public.demo_sessions (session_started_at desc);

create index if not exists demo_session_events_session_created_idx
  on public.demo_session_events (session_id, created_at desc);

create index if not exists demo_session_checks_session_created_idx
  on public.demo_session_checks (session_id, created_at desc);

drop trigger if exists demo_sessions_set_updated_at on public.demo_sessions;
create trigger demo_sessions_set_updated_at
before update on public.demo_sessions
for each row
execute function public.set_updated_at();

drop trigger if exists demo_session_checks_set_updated_at on public.demo_session_checks;
create trigger demo_session_checks_set_updated_at
before update on public.demo_session_checks
for each row
execute function public.set_updated_at();

alter table public.demo_sessions enable row level security;
alter table public.demo_session_events enable row level security;
alter table public.demo_session_checks enable row level security;
