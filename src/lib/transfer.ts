import { createAdminClient } from "@/lib/supabase/admin";

export const CLUB_MONTHLY_AMOUNT = 6000;
export const TRANSFER_PROOF_BUCKET = "transfer-proofs";

export type TransferInfo = {
  alias: string | null;
};

export function getTransferInfo(): TransferInfo {
  return {
    alias: process.env.NEXT_PUBLIC_TRANSFER_ALIAS?.trim() || null,
  };
}

export function isTransferSubscriber(row: {
  mp_preapproval_id: string | null;
  raw?: { payment_method?: string | null } | null;
}) {
  if (row.raw?.payment_method === "transfer") return true;
  return Boolean(row.mp_preapproval_id?.startsWith("transfer_"));
}

export async function ensureTransferProofBucket() {
  const supabase = createAdminClient();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  if (buckets?.some((b) => b.id === TRANSFER_PROOF_BUCKET)) return;

  const { error } = await supabase.storage.createBucket(TRANSFER_PROOF_BUCKET, {
    public: false,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ],
  });

  if (error && !/already exists/i.test(error.message)) throw error;
}

export async function createProofSignedUrl(path: string, expiresIn = 60 * 60) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(TRANSFER_PROOF_BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}
