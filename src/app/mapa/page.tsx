'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapWrapper } from '@/components/map/MapWrapper';
import { 
  Layers, 
  Flame, 
  Satellite,
  Compass
} from 'lucide-react';

function MapContent() {
  const searchParams = useSearchParams();
  const initialBiome = searchParams.get('biome') || undefined;

  return (
    <div className="space-y-6 py-2">
      {/* Cabeçalho da Página do Mapa */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Mapa Interativo do Brasil
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20">
              GeoJSON Oficial IBGE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visualização geoespacial com polígonos dos 7 ambientes e camadas de alertas orbitais
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Satellite size={15} className="text-emerald-500" />
          <span>Sensores Ativos: MODIS, VIIRS, WFI, MSI</span>
        </div>
      </div>

      {/* Componente de Mapa Dinâmico */}
      <MapWrapper initialBiomeId={initialBiome} />

      {/* Guia de Navegação e Interpretação Cartográfica */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Compass size={15} className="text-emerald-500" />
            <span>Como Explorar o Mapa</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Clique em qualquer região do mapa para selecionar o bioma correspondente e abrir o painel lateral com indicadores de conservação, área territorial e taxas oficiais.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Flame size={15} className="text-amber-500" />
            <span>Focos de Calor vs Área Queimada</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Os marcadores com anéis pulsantes laranjas representam anomalias térmicas (focos de calor instantâneos detectados por satélite), e não o perímetro total da área afetada pelo fogo.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Layers size={15} className="text-blue-500" />
            <span>Alternância de Camadas Base</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            No canto superior direito do mapa, você pode alternar entre o mapa escuro com alto contraste (CartoDB), imagem fotográfica de satélite em alta resolução (ESRI) e OpenStreetMap.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MapaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Carregando mapa...</div>}>
      <MapContent />
    </Suspense>
  );
}
