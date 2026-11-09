'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BIOMES_DATA } from '@/data/biomes';
import { ArrowUpRight, Flame, Trees, Shield, MapPin, Compass } from 'lucide-react';

export function BiomesSection() {
  const biomesList = Object.values(BIOMES_DATA);

  return (
    <section id="biomas" className="section bg-[#f8fafc] relative overflow-hidden">
      {/* Luz ambiente sutil */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-inner relative z-10 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-900/10 pb-6">
          <div>
            <div className="badge-360 mb-2">
              <Compass size={12} />
              <span>Panorama Territorial Oficial</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Os 7 Ambientes Brasileiros
            </h2>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              Cobertura continental auditada: do dossel amazônico aos recifes de corais da Zona Econômica Exclusiva.
              Acompanhe a proporção de vegetação nativa preservada e a pressão de queimadas.
            </p>
          </div>

          <Link
            href="/biomas"
            className="btn-secondary !py-2.5 !px-5 text-xs font-bold inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Ver matriz comparativa</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Grid dos 7 Biomas com Visual Bento Moderno */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {biomesList.map((biome) => (
            <motion.article
              key={biome.id}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Linha superior colorida com o tom oficial do bioma */}
              <div 
                className="absolute top-0 inset-x-0 h-1.5 opacity-90 transition-opacity group-hover:opacity-100"
                style={{ backgroundColor: biome.color }}
              />

              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {biome.category}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-slate-900 mt-2 group-hover:text-emerald-700 transition-colors">
                      {biome.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
                    {biome.percentageBrazil}% BR
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-5">
                  {biome.description}
                </p>

                {/* Métricas Principais */}
                <div className="space-y-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 mb-5">
                  <div>
                    <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700 mb-1">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Trees size={12} className="text-emerald-600" />
                        Vegetação Nativa
                      </span>
                      <span className="font-mono font-bold text-emerald-700">
                        {biome.nativeVegetationPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${biome.nativeVegetationPercentage}%`,
                          backgroundColor: biome.color,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700 mb-1">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Shield size={12} className="text-teal-600" />
                        Áreas Protegidas (UCs)
                      </span>
                      <span className="font-mono font-bold text-teal-700">
                        {biome.protectedAreaPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full transition-all duration-700"
                        style={{ width: `${biome.protectedAreaPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-600">
                    <Flame size={14} className="text-amber-500" />
                    <span className="font-mono">{biome.activeFireHotspots24h}</span>
                    <span className="text-[11px] font-normal text-slate-500">focos 24h</span>
                  </div>
                  <span className="font-mono text-[11px]">
                    {biome.areaKm2.toLocaleString('pt-BR')} km²
                  </span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <Link
                  href={`/biomas/${biome.id}`}
                  className="btn-primary !py-1.5 !px-3.5 text-xs font-bold inline-flex items-center gap-1"
                >
                  <span>Ficha Detalhada</span>
                  <ArrowUpRight size={13} />
                </Link>

                <Link
                  href="/mapa"
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
                >
                  <MapPin size={13} />
                  <span>Ver no Mapa</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
