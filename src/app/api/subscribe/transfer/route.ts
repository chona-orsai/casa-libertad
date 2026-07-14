import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  CLUB_MONTHLY_AMOUNT,
  TRANSFER_PROOF_BUCKET,
  ensureTransferProofBucket,
} from "@/lib/transfer";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
const MAX_BYTES = 5 * 1024 * 1024;

function extFor(mime: string) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "application/pdf") return "pdf";
  return "bin";
}

export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formulario inválido" }, { status: 400 });
  }

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const proof = form.get("proof");

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Ingresá tu nombre" }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Ingresá un email válido" }, { status: 400 });
  }
  if (!(proof instanceof File) || proof.size === 0) {
    return NextResponse.json(
      { error: "Adjuntá el comprobante de transferencia" },
      { status: 400 },
    );
  }
  if (!ALLOWED_TYPES.has(proof.type)) {
    return NextResponse.json(
      { error: "El comprobante debe ser JPG, PNG, WebP o PDF" },
      { status: 400 },
    );
  }
  if (proof.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "El comprobante no puede superar 5 MB" },
      { status: 400 },
    );
  }

  const id = randomUUID();
  const preapprovalId = `transfer_${id}`;
  const proofPath = `${id}.${extFor(proof.type)}`;

  try {
    await ensureTransferProofBucket();
    const supabase = createAdminClient();
    const buffer = Buffer.from(await proof.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(TRANSFER_PROOF_BUCKET)
      .upload(proofPath, buffer, {
        contentType: proof.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const nameParts = name.split(/\s+/);
    const firstName = nameParts[0] ?? name;
    const lastName = nameParts.slice(1).join(" ") || null;

    const { error: insertError } = await supabase.from("subscribers").insert({
      mp_preapproval_id: preapprovalId,
      payer_email: email,
      status: "pending",
      reason: "Club de Amigos — transferencia",
      transaction_amount: CLUB_MONTHLY_AMOUNT,
      currency_id: "ARS",
      raw: {
        payment_method: "transfer",
        payer_email: email,
        payer_name: name,
        payer_first_name: firstName,
        payer_last_name: lastName,
        proof_path: proofPath,
        proof_mime: proof.type,
      },
    });

    if (insertError) throw insertError;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[transfer-subscribe]", err);
    return NextResponse.json(
      { error: "No se pudo enviar el comprobante. Probá de nuevo." },
      { status: 500 },
    );
  }
}
