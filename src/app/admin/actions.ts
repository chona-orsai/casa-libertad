"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  isAdminAuthenticated,
  setAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isTransferSubscriber } from "@/lib/transfer";

export type LoginState = { error?: string } | undefined;

export async function loginAdmin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminPassword(password)) {
    return { error: "Contraseña incorrecta" };
  }

  await setAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin");
}

/** Aprueba un comprobante de transferencia y otorga 1 mes de suscripción. */
export async function approveTransferSubscription(subscriberId: string) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("No autorizado");
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("subscribers")
    .select("id, status, mp_preapproval_id, raw")
    .eq("id", subscriberId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Suscriptor no encontrado");
  if (!isTransferSubscriber(data)) {
    throw new Error("No es una solicitud por transferencia");
  }
  if (data.status !== "pending") {
    throw new Error("La solicitud ya fue procesada");
  }

  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const { error: updateError } = await supabase
    .from("subscribers")
    .update({
      status: "approved",
      last_payment_status: "approved",
      last_payment_at: now.toISOString(),
      next_payment_date: nextMonth.toISOString(),
    })
    .eq("id", subscriberId)
    .eq("status", "pending");

  if (updateError) throw updateError;

  revalidatePath("/admin");
}
