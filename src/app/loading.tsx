import React from "react";

export default function Loading() {
  return (
    <div className="section-inner py-12 space-y-8" role="status" aria-label="Carregando conteúdo">
      <div className="space-y-3">
        <div className="h-6 w-36 animate-pulse rounded-full bg-[var(--border)]" />
        <div className="h-10 w-72 animate-pulse rounded-[8px] bg-[var(--border)]" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded-[6px] bg-[var(--border)]" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-48 animate-pulse rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6"
          />
        ))}
      </div>
    </div>
  );
}
