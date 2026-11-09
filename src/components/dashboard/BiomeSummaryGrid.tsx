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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Os 7 Ambientes Brasileiros</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              (Monitoramento Contínuo)
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ficha sintética com indicadores territoriais e conservação oficial
          </p>
        </div>
        <Link 
          href="/biomas" 
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          Ver todos os perfis →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {BIOMES_LIST.map((biome) => {
          const isMarine = biome.id === 'costeiro_marinho';

          return (
            <div
              key={biome.id}
              className="group p-5 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden"
            >
              {/* Barra de cor do bioma no topo */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5" 
                style={{ backgroundColor: biome.color }} 
              />

              <div>
                {/* Cabeçalho do Card */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: biome.color }} />
                      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">
                        {biome.name}
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {biome.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {biome.percentageBrazil}% do Brasil
                  </span>
                </div>

                {/* Área Territorial e Estados */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Área Oficial</div>
                    <div className="font-bold font-mono text-slate-800 dark:text-slate-200">
                      {(biome.areaKm2).toLocaleString('pt-BR')} km²
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Estados</div>
                    <div className="font-medium text-slate-700 dark:text-slate-300 truncate" title={biome.states.join(', ')}>
                      {biome.states.slice(0, 5).join(', ')}{biome.states.length > 5 ? '...' : ''}
                    </div>
                  </div>
                </div>

                {/* Barras de Progresso: Vegetação Nativa & Áreas Protegidas */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Trees size={12} className="text-emerald-500" />
                        Vegetação Nativa
                      </span>
                      <span className="font-mono font-bold text-emerald-500">
                        {biome.nativeVegetationPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
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
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Shield size={12} className="text-blue-500" />
                        Áreas Protegidas (UCs)
                      </span>
                      <span className="font-mono font-bold text-blue-500">
                        {biome.protectedAreaPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${biome.protectedAreaPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Indicador de Focos de calor ou Desmatamento 2024 */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <Flame size={14} />
                    <span className="font-mono font-bold">{biome.activeFireHotspots24h}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">focos 24h</span>
                  </div>

                  {biome.deforestationTrendPercent !== null ? (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                      <TrendingDown size={13} />
                      <span>{biome.deforestationTrendPercent}% PRODES 24</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic font-mono">
                      {isMarine ? 'Eco Marinho (ZEE)' : 'Dados em Análise'}
                    </span>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2">
                <Link
                  href={`/biomas/${biome.id}`}
                  className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-200 text-center transition-colors flex items-center justify-center gap-1"
                >
                  <span>Perfil Completo</span>
                  <ArrowUpRight size={13} />
                </Link>
                <Link
                  href={`/mapa?biome=${biome.id}`}
                  className="py-1.5 px-3 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1"
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
