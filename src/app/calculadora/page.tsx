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
          eyebrowClassName="eyebrow text-[#789B7C]"
          titleClassName="display mt-3 text-3xl text-[#DCE5DD] md:text-4xl font-semibold"
        >
          <p className="mt-4 max-w-xl text-base text-[#A7B3A9] leading-relaxed">
            Ajuste os controles. O resultado recalcula na hora — em{" "}
            <strong className="font-semibold text-[#DCE5DD]">kg de CO₂e</strong>{" "}
            (CO₂ equivalente) por ano.{" "}
            <a
              href="/#glossario"
              className="text-[#91A88F] hover:text-[#DCE5DD] underline-offset-2 hover:underline"
            >
              O que é pegada e CO₂e?
            </a>
          </p>
        </PageIntro>
        <div className="mt-10">
          <CarbonCalculator />
        </div>
      </div>
    </VerdantPageShell>
  );
}
