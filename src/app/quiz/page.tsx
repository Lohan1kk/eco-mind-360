import type { Metadata } from "next";
import { QuizPageClient } from "@/components/QuizPageClient";
import { PageAtmosphereShell } from "@/components/ui/page-atmosphere-shell";

export const metadata: Metadata = {
  title: "Quiz Ambiental e Folclore",
  description:
    "Quiz sobre os biomas brasileiros e lendas protetoras da natureza — Curupira, Caipora, Boitatá e mais.",
};

export default function QuizPage() {
  return (
    <PageAtmosphereShell
      variant="mist"
      wash="dark"
      className="bg-[#101512] min-h-[70vh] py-8"
    >
      <QuizPageClient />
    </PageAtmosphereShell>
  );
}
