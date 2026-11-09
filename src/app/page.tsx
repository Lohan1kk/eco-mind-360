import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { Problem } from "@/components/Problem";
import { Idea } from "@/components/Idea";
import { BiomesSection } from "@/components/BiomesSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Tools } from "@/components/Tools";
import { ClimateReality } from "@/components/ClimateSections";
import { Glossary } from "@/components/Glossary";
import { School } from "@/components/School";
import { Team } from "@/components/Team";
import { EvaluationSection } from "@/components/Evaluation";
import { Encourage } from "@/components/Encourage";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Problem />
      <Idea />
      <BiomesSection />
      <HowItWorks />
      <Tools />
      <ClimateReality />
      <Glossary />
      <School />
      <Team />
      <EvaluationSection />
      <Encourage />
    </>
  );
}
