import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createProofSignedUrl,
  isTransferSubscriber,
} from "@/lib/transfer";
import { Logo } from "@/components/Logo";
import { LoginForm } from "./login-form";
import { logoutAdmin } from "./actions";
import { SubscribersLedger, type Subscriber } from "./subscribers-ledger";

export const dynamic = "force-dynamic";

const ACTIVE_STATUSES = new Set(["authorized", "approved"]);

async function loadSubscribers(): Promise<{
  rows: Subscriber[];
  error: string | null;
}> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("subscribers")
      .select(
        "id, payer_email, status, transaction_amount, currency_id, next_payment_date, last_payment_status, last_payment_at, mp_preapproval_id, raw, created_at, updated_at",
      )
      .order("created_at", { ascending: false });

    if (error) return { rows: [], error: error.message };

    const rows = await Promise.all(
      ((data ?? []) as Subscriber[]).map(async (row) => {
        const path = row.raw?.proof_path;
        if (!isTransferSubscriber(row) || !path) return row;
        try {
          const proofUrl = await createProofSignedUrl(path);
          return { ...row, proofUrl };
        } catch {
          return { ...row, proofUrl: null };
        }
      }),
    );

    return { rows, error: null };
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
              Cuando alguien se sume por Mercado Pago o transferencia, su aporte
              aparece acá.
            </p>
          </div>
        ) : (
          <SubscribersLedger rows={rows} />
        )}
      </div>
    </main>
  );
}
