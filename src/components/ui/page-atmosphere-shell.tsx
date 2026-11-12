"use client";

import type { ReactNode } from "react";

/** Page shell with clean Dark Botanical surface behind content. */
export function PageAtmosphereShell({
  children,
  className = "",
}: {
  children: ReactNode;
  variant?: "mist" | "soft" | "deep";
  wash?: "light" | "dark" | "none";
  className?: string;
}) {
  return (
    <div className={`relative min-h-[75vh] bg-[#101512] text-[#DCE5DD] ${className}`}>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
