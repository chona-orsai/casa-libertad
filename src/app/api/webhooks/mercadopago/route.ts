import { NextRequest, NextResponse } from "next/server";
import {
  fetchAuthorizedPayment,
  fetchPreapproval,
  MpNotFoundError,
  type MpPreapproval,
  verifyWebhookSignature,
} from "@/lib/mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type WebhookBody = {
  type?: string;
  action?: string;
  data?: { id?: string };
};

async function upsertSubscriber(
  preapproval: MpPreapproval,
  payment?: { id: string; status: string; at?: string },
) {
  const supabase = createAdminClient();

  const payerEmail = preapproval.payer_email?.trim() || null;

  const row: Record<string, unknown> = {
    mp_preapproval_id: String(preapproval.id),
    mp_plan_id: preapproval.preapproval_plan_id ?? null,
    payer_email: payerEmail,
    payer_id: preapproval.payer_id != null ? String(preapproval.payer_id) : null,
    status: preapproval.status,
    reason: preapproval.reason ?? null,
    transaction_amount: preapproval.auto_recurring?.transaction_amount ?? null,
    currency_id: preapproval.auto_recurring?.currency_id ?? "ARS",
    next_payment_date: preapproval.next_payment_date ?? null,
    raw: preapproval,
  };

  if (payment) {
    row.last_payment_id = payment.id;
    row.last_payment_status = payment.status;
    row.last_payment_at = payment.at ?? null;
  }

  const { error } = await supabase.from("subscribers").upsert(row, {
    onConflict: "mp_preapproval_id",
  });

  if (error) throw error;
}

export async function POST(request: NextRequest) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 500 });
  }

  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");
  const dataId =
    request.nextUrl.searchParams.get("data.id") ??
    request.nextUrl.searchParams.get("id");

  const valid = verifyWebhookSignature({
    secret,
    xSignature,
    xRequestId,
    dataId,
  });

  if (!valid) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  let body: WebhookBody = {};
  try {
    body = (await request.json()) as WebhookBody;
  } catch {
    // MP a veces envía query params sin body útil
  }

  const type = body.type ?? request.nextUrl.searchParams.get("type") ?? "";
  const id = body.data?.id ?? dataId;

  if (!id) {
    return NextResponse.json({ ok: true, skipped: "sin id" });
  }

  try {
    if (type === "subscription_preapproval" || type === "subscription") {
      const preapproval = await fetchPreapproval(id);
      await upsertSubscriber(preapproval);
    } else if (type === "subscription_authorized_payment") {
      const payment = await fetchAuthorizedPayment(id);
      if (payment.preapproval_id) {
        const preapproval = await fetchPreapproval(payment.preapproval_id);
        await upsertSubscriber(preapproval, {
          id: String(payment.id),
          status: payment.status,
          at: payment.date_created,
        });
      }
    }
  } catch (err) {
    // El simulador de MP envía id "123456"; recursos borrados también 404.
    // Respondemos 200 para no marcar fallo en el panel / reintentos inútiles.
    if (err instanceof MpNotFoundError) {
      return NextResponse.json({ ok: true, skipped: "not_found" });
    }
    console.error("[mp-webhook]", err);
    return NextResponse.json({ error: "Error procesando webhook" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
