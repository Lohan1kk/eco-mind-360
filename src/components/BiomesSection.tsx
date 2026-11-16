'use client';

import React from 'react';
import Link from 'next/link';
import { BIOMES_DATA } from '@/data/biomes';
import type { ResumoFocos } from '@/lib/firms/types';
import { useResumoFocos } from '@/lib/firms/useResumoFocos';
import { FreshnessSeal } from '@/components/firms/FreshnessSeal';
import { ArrowUpRight, Flame, Trees, Shield, MapPin, Compass } from 'lucide-react';

export function BiomesSection({ initialResumo }: { initialResumo?: ResumoFocos | null }) {
  const biomesList = Object.values(BIOMES_DATA);
  const { resumo } = useResumoFocos('24h', initialResumo);

  const updatedTimeStr = resumo?.atualizadoEm
    ? new Date(resumo.atualizadoEm).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <section id="biomas" className="section scroll-mt-20 bg-[#101512] border-b border-[#222D25] relative">
      <div className="section-inner relative z-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#222D25] pb-6">
          <div className="space-y-3">
            <div className="badge-360">
              <Compass size={12} />
              <span>Panorama Territorial Oficial</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#DCE5DD] tracking-tight">
              Os 7 Ambientes Brasileiros
            </h2>
            <p className="max-w-2xl text-base text-[#A7B3A9]">
              Cobertura continental auditada: do dossel amazônico aos recifes de corais da Zona Econômica Exclusiva.
              Acompanhe a proporção de vegetação nativa preservada e a pressão de queimadas nas últimas 24 h.
            </p>
            <FreshnessSeal
              atualizadoEm={resumo?.atualizadoEm}
              ultimoFocoEm={resumo?.ultimoFocoEm}
              desatualizado={resumo?.desatualizado}
              fonte={resumo?.fonte}
              periodo="24h"
            />
          </div>

          <Link
            href="/biomas"
            className="btn-secondary !py-2 !px-4 text-xs font-medium inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Ver matriz comparativa</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Grid Editorial dos 7 Biomas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {biomesList.map((biome) => {
            const count = resumo?.porBioma[biome.id]?.total;
            return (
              <article
                key={biome.id}
                className="glass-panel p-6 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: biome.color }}
                        />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#91A88F]">
                          {biome.category}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-semibold text-[#DCE5DD] mt-1.5 group-hover:text-[#91A88F] transition-colors">
                        {biome.name}
                      </h3>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-[5px] bg-[#1D2821] text-[#A7B3A9] border border-[#29362D]">
                      {biome.percentageBrazil}% BR
                    </span>
                  </div>

                  <p className="text-xs text-[#A7B3A9] leading-relaxed line-clamp-3 mb-5">
                    {biome.description}
                  </p>

                  {/* Métricas com barras limpas sem sub-cards */}
                  <div className="space-y-3 py-3 border-y border-[#222D25] mb-4">
                    <div>
                      <div className="flex justify-between items-center text-[11px] mb-1.5">
                        <span className="flex items-center gap-1.5 text-[#A7B3A9]">
                          <Trees size={12} className="text-[#789B7C]" />
                          Vegetação Nativa
                        </span>
                        <span className="font-mono font-medium text-[#DCE5DD]">
                          {biome.nativeVegetationPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-[#1D2821] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${biome.nativeVegetationPercentage}%`,
                            backgroundColor: '#789B7C',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[11px] mb-1.5">
                        <span className="flex items-center gap-1.5 text-[#A7B3A9]">
                          <Shield size={12} className="text-[#91A88F]" />
                          Áreas Protegidas (UCs)
                        </span>
                        <span className="font-mono font-medium text-[#DCE5DD]">
                          {biome.protectedAreaPercentage}%
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-[#1D2821] overflow-hidden">
                        <div
                          className="h-full bg-[#667F61] rounded-full"
                          style={{ width: `${biome.protectedAreaPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 pb-1">
                    <div className="flex items-center justify-between text-xs text-[#78877D]">
                      <div className="flex items-center gap-1.5 font-medium text-[#A9A17A]">
                        <Flame size={13} />
                        <span className="font-mono">
                          {count !== undefined ? count.toLocaleString('pt-BR') : '—'}
                        </span>
                        <span className="text-[11px] font-normal text-[#78877D]">
                          focos (últimas 24 h)
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-[#78877D]">
                        {biome.areaKm2.toLocaleString('pt-BR')} km²
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-[#78877D]">
                      Fonte: NASA FIRMS{updatedTimeStr ? ` · ${updatedTimeStr}` : ''}
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="pt-4 mt-3 border-t border-[#222D25] flex items-center justify-between gap-2">
                  <Link
                    href={`/biomas/${biome.id}`}
                    className="btn-primary !py-1.5 !px-3.5 text-xs font-medium inline-flex items-center gap-1"
                  >
                    <span>Ficha Detalhada</span>
                    <ArrowUpRight size={13} />
                  </Link>

                  <Link
                    href={`/mapa?bioma=${biome.id}&periodo=24h`}
                    className="px-3 py-1.5 text-xs font-medium text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors inline-flex items-center gap-1"
                  >
                    <MapPin size={13} className="text-[#789B7C]" />
                    <span>Ver no Mapa</span>
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
