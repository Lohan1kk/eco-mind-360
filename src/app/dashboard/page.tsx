'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Trees, 
  Flame, 
  TrendingDown, 
  Activity, 
  RefreshCw, 
  MapPin, 
  Download, 
  Filter,
  Compass
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DeforestationChart } from '@/components/dashboard/DeforestationChart';
import { LandCoverChart } from '@/components/dashboard/LandCoverChart';
import { BiomeSummaryGrid } from '@/components/dashboard/BiomeSummaryGrid';
import { RecentAlertsWidget } from '@/components/dashboard/RecentAlertsWidget';
import { BIOMES_LIST, BIOMES_DATA } from '@/data/biomes';

export default function DashboardPage() {
  const [selectedBiomeFilter, setSelectedBiomeFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeBiome = selectedBiomeFilter !== 'all' ? BIOMES_DATA[selectedBiomeFilter] : null;

  // Métricas agregadas ou específicas do bioma filtrado
  const nativeVegetation = activeBiome ? activeBiome.nativeVegetationPercentage : 64.2;
  const totalFires = activeBiome 
    ? activeBiome.activeFireHotspots24h 
    : BIOMES_LIST.reduce((acc, b) => acc + b.activeFireHotspots24h, 0);

  const deforestationVal = activeBiome 
    ? (activeBiome.deforestationProdes2024Km2 || 'N/A (Costeiro)')
    : 6288;

  const deforestationLabel = activeBiome 
    ? (activeBiome.deforestationTrendPercent ? `${activeBiome.deforestationTrendPercent}% vs 2023` : 'Monitoramento marinho')
    : 'queda histórica de 30,6% na Amazônia';

  const protectedArea = activeBiome ? activeBiome.protectedAreaPercentage : 29.8;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleExportSummary = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Ambiente,Area_km2,Percentual_BR,Veg_Nativa_Pct,Areas_Protegidas_Pct,PRODES_2024_km2,Focos_24h\n" +
      BIOMES_LIST.map(b => `${b.name},${b.areaKm2},${b.percentageBrazil},${b.nativeVegetationPercentage},${b.protectedAreaPercentage},${b.deforestationProdes2024Km2 || 0},${b.activeFireHotspots24h}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ecomind_360_resumo_biomas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="section-inner max-w-6xl mx-auto py-6 space-y-10">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#222D25] pb-6">
        <div>
          <div className="badge-360 mb-2">
            <Compass size={12} />
            <span>Telemetria & Dados Abertos 360°</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#DCE5DD] tracking-tight">
            Dashboard dos 7 Ambientes
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#A7B3A9] max-w-2xl leading-relaxed">
            Consolidação de sensoriamento remoto oficial (INPE, PRODES, MapBiomas e IBGE).
            Acompanhe o desmatamento, cobertura vegetal nativa e anomalias térmicas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportSummary}
            className="btn-secondary !py-2 !px-3.5 text-xs inline-flex items-center gap-1.5"
            title="Baixar resumo oficial em CSV"
          >
            <Download size={14} />
            <span>Exportar CSV</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            className="btn-secondary !p-2 text-xs"
            title="Recarregar dados satelitais"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-[#91A88F]' : ''} />
          </button>
        </div>
      </div>

      {/* Barra de Filtro Interativo por Bioma */}
      <div className="p-3 rounded-[10px] bg-[#131A16] border border-[#222D25] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-[#A7B3A9]">
          <Filter size={13} className="text-[#789B7C]" />
          <span>Filtro por Ambiente:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedBiomeFilter('all')}
            className={`px-3 py-1.5 rounded-[7px] text-xs font-medium transition-colors ${
              selectedBiomeFilter === 'all'
                ? 'bg-[#789B7C] text-[#101512] font-semibold'
                : 'text-[#A7B3A9] hover:text-[#DCE5DD] hover:bg-[#171F1A]'
            }`}
          >
            Brasil (Geral)
          </button>
          {BIOMES_LIST.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBiomeFilter(b.id)}
              className={`px-3 py-1.5 rounded-[7px] text-xs font-medium transition-colors ${
                selectedBiomeFilter === b.id
                  ? 'bg-[#789B7C] text-[#101512] font-semibold'
                  : 'text-[#A7B3A9] hover:text-[#DCE5DD] hover:bg-[#171F1A]'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        {activeBiome && (
          <Link
            href="/mapa"
            className="text-xs font-medium text-[#91A88F] hover:text-[#DCE5DD] flex items-center gap-1"
          >
            <MapPin size={13} />
            <span>Ver no Mapa →</span>
          </Link>
        )}
      </div>

      {/* Grade de KPIs Centrais */}
      <motion.div 
        key={`kpi-${selectedBiomeFilter}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <MetricCard
          title="Vegetação Nativa"
          value={nativeVegetation}
          unit="%"
          icon={Trees}
          trend={{ value: 0.2, label: 'estabilidade líquida', isPositiveGood: true }}
          description={`Proporção da cobertura vegetal original preservada ${activeBiome ? `no bioma ${activeBiome.name}` : 'no Brasil'}.`}
          source="MapBiomas Brasil (Coleção 9)"
        />

        <MetricCard
          title="Focos de Calor"
          value={totalFires}
          unit="focos 24h"
          icon={Flame}
          iconColor="text-[#A9A17A]"
          trend={{ value: 14.8, label: 'vs média semanal', isPositiveGood: false }}
          description={`Anomalias térmicas registradas na passagem dos sensores ${activeBiome ? `em ${activeBiome.name}` : 'no país'}.`}
          source="NASA FIRMS / INPE BDQueimadas"
        />

        <MetricCard
          title={activeBiome ? `Desmatamento ${activeBiome.name}` : "Desmatamento na Amazônia"}
          value={deforestationVal}
          unit={typeof deforestationVal === 'number' ? "km² (2024)" : ""}
          icon={TrendingDown}
          trend={activeBiome?.deforestationTrendPercent ? { value: activeBiome.deforestationTrendPercent, label: deforestationLabel, isPositiveGood: false } : undefined}
          description="Taxa oficial do Programa PRODES auditada com imagens de satélite sem cobertura de nuvens."
          source="INPE / MCTI (Novembro 2024)"
        />

        <MetricCard
          title="Áreas Protegidas"
          value={protectedArea}
          unit="% território"
          icon={Activity}
          iconColor="text-[#91A88F]"
          description={`Unidades de Conservação Federais e Estaduais (PI e US) ${activeBiome ? `no ${activeBiome.name}` : 'nacionais'}.`}
          source="ICMBio / SisBio / MMA"
        />
      </motion.div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeforestationChart />
        <LandCoverChart />
      </div>

      {/* Resumo dos 7 Ambientes */}
      <BiomeSummaryGrid />

      {/* Feed de Alertas Recentes */}
      <RecentAlertsWidget />
    </div>
  );
}
