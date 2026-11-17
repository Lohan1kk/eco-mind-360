"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BIOMES_DATA } from "@/data/biomes";
import type { ResumoFocos } from "@/lib/firms/types";
import { useResumoFocos } from "@/lib/firms/useResumoFocos";
import { FreshnessSeal } from "@/components/firms/FreshnessSeal";
import { Card } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/magicui/number-ticker";
import { Reveal } from "@/components/ui/reveal";

export function BiomesSection({ initialResumo }: { initialResumo?: ResumoFocos | null }) {
  const biomesList = Object.values(BIOMES_DATA);
  const { resumo } = useResumoFocos("24h", initialResumo);

  return (
    <section
      id="biomas"
      className="section scroll-mt-20 bg-[var(--background)] border-b border-[var(--border)]"
    >
      <div className="section-inner space-y-12">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="eyebrow">Panorama Territorial</span>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-[var(--foreground)]">
              Os 7 ambientes brasileiros
            </h2>
            <p className="text-sm sm:text-base text-[var(--foreground-secondary)] leading-relaxed">
              Cobertura vegetal nativa remanescente e anomalias térmicas registradas por satélite nas últimas 24 horas.
            </p>
            <div className="pt-1">
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

          <Link
            href="/biomas"
            className="btn-secondary shrink-0"
          >
            <span>Ver fichas completas</span>
            <ArrowUpRight size={15} strokeWidth={1.5} />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {biomesList.map((biome) => {
            const count = resumo?.porBioma[biome.id]?.total;
            return (
              <Card
                key={biome.id}
                className="group flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-action)] hover:shadow-lift"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: biome.color }}
                        aria-hidden="true"
                      />
                      <h3 className="font-display text-2xl text-[var(--foreground)]">
                        {biome.name}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-[var(--muted)]">
                      {biome.percentageBrazil}% BR
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[var(--foreground-secondary)] leading-relaxed line-clamp-1">
                    {biome.description}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-4">
                    <div>
                      <span className="block text-[11px] text-[var(--muted)]">
                        Vegetação nativa
                      </span>
                      <p className="mt-0.5 text-lg font-semibold text-[var(--foreground)] font-mono">
                        <NumberTicker
                          value={biome.nativeVegetationPercentage}
                          decimalPlaces={1}
                        />
                        %
                      </p>
                    </div>

                    <div>
                      <span className="block text-[11px] text-[var(--muted)]">
                        Focos (24h)
                      </span>
                      <p className="mt-0.5 text-lg font-semibold text-[var(--foreground)] font-mono">
                        {count !== undefined ? (
                          <NumberTicker value={count} />
                        ) : (
                          "—"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                  <Link
                    href={`/biomas/${biome.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline"
                  >
                    <span>Explorar ambiente</span>
                    <ArrowUpRight size={14} strokeWidth={1.5} />
                  </Link>

                  <Link
                    href={`/mapa?bioma=${biome.id}&periodo=24h`}
                    className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Ver no mapa
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
