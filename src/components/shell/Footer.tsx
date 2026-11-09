import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200/80 bg-[#09110e] text-slate-300 py-14">
      <div className="section-inner relative z-10 flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/icon-ecomind.png"
              alt="EcoMind 360"
              width={34}
              height={34}
              className="h-8 w-8 object-contain"
            />
            <span className="font-display text-xl font-black text-white">
              EcoMind <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold">360°</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Plataforma aberta de inteligência territorial para os 7 ambientes brasileiros.
            Sensoriamento orbital quase em tempo real integrado às bases oficiais do INPE, NASA, MapBiomas e IBGE.
          </p>
          <div className="pt-2 text-[11px] text-emerald-400/90 font-mono">
            <span>Ana Flávia</span> • <span>André Zauli</span> • <span>Lucas Lohan</span> • <span>Gabriel Rosa</span>
          </div>
        </div>

        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-12 gap-y-6 text-xs">
          <div className="flex flex-col space-y-2.5">
            <span className="font-bold uppercase tracking-wider text-emerald-400 text-[10px]">
              Navegação 360°
            </span>
            <Link href="/" className="hover:text-emerald-300 transition-colors">Início</Link>
            <Link href="/dashboard" className="hover:text-emerald-300 transition-colors">Dashboard Territorial</Link>
            <Link href="/mapa" className="hover:text-emerald-300 transition-colors">Mapa de Queimadas</Link>
            <Link href="/biomas" className="hover:text-emerald-300 transition-colors">Os 7 Ambientes</Link>
            <Link href="/alertas" className="hover:text-emerald-300 transition-colors">Alertas Orbitais</Link>
          </div>

          <div className="flex flex-col space-y-2.5">
            <span className="font-bold uppercase tracking-wider text-emerald-400 text-[10px]">
              Prática & Análise
            </span>
            <Link href="/calculadora" className="hover:text-emerald-300 transition-colors">Calculadora de Carbono</Link>
            <Link href="/quiz" className="hover:text-emerald-300 transition-colors">Quiz & Folclore</Link>
            <Link href="/comparacao" className="hover:text-emerald-300 transition-colors">Comparador Multicritério</Link>
            <Link href="/metodologia" className="hover:text-emerald-300 transition-colors">Metodologia Científica</Link>
          </div>
        </nav>
      </div>

      <div className="section-inner relative z-10 mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© 2024 EcoMind 360° · Projeto Estudantil Colégio Paulo de Tarso</p>
        <p className="font-mono text-emerald-400/70 text-[11px]">
          100% Gratuito (R$ 0) · Dados Públicos Oficiais
        </p>
      </div>
    </footer>
  );
}
