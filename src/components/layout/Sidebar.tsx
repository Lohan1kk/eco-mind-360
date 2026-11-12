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
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-[7px] bg-[#171F1A] text-[#DCE5DD] border border-[#29362D]"
        aria-label="Abrir menu"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Overlay escuro em mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 md:w-72 
        bg-[#131A16] text-[#DCE5DD] 
        border-r border-[#222D25]
        flex flex-col transition-transform duration-200 ease-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Topo / Logo */}
        <div className="p-5 border-b border-[#222D25]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-[10px] bg-[#1D2821] border border-[#29362D] flex items-center justify-center">
              <Trees className="w-5 h-5 text-[#789B7C]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-base tracking-tight text-[#DCE5DD]">
                  EcoMind <span className="text-[#91A88F]">360</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-[5px] bg-[#1D2821] text-[#91A88F] border border-[#29362D]">
                  360°
                </span>
              </div>
              <p className="text-[11px] text-[#78877D]">
                Monitoramento Ambiental
              </p>
            </div>
          </Link>

          {/* Status badge */}
          <div className="mt-4 px-3 py-2 rounded-[7px] bg-[#171F1A] border border-[#29362D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded-full h-2 w-2 bg-[#83A989]" />
              <span className="text-[11px] font-medium text-[#A7B3A9]">
                Rede Sensorial Ativa
              </span>
            </div>
            <Radio size={13} className="text-[#789B7C]" />
          </div>
        </div>

        {/* Links de navegação */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#78877D]">
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
                  flex items-center justify-between px-3 py-2 rounded-[7px] text-xs font-medium
                  transition-colors duration-150 group
                  ${isActive 
                    ? 'bg-[#1D2821] text-[#91A88F] border-l-2 border-[#789B7C]' 
                    : 'text-[#A7B3A9] hover:text-[#DCE5DD] hover:bg-[#171F1A]'
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-[#789B7C]' : 'text-[#78877D] group-hover:text-[#A7B3A9]'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[5px] ${
                    isActive ? 'bg-[#294C35] text-[#DCE5DD]' : 'bg-[#171F1A] text-[#78877D]'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-[5px] bg-[#171F1A] text-[#A7B3A9] font-mono">
                    {item.count}
                  </span>
                )}
                {item.alertDot && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A9A17A]" />
                )}
              </Link>
            );
          })}

          {/* Atalho dos 7 Ambientes */}
          <div className="pt-5 pb-2 px-3 text-[10px] font-mono uppercase tracking-wider text-[#78877D] flex items-center justify-between">
            <span>Ambientes Monitorados</span>
            <span className="text-[10px] text-[#78877D]">7/7</span>
          </div>
          <div className="space-y-0.5">
            {BIOMES_LIST.map((biome) => (
              <Link
                key={biome.id}
                href={`/biomas/${biome.id}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-1.5 rounded-[7px] text-xs text-[#A7B3A9] hover:text-[#DCE5DD] hover:bg-[#171F1A] transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <span 
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: biome.color }} 
                  />
                  <span className="truncate">{biome.name}</span>
                </div>
                <span className="text-[10px] text-[#78877D] font-mono">
                  {biome.nativeVegetationPercentage}%
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-4 border-t border-[#222D25] bg-[#101512]">
          <div className="flex items-center gap-2 mb-1.5 text-xs text-[#A7B3A9]">
            <Database size={13} className="text-[#789B7C]" />
            <span className="font-medium text-[#DCE5DD]">Fontes Oficiais</span>
          </div>
          <p className="text-[11px] text-[#78877D] leading-relaxed">
            INPE · NASA FIRMS · MapBiomas · IBGE · ICMBio
          </p>
        </div>
      </aside>
    </>
  );
}
