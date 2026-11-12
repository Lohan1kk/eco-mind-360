"use client";

import { BookOpen } from "lucide-react";
import { GLOSSARY_TERMS } from "@/data/glossary";

export function Glossary() {
  return (
    <section id="glossario" className="section scroll-mt-20 relative overflow-hidden bg-[#131A16] border-b border-[#222D25]">
      <div className="section-inner space-y-10">
        <div className="max-w-3xl space-y-3">
          <div className="badge-360">
            <BookOpen size={12} className="text-[#789B7C]" />
            <span>Especificações & Siglas Técnicas</span>
          </div>
          <h2 className="font-display font-semibold tracking-tight text-3xl text-[#DCE5DD] sm:text-4xl">
            O que significam esses termos
          </h2>
          <p className="text-base text-[#A7B3A9] leading-relaxed">
            ppm, CO₂e, FRP e outras unidades científicas utilizadas na plataforma — explicadas
            de forma direta e acessível.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GLOSSARY_TERMS.map((item) => (
            <div
              key={item.term}
              className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-5 space-y-2"
            >
              <p className="font-mono text-sm font-semibold text-[#91A88F]">
                {item.term}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-[#A7B3A9]">
                {item.meaning}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
