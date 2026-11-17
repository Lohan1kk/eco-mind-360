"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { ResumoFocos } from "@/lib/firms/types";
import { useResumoFocos } from "@/lib/firms/useResumoFocos";
import { FreshnessSeal } from "@/components/firms/FreshnessSeal";
import { Spotlight } from "@/components/ui/aceternity/spotlight";
import { EASE_OUT_EXPO } from "@/components/ui/reveal";

const HERO_WORDS = [
  "Acompanhe",
  "em",
  "tempo",
  "real",
  "os",
  "sete",
  "ambientes",
  "do",
  "Brasil.",
];

export function Hero({ initialResumo }: { initialResumo?: ResumoFocos | null }) {
  const { resumo } = useResumoFocos("24h", initialResumo);
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <section className="relative flex min-h-[84svh] flex-col items-center justify-center overflow-hidden bg-[var(--background)] pt-24 pb-16 border-b border-[var(--border)]">
        {/* Fundo sutil: grade pontilhada discreta + spotlight verde-claro suave (Aceternity) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(rgba(31, 90, 58, 0.14) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />
        <Spotlight className="-top-40 left-0 md:left-40 md:-top-20" fill="#BFE5CB" />

        <div className="section-inner relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-7">
          {/* 1. Selo no topo com ponto verde pulsando suavemente */}
          <div className="badge-360">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--primary)]" />
            </span>
            <span>Dados oficiais do INPE e da NASA</span>
          </div>

          {/* 2. Título grande e curto em serifada (~9 palavras) revelado palavra por palavra */}
          <h1 className="font-display text-[clamp(2.5rem,5.8vw,4.5rem)] leading-[1.06] tracking-tight text-[var(--foreground)]">
            {HERO_WORDS.map((word, index) =>
              reduce ? (
                <span key={index} className="inline-block mr-[0.26em]">
                  {word}
                </span>
              ) : (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.045,
                    ease: EASE_OUT_EXPO,
                  }}
                  className="inline-block mr-[0.26em]"
                >
                  {word}
                </motion.span>
              ),
            )}
          </h1>

          {/* 3. Uma linha de apoio (16 palavras) em cinza médio */}
          <p className="lede text-base sm:text-lg text-[var(--foreground-secondary)] max-w-xl mx-auto">
            Monitoramento de queimadas por satélite, cobertura vegetal nativa e indicadores territoriais abertos para escolas e cidadãos.
          </p>

          {/* 4. Dois botões: principal "Abrir mapa" e secundário em formato de link "Explorar os ambientes" */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
            <Link href="/mapa" className="btn-primary">
              <span>Abrir mapa</span>
            </Link>

            <Link
              href="#biomas"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
            >
              <span>Explorar os ambientes</span>
              <ArrowRight size={15} strokeWidth={1.5} />
            </Link>
          </div>

          {/* Metadado acessível de atualização para leitores de tela e auditoria */}
          <div className="sr-only">
            <FreshnessSeal
              atualizadoEm={resumo?.atualizadoEm}
              ultimoFocoEm={resumo?.ultimoFocoEm}
              desatualizado={resumo?.desatualizado}
              fonte={resumo?.fonte ?? "NASA FIRMS"}
              periodo="24h"
              compact
            />
          </div>
        </div>

        {/* Indicador discreto de rolagem que some ao rolar */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 transition-opacity duration-300 ${
            scrolled ? "opacity-0" : "opacity-60"
          }`}
        >
          <ArrowDown size={18} strokeWidth={1.5} className="text-[var(--muted)]" />
        </div>
      </section>

      {/* Faixa fina e silenciosa: Dados de fontes oficiais */}
      <section
        aria-label="Dados de fontes oficiais"
        className="border-b border-[var(--border)] bg-[var(--surface)] py-5"
      >
        <div className="section-inner flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--muted)]">
          <span className="font-medium uppercase tracking-wider">
            Dados de fontes oficiais
          </span>
          <ul className="flex flex-wrap items-center gap-6 sm:gap-10 font-medium text-[var(--foreground-secondary)]">
            <li>INPE</li>
            <li>NASA FIRMS</li>
            <li>MapBiomas</li>
            <li>IBGE</li>
          </ul>
        </div>
      </section>
    </>
  );
}
