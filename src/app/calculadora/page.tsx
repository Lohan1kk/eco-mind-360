import type { Metadata } from "next";
import { CarbonCalculator } from "@/components/CarbonCalculator";

export const metadata: Metadata = {
  title: "Calculadora de Pegada de Carbono",
  description:
    "Calcule sua estimativa parcial de emissão anual de CO₂e em transporte, alimentação e energia.",
};

export default function CalculadoraPage() {
  return (
    <div className="section-inner max-w-5xl mx-auto py-8 space-y-10">
      <header className="border-b border-[var(--border)] pb-6 space-y-2">
        <span className="eyebrow">Aprender e agir</span>
        <h1 className="font-display text-4xl sm:text-5xl text-[var(--foreground)]">
          Calculadora de pegada de carbono
        </h1>
        <p className="lede text-sm sm:text-base text-[var(--foreground-secondary)]">
          Ajuste os controles abaixo para estimar sua emissão anual em kg de CO₂ equivalente (CO₂e).
        </p>
      </header>

      <CarbonCalculator />
    </div>
  );
}
