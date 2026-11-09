import type { Metadata } from "next";
import { BaixarContent } from "@/components/BaixarContent";
import { PageAtmosphereShell } from "@/components/ui/page-atmosphere-shell";

export const metadata: Metadata = {
  title: "Baixar App EcoMind",
  description:
    "Instale o EcoMind 360 no celular — calculadora, quiz e mapa de queimadas com dados oficiais.",
};

export default function BaixarPage() {
  return (
    <PageAtmosphereShell variant="soft" wash="light" className="bg-mist py-8">
      <BaixarContent />
    </PageAtmosphereShell>
  );
}
