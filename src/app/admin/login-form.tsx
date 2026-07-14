"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginAdmin,
    undefined,
  );

  return (
    <form action={action} className="w-full max-w-[22rem]">
      <label
        htmlFor="password"
        className="mb-2 block text-[0.72rem] font-bold tracking-[1.6px] text-miel uppercase"
      >
        Contraseña
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="mb-3 w-full border-0 border-b-2 border-white/35 bg-transparent px-0 py-2.5 text-[1.05rem] text-white caret-miel outline-none transition-[border-color] placeholder:text-white/35 focus:border-miel"
        placeholder="••••••••••••"
      />
      {state?.error ? (
        <p className="mb-4 text-sm font-medium text-miel" role="alert">
          {state.error}. Probá de nuevo.
        </p>
      ) : (
        <p className="mb-5 text-sm text-white/55">Solo para el equipo de Casa Liber.</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border-none bg-miel px-7 py-3.5 text-[0.95rem] font-bold text-ink transition-[transform,opacity] duration-150 ease-out hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {pending ? "Entrando…" : "Entrar al registro"}
      </button>
    </form>
  );
}
