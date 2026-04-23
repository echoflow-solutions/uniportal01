-- Soft-delete / recycle-bin for demo_sessions.
-- Sessions are moved to the bin by setting deleted_at.
-- Items older than 30 days in the bin are purged lazily by the API.

alter table public.demo_sessions
  add column if not exists deleted_at timestamptz;

-- Partial index to keep active-list queries fast.
create index if not exists demo_sessions_active_idx
  on public.demo_sessions (session_started_at desc)
  where deleted_at is null;

-- Index for trash-list queries ordered by when the item was binned.
create index if not exists demo_sessions_trash_idx
  on public.demo_sessions (deleted_at desc)
  where deleted_at is not null;
