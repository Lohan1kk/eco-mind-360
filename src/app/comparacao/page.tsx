'use client';

import React, { useState } from 'react';
import { BIOMES_DATA, BIOMES_LIST } from '@/data/biomes';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export default function ComparacaoPage() {
  const [biomeAId, setBiomeAId] = useState<string>('amazonia');
  const [biomeBId, setBiomeBId] = useState<string>('cerrado');

  const biomeA = BIOMES_DATA[biomeAId] || BIOMES_LIST[0];
  const biomeB = BIOMES_DATA[biomeBId] || BIOMES_LIST[1];

  const comparisonData = [
    {
      metric: 'Veg. Nativa (%)',
      [biomeA.name]: biomeA.nativeVegetationPercentage,
      [biomeB.name]: biomeB.nativeVegetationPercentage,
    },
    {
      metric: 'Áreas UCs (%)',
      [biomeA.name]: biomeA.protectedAreaPercentage,
      [biomeB.name]: biomeB.protectedAreaPercentage,
    },
    {
      metric: '% do Brasil',
      [biomeA.name]: biomeA.percentageBrazil,
      [biomeB.name]: biomeB.percentageBrazil,
    },
  ];

  return (
    <div className="space-y-8 py-2">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Comparador Científico de Ambientes
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
              Análise Multicritério
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Confronte métricas oficiais de preservação, área e pressões antrópicas lado a lado
          </p>
        </div>
      </div>

      {/* Seletores dos Dois Biomas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: biomeA.color }} />
            <span>Primeiro Ambiente (A):</span>
          </label>
          <select
            value={biomeAId}
            onChange={(e) => setBiomeAId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {BIOMES_LIST.map((b) => (
              <option key={b.id} value={b.id} disabled={b.id === biomeBId}>
                {b.name} ({b.percentageBrazil}% BR)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: biomeB.color }} />
            <span>Segundo Ambiente (B):</span>
          </label>
          <select
            value={biomeBId}
            onChange={(e) => setBiomeBId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {BIOMES_LIST.map((b) => (
              <option key={b.id} value={b.id} disabled={b.id === biomeAId}>
                {b.name} ({b.percentageBrazil}% BR)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gráfico Comparativo de Percentuais */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Comparação Direta de Percentuais Críticos (%)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {biomeA.name} vs {biomeB.name} — Dados MapBiomas e ICMBio
          </p>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="metric" stroke="#64748b" fontSize={12} />
              <YAxis unit="%" stroke="#64748b" fontSize={11} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '12px'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey={biomeA.name} fill={biomeA.color} radius={[6, 6, 0, 0]} />
              <Bar dataKey={biomeB.name} fill={biomeB.color} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de Confronto Detalhado Lado a Lado */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Tabela Comparativa Multicritério
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900 text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-1/3">Critério / Indicador</th>
                <th className="py-3 px-4 w-1/3" style={{ color: biomeA.color }}>
                  {biomeA.name}
                </th>
                <th className="py-3 px-4 w-1/3" style={{ color: biomeB.color }}>
                  {biomeB.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Classificação Oficial</td>
                <td className="py-3 px-4 font-medium">{biomeA.category}</td>
                <td className="py-3 px-4 font-medium">{biomeB.category}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Área Oficial (IBGE)</td>
                <td className="py-3 px-4 font-mono font-bold">{biomeA.areaKm2.toLocaleString('pt-BR')} km²</td>
                <td className="py-3 px-4 font-mono font-bold">{biomeB.areaKm2.toLocaleString('pt-BR')} km²</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">% do Território Brasileiro</td>
                <td className="py-3 px-4 font-mono font-bold">{biomeA.percentageBrazil}%</td>
                <td className="py-3 px-4 font-mono font-bold">{biomeB.percentageBrazil}%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Vegetação Nativa Remanescente</td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-500">{biomeA.nativeVegetationPercentage}% (MapBiomas)</td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-500">{biomeB.nativeVegetationPercentage}% (MapBiomas)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Áreas Protegidas em UCs</td>
                <td className="py-3 px-4 font-mono font-bold text-blue-500">{biomeA.protectedAreaPercentage}%</td>
                <td className="py-3 px-4 font-mono font-bold text-blue-500">{biomeB.protectedAreaPercentage}%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Taxa de Desmatamento (PRODES 2024)</td>
                <td className="py-3 px-4 font-mono">
                  {biomeA.deforestationProdes2024Km2 
                    ? `${biomeA.deforestationProdes2024Km2.toLocaleString('pt-BR')} km² (${biomeA.deforestationTrendPercent}%)` 
                    : 'Não aplicável (Eco Marinho)'}
                </td>
                <td className="py-3 px-4 font-mono">
                  {biomeB.deforestationProdes2024Km2 
                    ? `${biomeB.deforestationProdes2024Km2.toLocaleString('pt-BR')} km² (${biomeB.deforestationTrendPercent}%)` 
                    : 'Não aplicável (Eco Marinho)'}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Focos de Calor (24h)</td>
                <td className="py-3 px-4 font-mono font-bold text-amber-500">{biomeA.activeFireHotspots24h} focos</td>
                <td className="py-3 px-4 font-mono font-bold text-amber-500">{biomeB.activeFireHotspots24h} focos</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Estados de Ocorrência</td>
                <td className="py-3 px-4 font-mono">{biomeA.states.join(', ')}</td>
                <td className="py-3 px-4 font-mono">{biomeB.states.join(', ')}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Principais Ameaças</td>
                <td className="py-3 px-4 text-xs leading-relaxed">
                  <ul className="list-disc list-inside space-y-0.5">
                    {biomeA.mainThreats.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </td>
                <td className="py-3 px-4 text-xs leading-relaxed">
                  <ul className="list-disc list-inside space-y-0.5">
                    {biomeB.mainThreats.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
