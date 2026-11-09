'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BIOMES_LIST } from '@/data/biomes';
import { 
  MapPin, 
  Shield, 
  Flame, 
  ArrowUpRight
} from 'lucide-react';

export default function BiomasPage() {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredBiomes = BIOMES_LIST.filter(b => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'terrestre') return b.category === 'Bioma Terrestre';
    if (filterCategory === 'marinho') return b.category === 'Sistema Costeiro e Marinho';
    return true;
  });

  return (
    <div className="space-y-8 py-2">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Os Sete Ambientes Brasileiros
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
              Classificação Oficial
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explorador detalhado com características ecológicas, dados territoriais e vetores de pressão
          </p>
        </div>

        {/* Filtro por Categoria */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-xs shadow-sm">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterCategory === 'all'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Todos os 7 Ambientes
          </button>
          <button
            onClick={() => setFilterCategory('terrestre')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterCategory === 'terrestre'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Biomas Terrestres (6)
          </button>
          <button
            onClick={() => setFilterCategory('marinho')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterCategory === 'marinho'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Costeiro-Marinho (1)
          </button>
        </div>
      </div>

      {/* Grid de Cards dos Biomas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBiomes.map((biome) => (
          <div
            key={biome.id}
            className="p-6 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
          >
            {/* Linha colorida do bioma */}
            <div 
              className="absolute top-0 left-0 right-0 h-1.5" 
              style={{ backgroundColor: biome.color }} 
            />

            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: biome.color }} />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {biome.name}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {biome.category} • Abrange {biome.states.length} Estados ({biome.states.slice(0, 6).join(', ')}{biome.states.length > 6 ? '...' : ''})
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                  {biome.percentageBrazil}% BR
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {biome.description}
              </p>

              {/* Indicadores Chave */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 mb-4 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Área IBGE</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    {biome.areaKm2.toLocaleString('pt-BR')} km²
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Veg. Nativa</div>
                  <div className="font-mono font-bold text-emerald-500 mt-0.5">
                    {biome.nativeVegetationPercentage}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Áreas Protegidas</div>
                  <div className="font-mono font-bold text-blue-500 mt-0.5">
                    {biome.protectedAreaPercentage}%
                  </div>
                </div>
              </div>

              {/* Principais Ameaças */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Shield size={13} className="text-rose-500" />
                  <span>Principais Vetores de Degradação</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  {biome.mainThreats.map((threat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-slate-400">•</span>
                      <span>{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Rodapé do Card com Ações */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Flame size={14} className="text-amber-500" />
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{biome.activeFireHotspots24h}</span>
                <span>focos 24h</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/mapa?biome=${biome.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                >
                  <MapPin size={13} />
                  <span>Mapa</span>
                </Link>
                <Link
                  href={`/biomas/${biome.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1"
                >
                  <span>Ficha Técnica</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela Comparativa Geral Oficial */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Matriz Comparativa Oficial dos 7 Ambientes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compilação direta de bases geodésicas do IBGE, MapBiomas e INPE
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3">Ambiente</th>
                <th className="py-3 px-3">Categoria</th>
                <th className="py-3 px-3">Área (km²)</th>
                <th className="py-3 px-3">% BR</th>
                <th className="py-3 px-3">Veg. Nativa</th>
                <th className="py-3 px-3">Áreas Protegidas (UCs)</th>
                <th className="py-3 px-3">PRODES 2024</th>
                <th className="py-3 px-3">Focos 24h</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {BIOMES_LIST.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 font-sans font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                    <Link href={`/biomas/${b.id}`} className="hover:text-emerald-500 transition-colors">
                      {b.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-500 dark:text-slate-400">{b.category}</td>
                  <td className="py-3 px-3">{b.areaKm2.toLocaleString('pt-BR')}</td>
                  <td className="py-3 px-3">{b.percentageBrazil}%</td>
                  <td className="py-3 px-3 text-emerald-500 font-bold">{b.nativeVegetationPercentage}%</td>
                  <td className="py-3 px-3 text-blue-500">{b.protectedAreaPercentage}%</td>
                  <td className="py-3 px-3 text-slate-800 dark:text-slate-200">
                    {b.deforestationProdes2024Km2 ? `${b.deforestationProdes2024Km2.toLocaleString('pt-BR')} km²` : 'N/A (Marinho)'}
                  </td>
                  <td className="py-3 px-3 text-amber-500">{b.activeFireHotspots24h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
