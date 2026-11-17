import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BIOMES_DATA, BIOMES_LIST } from "@/data/biomes";
import type { BiomeId } from "@/data/types";
import { getResumoFocos } from "@/lib/firms/service";
import { FreshnessSeal } from "@/components/firms/FreshnessSeal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trees,
  Shield,
  Flame,
  TrendingDown,
  MapPin,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

export const revalidate = 900;

interface Props {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return BIOMES_LIST.map((b) => ({ id: b.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const biome = BIOMES_DATA[params.id];
  if (!biome) {
    return { title: "Ambiente não encontrado" };
  }
  return {
    title: `${biome.name} — Ficha Territorial`,
    description: biome.description,
  };
}

export default async function BiomeDetailPage({ params }: Props) {
  const biome = BIOMES_DATA[params.id];

  if (!biome) {
    notFound();
  }

  const resumo = await getResumoFocos({ periodo: "24h" });
  const biomeResumo = resumo.porBioma[biome.id as BiomeId];
  const updatedStr = new Date(resumo.atualizadoEm).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="section-inner max-w-4xl mx-auto py-8 space-y-12">
      <div>
        <Link
          href="/biomas"
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--primary)] hover:underline"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>Voltar para todos os 7 ambientes</span>
        </Link>
      </div>

      {/* Hero Editorial Simples */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border)] pb-8">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: biome.color }}
              aria-hidden="true"
            />
            <span className="eyebrow">{biome.category}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[var(--foreground)]">
            {biome.name}
          </h1>
          <p className="lede text-base text-[var(--foreground-secondary)]">
            {biome.description}
          </p>
          <div className="pt-1">
            <FreshnessSeal
              atualizadoEm={resumo.atualizadoEm}
              ultimoFocoEm={resumo.ultimoFocoEm}
              desatualizado={resumo.desatualizado}
              fonte={resumo.fonte}
              periodo="24h"
            />
          </div>
        </div>

        <Link
          href={`/mapa?bioma=${biome.id}&periodo=24h`}
          className="btn-primary shrink-0"
        >
          <MapPin size={15} strokeWidth={1.5} />
          <span>Abrir no mapa</span>
        </Link>
      </header>

      {/* 3 Números Principais (+ Focos 24h) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-panel p-6">
          <span className="text-xs text-[var(--muted)]">Vegetação nativa</span>
          <p className="mt-2 font-display text-4xl text-[var(--foreground)] tabular-nums">
            {biome.nativeVegetationPercentage}%
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {biome.areaKm2.toLocaleString("pt-BR")} km² ({biome.percentageBrazil}% do Brasil)
          </p>
        </div>

        <div className="glass-panel p-6">
          <span className="text-xs text-[var(--muted)]">Áreas protegidas (UCs)</span>
          <p className="mt-2 font-display text-4xl text-[var(--foreground)] tabular-nums">
            {biome.protectedAreaPercentage}%
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">Unidades ICMBio / MMA</p>
        </div>

        <div className="glass-panel p-6">
          <span className="text-xs text-[var(--muted)]">Focos ativos (24h)</span>
          <p className="mt-2 font-display text-4xl text-[var(--foreground)] tabular-nums flex items-center gap-2">
            <Flame size={22} strokeWidth={1.5} className="text-[#EA580C]" />
            {(biomeResumo?.total ?? 0).toLocaleString("pt-BR")}
          </p>
          <p className="mt-1 text-[11px] text-[var(--muted)]">
            NASA FIRMS · {updatedStr}
          </p>
        </div>
      </div>

      {/* Seções em Abas (Importância, Pressões, Fontes) para não alongar a página */}
      <Tabs defaultValue="importancia" className="space-y-6">
        <TabsList>
          <TabsTrigger value="importancia">Importância</TabsTrigger>
          <TabsTrigger value="pressoes">Pressões</TabsTrigger>
          <TabsTrigger value="fontes">Fontes</TabsTrigger>
        </TabsList>

        <TabsContent value="importancia">
          <div className="glass-panel p-7 space-y-4">
            <div className="flex items-center gap-2 text-[var(--primary)]">
              <Trees size={18} strokeWidth={1.5} />
              <h2 className="font-display text-2xl text-[var(--foreground)]">
                Importância ecológica e clima
              </h2>
            </div>
            <p className="lede text-sm sm:text-base text-[var(--foreground-secondary)]">
              {biome.ecologicalImportance}
            </p>
            <div className="pt-4 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-medium text-[var(--foreground)]">Regime climático:</span>
                <p className="mt-1 text-[var(--muted)]">{biome.climate}</p>
              </div>
              <div>
                <span className="font-medium text-[var(--foreground)]">Estados abrangidos:</span>
                <p className="mt-1 text-[var(--muted)]">{biome.states.join(", ")}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pressoes">
          <div className="glass-panel p-7 space-y-4">
            <div className="flex items-center gap-2 text-[var(--warning)]">
              <Shield size={18} strokeWidth={1.5} />
              <h2 className="font-display text-2xl text-[var(--foreground)]">
                Vetores de pressão e conservação
              </h2>
            </div>
            <ul className="space-y-2.5 text-sm text-[var(--foreground-secondary)]">
              {biome.mainThreats.map((threat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--primary)] shrink-0" />
                  <span>{threat}</span>
                </li>
              ))}
            </ul>
            {biome.deforestationTrendPercent !== null && (
              <div className="pt-4 border-t border-[var(--border)] flex items-center gap-2 text-xs text-[var(--primary)] font-medium">
                <TrendingDown size={15} strokeWidth={1.5} />
                <span>
                  Tendência PRODES 2024: {biome.deforestationTrendPercent}% em relação ao período anterior
                </span>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="fontes">
          <div className="glass-panel p-7 space-y-4">
            <h2 className="font-display text-2xl text-[var(--foreground)]">
              Bases científicas auditadas
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {biome.sources.map((src, i) => (
                <div
                  key={i}
                  className="rounded-[10px] border border-[var(--border)] bg-[var(--background)] p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between font-medium text-[var(--foreground)]">
                    <span>{src.name}</span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--primary)] hover:underline"
                      title="Abrir fonte oficial"
                    >
                      <ExternalLink size={13} strokeWidth={1.5} />
                    </a>
                  </div>
                  <p className="text-[var(--foreground-secondary)] leading-relaxed">
                    {src.description}
                  </p>
                  <p className="text-[11px] text-[var(--muted)]">
                    Atualização: {src.lastUpdated}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
