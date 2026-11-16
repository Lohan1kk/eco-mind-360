'use client';

import React from 'react';
import Link from 'next/link';
import { BIOMES_DATA } from '@/data/biomes';
import type { ResumoFocos } from '@/lib/firms/types';
import { useResumoFocos } from '@/lib/firms/useResumoFocos';
import { FreshnessSeal } from '@/components/firms/FreshnessSeal';
import { ArrowUpRight, Flame, Trees, MapPin, Compass } from 'lucide-react';

export function BiomesSection({ initialResumo }: { initialResumo?: ResumoFocos | null }) {
  const biomesList = Object.values(BIOMES_DATA);
  const { resumo } = useResumoFocos('24h', initialResumo);

  return (
    <section id="biomas" className="section scroll-mt-20 bg-[#101512] border-b border-[#222D25] relative">
      <div className="section-inner relative z-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#222D25] pb-5">
          <div className="space-y-2.5">
            <div className="badge-360">
              <Compass size={12} />
              <span>Panorama Territorial</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#DCE5DD] tracking-tight">
              Os 7 Ambientes Brasileiros
            </h2>
            <FreshnessSeal
              atualizadoEm={resumo?.atualizadoEm}
              ultimoFocoEm={resumo?.ultimoFocoEm}
              desatualizado={resumo?.desatualizado}
              fonte={resumo?.fonte}
              periodo="24h"
              compact
            />
          </div>

          <Link
            href="/biomas"
            className="btn-secondary !py-2 !px-4 text-xs font-medium inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Ver detalhes dos biomas</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Grid Limpo dos 7 Biomas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {biomesList.map((biome) => {
            const count = resumo?.porBioma[biome.id]?.total;
            return (
              <article
                key={biome.id}
                className="glass-panel p-5 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: biome.color }}
                      />
                      <h3 className="font-display text-lg font-semibold text-[#DCE5DD] group-hover:text-[#91A88F] transition-colors">
                        {biome.name}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-[5px] bg-[#1D2821] text-[#A7B3A9] border border-[#29362D]">
                      {biome.percentageBrazil}% BR
                    </span>
                  </div>

                  <p className="text-xs text-[#A7B3A9] leading-relaxed line-clamp-2 mb-4">
                    {biome.description}
                  </p>

                  {/* Dois indicadores diretos e limpos */}
                  <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-[#222D25]">
                    <div>
                      <span className="flex items-center gap-1 text-[11px] text-[#A7B3A9]">
                        <Trees size={12} className="text-[#789B7C]" />
                        Veg. Nativa
                      </span>
                      <p className="mt-0.5 font-mono text-sm font-semibold text-[#DCE5DD]">
                        {biome.nativeVegetationPercentage}%
                      </p>
                    </div>

                    <div>
                      <span className="flex items-center gap-1 text-[11px] text-[#A7B3A9]">
                        <Flame size={12} className="text-[#FB923C]" />
                        Focos (24h)
                      </span>
                      <p className="mt-0.5 font-mono text-sm font-semibold text-[#DCE5DD]">
                        {count !== undefined ? count.toLocaleString('pt-BR') : '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="pt-3.5 flex items-center justify-between gap-2">
                  <Link
                    href={`/biomas/${biome.id}`}
                    className="text-xs font-medium text-[#91A88F] hover:text-[#DCE5DD] inline-flex items-center gap-1"
                  >
                    <span>Conhecer bioma</span>
                    <ArrowUpRight size={13} />
                  </Link>

                  <Link
                    href={`/mapa?bioma=${biome.id}&periodo=24h`}
                    className="px-2.5 py-1 rounded-[6px] bg-[#1D2821] border border-[#29362D] text-xs font-medium text-[#DCE5DD] hover:border-[#789B7C] transition-colors inline-flex items-center gap-1"
                  >
                    <MapPin size={12} className="text-[#789B7C]" />
                    <span>Mapa</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
