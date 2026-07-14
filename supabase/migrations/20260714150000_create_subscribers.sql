-- Suscriptores del Club de Amigos (Mercado Pago)
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  mp_preapproval_id text not null unique,
  mp_plan_id text,
  payer_email text,
  payer_id text,
  status text not null,
  reason text,
  transaction_amount numeric(12, 2),
  currency_id text default 'ARS',
  next_payment_date timestamptz,
  last_payment_id text,
  last_payment_status text,
  last_payment_at timestamptz,
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscribers_status_idx on public.subscribers (status);
create index if not exists subscribers_payer_email_idx on public.subscribers (payer_email);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscribers_set_updated_at on public.subscribers;
create trigger subscribers_set_updated_at
  before update on public.subscribers
  for each row
  execute function public.set_updated_at();

alter table public.subscribers enable row level security;

-- Sin policies: solo service_role (backend) puede leer/escribir.
revoke all on public.subscribers from anon, authenticated;
grant all on public.subscribers to service_role;
