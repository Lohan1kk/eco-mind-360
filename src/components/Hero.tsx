'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
    <section className="relative min-h-[92svh] overflow-hidden bg-[#09110e] text-white flex flex-col justify-between pt-24 pb-12">
      {/* Background Dinâmico Bio-Orbital 360 */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Foto de fundo 4K com tratamento cinematográfico escuro */}
        <div className="absolute inset-0 opacity-25 scale-105 transition-transform duration-1000 ease-out">
          <Image
            src="/brand/hero-ecomind-4k.jpg"
            alt="EcoMind 360 Background"
            fill
            priority
            quality={90}
            className="object-cover object-center"
          />
        </div>

        {/* Gradientes e Radiais de Luz Atmosférica */}
        <div className="absolute top-[-20%] left-[20%] w-[650px] h-[650px] rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[550px] h-[550px] rounded-full bg-teal-500/10 blur-[130px]" />
        <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] rounded-full bg-emerald-400/10 blur-[90px]" />

        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, transparent 20%, rgba(9, 17, 14, 0.85) 70%, #09110e 100%), linear-gradient(to bottom, rgba(9, 17, 14, 0.4) 0%, #09110e 100%)',
          }}
        />

        {/* Grade vetorial sutil no fundo */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      {/* Conteúdo Principal do Hero */}
      <div className="relative z-10 section-inner flex-1 flex flex-col justify-center py-6 md:py-10">
        <div className="max-w-4xl space-y-6">
          {/* Badge 360 Orbital Live */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.2)] backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider">
              Monitoramento Orbital 360° Ativo
            </span>
            <span className="text-emerald-500/60">•</span>
            <span className="text-[11px] font-semibold text-emerald-200/90">INPE & NASA FIRMS</span>
          </motion.div>

          {/* Título de Impacto Único EcoMind 360 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
              Inteligência Territorial para os{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sprout">
                7 Ambientes do Brasil.
              </span>
            </h1>
            <p className="max-w-2xl text-base sm:text-xl text-slate-300/90 font-normal leading-relaxed">
              Da Amazônia ao Sistema Costeiro-Marinho: acompanhe queimadas em tempo real por satélite,
              taxas auditadas de desmatamento (PRODES 2024) e indicadores ecológicos com R$ 0 de custo.
            </p>
          </motion.div>

          {/* Botões de Ação com Alta Fluidez */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <Link
              href="/mapa"
              className="btn-primary !py-3.5 !px-6 text-sm font-bold shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_40px_rgba(16,185,129,0.55)] group cursor-pointer"
            >
              <MapPin size={18} className="text-emerald-200 group-hover:scale-110 transition-transform" />
              <span>Abrir Mapa Orbital 360°</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">FRP</span>
            </Link>

            <Link
              href="/dashboard"
              className="btn-ghost !py-3.5 !px-6 text-sm font-bold cursor-pointer inline-flex items-center gap-2 hover:bg-white/15"
            >
              <LayoutDashboard size={18} className="text-teal-300" />
              <span>Painel dos 7 Ambientes</span>
            </Link>

            <Link
              href="/biomas"
              className="px-4 py-3 text-xs font-bold text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1 group"
            >
              <span>Explorar Biomas</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Widget Interativo 360° de Telemetria Rápida no Rodapé do Hero */}
      <div className="relative z-10 section-inner pt-6 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Seletor Rápido dos 7 Biomas com Transição Fluida */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-bold text-emerald-400">
                <Compass size={14} />
                Radar dos 7 Ambientes
              </span>
              <span className="hidden sm:inline text-slate-400 text-[11px]">
                Clique para alternar telemetria instantânea
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {BIOMES_LIST.map((biome) => {
                const isSelected = biome.id === activeBiomeId;
                return (
                  <button
                    key={biome.id}
                    onClick={() => setActiveBiomeId(biome.id)}
                    className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: isSelected ? '#09110e' : biome.color }} 
                    />
                    <span>{biome.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cartão de Telemetria Dinâmica do Bioma Selecionado */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBiome.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-2xl bg-white/10 border border-emerald-500/30 backdrop-blur-xl flex items-center justify-between gap-4 shadow-xl"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-base text-white">
                      {activeBiome.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      {activeBiome.percentageBrazil}% BR
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300">
                    <span className="flex items-center gap-1 text-emerald-400 font-mono font-bold">
                      <Trees size={13} />
                      {activeBiome.nativeVegetationPercentage}% nativa
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                      <Flame size={13} />
                      {activeBiome.activeFireHotspots24h} focos
                    </span>
                  </div>
                </div>

                <Link
                  href={`/biomas/${activeBiome.id}`}
                  className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                >
                  <span>Ficha</span>
                  <ArrowUpRight size={14} />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
