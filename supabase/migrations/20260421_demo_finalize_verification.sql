-- Pre-submit verification fields for the writing-integrity demo.
-- Adds finalize_{status,verdict,questions,completed_at} columns to demo_sessions
-- and extends the session_status check to include 'submitted'.

alter table public.demo_sessions
  add column if not exists finalize_status text,
  add column if not exists finalize_verdict text,
  add column if not exists finalize_questions jsonb,
  add column if not exists finalize_completed_at timestamptz;

comment on column public.demo_sessions.finalize_questions is
  'Array of { passageIndex, passageText, question, excerpt, difficulty, source, answer, score, confidence, feedback, correct }';

-- finalize_status check: null means not yet submitted.
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'demo_sessions_finalize_status_check'
      and conrelid = 'public.demo_sessions'::regclass
  ) then
    alter table public.demo_sessions
      drop constraint demo_sessions_finalize_status_check;
  end if;

  alter table public.demo_sessions
    add constraint demo_sessions_finalize_status_check
    check (finalize_status is null or finalize_status in ('pending', 'completed', 'skipped'));
end $$;

-- finalize_verdict check: null when finalize_status is null or 'pending'.
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'demo_sessions_finalize_verdict_check'
      and conrelid = 'public.demo_sessions'::regclass
  ) then
    alter table public.demo_sessions
      drop constraint demo_sessions_finalize_verdict_check;
  end if;

  alter table public.demo_sessions
    add constraint demo_sessions_finalize_verdict_check
    check (finalize_verdict is null or finalize_verdict in ('verified', 'review', 'flagged', 'skipped'));
end $$;

-- Extend session_status to include 'submitted' (distinct from 'completed'
-- which is used for Save & Exit).
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'demo_sessions_session_status_check'
      and conrelid = 'public.demo_sessions'::regclass
  ) then
    alter table public.demo_sessions
      drop constraint demo_sessions_session_status_check;
  end if;

  alter table public.demo_sessions
    add constraint demo_sessions_session_status_check
    check (session_status in ('active', 'completed', 'abandoned', 'submitted'));
end $$;

-- Partial index to keep Dean-review queries over finalized sessions fast.
create index if not exists demo_sessions_finalize_verdict_idx
  on public.demo_sessions (finalize_verdict)
  where finalize_verdict is not null;
