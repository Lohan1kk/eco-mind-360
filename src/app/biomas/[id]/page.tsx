import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BIOMES_DATA, BIOMES_LIST } from '@/data/biomes';
import { 
  Trees, 
  Shield, 
  Flame, 
  TrendingDown, 
  MapPin, 
  ArrowLeft, 
  ExternalLink,
  Info
} from 'lucide-react';

interface Props {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return BIOMES_LIST.map((b) => ({ id: b.id }));
}

export default function BiomeDetailPage({ params }: Props) {
  const biome = BIOMES_DATA[params.id];

  if (!biome) {
    notFound();
  }

  return (
    <div className="section-inner max-w-5xl mx-auto py-8 space-y-10">
      {/* Voltar */}
      <div>
        <Link
          href="/biomas"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para todos os 7 ambientes</span>
        </Link>
      </div>

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-200/80 pb-6">
        <div>
          <div className="badge-360 mb-2">
            <span>{biome.category}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
            {biome.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600 leading-relaxed">
            {biome.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-800">Estados abrangidos:</span>
            <span>{biome.states.join(', ')}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <span className="font-mono font-bold text-sm px-3.5 py-1.5 rounded-full bg-slate-900 text-white shadow-sm">
            {biome.percentageBrazil}% do Território BR
          </span>
          <Link
            href="/mapa"
            className="btn-primary !py-2 !px-4 text-xs font-bold inline-flex items-center gap-1.5"
          >
            <MapPin size={14} />
            <span>Ver no mapa de queimadas</span>
          </Link>
        </div>
      </div>

      {/* Grid de Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Área Territorial
          </span>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {biome.areaKm2.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">km² oficiais (IBGE)</p>
        </div>

        <div className="glass-panel p-5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Veg. Nativa
          </span>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
            {biome.nativeVegetationPercentage}%
          </p>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">MapBiomas Coleção 9</p>
        </div>

        <div className="glass-panel p-5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Áreas Protegidas (UCs)
          </span>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-teal-700 mt-1">
            {biome.protectedAreaPercentage}%
          </p>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">Unidades ICMBio</p>
        </div>

        <div className="glass-panel p-5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Focos Orbitais 24h
          </span>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1 flex items-center gap-1.5">
            <Flame size={20} className="text-amber-500" />
            {biome.activeFireHotspots24h}
          </p>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">INPE / NASA FIRMS</p>
        </div>
      </div>

      {/* Detalhes Ecológicos e Vetores de Pressão */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 space-y-4">
          <h3 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
            <Trees size={18} className="text-emerald-600" />
            <span>Importância Ecológica e Serviços Ecossistêmicos</span>
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
            {biome.ecologicalImportance}
          </p>
          <div className="pt-3 border-t border-slate-200/70">
            <span className="text-xs font-bold text-slate-800">Regime Climático:</span>
            <p className="text-xs text-slate-500 mt-1">{biome.climate}</p>
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <h3 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
            <Shield size={18} className="text-amber-600" />
            <span>Principais Vetores de Pressão & Ameaças</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
            {biome.mainThreats.map((threat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{threat}</span>
              </li>
            ))}
          </ul>
          {biome.deforestationTrendPercent !== null && (
            <div className="pt-3 border-t border-slate-200/70 flex items-center gap-2 text-xs">
              <TrendingDown size={15} className="text-emerald-700" />
              <span className="font-bold text-emerald-800">
                Tendência PRODES 2024: {biome.deforestationTrendPercent}% vs período anterior
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Fontes Científicas e Auditoria */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
          <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
            <Info size={16} className="text-emerald-600" />
            <span>Bases Oficiais & Fontes Científicas Auditadas</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">Orçamento R$ 0 · Dados Públicos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {biome.sources.map((src, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>{src.name}</span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-emerald-700"
                  title="Abrir base oficial externa"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
              <p className="text-slate-600 leading-relaxed">{src.description}</p>
              <p className="text-[11px] text-slate-400 font-mono">Atualização: {src.lastUpdated}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
