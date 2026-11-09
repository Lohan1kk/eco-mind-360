"use client";

import { StaggerItem, StaggerReveal } from "@/components/motion";

export function AlertaIntro() {
  return (
    <StaggerReveal
      className="relative z-[1] max-w-5xl"
      staggerChildren={0.06}
      delayChildren={0.02}
    >
      <StaggerItem soft>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-burn md:text-xs">
          Inteligência Territorial · Dados Oficiais
        </p>
      </StaggerItem>
      <StaggerItem>
        <h1 className="mt-0.5 font-display text-lg font-bold text-forest md:mt-1 md:text-2xl">
          Mapa de Queimadas e Ambientes Brasileiros
        </h1>
      </StaggerItem>
      <StaggerItem soft>
        <p className="mt-1 max-w-3xl text-xs leading-snug text-ash md:text-sm md:leading-normal">
          <span className="md:hidden">
            INPE + NASA · cores = FRP (potência do fogo em MW) · camada dos 7 biomas · + para reportar foco.
          </span>
          <span className="hidden md:inline">
            Focos orbitais em tempo real (INPE Queimadas e NASA FIRMS). Os marcadores seguem a intensidade de FRP (Fire Radiative Power).
            Alterne entre modo Mapa e Satélite, ative/desative a camada dos 7 biomas brasileiros ou use o botão vermelho para registrar um reporte local.
          </span>
        </p>
      </StaggerItem>
    </StaggerReveal>
  );
}
