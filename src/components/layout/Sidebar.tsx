'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Trees, 
  AlertTriangle, 
  Scale, 
  BookOpenCheck, 
  Home, 
  Menu, 
  X, 
  Radio, 
  Database
} from 'lucide-react';
import { BIOMES_LIST } from '@/data/biomes';

const NAV_ITEMS = [
  { href: '/', label: 'Apresentação', icon: Home, badge: 'Início' },
  { href: '/dashboard', label: 'Dashboard Geral', icon: LayoutDashboard, badge: 'Principal' },
  { href: '/mapa', label: 'Mapa Interativo', icon: MapIcon, badge: 'GeoJSON' },
  { href: '/biomas', label: 'Os 7 Ambientes', icon: Trees, count: '7' },
  { href: '/alertas', label: 'Alertas em Tempo Real', icon: AlertTriangle, alertDot: true },
  { href: '/comparacao', label: 'Comparador de Biomas', icon: Scale },
  { href: '/metodologia', label: 'Metodologia & Fontes', icon: BookOpenCheck },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Botão de menu Mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-slate-900/90 text-white border border-slate-700 backdrop-blur shadow-md"
        aria-label="Abrir menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay escuro em mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 md:w-72 
        bg-slate-950 dark:bg-[#070b12] text-slate-200 
        border-r border-slate-800/80 dark:border-slate-800/60
        flex flex-col transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Topo / Logo */}
        <div className="p-5 border-b border-slate-800/60">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Trees className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  EcoMind <span className="text-emerald-400">360</span>
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Monitoramento Ambiental
              </p>
            </div>
          </Link>

          {/* Status badge */}
          <div className="mt-4 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-medium text-emerald-300">
                Rede Sensorial Ativa
              </span>
            </div>
            <Radio size={14} className="text-emerald-400" />
          </div>
        </div>

        {/* Links de navegação */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
            Navegação Principal
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/10 text-emerald-300 border-l-2 border-emerald-400 font-semibold shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-300'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {item.count}
                  </span>
                )}
                {item.alertDot && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </Link>
            );
          })}

          {/* Atalho dos 7 Ambientes */}
          <div className="pt-5 pb-2 px-3 text-[10px] font-semibold tracking-wider uppercase text-slate-400 flex items-center justify-between">
            <span>Ambientes Monitorados</span>
            <span className="text-[10px] text-slate-400">7/7</span>
          </div>
          <div className="space-y-0.5">
            {BIOMES_LIST.map((biome) => (
              <Link
                key={biome.id}
                href={`/biomas/${biome.id}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-1.5 rounded-md text-xs text-slate-300 hover:text-white hover:bg-slate-900/50 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <span 
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: biome.color }} 
                  />
                  <span className="truncate">{biome.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {biome.nativeVegetationPercentage}% nativo
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/80">
          <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
            <Database size={13} className="text-emerald-400" />
            <span className="font-semibold text-slate-300">Fontes Oficiais:</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            INPE • NASA FIRMS • MapBiomas • IBGE • ICMBio
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-slate-400">
            <span>EcoMind 360 © 2024</span>
            <span className="text-emerald-400 font-mono">100% Brasil</span>
          </div>
        </div>
      </aside>
    </>
  );
}
