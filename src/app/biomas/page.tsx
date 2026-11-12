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
    <div className="section-inner max-w-6xl mx-auto py-8 space-y-10">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#222D25] pb-6">
        <div>
          <div className="badge-360 mb-3">
            <Compass size={12} />
            <span>Biodiversidade & Conservação 360°</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#DCE5DD] tracking-tight">
            Os Sete Ambientes Brasileiros
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-[#A7B3A9] max-w-2xl leading-relaxed">
            Compêndio territorial oficial com dados de cobertura vegetal, taxas de desmatamento,
            vetores de pressão e áreas protegidas (IBGE, MapBiomas e INPE).
          </p>
        </div>

        {/* Filtro por Categoria */}
        <div className="flex items-center gap-1 border border-[#29362D] bg-[#131A16] p-1 rounded-[10px] text-xs">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-[7px] font-medium transition-colors ${
              filterCategory === 'all'
                ? 'bg-[#294C35] text-[#DCE5DD] border border-[#365C40]'
                : 'text-[#A7B3A9] hover:text-[#DCE5DD] hover:bg-[#1D2821]'
            }`}
          >
            Todos os 7 Ambientes
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('terrestre')}
            className={`px-3 py-1.5 rounded-[7px] font-medium transition-colors ${
              filterCategory === 'terrestre'
                ? 'bg-[#294C35] text-[#DCE5DD] border border-[#365C40]'
                : 'text-[#A7B3A9] hover:text-[#DCE5DD] hover:bg-[#1D2821]'
            }`}
          >
            Biomas Terrestres (6)
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('marinho')}
            className={`px-3 py-1.5 rounded-[7px] font-medium transition-colors ${
              filterCategory === 'marinho'
                ? 'bg-[#294C35] text-[#DCE5DD] border border-[#365C40]'
                : 'text-[#A7B3A9] hover:text-[#DCE5DD] hover:bg-[#1D2821]'
            }`}
          >
            Costeiro-Marinho (1)
          </button>
        </div>
      </div>

      {/* Grid de Cards Editoriais dos Biomas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBiomes.map((biome) => (
          <div
            key={biome.id}
            className="rounded-[10px] border border-[#29362D] bg-[#171F1A] flex flex-col justify-between p-6 transition-colors hover:border-[#789B7C]/50 relative overflow-hidden"
          >
            {/* Barra superior de cor do bioma */}
            <div
              className="absolute top-0 inset-x-0 h-1"
              style={{ backgroundColor: biome.color }}
            />

            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#91A88F] bg-[#1D2821] border border-[#29362D] px-2.5 py-0.5 rounded-[7px]">
                    {biome.category}
                  </span>
                  <h3 className="font-display font-semibold text-xl text-[#DCE5DD] mt-2">
                    {biome.name}
                  </h3>
                </div>
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-[7px] bg-[#131A16] border border-[#222D25] text-[#A7B3A9]">
                  {biome.percentageBrazil}% BR
                </span>
              </div>

              <p className="text-xs text-[#A7B3A9] leading-relaxed mb-5 line-clamp-3">
                {biome.description}
              </p>

              {/* Indicadores Chave com divisores discretos */}
              <div className="grid grid-cols-3 divide-x divide-[#222D25] py-3 border-y border-[#222D25] mb-5 text-xs text-center">
                <div className="px-1">
                  <div className="text-[10px] uppercase font-mono text-[#78877D]">Área IBGE</div>
                  <div className="font-mono font-semibold text-[#DCE5DD] mt-1 text-[11px]">
                    {biome.areaKm2.toLocaleString('pt-BR')} km²
                  </div>
                </div>
                <div className="px-1">
                  <div className="text-[10px] uppercase font-mono text-[#78877D]">Veg. Nativa</div>
                  <div className="font-mono font-semibold text-[#83A989] mt-1 text-[11px]">
                    {biome.nativeVegetationPercentage}%
                  </div>
                </div>
                <div className="px-1">
                  <div className="text-[10px] uppercase font-mono text-[#78877D]">Áreas Prot.</div>
                  <div className="font-mono font-semibold text-[#91A88F] mt-1 text-[11px]">
                    {biome.protectedAreaPercentage}%
                  </div>
                </div>
              </div>

              {/* Principais Ameaças */}
              <div className="mb-5">
                <div className="text-xs font-medium text-[#DCE5DD] mb-2 flex items-center gap-1.5">
                  <Shield size={13} className="text-[#A9A17A]" />
                  <span>Principais Vetores de Degradação</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#A7B3A9]">
                  {biome.mainThreats.slice(0, 2).map((threat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#A9A17A] mt-1.5 shrink-0" />
                      <span className="line-clamp-1">{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Rodapé do Card com Ações */}
            <div className="pt-4 border-t border-[#222D25] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[#A9A17A] font-medium">
                <Flame size={14} />
                <span className="font-mono">{biome.activeFireHotspots24h}</span>
                <span className="text-[11px] text-[#78877D] font-normal">focos 24h</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/mapa"
                  className="btn-secondary !py-1.5 !px-3 text-xs font-medium flex items-center gap-1"
                >
                  <MapPin size={13} />
                  <span>Mapa</span>
                </Link>
                <Link
                  href={`/biomas/${biome.id}`}
                  className="btn-primary !py-1.5 !px-3.5 text-xs font-medium flex items-center gap-1"
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
      <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 space-y-5">
        <div>
          <h2 className="font-display text-xl font-semibold text-[#DCE5DD]">
            Matriz Comparativa Oficial dos 7 Ambientes
          </h2>
          <p className="text-xs text-[#78877D] mt-1">
            Compilação direta de bases geodésicas do IBGE, MapBiomas e INPE
          </p>
        </div>

        <div className="overflow-x-auto rounded-[7px] border border-[#222D25]">
          <table className="w-full text-left text-xs text-[#DCE5DD]">
            <thead className="bg-[#131A16] text-[11px] font-mono uppercase text-[#78877D] border-b border-[#222D25]">
              <tr>
                <th className="py-3 px-3.5 font-medium">Ambiente</th>
                <th className="py-3 px-3.5 font-medium">Categoria</th>
                <th className="py-3 px-3.5 font-medium">Área (km²)</th>
                <th className="py-3 px-3.5 font-medium">% BR</th>
                <th className="py-3 px-3.5 font-medium">Veg. Nativa</th>
                <th className="py-3 px-3.5 font-medium">Áreas Protegidas (UCs)</th>
                <th className="py-3 px-3.5 font-medium">PRODES 2024</th>
                <th className="py-3 px-3.5 font-medium">Focos 24h</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222D25] font-mono">
              {BIOMES_LIST.map((b) => (
                <tr key={b.id} className="hover:bg-[#1D2821]/60 transition-colors">
                  <td className="py-3 px-3.5 font-sans font-medium flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                    <Link href={`/biomas/${b.id}`} className="text-[#DCE5DD] hover:text-[#91B596] transition-colors">
                      {b.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3.5 font-sans text-[#A7B3A9]">{b.category}</td>
                  <td className="py-3 px-3.5 text-[#DCE5DD]">{b.areaKm2.toLocaleString('pt-BR')}</td>
                  <td className="py-3 px-3.5 text-[#A7B3A9]">{b.percentageBrazil}%</td>
                  <td className="py-3 px-3.5 text-[#83A989] font-semibold">{b.nativeVegetationPercentage}%</td>
                  <td className="py-3 px-3.5 text-[#91A88F]">{b.protectedAreaPercentage}%</td>
                  <td className="py-3 px-3.5 text-[#A7B3A9]">
                    {b.deforestationProdes2024Km2 ? `${b.deforestationProdes2024Km2.toLocaleString('pt-BR')} km²` : 'N/A (Marinho)'}
                  </td>
                  <td className="py-3 px-3.5 text-[#A9A17A] font-semibold">{b.activeFireHotspots24h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
