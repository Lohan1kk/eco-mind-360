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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222D25] pb-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#DCE5DD]">
            Panorama dos 7 Ambientes Brasileiros
          </h2>
          <p className="text-xs sm:text-sm text-[#A7B3A9] mt-1">
            Ficha sintética com indicadores territoriais consolidados do IBGE, MapBiomas e INPE
          </p>
        </div>
        <Link 
          href="/biomas" 
          className="text-xs font-medium text-[#91A88F] hover:text-[#DCE5DD] inline-flex items-center gap-1 group"
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
              className="glass-panel flex flex-col justify-between p-6 relative"
            >
              <div>
                {/* Cabeçalho do Card */}
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
                    <h3 className="font-display font-semibold text-lg text-[#DCE5DD] mt-1">
                      {biome.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-[5px] bg-[#1D2821] text-[#A7B3A9] border border-[#29362D]">
                    {biome.percentageBrazil}% BR
                  </span>
                </div>

                {/* Área Territorial e Estados */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-4 py-3 border-y border-[#222D25]">
                  <div>
                    <div className="text-[10px] text-[#78877D] uppercase font-mono">Área Oficial</div>
                    <div className="font-medium font-mono text-[#DCE5DD] mt-0.5">
                      {(biome.areaKm2).toLocaleString('pt-BR')} km²
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#78877D] uppercase font-mono">Estados</div>
                    <div className="font-medium text-[#A7B3A9] truncate mt-0.5" title={biome.states.join(', ')}>
                      {biome.states.slice(0, 4).join(', ')}{biome.states.length > 4 ? '...' : ''}
                    </div>
                  </div>
                </div>

                {/* Barras de Progresso */}
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-[#A7B3A9] flex items-center gap-1">
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
                          backgroundColor: '#789B7C'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-[#A7B3A9] flex items-center gap-1">
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

                {/* Indicador de Focos e Desmatamento */}
                <div className="mt-4 pt-3 border-t border-[#222D25] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#A9A17A] font-medium">
                    <Flame size={13} />
                    <span className="font-mono">{biome.activeFireHotspots24h}</span>
                    <span className="text-[11px] text-[#78877D] font-normal">focos 24h</span>
                  </div>

                  {biome.deforestationTrendPercent !== null ? (
                    <div className="flex items-center gap-1 text-[11px] text-[#83A989] font-mono">
                      <TrendingDown size={13} />
                      <span>{biome.deforestationTrendPercent}% PRODES 24</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-[#78877D] font-mono">
                      {isMarine ? 'Eco Marinho (ZEE)' : 'Dados em Análise'}
                    </span>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="mt-5 pt-3 border-t border-[#222D25] flex items-center gap-2">
                <Link
                  href={`/biomas/${biome.id}`}
                  className="flex-1 btn-primary !py-1.5 !px-3 text-xs font-medium text-center flex items-center justify-center gap-1"
                >
                  <span>Ver perfil</span>
                  <ArrowUpRight size={13} />
                </Link>
                <Link
                  href="/mapa"
                  className="btn-secondary !py-1.5 !px-3 text-xs font-medium flex items-center gap-1"
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
