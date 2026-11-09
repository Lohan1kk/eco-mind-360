import React from 'react';
import Link from 'next/link';
import { BIOMES_LIST } from '@/data/biomes';
import { 
  Flame, 
  Shield, 
  MapPin, 
  ArrowUpRight, 
  Trees, 
  TrendingDown
} from 'lucide-react';

export function BiomeSummaryGrid() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Panorama dos 7 Ambientes Brasileiros
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Ficha sintética com indicadores territoriais consolidados do IBGE, MapBiomas e INPE
          </p>
        </div>
        <Link 
          href="/biomas" 
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 group"
        >
          <span>Explorar perfis científicos detalhados</span>
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BIOMES_LIST.map((biome) => {
          const isMarine = biome.id === 'costeiro_marinho';

          return (
            <div
              key={biome.id}
              className="glass-panel flex flex-col justify-between p-6 transition-transform hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Barra colorida do bioma */}
              <div
                className="absolute top-0 inset-x-0 h-1.5"
                style={{ backgroundColor: biome.color }}
              />

              <div>
                {/* Cabeçalho do Card */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {biome.category}
                    </span>
                    <h3 className="font-display font-bold text-xl text-slate-900 mt-1">
                      {biome.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                    {biome.percentageBrazil}% BR
                  </span>
                </div>

                {/* Área Territorial e Estados */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Área Oficial</div>
                    <div className="font-bold font-mono text-slate-900">
                      {(biome.areaKm2).toLocaleString('pt-BR')} km²
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Estados</div>
                    <div className="font-medium text-slate-700 truncate" title={biome.states.join(', ')}>
                      {biome.states.slice(0, 4).join(', ')}{biome.states.length > 4 ? '...' : ''}
                    </div>
                  </div>
                </div>

                {/* Barras de Progresso */}
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-slate-600 flex items-center gap-1 font-medium">
                        <Trees size={12} className="text-emerald-600" />
                        Vegetação Nativa
                      </span>
                      <span className="font-mono font-bold text-emerald-700">
                        {biome.nativeVegetationPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${biome.nativeVegetationPercentage}%`,
                          backgroundColor: biome.color 
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-slate-600 flex items-center gap-1 font-medium">
                        <Shield size={12} className="text-teal-600" />
                        Áreas Protegidas (UCs)
                      </span>
                      <span className="font-mono font-bold text-teal-700">
                        {biome.protectedAreaPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div 
                        className="h-full bg-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${biome.protectedAreaPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Indicador de Focos e Desmatamento */}
                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                    <Flame size={14} />
                    <span className="font-mono">{biome.activeFireHotspots24h}</span>
                    <span className="text-[11px] text-slate-500 font-normal">focos 24h</span>
                  </div>

                  {biome.deforestationTrendPercent !== null ? (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                      <TrendingDown size={13} />
                      <span>{biome.deforestationTrendPercent}% PRODES 24</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">
                      {isMarine ? 'Eco Marinho (ZEE)' : 'Dados em Análise'}
                    </span>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="mt-5 pt-3 border-t border-slate-200/70 flex items-center gap-2">
                <Link
                  href={`/biomas/${biome.id}`}
                  className="flex-1 btn-primary !py-1.5 !px-3 text-xs font-bold text-center flex items-center justify-center gap-1"
                >
                  <span>Ver perfil</span>
                  <ArrowUpRight size={13} />
                </Link>
                <Link
                  href="/mapa"
                  className="btn-secondary !py-1.5 !px-3 text-xs font-semibold flex items-center gap-1"
                  title="Ver no mapa interativo"
                >
                  <MapPin size={13} />
                  <span>Mapa</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
