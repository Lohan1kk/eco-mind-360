import { Hero } from "@/components/Hero";
import { BiomesSection } from "@/components/BiomesSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Tools } from "@/components/Tools";
import { Team } from "@/components/Team";
import { Encourage } from "@/components/Encourage";
import { getResumoFocos } from "@/lib/firms/service";

export const revalidate = 900;

export default async function HomePage() {
  const resumoFocos = await getResumoFocos({ periodo: "24h" });

  return (
    <>
      <Hero initialResumo={resumoFocos} />
      <BiomesSection initialResumo={resumoFocos} />
      <HowItWorks />
      <Tools />
      <Team />
      <Encourage />
    </>
  );
}
