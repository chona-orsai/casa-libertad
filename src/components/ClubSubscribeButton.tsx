"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { TransferInfo } from "@/lib/transfer";

type Step = "choose" | "transfer" | "done";

type Props = {
  checkoutUrl: string;
  transfer: TransferInfo;
};

export function ClubSubscribeButton({ checkoutUrl, transfer }: Props) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("choose");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  function close() {
    setOpen(false);
    setStep("choose");
    setError(null);
    setSubmitting(false);
  }

  function onDialogClose() {
    setOpen(false);
    setStep("choose");
    setError(null);
    setSubmitting(false);
  }

  async function submitTransfer(e: FormEvent) {
    e.preventDefault();
    if (!proof) {
      setError("Adjuntá el comprobante de transferencia");
      return;
    }

    setSubmitting(true);
    setError(null);

    const body = new FormData();
    body.set("name", name);
    body.set("email", email);
    body.set("proof", proof);

    try {
      const res = await fetch("/api/subscribe/transfer", {
        method: "POST",
        body,
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "No se pudo enviar. Probá de nuevo.");
        setSubmitting(false);
        return;
      }
      setStep("done");
      setName("");
      setEmail("");
      setProof(null);
    } catch {
      setError("No se pudo enviar. Probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  const hasAlias = Boolean(transfer.alias);

  return (
    <>
      <button
        type="button"
        className="inline-block w-full cursor-pointer rounded-full border-none bg-miel px-7 py-3.5 text-center text-[0.95rem] font-bold text-ink no-underline transition-transform duration-150 ease-out hover:-translate-y-0.5"
        onClick={() => setOpen(true)}
      >
        Quiero ser Amigo/a
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={onDialogClose}
        className="m-auto w-[calc(100%-1.5rem)] max-w-md border-0 bg-transparent p-0 text-ink open:flex open:max-h-[min(92dvh,40rem)] open:flex-col backdrop:bg-ink/55 backdrop:backdrop-blur-[2px]"
      >
        <div className="overflow-y-auto rounded-3xl bg-crema shadow-[0_24px_60px_rgba(30,30,20,0.35)]">
          <div className="relative border-b border-ink/10 bg-verde-deep px-5 py-5 text-white sm:px-6">
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute top-3.5 right-3.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-transparent text-lg leading-none text-white transition-colors hover:border-miel hover:text-miel"
            >
              ×
            </button>
            <p className="m-0 text-[0.72rem] font-bold tracking-[1.5px] text-miel uppercase">
              Club de Amigos
            </p>
            <h3 id={titleId} className="mt-1.5 mb-0 pr-8 font-display text-[1.45rem] leading-tight text-white">
              {step === "choose" && "¿Cómo querés sumarte?"}
              {step === "transfer" && "Transferencia bancaria"}
              {step === "done" && "Comprobante enviado"}
            </h3>
          </div>

          <div className="px-5 py-5 sm:px-6 sm:py-6">
            {step === "choose" ? (
              <div className="flex flex-col gap-3">
                <p className="m-0 text-[0.95rem] text-body">
                  Elegí cómo pagar tu aporte mensual de $6.000.
                </p>
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full cursor-pointer rounded-full border-none bg-miel px-6 py-3.5 text-center text-[0.95rem] font-bold text-ink no-underline transition-transform duration-150 hover:-translate-y-0.5"
                >
                  Mercado Pago
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep("transfer");
                  }}
                  className="inline-block w-full cursor-pointer rounded-full border-2 border-verde bg-transparent px-6 py-3 text-center text-[0.95rem] font-bold text-verde transition-[background-color,color] duration-150 hover:bg-verde hover:text-white"
                >
                  Transferencia
                </button>
              </div>
            ) : null}

            {step === "transfer" ? (
              <form onSubmit={submitTransfer} className="flex flex-col gap-4">
                <div className="border-l-[3px] border-miel bg-miel/10 px-3.5 py-3">
                  <p className="m-0 text-[0.72rem] font-bold tracking-[1px] text-verde uppercase">
                    Datos para transferir
                  </p>
                  {hasAlias ? (
                    <dl className="mt-2 mb-0 space-y-1.5 text-sm">
                      <div>
                        <dt className="inline text-muted">Alias: </dt>
                        <dd className="inline m-0 font-medium break-all text-ink">
                          {transfer.alias}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline text-muted">Monto: </dt>
                        <dd className="inline m-0 font-display font-semibold text-ink">
                          $6.000
                        </dd>
                      </div>
                    </dl>
                  ) : (
                    <p className="mt-2 mb-0 text-sm text-body">
                      Escribinos a{" "}
                      <a
                        href="mailto:casalibertadlaplata@gmail.com"
                        className="font-medium text-verde"
                      >
                        casalibertadlaplata@gmail.com
                      </a>{" "}
                      para pedirnos el alias, y después cargá el comprobante acá.
                    </p>
                  )}
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-[0.72rem] font-bold tracking-[1px] text-muted uppercase">
                    Nombre y apellido
                  </span>
                  <input
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-[1rem] text-ink outline-none focus:border-verde"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[0.72rem] font-bold tracking-[1px] text-muted uppercase">
                    Email
                  </span>
                  <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-[1rem] text-ink outline-none focus:border-verde"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[0.72rem] font-bold tracking-[1px] text-muted uppercase">
                    Comprobante
                  </span>
                  <input
                    required
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={(e) => setProof(e.target.files?.[0] ?? null)}
                    className="w-full text-sm text-body file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-verde file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
                  />
                  <span className="mt-1 block text-[0.78rem] text-muted">
                    JPG, PNG, WebP o PDF · máx. 5 MB
                  </span>
                </label>

                {error ? (
                  <p className="m-0 text-sm text-tierra" role="alert">
                    {error}
                  </p>
                ) : null}

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setStep("choose");
                    }}
                    className="cursor-pointer rounded-full border border-ink/20 bg-transparent px-5 py-3 text-[0.9rem] font-bold text-ink hover:border-ink/40"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 cursor-pointer rounded-full border-none bg-miel px-5 py-3 text-[0.95rem] font-bold text-ink disabled:cursor-wait disabled:opacity-70"
                  >
                    {submitting ? "Enviando…" : "Enviar comprobante"}
                  </button>
                </div>
              </form>
            ) : null}

            {step === "done" ? (
              <div className="flex flex-col gap-4">
                <p className="m-0 text-[0.95rem] text-body">
                  Gracias. Revisamos el comprobante y te activamos el mes del
                  Club apenas lo confirmemos.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="inline-block w-full cursor-pointer rounded-full border-none bg-miel px-6 py-3.5 text-center text-[0.95rem] font-bold text-ink"
                >
                  Cerrar
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
