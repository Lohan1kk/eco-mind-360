import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { Problem } from "@/components/Problem";
import { BiomesSection } from "@/components/BiomesSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Tools } from "@/components/Tools";
import { Glossary } from "@/components/Glossary";
import { Team } from "@/components/Team";
import { EvaluationSection } from "@/components/Evaluation";
import { Encourage } from "@/components/Encourage";
import { getResumoFocos } from "@/lib/firms/service";

export const revalidate = 900;

export default async function HomePage() {
  const resumoFocos = await getResumoFocos({ periodo: "24h" });

  return (
    <>
      <Hero initialResumo={resumoFocos} />
      <TrustStrip />
      <Problem />
      <BiomesSection initialResumo={resumoFocos} />
      <HowItWorks />
      <Tools />
      <Glossary />
      <Team />
      <EvaluationSection />
      <Encourage />
    </>
  );
}
