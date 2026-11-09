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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-forest/10 pb-4">
        <div>
          <h2 className="display text-2xl font-bold text-forest">
            Panorama dos 7 Ambientes Brasileiros
          </h2>
          <p className="text-xs sm:text-sm text-ash mt-1">
            Ficha sintética com indicadores territoriais consolidados do IBGE, MapBiomas e INPE
          </p>
        </div>
        <Link 
          href="/biomas" 
          className="text-xs font-bold text-forest hover:text-forest-mid inline-flex items-center gap-1 group"
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
              className="panel-soft flex flex-col justify-between p-6 transition-transform hover:-translate-y-1"
            >
              <div>
                {/* Cabeçalho do Card */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-mid">
                      {biome.category}
                    </span>
                    <h3 className="display font-bold text-xl text-forest mt-0.5">
                      {biome.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-forest/8 text-forest">
                    {biome.percentageBrazil}% BR
                  </span>
                </div>

                {/* Área Territorial e Estados */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4 p-3 rounded-xl bg-mist border border-forest/10">
                  <div>
                    <div className="text-[10px] text-ash uppercase font-semibold">Área Oficial</div>
                    <div className="font-bold font-mono text-forest">
                      {(biome.areaKm2).toLocaleString('pt-BR')} km²
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ash uppercase font-semibold">Estados</div>
                    <div className="font-medium text-ink truncate" title={biome.states.join(', ')}>
                      {biome.states.slice(0, 4).join(', ')}{biome.states.length > 4 ? '...' : ''}
                    </div>
                  </div>
                </div>

                {/* Barras de Progresso: Vegetação Nativa & Áreas Protegidas */}
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-ash flex items-center gap-1 font-medium">
                        <Trees size={12} className="text-forest" />
                        Vegetação Nativa
                      </span>
                      <span className="font-mono font-bold text-forest">
                        {biome.nativeVegetationPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-forest/10 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-forest transition-all duration-500"
                        style={{ width: `${biome.nativeVegetationPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-ash flex items-center gap-1 font-medium">
                        <Shield size={12} className="text-forest-mid" />
                        Áreas Protegidas (UCs)
                      </span>
                      <span className="font-mono font-bold text-forest-mid">
                        {biome.protectedAreaPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-forest/10 overflow-hidden">
                      <div 
                        className="h-full bg-forest-mid rounded-full transition-all duration-500"
                        style={{ width: `${biome.protectedAreaPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Indicador de Focos de calor ou Desmatamento 2024 */}
                <div className="mt-4 pt-3 border-t border-forest/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-burn font-bold">
                    <Flame size={14} />
                    <span className="font-mono">{biome.activeFireHotspots24h}</span>
                    <span className="text-[11px] text-ash font-normal">focos 24h</span>
                  </div>

                  {biome.deforestationTrendPercent !== null ? (
                    <div className="flex items-center gap-1 text-[11px] text-forest font-bold">
                      <TrendingDown size={13} />
                      <span>{biome.deforestationTrendPercent}% PRODES 24</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-ash italic">
                      {isMarine ? 'Eco Marinho (ZEE)' : 'Dados em Análise'}
                    </span>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="mt-5 pt-3 border-t border-forest/10 flex items-center gap-2">
                <Link
                  href={`/biomas?id=${biome.id}`}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-bold btn-primary text-center flex items-center justify-center gap-1"
                >
                  <span>Ver perfil</span>
                  <ArrowUpRight size={13} />
                </Link>
                <Link
                  href="/mapa"
                  className="py-2 px-3 rounded-xl text-xs font-semibold btn-secondary text-forest flex items-center gap-1"
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
