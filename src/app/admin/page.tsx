import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Logo } from "@/components/Logo";
import { LoginForm } from "./login-form";
import { logoutAdmin } from "./actions";

export const dynamic = "force-dynamic";

type Subscriber = {
  id: string;
  payer_email: string | null;
  status: string;
  transaction_amount: number | null;
  currency_id: string | null;
  next_payment_date: string | null;
  last_payment_status: string | null;
  last_payment_at: string | null;
  mp_preapproval_id: string;
  created_at: string;
  updated_at: string;
};

const ACTIVE_STATUSES = new Set(["authorized", "approved"]);

function formatMoney(amount: number | null, currency: string | null) {
  if (amount == null) return "—";
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency || "ARS",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount}`;
  }
}

function formatDate(value: string | null, withTime = false) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(
    "es-AR",
    withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" },
  ).format(d);
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    authorized: "Activa",
    approved: "Aprobada",
    pending: "Pendiente",
    paused: "Pausada",
    cancelled: "Cancelada",
    canceled: "Cancelada",
  };
  return map[status] ?? status;
}

function spineClass(status: string) {
  if (ACTIVE_STATUSES.has(status)) return "bg-miel";
  if (status === "pending") return "bg-tierra";
  if (status === "paused") return "bg-white/40";
  return "bg-tierra/55";
}

async function loadSubscribers(): Promise<{
  rows: Subscriber[];
  error: string | null;
}> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("subscribers")
      .select(
        "id, payer_email, status, transaction_amount, currency_id, next_payment_date, last_payment_status, last_payment_at, mp_preapproval_id, created_at, updated_at",
      )
      .order("created_at", { ascending: false });

    if (error) return { rows: [], error: error.message };
    return { rows: (data ?? []) as Subscriber[], error: null };
  } catch (e) {
    return {
      rows: [],
      error: e instanceof Error ? e.message : "No se pudo cargar el registro",
    };
  }
}

function LoginView() {
  return (
    <main className="relative flex min-h-dvh overflow-hidden bg-[var(--admin-forest)] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(232,164,74,0.22),transparent_45%),radial-gradient(ellipse_at_90%_85%,rgba(45,106,79,0.55),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full border border-white/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 h-56 w-56 rounded-full border border-miel/20"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col justify-center gap-12 px-6 py-16 sm:px-10 min-[900px]:flex-row min-[900px]:items-end min-[900px]:justify-between min-[900px]:gap-20 min-[900px]:py-20">
        <div className="admin-rise max-w-md">
          <Logo className="footer-logo sm:!text-[2.4rem]" showSubtitle={false} />
          <p className="mt-3 font-sans text-[0.62rem] font-semibold tracking-[2.5px] text-miel/80 uppercase [filter:none] [text-shadow:none]">
            Asociación Civil Casa Libertad
          </p>
          <h1 className="mt-10 mb-0 max-w-[12ch] font-display text-[clamp(2.4rem,6vw,3.6rem)] leading-[1.05] font-semibold text-white">
            Registro del Club
          </h1>
          <p className="mt-4 max-w-[34ch] text-[1.05rem] leading-relaxed text-[#dfe9e3]">
            Acá ves quién sostiene mes a mes a las familias que acompañamos.
          </p>
        </div>

        <div className="admin-rise-delay w-full max-w-sm border-t border-white/15 pt-8 min-[900px]:border-t-0 min-[900px]:border-l min-[900px]:pt-0 min-[900px]:pl-12">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

function LedgerRow({
  row,
  index,
}: {
  row: Subscriber;
  index: number;
}) {
  return (
    <article
      className="admin-ledger-row relative grid gap-3 border-b border-[var(--admin-rule)] py-4 pl-4 sm:grid-cols-[minmax(0,1.4fr)_auto_minmax(7rem,1fr)_minmax(7rem,1fr)] sm:items-baseline sm:gap-6 sm:pl-5"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <span
        aria-hidden
        className={`absolute top-3 bottom-3 left-0 w-[3px] rounded-full ${spineClass(row.status)}`}
      />

      <div className="min-w-0">
        <p className="m-0 truncate font-medium text-ink">
          {row.payer_email ?? "Sin email"}
        </p>
        <p className="m-0 mt-0.5 truncate font-mono text-[0.68rem] tracking-wide text-muted/80">
          {row.mp_preapproval_id}
        </p>
      </div>

      <div className="flex items-baseline gap-3 sm:flex-col sm:items-end sm:gap-0.5">
        <span
          className={`text-[0.72rem] font-bold tracking-[1.2px] uppercase ${
            ACTIVE_STATUSES.has(row.status)
              ? "text-verde"
              : row.status === "pending"
                ? "text-tierra"
                : "text-muted"
          }`}
        >
          {statusLabel(row.status)}
        </span>
        <span className="font-display text-[1.15rem] font-semibold tabular-nums tracking-tight text-ink sm:text-[1.25rem]">
          {formatMoney(row.transaction_amount, row.currency_id)}
        </span>
      </div>

      <div className="text-sm tabular-nums text-body">
        <p className="m-0 text-[0.68rem] font-bold tracking-[1px] text-muted uppercase">
          Próximo cobro
        </p>
        <p className="m-0 mt-0.5">{formatDate(row.next_payment_date)}</p>
      </div>

      <div className="text-sm tabular-nums text-body">
        <p className="m-0 text-[0.68rem] font-bold tracking-[1px] text-muted uppercase">
          Último pago
        </p>
        <p className="m-0 mt-0.5">{formatDate(row.last_payment_at, true)}</p>
        {row.last_payment_status ? (
          <p className="m-0 mt-0.5 text-[0.75rem] text-muted">
            {row.last_payment_status}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return <LoginView />;
  }

  const { rows, error } = await loadSubscribers();
  const activeCount = rows.filter((r) => ACTIVE_STATUSES.has(r.status)).length;

  return (
    <main className="relative min-h-dvh bg-[var(--admin-paper)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(45,106,79,0.08),transparent_42%),radial-gradient(ellipse_at_100%_0%,rgba(232,164,74,0.12),transparent_40%)]"
      />

      <header className="relative z-10 border-b border-[var(--admin-rule)] bg-[var(--admin-forest)] text-white">
        <div className="mx-auto flex w-full max-w-5xl items-end justify-between gap-6 px-5 py-7 sm:px-8 sm:py-9">
          <div className="admin-fade min-w-0">
            <Logo className="footer-logo sm:!text-[2rem]" showSubtitle={false} />
            <h1 className="mt-5 mb-0 font-display text-[clamp(1.75rem,3.5vw,2.35rem)] leading-tight text-white">
              Registro del Club de Amigos
            </h1>
            <p className="mt-2 mb-0 max-w-[42ch] text-[0.95rem] text-[#dfe9e3]">
              {rows.length === 0 ? (
                "Todavía no hay altas cargadas."
              ) : (
                <>
                  Hoy hay{" "}
                  <span className="font-display text-[1.15em] font-semibold text-miel tabular-nums">
                    {activeCount}
                  </span>{" "}
                  {activeCount === 1 ? "amigo activo" : "amigos activos"}
                  {rows.length !== activeCount ? (
                    <>
                      {" "}
                      de{" "}
                      <span className="tabular-nums text-white">{rows.length}</span>{" "}
                      en el registro
                    </>
                  ) : null}
                  .
                </>
              )}
            </p>
          </div>

          <form action={logoutAdmin} className="shrink-0 pb-0.5">
            <button
              type="submit"
              className="cursor-pointer rounded-full border border-white/30 bg-transparent px-4 py-2 text-sm font-bold text-white transition-[background-color,border-color] duration-150 hover:border-miel hover:bg-miel hover:text-ink"
            >
              Salir
            </button>
          </form>
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
        {error ? (
          <p
            className="border-l-[3px] border-tierra bg-tierra/10 px-4 py-3 text-sm text-tierra"
            role="alert"
          >
            No se pudo cargar el registro. Recargá la página.
            <span className="mt-1 block text-xs text-muted">{error}</span>
          </p>
        ) : rows.length === 0 ? (
          <div className="admin-rise border-t-2 border-double border-[var(--admin-moss)]/35 pt-8">
            <p className="m-0 font-display text-2xl text-ink">Nadie en el registro todavía</p>
            <p className="mt-2 max-w-[40ch] text-body">
              Cuando alguien se sume por Mercado Pago, su aporte aparece acá.
            </p>
          </div>
        ) : (
          <div className="admin-rise">
            <div className="mb-1 flex items-end justify-between gap-4 border-b-2 border-[var(--admin-moss)] pb-3">
              <p className="m-0 text-[0.72rem] font-bold tracking-[1.6px] text-verde uppercase">
                Amigos registrados
              </p>
              <p className="m-0 hidden text-[0.72rem] font-bold tracking-[1px] text-muted uppercase sm:block">
                Más recientes primero
              </p>
            </div>
            <div className="border-b border-[var(--admin-rule)]" aria-hidden />

            <div role="list" className="pt-1">
              {rows.map((row, index) => (
                <div key={row.id} role="listitem">
                  <LedgerRow row={row} index={index} />
                </div>
              ))}
            </div>

            <p className="mt-6 text-center font-chalk text-lg text-verde/70 sm:text-left">
              Cada aporte sostiene el acompañamiento en el tiempo.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
