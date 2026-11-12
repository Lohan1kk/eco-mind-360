"use client";

import type { ReactNode } from "react";

/** Dark Botanical page shell with calm surface geometry. */
export function VerdantPageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative min-h-[75vh] bg-[#101512] text-[#DCE5DD] py-8 ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
