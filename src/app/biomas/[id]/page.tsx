import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BIOMES_DATA, BIOMES_LIST } from '@/data/biomes';
import { 
  Trees, 
  MapPin, 
  Shield, 
  ExternalLink, 
  ArrowLeft
} from 'lucide-react';

export function generateStaticParams() {
  return BIOMES_LIST.map((b) => ({
    id: b.id,
  }));
}

export default function BiomeDetailPage({ params }: { params: { id: string } }) {
  const biome = BIOMES_DATA[params.id];

  if (!biome) {
    notFound();
  }

  return (
    <div className="space-y-8 py-2">
      {/* Navegação e Voltar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/biomas"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-500 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Voltar para Todos os Biomas</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/mapa?biome=${biome.id}`}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <MapPin size={13} />
            <span>Ver {biome.name} no Mapa</span>
          </Link>
        </div>
      </div>

      {/* Banner de Apresentação do Bioma */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-2" 
          style={{ backgroundColor: biome.color }} 
        />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: biome.color }} />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {biome.category}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-medium">
                {biome.percentageBrazil}% do Território Nacional
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {biome.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {biome.description}
            </p>

            <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Estados abrangidos:</span>
              <div className="flex flex-wrap gap-1">
                {biome.states.map((st) => (
                  <span key={st} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-medium">
                    {st}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 w-full lg:w-72 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 space-y-3 text-xs">
            <div className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider">
              Síntese Cartográfica
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <span className="text-slate-500">Área IBGE:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{biome.areaKm2.toLocaleString('pt-BR')} km²</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <span className="text-slate-500">Veg. Nativa:</span>
              <span className="font-mono font-bold text-emerald-500">{biome.nativeVegetationPercentage}%</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <span className="text-slate-500">Áreas Protegidas:</span>
              <span className="font-mono font-bold text-blue-500">{biome.protectedAreaPercentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Focos 24h:</span>
              <span className="font-mono font-bold text-amber-500">{biome.activeFireHotspots24h} focos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seções de Detalhamento Ecológico e Ameaças */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Trees size={16} className="text-emerald-500" />
            <span>Importância Ecológica e Serviços Ecossistêmicos</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {biome.ecologicalImportance}
          </p>
          <div className="pt-2 text-xs text-slate-500 dark:text-slate-400">
            <strong>Regime Climático Típico:</strong> {biome.climate}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Shield size={16} className="text-rose-500" />
            <span>Principais Vetores de Pressão Antrópica</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {biome.mainThreats.map((threat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                <span>{threat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Taxas Oficiais e Auditoria Satelital */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Monitoramento Oficial e Auditoria Satelital
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sistemas de rastreamento com fontes primárias públicas
            </p>
          </div>

          {biome.deforestationProdes2024Km2 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono">
              <span className="text-slate-500">Taxa PRODES 2024:</span>
              <span className="font-bold text-emerald-500">
                {biome.deforestationProdes2024Km2.toLocaleString('pt-BR')} km²
              </span>
              <span className="text-emerald-400 font-semibold">
                ({biome.deforestationTrendPercent}% vs 2023)
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {biome.sources.map((source, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 space-y-2 text-xs"
            >
              <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{source.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{source.lastUpdated}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                {source.description}
              </p>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1 text-[11px] pt-1"
              >
                <span>Acessar base oficial</span>
                <ExternalLink size={11} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
