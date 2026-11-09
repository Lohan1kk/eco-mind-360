'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BIOMES_LIST } from '@/data/biomes';
import { 
  MapPin, 
  Shield, 
  Flame, 
  ArrowUpRight,
  Compass
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
    <div className="section-inner max-w-6xl mx-auto py-6 space-y-10">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-6">
        <div>
          <div className="badge-360 mb-2">
            <Compass size={12} />
            <span>Biodiversidade & Conservação 360°</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Os Sete Ambientes Brasileiros
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Compêndio territorial oficial com dados de cobertura vegetal, taxas de desmatamento,
            vetores de pressão e áreas protegidas (IBGE, MapBiomas e INPE).
          </p>
        </div>

        {/* Filtro por Categoria */}
        <div className="flex items-center gap-1 border border-slate-200/80 bg-white p-1 rounded-xl text-xs shadow-sm">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos os 7 Ambientes
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('terrestre')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterCategory === 'terrestre'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Biomas Terrestres (6)
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('marinho')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterCategory === 'marinho'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Costeiro-Marinho (1)
          </button>
        </div>
      </div>

      {/* Grid de Cards dos Biomas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBiomes.map((biome) => (
          <div
            key={biome.id}
            className="glass-panel flex flex-col justify-between p-6 transition-transform hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Barra superior de cor do bioma */}
            <div
              className="absolute top-0 inset-x-0 h-1.5"
              style={{ backgroundColor: biome.color }}
            />

            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {biome.category}
                  </span>
                  <h3 className="font-display font-extrabold text-2xl text-slate-900 mt-1.5">
                    {biome.name}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                  {biome.percentageBrazil}% BR
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                {biome.description}
              </p>

              {/* Indicadores Chave */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/60 mb-4 text-xs text-center">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-500">Área IBGE</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5 text-[11px]">
                    {biome.areaKm2.toLocaleString('pt-BR')} km²
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-500">Veg. Nativa</div>
                  <div className="font-mono font-bold text-emerald-700 mt-0.5 text-[11px]">
                    {biome.nativeVegetationPercentage}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-500">Áreas Prot.</div>
                  <div className="font-mono font-bold text-teal-700 mt-0.5 text-[11px]">
                    {biome.protectedAreaPercentage}%
                  </div>
                </div>
              </div>

              {/* Principais Ameaças */}
              <div className="mb-4">
                <div className="text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <Shield size={13} className="text-amber-600" />
                  <span>Principais Vetores de Degradação</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-600">
                  {biome.mainThreats.slice(0, 2).map((threat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span className="line-clamp-1">{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Rodapé do Card com Ações */}
            <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
                <Flame size={14} />
                <span className="font-mono">{biome.activeFireHotspots24h}</span>
                <span className="text-[11px] text-slate-500 font-normal">focos 24h</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/mapa"
                  className="btn-secondary !py-1.5 !px-3 text-xs font-semibold flex items-center gap-1"
                >
                  <MapPin size={13} />
                  <span>Mapa</span>
                </Link>
                <Link
                  href={`/biomas/${biome.id}`}
                  className="btn-primary !py-1.5 !px-3.5 text-xs font-bold flex items-center gap-1"
                >
                  <span>Ficha Técnica</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Matriz Comparativa Oficial */}
      <div className="glass-panel p-6 space-y-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Matriz Comparativa Oficial dos 7 Ambientes
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Compilação direta de bases geodésicas do IBGE, MapBiomas e INPE
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-600 border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-200/80 font-mono">
              {BIOMES_LIST.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-sans font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                    <Link href={`/biomas/${b.id}`} className="hover:text-emerald-700 transition-colors">
                      {b.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-500">{b.category}</td>
                  <td className="py-3 px-3">{b.areaKm2.toLocaleString('pt-BR')}</td>
                  <td className="py-3 px-3">{b.percentageBrazil}%</td>
                  <td className="py-3 px-3 text-emerald-700 font-bold">{b.nativeVegetationPercentage}%</td>
                  <td className="py-3 px-3 text-teal-700">{b.protectedAreaPercentage}%</td>
                  <td className="py-3 px-3 text-slate-600">
                    {b.deforestationProdes2024Km2 ? `${b.deforestationProdes2024Km2.toLocaleString('pt-BR')} km²` : 'N/A (Marinho)'}
                  </td>
                  <td className="py-3 px-3 text-amber-600 font-bold">{b.activeFireHotspots24h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

