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

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Problem />
      <BiomesSection />
      <HowItWorks />
      <Tools />
      <Glossary />
      <Team />
      <EvaluationSection />
      <Encourage />
    </>
  );
}
