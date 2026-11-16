import { Hero } from "@/components/Hero";
import { BiomesSection } from "@/components/BiomesSection";
import { Tools } from "@/components/Tools";
import { Team } from "@/components/Team";
import { EvaluationSection } from "@/components/Evaluation";
import { getResumoFocos } from "@/lib/firms/service";

export const revalidate = 900;

export default async function HomePage() {
  const resumoFocos = await getResumoFocos({ periodo: "24h" });

  return (
    <>
      <Hero initialResumo={resumoFocos} />
      <BiomesSection initialResumo={resumoFocos} />
      <Tools />
      <Team />
      <EvaluationSection />
    </>
  );
}
