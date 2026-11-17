"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Compass, Layers, Satellite } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    n: "01",
    icon: Satellite,
    title: "Captação por satélite",
    desc: "Sensores orbitais da NASA e do INPE registram anomalias térmicas e cobertura vegetal em todo o território brasileiro.",
  },
  {
    n: "02",
    icon: Layers,
    title: "Cruzamento espacial",
    desc: "Cada coordenada é classificada por potência radiativa (FRP) e cruzada com as malhas oficiais dos 7 ambientes no IBGE.",
  },
  {
    n: "03",
    icon: Compass,
    title: "Consulta e ação cidadã",
    desc: "Você acompanha o mapa em tempo real, compara indicadores territoriais e calcula sua pegada anual de carbono.",
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const cards = gsap.utils.toArray<HTMLElement>(".how-step-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="como-funciona"
      className="section scroll-mt-20 bg-[var(--surface)] border-b border-[var(--border)]"
    >
      <div className="section-inner space-y-12">
        <div className="max-w-xl space-y-3">
          <span className="eyebrow">Como funciona</span>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-[var(--foreground)]">
            Do satélite à tomada de decisão em três passos
          </h2>
          <p className="text-sm sm:text-base text-[var(--foreground-secondary)] leading-relaxed">
            Dados orbitais complexos traduzidos em leitura clara e acessível.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.n}
                className="how-step-card rounded-[12px] border border-[var(--border)] bg-[var(--background)] p-7 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl text-[var(--primary)]">
                      {s.n}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--accent-soft)] text-[var(--primary)]">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 className="font-display text-2xl text-[var(--foreground)]">
                    {s.title}
                  </h3>

                  <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
