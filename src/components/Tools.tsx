"use client";

import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Calculator,
  GitCompare,
  LayoutDashboard,
  MapPin,
} from "lucide-react";
import { BorderBeam } from "@/components/ui/magicui/border-beam";
import { Reveal } from "@/components/ui/reveal";

const TOOLS = [
  {
    href: "/mapa",
    title: "Mapa ao Vivo",
    desc: "Visualize milhares de focos de calor da NASA e do INPE classificados por potência radiativa nos 7 ambientes.",
    icon: MapPin,
    featured: true,
    span: "md:col-span-2",
  },
  {
    href: "/dashboard",
    title: "Dashboard Territorial",
    desc: "Série histórica PRODES, cobertura vegetal MapBiomas e áreas protegidas.",
    icon: LayoutDashboard,
    featured: false,
    span: "md:col-span-1",
  },
  {
    href: "/alertas",
    title: "Alertas e Ocorrências",
    desc: "Consulta filtrável de anomalias térmicas e alertas DETER com exportação CSV.",
    icon: AlertTriangle,
    featured: false,
    span: "md:col-span-1",
  },
  {
    href: "/calculadora",
    title: "Calculadora de Carbono",
    desc: "Estime sua emissão anual em kg de CO₂e em transporte, alimentação e energia.",
    icon: Calculator,
    featured: false,
    span: "md:col-span-1",
  },
  {
    href: "/comparacao",
    title: "Comparador de Ambientes",
    desc: "Confronte dois ambientes brasileiros lado a lado em múltiplas dimensões.",
    icon: GitCompare,
    featured: false,
    span: "md:col-span-1",
  },
];

export function Tools() {
  return (
    <section
      id="ferramentas"
      className="section scroll-mt-20 bg-[var(--background)] border-b border-[var(--border)]"
    >
      <div className="section-inner space-y-12">
        <Reveal className="max-w-xl space-y-3">
          <span className="eyebrow">Ferramentas</span>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-[var(--foreground)]">
            Instrumentos abertos para monitorar e agir
          </h2>
          <p className="text-sm sm:text-base text-[var(--foreground-secondary)] leading-relaxed">
            Explore os módulos interativos construídos sobre bases públicas auditadas.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`group relative overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-action)] hover:shadow-lift ${t.span}`}
              >
                {t.featured && (
                  <BorderBeam
                    size={200}
                    duration={14}
                    colorFrom="#1F5A3A"
                    colorTo="#7BC796"
                  />
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--accent-soft)] text-[var(--primary)]">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.5}
                      className="text-[var(--muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--primary)]"
                    />
                  </div>

                  <h3 className="font-display text-2xl text-[var(--foreground)]">
                    {t.title}
                  </h3>

                  <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
