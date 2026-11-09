"use client";

import { SectionAtmosphere } from "@/components/ui/section-atmosphere";
import { StaggerItem, StaggerReveal } from "@/components/motion";

const badges = [
  "Dados INPE / PRODES",
  "NASA FIRMS 24h",
  "Os 7 Ambientes do Brasil",
  "Colégio Paulo de Tarso",
  "100% Gratuito (R$ 0)",
];

export function TrustStrip() {
  return (
    <section className="section-soft relative overflow-hidden border-b border-[var(--line)]">
      <SectionAtmosphere variant="soft" />
      <StaggerReveal
        className="section-inner relative z-[1] flex flex-wrap items-center justify-center gap-x-3 gap-y-3 py-6 md:gap-x-4"
        staggerChildren={0.07}
        delayChildren={0.08}
      >
        {badges.map((badge, i) => (
          <StaggerItem key={badge} soft className="flex items-center gap-3 md:gap-4">
            {i > 0 ? (
              <span
                aria-hidden
                className="hidden h-1 w-1 rounded-full bg-forest/25 sm:block"
              />
            ) : null}
            <p className="rounded-full border border-forest/10 bg-paper/70 px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-[0.03em] text-forest backdrop-blur-sm shadow-sm">
              {badge}
            </p>
          </StaggerItem>
        ))}
      </StaggerReveal>
    </section>
  );
}
