import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BIOMES_DATA, BIOMES_LIST } from '@/data/biomes';
import { PageIntro } from '@/components/PageIntro';
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
          className="inline-flex items-center gap-2 text-xs font-bold text-forest hover:text-forest-mid group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para todos os 7 ambientes</span>
        </Link>
      </div>

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-forest/10 pb-6">
        <div>
          <PageIntro
            eyebrow={biome.category}
            title={biome.name}
            eyebrowClassName="eyebrow text-forest-mid"
            titleClassName="display mt-2 text-4xl text-forest md:text-6xl"
          >
            <p className="mt-4 max-w-2xl text-base text-ash leading-relaxed">
              {biome.description}
            </p>
          </PageIntro>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ash">
            <span className="font-semibold text-forest">Estados abrangidos:</span>
            <span>{biome.states.join(', ')}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <span className="font-mono font-bold text-base px-3.5 py-1.5 rounded-full bg-forest text-mist shadow-sm">
            {biome.percentageBrazil}% do Território
          </span>
          <Link
            href="/mapa"
            className="btn btn-primary !py-2 !px-4 text-xs font-bold inline-flex items-center gap-1.5"
          >
            <MapPin size={14} />
            <span>Ver no mapa de queimadas</span>
          </Link>
        </div>
      </div>

      {/* Grid de Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="panel-soft p-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-forest-mid">
            Área Territorial
          </span>
          <p className="font-display text-2xl sm:text-3xl font-bold text-forest mt-1">
            {biome.areaKm2.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-ash mt-0.5">quilômetros quadrados (IBGE)</p>
        </div>

        <div className="panel-soft p-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-forest-mid">
            Veg. Nativa Remanescente
          </span>
          <p className="font-display text-2xl sm:text-3xl font-bold text-forest mt-1">
            {biome.nativeVegetationPercentage}%
          </p>
          <p className="text-xs text-ash mt-0.5">MapBiomas Coleção 9</p>
        </div>

        <div className="panel-soft p-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-forest-mid">
            Áreas Protegidas (UCs)
          </span>
          <p className="font-display text-2xl sm:text-3xl font-bold text-forest-mid mt-1">
            {biome.protectedAreaPercentage}%
          </p>
          <p className="text-xs text-ash mt-0.5">Unidades de Conservação (ICMBio)</p>
        </div>

        <div className="panel-soft p-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-burn">
            Focos Orbitais 24h
          </span>
          <p className="font-display text-2xl sm:text-3xl font-bold text-burn mt-1 flex items-center gap-1.5">
            <Flame size={20} className="text-burn" />
            {biome.activeFireHotspots24h}
          </p>
          <p className="text-xs text-ash mt-0.5">Sensores INPE / NASA FIRMS</p>
        </div>
      </div>

      {/* Detalhes Ecológicos e Vetores de Pressão */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="panel-soft p-6 space-y-4">
          <h3 className="display text-xl font-bold text-forest flex items-center gap-2">
            <Trees size={18} className="text-forest-mid" />
            <span>Importância Ecológica e Serviços Ecossistêmicos</span>
          </h3>
          <p className="text-sm leading-relaxed text-ash">
            {biome.ecologicalImportance}
          </p>
          <div className="pt-3 border-t border-forest/10">
            <span className="text-xs font-bold text-forest">Regime Climático:</span>
            <p className="text-xs text-ash mt-1">{biome.climate}</p>
          </div>
        </div>

        <div className="panel-soft p-6 space-y-4">
          <h3 className="display text-xl font-bold text-forest flex items-center gap-2">
            <Shield size={18} className="text-burn" />
            <span>Principais Vetores de Pressão & Ameaças</span>
          </h3>
          <ul className="space-y-2 text-sm text-ash">
            {biome.mainThreats.map((threat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-burn font-bold">•</span>
                <span>{threat}</span>
              </li>
            ))}
          </ul>
          {biome.deforestationTrendPercent !== null && (
            <div className="pt-3 border-t border-forest/10 flex items-center gap-2 text-xs">
              <TrendingDown size={15} className="text-forest" />
              <span className="font-bold text-forest">
                Tendência PRODES 2024: {biome.deforestationTrendPercent}% vs período anterior
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Fontes Científicas e Auditoria */}
      <div className="panel-soft p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-forest/10 pb-3">
          <h3 className="display text-lg font-bold text-forest flex items-center gap-2">
            <Info size={16} className="text-forest-mid" />
            <span>Bases Oficiais & Fontes Científicas Auditadas</span>
          </h3>
          <span className="text-xs font-semibold text-ash">Orçamento R$ 0 · Dados Públicos Abertos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {biome.sources.map((src, i) => (
            <div key={i} className="p-4 rounded-xl bg-mist border border-forest/10 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-forest">
                <span>{src.name}</span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ash hover:text-forest"
                  title="Abrir base oficial externa"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
              <p className="text-ash leading-relaxed">{src.description}</p>
              <p className="text-[11px] text-ash/80">Atualização: {src.lastUpdated}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
