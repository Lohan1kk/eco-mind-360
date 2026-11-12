'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Satellite, 
  X,
  ChevronDown,
  Compass
} from 'lucide-react';
import { BIOMES_LIST } from '@/data/biomes';
import { VERIFIED_ALERTS } from '@/data/alerts';

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [biomeSelectOpen, setBiomeSelectOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        const input = searchContainerRef.current?.querySelector('input');
        input?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredBiomes = searchQuery.trim()
    ? BIOMES_LIST.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.states.some(st => st.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const filteredAlerts = searchQuery.trim()
    ? VERIFIED_ALERTS.filter(a => 
        a.municipality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.biomeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.typeName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#131A16]/90 backdrop-blur-xl border-b border-[#222D25] px-4 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1 max-w-xl pl-10 lg:pl-0">
        <div ref={searchContainerRef} className="relative w-full">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-[#78877D] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Buscar bioma, município, UF ou alerta..."
              className="w-full pl-9 pr-16 py-1.5 rounded-[7px] text-xs bg-[#171F1A] text-[#DCE5DD] placeholder-[#78877D] border border-[#29362D] focus:outline-none focus:border-[#789B7C] transition-colors"
            />
            <div className="absolute right-2 flex items-center gap-1.5">
              {searchQuery ? (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSearchOpen(false);
                  }} 
                  className="p-1 rounded-[5px] text-[#78877D] hover:text-[#DCE5DD]"
                >
                  <X size={13} />
                </button>
              ) : (
                <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded-[5px] bg-[#1D2821] text-[#78877D] border border-[#29362D]">
                  Ctrl K
                </span>
              )}
            </div>
          </div>

          {searchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2.5 rounded-[10px] bg-[#171F1A] border border-[#29362D] shadow-lift z-50 max-h-96 overflow-y-auto">
              <div className="text-[10px] font-mono text-[#78877D] px-2 py-1 uppercase tracking-wider flex items-center justify-between">
                <span>Biomas Identificados</span>
                <span className="text-[#91A88F]">{filteredBiomes.length}</span>
              </div>
              {filteredBiomes.length > 0 ? (
                <div className="space-y-1 mb-3">
                  {filteredBiomes.map((biome) => (
                    <button
                      key={biome.id}
                      onClick={() => {
                        router.push(`/biomas/${biome.id}`);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-[7px] hover:bg-[#1D2821] text-left text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: biome.color }} />
                        <span className="font-medium text-[#DCE5DD]">
                          {biome.name}
                        </span>
                        <span className="text-[#78877D] text-[11px]">
                          ({biome.states.slice(0, 4).join(', ')})
                        </span>
                      </div>
                      <span className="text-[11px] text-[#91A88F]">Ver →</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#78877D] px-2 py-1">Nenhum bioma com esse nome.</div>
              )}

              <div className="text-[10px] font-mono text-[#78877D] px-2 py-1 uppercase tracking-wider border-t border-[#222D25] pt-2 flex items-center justify-between">
                <span>Ocorrências e Alertas</span>
                <span className="text-[#A9A17A]">{filteredAlerts.length}</span>
              </div>
              {filteredAlerts.length > 0 ? (
                <div className="space-y-1">
                  {filteredAlerts.map((alert) => (
                    <button
                      key={alert.id}
                      onClick={() => {
                        router.push('/alertas');
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-[7px] hover:bg-[#1D2821] text-left text-xs transition-colors"
                    >
                      <div>
                        <div className="font-medium text-[#DCE5DD]">
                          {alert.typeName} — {alert.municipality}/{alert.state}
                        </div>
                        <div className="text-[10px] text-[#78877D]">
                          {alert.biomeName} · {alert.date} · {alert.source}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-[5px] bg-[#1D2821] text-[#A7B3A9] border border-[#29362D]">
                        {alert.confidence}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-[#78877D] px-2 py-1">Nenhum alerta localizado.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-[7px] bg-[#171F1A] border border-[#29362D] text-xs">
          <span className="inline-flex rounded-full h-2 w-2 bg-[#83A989]" />
          <Satellite size={13} className="text-[#789B7C]" />
          <span className="text-[#DCE5DD] font-medium">NASA · INPE:</span>
          <span className="text-[#78877D] font-mono text-[11px]">VIIRS · AQUA · CBERS</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setBiomeSelectOpen(!biomeSelectOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-xs font-medium bg-[#171F1A] hover:bg-[#1D2821] text-[#DCE5DD] border border-[#29362D] transition-colors"
          >
            <Compass size={13} className="text-[#789B7C]" />
            <span className="hidden sm:inline">Ambiente:</span>
            <span>7 Biomas</span>
            <ChevronDown size={13} className="text-[#78877D]" />
          </button>

          {biomeSelectOpen && (
            <div 
              onMouseLeave={() => setBiomeSelectOpen(false)}
              className="absolute right-0 mt-2 w-52 rounded-[10px] bg-[#171F1A] border border-[#29362D] shadow-lift p-1.5 z-50 text-xs"
            >
              <div className="px-2.5 py-1 text-[10px] uppercase font-mono text-[#78877D] tracking-wider">
                Navegação Rápida
              </div>
              {BIOMES_LIST.map((b) => (
                <Link
                  key={b.id}
                  href={`/biomas/${b.id}`}
                  onClick={() => setBiomeSelectOpen(false)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-[7px] hover:bg-[#1D2821] text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                    <span>{b.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#78877D]">{b.percentageBrazil}%</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
