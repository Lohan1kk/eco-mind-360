'use client';

import React, { useState } from 'react';
import { 
  Trees, 
  Flame, 
  TrendingDown, 
  Activity, 
  Calendar,
  RefreshCw
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DeforestationChart } from '@/components/dashboard/DeforestationChart';
import { LandCoverChart } from '@/components/dashboard/LandCoverChart';
import { BiomeSummaryGrid } from '@/components/dashboard/BiomeSummaryGrid';
import { RecentAlertsWidget } from '@/components/dashboard/RecentAlertsWidget';
import { BIOMES_LIST } from '@/data/biomes';

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2024');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Média ponderada aproximada de vegetação nativa no Brasil: ~64.2%
  const totalNativeVegetation = 64.2;
  // Total de focos de calor ativos acumulados nas últimas 24h
  const totalFires24h = BIOMES_LIST.reduce((acc, b) => acc + b.activeFireHotspots24h, 0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
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
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
              Série Oficial 2024
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Indicadores agregados de sensoriamento remoto para os 7 ambientes brasileiros
          </p>
        </div>

        {/* Controles de Período e Atualização */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-xs shadow-sm">
            <Calendar size={14} className="text-slate-400 ml-1.5" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-200 font-medium focus:outline-none pr-2"
            >
              <option value="2024" className="bg-slate-900 text-white">Ano 2024 (Consolidado)</option>
              <option value="2023" className="bg-slate-900 text-white">Ano 2023</option>
              <option value="2022" className="bg-slate-900 text-white">Ano 2022</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 shadow-sm transition-colors"
            title="Recarregar dados satelitais"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-emerald-500' : ''} />
          </button>
        </div>
      </div>

      {/* Grade de KPIs Centrais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Vegetação Nativa Remanescente"
          value={totalNativeVegetation}
          unit="%"
          icon={Trees}
          iconColor="text-emerald-500"
          trend={{ value: 0.2, label: 'estabilidade líquida', isPositiveGood: true }}
          description="Proporção da cobertura vegetal primária e secundária preservada em território nacional."
          source="MapBiomas Brasil (Coleção 9)"
        />

        <MetricCard
          title="Focos de Calor Orbitais"
          value={totalFires24h}
          unit="detecções 24h"
          icon={Flame}
          iconColor="text-amber-500"
          trend={{ value: 14.8, label: 'vs média semanal', isPositiveGood: false }}
          description="Anomalias térmicas registradas na passagem dos sensores MODIS e VIIRS."
          source="NASA FIRMS / INPE BDQueimadas"
        />

        <MetricCard
          title="Desmatamento na Amazônia"
          value={6288}
          unit="km² (2024)"
          icon={TrendingDown}
          iconColor="text-emerald-400"
          trend={{ value: -30.6, label: 'queda histórica vs 2023', isPositiveGood: false }}
          description="Taxa oficial do Programa PRODES auditada com imagens de satélite sem cobertura de nuvens."
          source="INPE / MCTI (Novembro 2024)"
        />

        <MetricCard
          title="Áreas Formalmente Protegidas"
          value="29,8"
          unit="% território"
          icon={Activity}
          iconColor="text-blue-500"
          description="Unidades de Conservação Federais e Estaduais (PI e US) mais Terras Indígenas demarcadas."
          source="ICMBio / Funai / MMA"
        />
      </div>

      {/* Gráficos de Série Histórica e Uso da Terra */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeforestationChart />
        <LandCoverChart />
      </div>

      {/* Resumo Detalhado dos 7 Ambientes */}
      <BiomeSummaryGrid />

      {/* Feed de Alertas Recentes */}
      <RecentAlertsWidget />
    </div>
  );
}
