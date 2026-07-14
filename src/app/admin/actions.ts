"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSession,
  setAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth";

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
