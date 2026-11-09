'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Sun, 
  Moon, 
  Satellite, 
  X,
  ChevronDown
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { BIOMES_LIST } from '@/data/biomes';
import { VERIFIED_ALERTS } from '@/data/alerts';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [biomeSelectOpen, setBiomeSelectOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown de pesquisa ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Resultados de busca
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
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#070b12]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 lg:px-8 flex items-center justify-between gap-4 transition-colors">
      {/* Lado esquerdo: Espaçador do menu mobile + barra de pesquisa */}
      <div className="flex items-center gap-3 flex-1 max-w-xl pl-10 lg:pl-0">
        <div ref={searchContainerRef} className="relative w-full">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Buscar bioma, município (ex: Altamira, Corumbá), estado ou alerta..."
              className="w-full pl-9 pr-8 py-2 rounded-lg text-xs md:text-sm bg-slate-100 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-700/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSearchOpen(false);
                }} 
                className="absolute right-2.5 text-slate-400 hover:text-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Dropdown de resultados de busca instantânea */}
          {searchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl z-50 max-h-96 overflow-y-auto">
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Biomas Encontrados
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
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: biome.color }} />
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{biome.name}</span>
                        <span className="text-slate-400">({biome.states.slice(0, 4).join(', ')})</span>
                      </div>
                      <span className="text-[10px] text-emerald-500 font-medium">Ver Bioma →</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 px-2 py-1 italic">Nenhum bioma com esse termo.</div>
              )}

              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider border-t border-slate-100 dark:border-slate-800 pt-2">
                Ocorrências & Alertas
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
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-xs transition-colors"
                    >
                      <div>
                        <div className="font-medium text-slate-900 dark:text-slate-200">
                          {alert.typeName} — {alert.municipality}/{alert.state}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {alert.biomeName} • {alert.date} • {alert.source}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {alert.confidence}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 px-2 py-1 italic">Nenhum alerta correspondente.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lado direito: Status satélite + Seletor de bioma rápido + Toggle de Tema */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Badge de status dos Satélites (desktop) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
          <Satellite size={14} className="text-cyan-500 animate-pulse" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">Constelação Orbital:</span>
          <span className="text-slate-400 font-mono text-[11px]">Aqua • Terra • NOAA-20 • CBERS</span>
        </div>

        {/* Dropdown rápido de Biomas */}
        <div className="relative">
          <button
            onClick={() => setBiomeSelectOpen(!biomeSelectOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            <span>Ir para Bioma</span>
            <ChevronDown size={14} />
          </button>

          {biomeSelectOpen && (
            <div 
              onMouseLeave={() => setBiomeSelectOpen(false)}
              className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50 text-xs"
            >
              {BIOMES_LIST.map((b) => (
                <Link
                  key={b.id}
                  href={`/biomas/${b.id}`}
                  onClick={() => setBiomeSelectOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                  <span>{b.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Botão de Alternância de Tema Claro / Escuro */}
        <button
          onClick={toggleTheme}
          aria-label="Alternar tema claro ou escuro"
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
          title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
        >
          {theme === 'dark' ? (
            <Sun size={17} className="text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon size={17} className="text-slate-700 hover:-rotate-12 transition-transform" />
          )}
        </button>
      </div>
    </header>
  );
}
