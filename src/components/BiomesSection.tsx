"use client";

import Link from "next/link";
import { BIOMES_DATA } from "@/data/biomes";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/motion";
import { SectionAtmosphere } from "@/components/ui/section-atmosphere";
import { VerdantWash } from "@/components/ui/verdant-accent";
import { ArrowUpRight, Flame, Trees } from "lucide-react";

export function BiomesSection() {
  const biomesList = Object.values(BIOMES_DATA);

  return (
    <section id="biomas" className="section section-botanical relative overflow-hidden">
      <SectionAtmosphere variant="soft" />
      <VerdantWash tone="light" speed={0.35} />
      <div className="section-inner relative z-[1]">
        <StaggerReveal staggerChildren={0.09} delayChildren={0.04}>
          <StaggerItem soft>
            <p className="eyebrow text-forest-mid">Biodiversidade & Território</p>
          </StaggerItem>
          <StaggerItem>
            <h2 className="display mt-4 max-w-3xl text-3xl text-ink md:text-5xl">
              Os 7 Ambientes Brasileiros
            </h2>
          </StaggerItem>
          <StaggerItem soft>
            <p className="lede mt-5 max-w-2xl">
              Do dossel equatorial da Amazônia aos recifes do Sistema Costeiro-Marinho:
              monitoramento com dados oficiais do IBGE, MapBiomas e INPE.
            </p>
          </StaggerItem>
        </StaggerReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {biomesList.map((biome, i) => (
            <Reveal key={biome.id} delayMs={100 + i * 70} variant="fadeUp">
              <article className="panel-soft flex h-full flex-col justify-between p-6 transition-transform hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-forest/8 px-3 py-1 text-xs font-semibold text-forest">
                      {biome.category}
                    </span>
                    <span className="font-mono text-xs font-bold text-ash">
                      {biome.percentageBrazil}% do Brasil
                    </span>
                  </div>

                  <h3 className="display mt-4 text-2xl font-bold text-forest">
                    {biome.name}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-ash line-clamp-3">
                    {biome.description}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-forest/10 pt-4 text-xs">
                    <div>
                      <p className="text-ash/80">Veg. Nativa</p>
                      <p className="font-mono font-bold text-forest text-sm">
                        {biome.nativeVegetationPercentage}%
                      </p>
                    </div>
                    <div>
                      <p className="text-ash/80">Focos 24h</p>
                      <p className="font-mono font-bold text-burn text-sm flex items-center gap-1">
                        <Flame size={13} className="text-burn" />
                        {biome.activeFireHotspots24h}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-forest/10 flex items-center justify-between">
                  <Link
                    href={`/biomas?id=${biome.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-forest hover:text-forest-mid group"
                  >
                    <span>Ver detalhes científicos</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/mapa"
                    className="text-[11px] font-semibold text-ash hover:text-forest"
                  >
                    Localizar no mapa
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={300} className="mt-10 text-center">
          <Link
            href="/dashboard"
            className="btn btn-secondary inline-flex items-center gap-2 text-sm"
          >
            <Trees size={16} />
            <span>Acessar Painel Comparativo Completo</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
