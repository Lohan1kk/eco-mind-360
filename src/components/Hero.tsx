'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  LayoutDashboard, 
  ArrowUpRight, 
  Flame, 
  Trees, 
  Compass
} from 'lucide-react';
import { BIOMES_LIST } from '@/data/biomes';

export function Hero() {
  const [activeBiomeId, setActiveBiomeId] = useState<string>('amazonia');
  const activeBiome = BIOMES_LIST.find((b) => b.id === activeBiomeId) || BIOMES_LIST[0];

  return (
    <section className="relative min-h-[85svh] overflow-hidden bg-[#101512] text-[#DCE5DD] flex flex-col justify-between pt-24 pb-12 border-b border-[#222D25]">
      {/* Background Ambiental Sutil */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/brand/hero-ecomind-4k.jpg"
            alt="EcoMind 360 Background"
            fill
            priority
            quality={90}
            className="object-cover object-center grayscale-[25%]"
          />
        </div>

        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 25%, rgba(16, 21, 18, 0.45) 0%, rgba(16, 21, 18, 0.92) 70%, #101512 100%), linear-gradient(to bottom, rgba(16, 21, 18, 0.5) 0%, #101512 100%)',
          }}
        />
      </div>

      {/* Conteúdo Principal do Hero */}
      <div className="relative z-10 section-inner flex-1 flex flex-col justify-center py-8 md:py-12">
        <div className="max-w-3xl space-y-6">
          {/* Badge Orbital */}
          <div className="badge-360">
            <span className="inline-flex rounded-full h-1.5 w-1.5 bg-[#83A989]" />
            <span>Monitoramento Orbital 360° Ativo</span>
            <span className="text-[#78877D]">·</span>
            <span className="text-[#A7B3A9]">INPE & NASA FIRMS</span>
          </div>

          {/* Título Principal */}
          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-[#DCE5DD]">
              Inteligência Territorial para os{' '}
              <span className="text-[#91A88F]">
                7 Ambientes do Brasil.
              </span>
            </h1>
            <p className="max-w-2xl text-base sm:text-lg text-[#A7B3A9] font-normal leading-relaxed">
              Da Amazônia ao Sistema Costeiro-Marinho: acompanhe queimadas em tempo real por satélite,
              taxas auditadas de desmatamento (PRODES 2024) e indicadores ecológicos com R$ 0 de custo.
            </p>
          </div>

          {/* Ações */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/mapa"
              className="btn-primary !py-2.5 !px-5 text-xs font-semibold cursor-pointer"
            >
              <MapPin size={15} />
              <span>Abrir Mapa Orbital 360°</span>
              <span className="text-[10px] bg-[#101512]/20 px-1.5 py-0.5 rounded-[5px] font-mono">FRP</span>
            </Link>

            <Link
              href="/dashboard"
              className="btn-secondary !py-2.5 !px-5 text-xs font-medium cursor-pointer"
            >
              <LayoutDashboard size={15} className="text-[#91A88F]" />
              <span>Painel dos 7 Ambientes</span>
            </Link>

            <Link
              href="/biomas"
              className="px-3 py-2 text-xs font-medium text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors inline-flex items-center gap-1 group"
            >
              <span>Explorar Biomas</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Telemetria Rápida no Rodapé do Hero */}
      <div className="relative z-10 section-inner pt-8 border-t border-[#222D25]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-mono text-[#91A88F]">
                <Compass size={13} />
                Radar dos 7 Ambientes
              </span>
              <span className="hidden sm:inline text-[#78877D] text-[11px]">
                Selecione para alternar telemetria
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {BIOMES_LIST.map((biome) => {
                const isSelected = biome.id === activeBiomeId;
                return (
                  <button
                    key={biome.id}
                    type="button"
                    onClick={() => setActiveBiomeId(biome.id)}
                    className={`px-3 py-1.5 rounded-[7px] text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#789B7C] text-[#101512] font-semibold'
                        : 'bg-[#171F1A] hover:bg-[#1D2821] text-[#A7B3A9] hover:text-[#DCE5DD] border border-[#29362D]'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: isSelected ? '#101512' : biome.color }} 
                    />
                    <span>{biome.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              key={activeBiome.id}
              className="p-4 rounded-[10px] bg-[#171F1A] border border-[#29362D] flex items-center justify-between gap-4 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-base text-[#DCE5DD]">
                    {activeBiome.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-[5px] bg-[#1D2821] text-[#91A88F] border border-[#29362D]">
                    {activeBiome.percentageBrazil}% BR
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-[#A7B3A9]">
                  <span className="flex items-center gap-1 text-[#83A989] font-mono">
                    <Trees size={13} />
                    {activeBiome.nativeVegetationPercentage}% nativa
                  </span>
                  <span className="flex items-center gap-1 text-[#A9A17A] font-mono">
                    <Flame size={13} />
                    {activeBiome.activeFireHotspots24h} focos
                  </span>
                </div>
              </div>

              <Link
                href={`/biomas/${activeBiome.id}`}
                className="btn-secondary !py-1.5 !px-3 text-xs font-medium shrink-0"
              >
                <span>Ficha</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
