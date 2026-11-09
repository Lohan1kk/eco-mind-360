'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Trees, 
  Flame, 
  TrendingDown, 
  Activity, 
  Calendar,
  RefreshCw,
  MapPin,
  Download,
  Filter
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DeforestationChart } from '@/components/dashboard/DeforestationChart';
import { LandCoverChart } from '@/components/dashboard/LandCoverChart';
import { BiomeSummaryGrid } from '@/components/dashboard/BiomeSummaryGrid';
import { RecentAlertsWidget } from '@/components/dashboard/RecentAlertsWidget';
import { BIOMES_LIST, BIOMES_DATA } from '@/data/biomes';

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2024');
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

  // Exportar resumo para CSV simples
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
    <div className="space-y-8 py-2">
      {/* Cabeçalho do Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Dashboard Ambiental do Brasil
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
              Série Oficial 2024
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Indicadores agregados de sensoriamento remoto para os 7 ambientes brasileiros
          </p>
        </div>

        {/* Controles de Período, Exportação e Atualização */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#0b121e] border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-xs shadow-sm">
            <Calendar size={14} className="text-slate-400 ml-1.5" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-200 font-bold focus:outline-none pr-2 cursor-pointer"
            >
              <option value="2024" className="bg-slate-900 text-white">Ano 2024 (Consolidado)</option>
              <option value="2023" className="bg-slate-900 text-white">Ano 2023</option>
              <option value="2022" className="bg-slate-900 text-white">Ano 2022</option>
            </select>
          </div>

          <button
            onClick={handleExportSummary}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#0b121e] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-500 dark:hover:text-emerald-400 shadow-sm transition-all flex items-center gap-1.5 text-xs font-semibold"
            title="Baixar resumo oficial em CSV"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl bg-white dark:bg-[#0b121e] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 shadow-sm transition-colors"
            title="Recarregar dados satelitais"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-emerald-500' : ''} />
          </button>
        </div>
      </div>

      {/* Barra de Filtro Interativo por Bioma */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#090f1a] border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-emerald-500" />
          <span className="font-bold text-slate-700 dark:text-slate-200">Filtro de Telemetria:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedBiomeFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedBiomeFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            🇧🇷 Brasil (Geral)
          </button>
          {BIOMES_LIST.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBiomeFilter(b.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                selectedBiomeFilter === b.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
              <span>{b.name}</span>
            </button>
          ))}
        </div>

        {activeBiome && (
          <Link
            href={`/mapa?biome=${activeBiome.id}`}
            className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1"
          >
            <MapPin size={13} />
            <span>Focar {activeBiome.name} no Mapa →</span>
          </Link>
        )}
      </div>

      {/* Grade de KPIs Centrais */}
      <motion.div 
        key={`kpi-${selectedBiomeFilter}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard
          title="Vegetação Nativa Remanescente"
          value={nativeVegetation}
          unit="%"
          icon={Trees}
          iconColor="text-emerald-500"
          trend={{ value: 0.2, label: 'estabilidade líquida', isPositiveGood: true }}
          description={`Proporção da cobertura vegetal original preservada ${activeBiome ? `no bioma ${activeBiome.name}` : 'no Brasil'}.`}
          source="MapBiomas Brasil (Coleção 9)"
        />

        <MetricCard
          title="Focos de Calor Orbitais"
          value={totalFires}
          unit="detecções 24h"
          icon={Flame}
          iconColor="text-amber-500"
          trend={{ value: 14.8, label: 'vs média semanal', isPositiveGood: false }}
          description={`Anomalias térmicas registradas na passagem dos sensores MODIS e VIIRS ${activeBiome ? `em ${activeBiome.name}` : 'no país'}.`}
          source="NASA FIRMS / INPE BDQueimadas"
        />

        <MetricCard
          title={activeBiome ? `Desmatamento ${activeBiome.name}` : "Desmatamento na Amazônia"}
          value={deforestationVal}
          unit={typeof deforestationVal === 'number' ? "km² (2024)" : ""}
          icon={TrendingDown}
          iconColor="text-emerald-400"
          trend={activeBiome?.deforestationTrendPercent ? { value: activeBiome.deforestationTrendPercent, label: deforestationLabel, isPositiveGood: false } : undefined}
          description="Taxa oficial do Programa PRODES auditada com imagens de satélite sem cobertura de nuvens."
          source="INPE / MCTI (Novembro 2024)"
        />

        <MetricCard
          title="Áreas Formalmente Protegidas"
          value={protectedArea}
          unit="% território"
          icon={Activity}
          iconColor="text-blue-500"
          description={`Unidades de Conservação Federais e Estaduais (PI e US) ${activeBiome ? `no ${activeBiome.name}` : 'nacionais'}.`}
          source="ICMBio / SisBio / MMA"
        />
      </motion.div>

      {/* Gráficos de Série Histórica e Uso da Terra */}
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
