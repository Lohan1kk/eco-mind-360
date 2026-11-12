"use client";

import { GLOSSARY_TERMS } from "@/data/glossary";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/motion";

export function Glossary() {
  return (
    <section id="glossario" className="section relative overflow-hidden bg-[#101512] border-b border-[#222D25]">
      <div className="section-inner relative z-[1]">
        <Reveal>
          <p className="eyebrow text-[#91A88F]">Especificações</p>
          <h2 className="font-display font-semibold tracking-tight mt-3 max-w-3xl text-3xl text-[#DCE5DD] md:text-4xl">
            O que significam esses termos
          </h2>
          <p className="lede mt-4 max-w-xl">
            ppm, CO₂, FRP e outros números do site — explicados em linguagem
            clara, sem precisar ser especialista.
          </p>
        </Reveal>

        <StaggerReveal
          className="mt-10 divide-y divide-[#222D25] border-y border-[#222D25]"
          staggerChildren={0.04}
          delayChildren={0.04}
        >
          {GLOSSARY_TERMS.map((item) => (
            <StaggerItem key={item.term} soft>
              <div className="grid gap-2 py-5 sm:grid-cols-[minmax(8rem,14rem)_1fr] sm:gap-8">
                <p className="font-mono text-sm font-medium text-[#91A88F]">
                  {item.term}
                </p>
                <p className="text-sm leading-relaxed text-[#A7B3A9]">
                  {item.meaning}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>

        <Reveal delayMs={100}>
          <p className="mt-6 max-w-2xl text-xs text-[#78877D]">
            Esses significados aparecem na realidade climática, na calculadora e
            no mapa de queimadas. Se ainda tiver dúvida, use o quiz — as
            respostas reforçam o mesmo vocabulário.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
