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

async function mpFetch<T>(path: string): Promise<T> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN");

  const res = await fetch(`https://api.mercadopago.com${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

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
};

export function fetchPreapproval(id: string) {
  return mpFetch<MpPreapproval>(`/preapproval/${id}`);
}

export function fetchAuthorizedPayment(id: string) {
  return mpFetch<MpAuthorizedPayment>(`/authorized_payments/${id}`);
}
