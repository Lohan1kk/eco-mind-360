"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MotionPress,
  StaggerItem,
  StaggerReveal,
} from "@/components/motion";
import { QrInstall } from "@/components/shell/QrInstall";

const features = [
  "Monitoramento orbital em tempo real (INPE & NASA FIRMS)",
  "Cobertura completa dos 7 biomas e ecossistemas brasileiros",
  "Dashboard analítico com histórico PRODES e MapBiomas",
  "Calculadora científica de pegada de carbono (kg CO₂e)",
  "Quiz interativo com guardiões e folclore brasileiro",
];

export function BaixarContent() {
  return (
    <div className="section-inner max-w-3xl py-6">
      <StaggerReveal staggerChildren={0.1} delayChildren={0.04}>
        <StaggerItem className="flex items-center gap-4 border-b border-forest/10 pb-6">
          <Image
            src="/brand/icon-ecomind.png"
            alt="EcoMind 360 Logo"
            width={64}
            height={64}
            className="h-16 w-16 object-contain drop-shadow-sm"
            priority
          />
          <div>
            <div className="badge-360 inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] mb-1">
              <span>● APP PWA INSTALÁVEL</span>
            </div>
            <h1 className="display text-3xl text-forest">Instale o EcoMind 360°</h1>
            <p className="text-ash text-sm">Bio-inteligência territorial e dados orbitais na palma da mão</p>
          </div>
        </StaggerItem>

        <StaggerItem className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
          <div className="space-y-8">
            <section className="glass-panel p-6">
              <h2 className="font-display text-lg font-bold text-forest">
                Instalação Instantânea no Celular
              </h2>
              <p className="mt-1 text-xs text-ash">
                O EcoMind 360 funciona como aplicativo nativo (PWA) sem ocupar armazenamento pesado da sua loja de apps.
              </p>
              <ul className="mt-4 space-y-3 text-sm text-ash">
                <li className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-forest bg-forest/10 rounded-md px-1.5 py-0.5 text-xs">Android</span>
                  <span>No Chrome, toque no menu <strong className="text-forest">⋮</strong> e selecione <strong className="text-forest">Instalar aplicativo</strong> ou Adicionar à tela inicial.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-forest bg-forest/10 rounded-md px-1.5 py-0.5 text-xs">iPhone</span>
                  <span>No Safari, toque no botão de <strong className="text-forest">Compartilhar</strong> e selecione <strong className="text-forest">Adicionar à Tela de Início</strong>.</span>
                </li>
              </ul>
              <MotionPress className="mt-6 inline-block">
                <Link href="/mapa" className="btn-primary inline-flex items-center gap-2">
                  Explorar Mapa 360°
                </Link>
              </MotionPress>
            </section>

            <section className="panel-soft p-6">
              <h2 className="font-display text-lg font-bold text-forest">
                Recursos Inclusos no App
              </h2>
              <ul className="mt-4 space-y-2.5">
                {features.map((text) => (
                  <li
                    key={text}
                    className="flex items-center gap-2.5 text-sm text-ash"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="glass-panel flex flex-col items-center p-6 text-center">
            <h2 className="font-display text-base font-bold text-forest">
              Acesso Rápido via QR
            </h2>
            <p className="text-xs text-ash mt-1 max-w-[180px]">Aponte a câmera do celular para abrir imediatamente</p>
            <div className="mt-4 p-2 bg-white rounded-xl shadow-inner border border-forest/10">
              <QrInstall />
            </div>
          </section>
        </StaggerItem>
      </StaggerReveal>
    </div>
  );
}
