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
          className="inline-flex items-center gap-2 text-xs font-medium text-[#91A88F] hover:text-[#DCE5DD] transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para todos os 7 ambientes</span>
        </Link>
      </div>

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-[#222D25] pb-6">
        <div>
          <div className="badge-360 mb-3">
            <span>{biome.category}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#DCE5DD] tracking-tight">
            {biome.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#A7B3A9] leading-relaxed">
            {biome.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#78877D]">
            <span className="font-medium text-[#DCE5DD]">Estados abrangidos:</span>
            <span className="font-mono text-[#A7B3A9]">{biome.states.join(', ')}</span>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
          <span className="font-mono font-medium text-xs px-3.5 py-1.5 rounded-[7px] bg-[#171F1A] border border-[#29362D] text-[#91A88F]">
            {biome.percentageBrazil}% do Território BR
          </span>
          <Link
            href="/mapa"
            className="btn-primary !py-2 !px-4 text-xs font-medium inline-flex items-center gap-1.5"
          >
            <MapPin size={14} />
            <span>Ver no mapa de queimadas</span>
          </Link>
        </div>
      </div>

      {/* Grid de Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#78877D]">
            Área Territorial
          </span>
          <p className="font-display text-2xl sm:text-3xl font-semibold text-[#DCE5DD] mt-1.5 tabular-nums">
            {biome.areaKm2.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-[#78877D] mt-1 font-mono">km² oficiais (IBGE)</p>
        </div>

        <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#78877D]">
            Veg. Nativa
          </span>
          <p className="font-display text-2xl sm:text-3xl font-semibold text-[#83A989] mt-1.5 tabular-nums">
            {biome.nativeVegetationPercentage}%
          </p>
          <p className="text-xs text-[#78877D] mt-1 font-mono">MapBiomas Coleção 9</p>
        </div>

        <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#78877D]">
            Áreas Protegidas (UCs)
          </span>
          <p className="font-display text-2xl sm:text-3xl font-semibold text-[#91A88F] mt-1.5 tabular-nums">
            {biome.protectedAreaPercentage}%
          </p>
          <p className="text-xs text-[#78877D] mt-1 font-mono">Unidades ICMBio</p>
        </div>

        <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#78877D]">
            Focos Orbitais 24h
          </span>
          <p className="font-display text-2xl sm:text-3xl font-semibold text-[#A9A17A] mt-1.5 flex items-center gap-1.5 tabular-nums">
            <Flame size={20} className="text-[#A9A17A]" />
            {biome.activeFireHotspots24h}
          </p>
          <p className="text-xs text-[#78877D] mt-1 font-mono">INPE / NASA FIRMS</p>
        </div>
      </div>

      {/* Detalhes Ecológicos e Vetores de Pressão */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold text-[#DCE5DD] flex items-center gap-2">
            <Trees size={18} className="text-[#789B7C]" />
            <span>Importância Ecológica e Serviços Ecossistêmicos</span>
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-[#A7B3A9]">
            {biome.ecologicalImportance}
          </p>
          <div className="pt-3 border-t border-[#222D25]">
            <span className="text-xs font-medium text-[#DCE5DD]">Regime Climático:</span>
            <p className="text-xs text-[#78877D] mt-1">{biome.climate}</p>
          </div>
        </div>

        <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold text-[#DCE5DD] flex items-center gap-2">
            <Shield size={18} className="text-[#A9A17A]" />
            <span>Principais Vetores de Pressão & Ameaças</span>
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#A7B3A9]">
            {biome.mainThreats.map((threat, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A9A17A] mt-2 shrink-0" />
                <span>{threat}</span>
              </li>
            ))}
          </ul>
          {biome.deforestationTrendPercent !== null && (
            <div className="pt-3 border-t border-[#222D25] flex items-center gap-2 text-xs">
              <TrendingDown size={15} className="text-[#83A989]" />
              <span className="font-medium text-[#83A989]">
                Tendência PRODES 2024: {biome.deforestationTrendPercent}% vs período anterior
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Fontes Científicas e Auditoria */}
      <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#222D25] pb-3.5">
          <h3 className="font-display text-base font-semibold text-[#DCE5DD] flex items-center gap-2">
            <Info size={16} className="text-[#789B7C]" />
            <span>Bases Oficiais & Fontes Científicas Auditadas</span>
          </h3>
          <span className="text-xs font-mono text-[#78877D]">Orçamento R$ 0 · Dados Públicos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {biome.sources.map((src, i) => (
            <div key={i} className="p-4 rounded-[7px] bg-[#131A16] border border-[#222D25] text-xs space-y-2">
              <div className="flex items-center justify-between font-medium text-[#DCE5DD]">
                <span>{src.name}</span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#78877D] hover:text-[#91B596] transition-colors"
                  title="Abrir base oficial externa"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
              <p className="text-[#A7B3A9] leading-relaxed">{src.description}</p>
              <p className="text-[11px] text-[#78877D] font-mono">Atualização: {src.lastUpdated}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
