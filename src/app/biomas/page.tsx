'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BIOMES_LIST } from '@/data/biomes';
import { PageIntro } from '@/components/PageIntro';
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
    <div className="section-inner max-w-6xl mx-auto py-6 space-y-10">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-forest/10 pb-6">
        <PageIntro
          eyebrow="Biodiversidade e Conservação"
          title="Os Sete Ambientes Brasileiros"
          eyebrowClassName="eyebrow text-forest-mid"
          titleClassName="display mt-2 text-3xl text-forest md:text-5xl"
        >
          <p className="mt-3 max-w-2xl text-base text-ash">
            Compêndio territorial oficial com dados de cobertura vegetal, taxas de desmatamento,
            vetores de pressão e áreas protegidas (IBGE, MapBiomas e INPE).
          </p>
        </PageIntro>

        {/* Filtro por Categoria */}
        <div className="flex items-center gap-1 border border-forest/15 bg-white/80 p-1 rounded-xl text-xs shadow-sm">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterCategory === 'all'
                ? 'bg-forest text-mist shadow-sm'
                : 'text-ash hover:text-forest'
            }`}
          >
            Todos os 7 Ambientes
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('terrestre')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterCategory === 'terrestre'
                ? 'bg-forest text-mist shadow-sm'
                : 'text-ash hover:text-forest'
            }`}
          >
            Biomas Terrestres (6)
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('marinho')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterCategory === 'marinho'
                ? 'bg-forest text-mist shadow-sm'
                : 'text-ash hover:text-forest'
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
            className="panel-soft flex flex-col justify-between p-6 transition-transform hover:-translate-y-1"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-mid">
                    {biome.category}
                  </span>
                  <h3 className="display font-bold text-2xl text-forest mt-0.5">
                    {biome.name}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-forest/8 text-forest">
                  {biome.percentageBrazil}% BR
                </span>
              </div>

              <p className="text-xs text-ash leading-relaxed mb-4 line-clamp-3">
                {biome.description}
              </p>

              {/* Indicadores Chave */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-mist border border-forest/10 mb-4 text-xs text-center">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-ash">Área IBGE</div>
                  <div className="font-mono font-bold text-forest mt-0.5 text-[11px]">
                    {biome.areaKm2.toLocaleString('pt-BR')} km²
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-ash">Veg. Nativa</div>
                  <div className="font-mono font-bold text-forest mt-0.5 text-[11px]">
                    {biome.nativeVegetationPercentage}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-ash">Áreas Prot.</div>
                  <div className="font-mono font-bold text-forest-mid mt-0.5 text-[11px]">
                    {biome.protectedAreaPercentage}%
                  </div>
                </div>
              </div>

              {/* Principais Ameaças */}
              <div className="mb-4">
                <div className="text-xs font-bold text-forest mb-1.5 flex items-center gap-1.5">
                  <Shield size={13} className="text-burn" />
                  <span>Principais Vetores de Degradação</span>
                </div>
                <ul className="space-y-1 text-xs text-ash">
                  {biome.mainThreats.slice(0, 2).map((threat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-burn font-bold">•</span>
                      <span className="line-clamp-1">{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Rodapé do Card com Ações */}
            <div className="pt-4 border-t border-forest/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-burn font-bold">
                <Flame size={14} />
                <span className="font-mono">{biome.activeFireHotspots24h}</span>
                <span className="text-[11px] text-ash font-normal">focos 24h</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/mapa"
                  className="py-1.5 px-3 rounded-xl text-xs font-semibold btn-secondary text-forest flex items-center gap-1"
                >
                  <MapPin size={13} />
                  <span>Mapa</span>
                </Link>
                <Link
                  href={`/biomas/${biome.id}`}
                  className="py-1.5 px-3.5 rounded-xl text-xs font-bold btn-primary flex items-center gap-1"
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
      <div className="panel-soft p-6 space-y-4">
        <div>
          <h2 className="display text-2xl font-bold text-forest">
            Matriz Comparativa Oficial dos 7 Ambientes
          </h2>
          <p className="text-xs text-ash mt-1">
            Compilação direta de bases geodésicas do IBGE, MapBiomas e INPE
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink">
            <thead className="bg-mist text-[11px] uppercase font-bold text-forest-mid border-b border-forest/10">
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
            <tbody className="divide-y divide-forest/10 font-mono">
              {BIOMES_LIST.map((b) => (
                <tr key={b.id} className="hover:bg-forest/5 transition-colors">
                  <td className="py-3 px-3 font-sans font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                    <Link href={`/biomas/${b.id}`} className="hover:text-forest-mid transition-colors">
                      {b.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3 font-sans text-ash">{b.category}</td>
                  <td className="py-3 px-3">{b.areaKm2.toLocaleString('pt-BR')}</td>
                  <td className="py-3 px-3">{b.percentageBrazil}%</td>
                  <td className="py-3 px-3 text-forest font-bold">{b.nativeVegetationPercentage}%</td>
                  <td className="py-3 px-3 text-forest-mid">{b.protectedAreaPercentage}%</td>
                  <td className="py-3 px-3 text-ash">
                    {b.deforestationProdes2024Km2 ? `${b.deforestationProdes2024Km2.toLocaleString('pt-BR')} km²` : 'N/A (Marinho)'}
                  </td>
                  <td className="py-3 px-3 text-burn font-bold">{b.activeFireHotspots24h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
