"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface FreshnessSealProps {
  atualizadoEm?: string | null;
  ultimoFocoEm?: string | null;
  desatualizado?: boolean;
  fonte?: string;
  periodo?: "24h" | "48h" | "7d";
  compact?: boolean;
  className?: string;
}

export function formatMinutesAgo(isoDate: string | null | undefined, nowMs: number): string {
  if (!isoDate) return "agora mesmo";
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) return isoDate;
  const diffMin = Math.max(0, Math.round((nowMs - parsed) / 60000));
  if (diffMin < 1) return "há menos de 1 min";
  if (diffMin === 1) return "há 1 min";
  if (diffMin < 60) return `há ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours === 1) return "há 1 h";
  if (diffHours < 24) return `há ${diffHours} h`;
  return new Date(parsed).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPeriodoLabel(periodo: "24h" | "48h" | "7d" = "24h"): string {
  if (periodo === "24h") return "últimas 24 h";
  if (periodo === "48h") return "últimas 48 h";
  return "últimos 7 dias";
}

export function FreshnessSeal({
  atualizadoEm,
  ultimoFocoEm,
  desatualizado = false,
  fonte = "NASA FIRMS (VIIRS/MODIS)",
  periodo = "24h",
  compact = false,
  className = "",
}: FreshnessSealProps) {
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    setNowMs(Date.now());
    const id = window.setInterval(() => setNowMs(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);

  const relLabel = formatMinutesAgo(atualizadoEm, nowMs);
  const fullTimestamp = atualizadoEm
    ? new Date(atualizadoEm).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "indisponível";

  const passTimestamp = ultimoFocoEm
    ? new Date(ultimoFocoEm).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-1.5 rounded-[7px] border px-2.5 py-1 text-[11px] font-mono leading-snug ${
        desatualizado
          ? "border-[#A9A17A]/50 bg-[var(--surface-elevated)] text-[var(--warning)]"
          : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground-secondary)]"
      } ${className}`}
      title={`Atualização do servidor: ${fullTimestamp}${passTimestamp ? ` · Última passagem orbital: ${passTimestamp}` : ""}`}
    >
      {desatualizado ? (
        <AlertTriangle size={12} className="shrink-0 text-[var(--warning)]" aria-hidden="true" />
      ) : (
        <CheckCircle2 size={12} className="shrink-0 text-[var(--success)]" aria-hidden="true" />
      )}
      <span className="font-medium text-[var(--foreground)]">
        Fonte: {fonte}
      </span>
      <span className="text-[var(--muted)]" aria-hidden="true">·</span>
      <span>
        atualizado {relLabel} ({fullTimestamp})
      </span>
      {!compact && (
        <>
          <span className="text-[var(--muted)]" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 text-[var(--sage)]">
            <Clock size={11} aria-hidden="true" />
            janela: {formatPeriodoLabel(periodo)} (quase em tempo real, ~3 h de latência)
          </span>
        </>
      )}
      {desatualizado && (
        <span className="ml-1 rounded-[4px] bg-[#A9A17A]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--warning)]">
          Cache de {fullTimestamp}
        </span>
      )}
    </div>
  );
}
