import { createHmac, timingSafeEqual } from "crypto";

export function getCheckoutUrl() {
  const planId = process.env.NEXT_PUBLIC_MERCADOPAGO_PREAPPROVAL_PLAN_ID;
  if (!planId) {
    throw new Error("Falta NEXT_PUBLIC_MERCADOPAGO_PREAPPROVAL_PLAN_ID");
  }
  return `https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=${planId}`;
}

export function verifyWebhookSignature(params: {
  secret: string;
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
}) {
  const { secret, xSignature, xRequestId, dataId } = params;
  if (!xSignature) return false;

  const parts = Object.fromEntries(
    xSignature.split(",").map((part) => {
      const [key, ...rest] = part.trim().split("=");
      return [key, rest.join("=")];
    }),
  );

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  let manifest = "";
  if (dataId) manifest += `id:${dataId.toLowerCase()};`;
  if (xRequestId) manifest += `request-id:${xRequestId};`;
  manifest += `ts:${ts};`;

  const hash = createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(v1));
  } catch {
    return false;
  }
}

export class MpNotFoundError extends Error {
  constructor(path: string) {
    super(`Mercado Pago ${path}: 404`);
    this.name = "MpNotFoundError";
  }
}

async function mpFetch<T>(path: string): Promise<T> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN");

  const res = await fetch(`https://api.mercadopago.com${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 404) {
    throw new MpNotFoundError(path);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mercado Pago ${path}: ${res.status} ${body}`);
  }

  return res.json() as Promise<T>;
}

export type MpPreapproval = {
  id: string;
  status: string;
  reason?: string;
  payer_id?: number;
  payer_email?: string;
  payer_first_name?: string;
  payer_last_name?: string;
  preapproval_plan_id?: string;
  next_payment_date?: string;
  auto_recurring?: {
    transaction_amount?: number;
    currency_id?: string;
  };
};

export type MpAuthorizedPayment = {
  id: number;
  status: string;
  preapproval_id?: string;
  date_created?: string;
  transaction_amount?: number;
  payment?: { id?: number; status?: string };
};

type MpPayment = {
  id: number;
  payer?: { email?: string };
};

function nonempty(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Preapproval deja payer_email vacío; el email está en el cobro (/v1/payments). */
async function fetchPayerEmailFromCharges(preapprovalId: string) {
  try {
    const search = await mpFetch<{ results?: MpAuthorizedPayment[] }>(
      `/authorized_payments/search?preapproval_id=${encodeURIComponent(preapprovalId)}`,
    );
    for (const ap of search.results ?? []) {
      const paymentId = ap.payment?.id;
      if (!paymentId) continue;
      const payment = await mpFetch<MpPayment>(`/v1/payments/${paymentId}`);
      const email = nonempty(payment.payer?.email);
      if (email) return email;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

/**
 * GET /preapproval/:id no trae nombre ni email útiles.
 * Nombre: /preapproval/search. Email: pago asociado en /v1/payments.
 */
export async function fetchPreapproval(id: string): Promise<MpPreapproval> {
  const byId = await mpFetch<MpPreapproval>(`/preapproval/${id}`);
  let payerEmail = nonempty(byId.payer_email);
  let payerFirstName = nonempty(byId.payer_first_name);
  let payerLastName = nonempty(byId.payer_last_name);

  try {
    const search = await mpFetch<{ results?: MpPreapproval[] }>(
      `/preapproval/search?id=${encodeURIComponent(id)}`,
    );
    const found = search.results?.[0];
    if (found) {
      payerEmail = payerEmail ?? nonempty(found.payer_email);
      payerFirstName = payerFirstName ?? nonempty(found.payer_first_name);
      payerLastName = payerLastName ?? nonempty(found.payer_last_name);
    }
  } catch {
    // search es best-effort
  }

  if (!payerEmail) {
    payerEmail = await fetchPayerEmailFromCharges(id);
  }

  return {
    ...byId,
    payer_email: payerEmail ?? byId.payer_email,
    payer_first_name: payerFirstName,
    payer_last_name: payerLastName,
  };
}

export function fetchAuthorizedPayment(id: string) {
  return mpFetch<MpAuthorizedPayment>(`/authorized_payments/${id}`);
}
