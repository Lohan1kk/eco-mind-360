import type { Metadata } from "next";
import { CarbonCalculator } from "@/components/CarbonCalculator";
import { PageIntro } from "@/components/PageIntro";
import { VerdantPageShell } from "@/components/ui/verdant-page-shell";

export const metadata: Metadata = {
  title: "Calculadora de Pegada de Carbono",
  description:
    "Calcule sua pegada de carbono anual com transporte, alimentação e energia.",
};

export default function CalculadoraPage() {
  return (
    <VerdantPageShell>
      <div className="section-inner">
        <PageIntro
          eyebrow="Ferramenta Prática"
          title="Sua pegada, em tempo real"
          eyebrowClassName="eyebrow text-sprout"
          titleClassName="display mt-3 text-3xl text-mist md:text-5xl"
        >
          <p className="mt-4 max-w-xl text-lg text-mist/70">
            Ajuste os controles. O resultado recalcula na hora — em{" "}
            <strong className="font-semibold text-mist/90">kg de CO₂e</strong>{" "}
            (CO₂ equivalente) por ano.{" "}
            <a
              href="/#glossario"
              className="text-sprout underline-offset-2 hover:underline"
            >
              O que é pegada e CO₂e?
            </a>
          </p>
        </PageIntro>
        <div className="mt-12">
          <CarbonCalculator />
        </div>
      </div>
    </VerdantPageShell>
  );
}
