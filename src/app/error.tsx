"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="section-inner flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--primary)]">
        <AlertTriangle size={22} strokeWidth={1.5} />
      </div>
      <h1 className="font-display text-3xl sm:text-4xl text-[var(--foreground)]">
        Não foi possível carregar esta seção
      </h1>
      <p className="mt-2 max-w-md text-sm text-[var(--foreground-secondary)]">
        Ocorreu uma falha temporária ao processar a visualização. Tente novamente em instantes.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button type="button" onClick={() => reset()} className="btn-primary">
          <RotateCcw size={15} strokeWidth={1.5} />
          <span>Tentar novamente</span>
        </button>
        <Link href="/" className="btn-secondary">
          <span>Ir para o início</span>
        </Link>
      </div>
    </div>
  );
}
