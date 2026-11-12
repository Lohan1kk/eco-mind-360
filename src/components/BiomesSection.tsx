'use client';

import React from 'react';
import Link from 'next/link';
import { BIOMES_DATA } from '@/data/biomes';
import { ArrowUpRight, Flame, Trees, Shield, MapPin, Compass } from 'lucide-react';

export function BiomesSection() {
  const biomesList = Object.values(BIOMES_DATA);

  return (
    <section id="biomas" className="section bg-[#101512] border-b border-[#222D25] relative">
      <div className="section-inner relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#222D25] pb-6">
          <div>
            <div className="badge-360 mb-2">
              <Compass size={12} />
              <span>Panorama Territorial Oficial</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#DCE5DD] tracking-tight">
              Os 7 Ambientes Brasileiros
            </h2>
            <p className="mt-3 max-w-2xl text-base text-[#A7B3A9]">
              Cobertura continental auditada: do dossel amazônico aos recifes de corais da Zona Econômica Exclusiva.
              Acompanhe a proporção de vegetação nativa preservada e a pressão de queimadas.
            </p>
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
          {biomesList.map((biome) => (
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

                <div className="flex items-center justify-between text-xs text-[#78877D] pb-1">
                  <div className="flex items-center gap-1.5 font-medium text-[#A9A17A]">
                    <Flame size={13} />
                    <span className="font-mono">{biome.activeFireHotspots24h}</span>
                    <span className="text-[11px] font-normal text-[#78877D]">focos 24h</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#78877D]">
                    {biome.areaKm2.toLocaleString('pt-BR')} km²
                  </span>
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
                  href="/mapa"
                  className="px-3 py-1.5 text-xs font-medium text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors inline-flex items-center gap-1"
                >
                  <MapPin size={13} className="text-[#789B7C]" />
                  <span>Ver no Mapa</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
