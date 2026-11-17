"use client";

import React from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

const TEAM = [
  {
    name: "Ana Flávia",
    role: "Design & Comunicação",
    image: "/team/foto-ana.png",
  },
  {
    name: "André Zauli",
    role: "Desenvolvimento Fullstack",
    image: "/team/foto-andre.png",
  },
  {
    name: "Lucas Lohan",
    role: "Engenharia & Pesquisa",
    image: "/team/foto-lucas.png",
  },
  {
    name: "Gabriel Rosa",
    role: "Conteúdo & Direção Visual",
    image: "/team/foto-gabriel.png",
  },
];

export function Team() {
  return (
    <section
      id="equipe"
      className="section scroll-mt-20 bg-[var(--surface)] border-b border-[var(--border)]"
    >
      <div className="section-inner space-y-12">
        <Reveal className="max-w-xl space-y-3">
          <span className="eyebrow">Quem fez</span>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-[var(--foreground)]">
            Projeto estudantil do Colégio Paulo de Tarso
          </h2>
          <p className="text-sm sm:text-base text-[var(--foreground-secondary)] leading-relaxed">
            Desenvolvido por quatro alunos para aproximar ciência aberta e educação ambiental.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {TEAM.map((person) => (
            <div
              key={person.name}
              className="flex flex-col items-center rounded-[12px] border border-[var(--border)] bg-[var(--background)] p-6 text-center"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[var(--border)]">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  sizes="80px"
                  quality={75}
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 font-display text-xl text-[var(--foreground)]">
                {person.name}
              </h3>
              <p className="mt-1 text-xs text-[var(--muted)]">{person.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
