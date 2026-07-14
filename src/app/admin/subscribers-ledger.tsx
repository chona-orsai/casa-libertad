"use client";

import { useState, useTransition } from "react";
import { approveTransferSubscription } from "./actions";

export type SubscriberRaw = {
  payer_email?: string | null;
  payer_first_name?: string | null;
  payer_last_name?: string | null;
  payer_name?: string | null;
  payment_method?: string | null;
  proof_path?: string | null;
};

export type Subscriber = {
  id: string;
  payer_email: string | null;
  status: string;
  transaction_amount: number | null;
  currency_id: string | null;
  next_payment_date: string | null;
  last_payment_status: string | null;
  last_payment_at: string | null;
  mp_preapproval_id: string;
  raw: SubscriberRaw | null;
  created_at: string;
  updated_at: string;
  proofUrl?: string | null;
};

type StatusFilter = "all" | "aprobada" | "pendiente" | "cancelada";
type MethodFilter = "all" | "mercadopago" | "transfer";

const ACTIVE_STATUSES = new Set(["authorized", "approved"]);

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "aprobada", label: "Aprobadas" },
  { id: "pendiente", label: "Pendientes" },
  { id: "cancelada", label: "Canceladas" },
];

const METHOD_FILTERS: {
  id: MethodFilter;
  label: string;
  shortLabel: string;
}[] = [
  { id: "all", label: "Todos los medios", shortLabel: "Medios" },
  { id: "mercadopago", label: "Mercado Pago", shortLabel: "M. Pago" },
  { id: "transfer", label: "Transferencia", shortLabel: "Transfer." },
];

function isTransfer(row: Subscriber) {
  return (
    row.raw?.payment_method === "transfer" ||
    row.mp_preapproval_id.startsWith("transfer_")
  );
}

function MethodBadge({ transfer }: { transfer: boolean }) {
  return (
    <span
      className={`inline-block rounded-sm px-2 py-0.5 text-[0.68rem] font-bold tracking-[1.1px] uppercase ${
        transfer
          ? "bg-[var(--admin-wax)]/15 text-[var(--admin-wax)]"
          : "bg-[#009EE3]/12 text-[#0077b3]"
      }`}
    >
      {transfer ? "Transferencia" : "Mercado Pago"}
    </span>
  );
}

function payerFullName(row: Subscriber) {
  const named = row.raw?.payer_name?.trim();
  if (named) return named;
  const first = row.raw?.payer_first_name?.trim();
  const last = row.raw?.payer_last_name?.trim();
  const parts = [first, last].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
}

function payerEmail(row: Subscriber) {
  const fromCol = row.payer_email?.trim();
  if (fromCol) return fromCol;
  const fromRaw = row.raw?.payer_email?.trim();
  return fromRaw || null;
}

/** Node/browser ICU differ on NBSP vs regular space in es-AR output. */
function normalizeIntlSpaces(value: string) {
  return value.replace(/[\u00a0\u202f]/g, " ");
}

function formatMoney(amount: number | null, currency: string | null) {
  if (amount == null) return "—";
  try {
    return normalizeIntlSpaces(
      new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: currency || "ARS",
        maximumFractionDigits: 0,
      }).format(amount),
    );
  } catch {
    return `$${amount}`;
  }
}

function formatDate(value: string | null, withTime = false) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return normalizeIntlSpaces(
    new Intl.DateTimeFormat(
      "es-AR",
      withTime
        ? { dateStyle: "medium", timeStyle: "short" }
        : { dateStyle: "medium" },
    ).format(d),
  );
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

function matchesStatus(status: string, filter: StatusFilter) {
  if (filter === "all") return true;
  if (filter === "aprobada") return ACTIVE_STATUSES.has(status);
  if (filter === "pendiente") return status === "pending";
  if (filter === "cancelada") return status === "cancelled" || status === "canceled";
  return true;
}

function matchesMethod(row: Subscriber, filter: MethodFilter) {
  if (filter === "all") return true;
  const transfer = isTransfer(row);
  if (filter === "transfer") return transfer;
  return !transfer;
}

function matchesQuery(row: Subscriber, query: string) {
  if (!query) return true;
  const haystack = [
    payerFullName(row),
    payerEmail(row),
    row.mp_preapproval_id,
    isTransfer(row) ? "transferencia" : "mercado pago",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function ApproveTransferButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await approveTransferSubscription(id);
            } catch (e) {
              setError(
                e instanceof Error ? e.message : "No se pudo aprobar",
              );
            }
          });
        }}
        className="w-full cursor-pointer rounded-full border-none bg-miel px-3.5 py-2.5 text-[0.78rem] font-bold text-ink disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:py-1.5"
      >
        {pending ? "Aprobando…" : "Aprobar 1 mes"}
      </button>
      {error ? (
        <p className="m-0 mt-1 text-[0.75rem] text-tierra" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function LedgerRow({ row, index }: { row: Subscriber; index: number }) {
  const transfer = isTransfer(row);
  const statusTone = ACTIVE_STATUSES.has(row.status)
    ? "text-verde"
    : row.status === "pending"
      ? "text-tierra"
      : "text-muted";

  return (
    <article
      className="admin-ledger-row relative grid grid-cols-2 gap-x-3 gap-y-3 border-b border-[var(--admin-rule)] py-4 pl-3.5 sm:grid-cols-[minmax(0,1.4fr)_auto_minmax(7rem,1fr)_minmax(7rem,1fr)] sm:items-baseline sm:gap-6 sm:pl-5"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <span
        aria-hidden
        className={`absolute top-3 bottom-3 left-0 w-[3px] rounded-full ${spineClass(row.status)}`}
      />

      <div className="min-w-0">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <MethodBadge transfer={transfer} />
          <span
            className={`text-[0.72rem] font-bold tracking-[1.2px] uppercase sm:hidden ${statusTone}`}
          >
            {statusLabel(row.status)}
          </span>
        </div>
        <p className="m-0 break-words font-medium text-ink">
          {payerFullName(row) ?? "Sin nombre"}
        </p>
        <p className="m-0 mt-0.5 break-all text-sm text-body">
          {payerEmail(row) ?? "Sin email de pago"}
        </p>
        {!transfer ? (
          <p className="m-0 mt-0.5 truncate font-mono text-[0.68rem] tracking-wide text-muted/80">
            {row.mp_preapproval_id}
          </p>
        ) : null}
        {transfer && row.proofUrl ? (
          <p className="m-0 mt-1.5">
            <a
              href={row.proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center text-sm font-medium text-verde underline-offset-2 hover:underline sm:min-h-0"
            >
              Ver comprobante
            </a>
          </p>
        ) : null}
        {transfer && row.status === "pending" ? (
          <ApproveTransferButton id={row.id} />
        ) : null}
      </div>

      <div className="flex flex-col items-end gap-0.5 self-start text-right">
        <span
          className={`hidden text-[0.72rem] font-bold tracking-[1.2px] uppercase sm:inline ${statusTone}`}
        >
          {statusLabel(row.status)}
        </span>
        <span className="font-display text-[1.2rem] font-semibold tabular-nums tracking-tight text-ink sm:text-[1.25rem]">
          {formatMoney(row.transaction_amount, row.currency_id)}
        </span>
      </div>

      <div className="text-sm tabular-nums text-body">
        <p className="m-0 text-[0.68rem] font-bold tracking-[1px] text-muted uppercase">
          {transfer ? "Válido hasta" : "Próximo cobro"}
        </p>
        <p className="m-0 mt-0.5">{formatDate(row.next_payment_date)}</p>
      </div>

      <div className="text-sm tabular-nums text-body">
        <p className="m-0 text-[0.68rem] font-bold tracking-[1px] text-muted uppercase">
          {transfer ? "Comprobante" : "Último pago"}
        </p>
        <p className="m-0 mt-0.5">
          {formatDate(
            transfer ? row.created_at : row.last_payment_at,
            !transfer,
          )}
        </p>
        {!transfer && row.last_payment_status ? (
          <p className="m-0 mt-0.5 text-[0.75rem] text-muted">
            {row.last_payment_status}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function SubscribersLedger({ rows }: { rows: Subscriber[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [methodFilter, setMethodFilter] = useState<MethodFilter>("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = rows.filter(
    (row) =>
      matchesStatus(row.status, statusFilter) &&
      matchesMethod(row, methodFilter) &&
      matchesQuery(row, q),
  );

  return (
    <div className="admin-rise">
      <div className="mb-1 flex items-baseline justify-between gap-3 border-b-2 border-[var(--admin-moss)] pb-3">
        <p className="m-0 text-[0.72rem] font-bold tracking-[1.6px] text-verde uppercase">
          Amigos registrados
        </p>
        <p className="m-0 shrink-0 text-[0.68rem] font-bold tracking-[1px] text-muted uppercase sm:text-[0.72rem]">
          {filtered.length === rows.length
            ? `${rows.length} en el registro`
            : `${filtered.length} de ${rows.length}`}
        </p>
      </div>

      <div className="flex flex-col gap-3 border-b border-[var(--admin-rule)] py-3 sm:gap-4 sm:py-4">
        <div className="-mx-4 overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-[900px]:mx-0 min-[900px]:overflow-visible min-[900px]:px-0">
          <div className="flex w-max items-center gap-x-0.5 min-[900px]:w-auto min-[900px]:flex-wrap min-[900px]:gap-x-0">
            <div
              role="tablist"
              aria-label="Filtrar por estado"
              className="flex gap-x-0.5"
            >
              {STATUS_FILTERS.map((filter) => {
                const active = statusFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setStatusFilter(filter.id)}
                    className={`cursor-pointer whitespace-nowrap border-0 border-b-2 bg-transparent px-2.5 py-2.5 text-[0.72rem] font-bold tracking-[1px] uppercase transition-[color,border-color] sm:py-1.5 sm:text-[0.78rem] ${
                      active
                        ? "border-[var(--admin-moss)] text-verde"
                        : "border-transparent text-muted hover:text-ink"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            <span
              aria-hidden
              className="mx-2 inline-block h-4 w-px shrink-0 bg-[var(--admin-rule)] min-[900px]:mx-3"
            />

            <div
              role="tablist"
              aria-label="Filtrar por medio de pago"
              className="flex gap-x-0.5"
            >
              {METHOD_FILTERS.map((filter) => {
                const active = methodFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setMethodFilter(filter.id)}
                    className={`cursor-pointer whitespace-nowrap border-0 border-b-2 bg-transparent px-2.5 py-2.5 text-[0.72rem] font-bold tracking-[1px] uppercase transition-[color,border-color] sm:py-1.5 sm:text-[0.78rem] ${
                      active
                        ? filter.id === "transfer"
                          ? "border-[var(--admin-wax)] text-[var(--admin-wax)]"
                          : filter.id === "mercadopago"
                            ? "border-[#0077b3] text-[#0077b3]"
                            : "border-[var(--admin-moss)] text-verde"
                        : "border-transparent text-muted hover:text-ink"
                    }`}
                  >
                    <span className="min-[900px]:hidden">{filter.shortLabel}</span>
                    <span className="hidden min-[900px]:inline">{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <label className="block">
          <span className="sr-only">Buscar</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar nombre, email…"
            className="w-full border-0 border-b-2 border-[var(--admin-rule)] bg-transparent px-0 py-2.5 text-[1rem] text-ink caret-verde outline-none transition-[border-color] placeholder:text-muted/70 focus:border-[var(--admin-moss)] sm:py-2"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="pt-8">
          <p className="m-0 font-display text-2xl text-ink">Sin resultados</p>
          <p className="mt-2 max-w-[40ch] text-body">
            Probá otro filtro o borrá el texto del buscador.
          </p>
        </div>
      ) : (
        <div role="list" className="pt-1">
          {filtered.map((row, index) => (
            <div key={row.id} role="listitem">
              <LedgerRow row={row} index={index} />
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-center font-chalk text-lg text-verde/70 sm:text-left">
        Cada aporte sostiene el acompañamiento en el tiempo.
      </p>
    </div>
  );
}
