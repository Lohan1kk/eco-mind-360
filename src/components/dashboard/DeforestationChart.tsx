'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { HISTORICAL_DEFORESTATION_PRODES } from '@/data/historicalSeries';

const BIOME_CONFIGS = [
  { key: 'amazonia', name: 'Amazônia', color: '#10b981' },
  { key: 'cerrado', name: 'Cerrado', color: '#d97706' },
  { key: 'caatinga', name: 'Caatinga', color: '#ea580c' },
  { key: 'pantanal', name: 'Pantanal', color: '#06b6d4' },
  { key: 'pampa', name: 'Pampa', color: '#84cc16' },
  { key: 'mata_atlantica', name: 'Mata Atlântica', color: '#059669' },
];

export function DeforestationChart() {
  const [selectedBiome, setSelectedBiome] = useState<string>('all');

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span>Evolução Histórica do Desmatamento</span>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              PRODES / INPE
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Taxa anual oficial consolidada de supressão vegetal (km²/ano de 2018 a 2024)
          </p>
        </div>

        {/* Seletor de foco de bioma */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs">
          <button
            onClick={() => setSelectedBiome('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedBiome === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedBiome('amazonia')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedBiome === 'amazonia'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Amazônia
          </button>
          <button
            onClick={() => setSelectedBiome('cerrado')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedBiome === 'cerrado'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-amber-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Cerrado
          </button>
        </div>
      </div>

      <div className="w-full h-72 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={HISTORICAL_DEFORESTATION_PRODES} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              {BIOME_CONFIGS.map((biome) => (
                <linearGradient key={biome.key} id={`grad-${biome.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={biome.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={biome.color} stopOpacity={0.0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k km²`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl text-xs backdrop-blur-md">
                      <div className="font-bold text-white mb-2">Ano {label} (PRODES/INPE)</div>
                      <div className="space-y-1">
                        {payload.map((entry) => (
                          <div key={entry.name} className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              {entry.name}:
                            </span>
                            <span className="font-mono font-bold text-white">
                              {Number(entry.value).toLocaleString('pt-BR')} km²
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
              formatter={(value) => <span className="text-slate-600 dark:text-slate-300 font-medium">{value}</span>}
            />
            {BIOME_CONFIGS.filter(b => selectedBiome === 'all' || b.key === selectedBiome).map((biome) => (
              <Area
                key={biome.key}
                type="monotone"
                dataKey={biome.key}
                name={biome.name}
                stroke={biome.color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#grad-${biome.key})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-1">
        <span>* Sistema Costeiro-Marinho possui dinâmica fitofisionômica marinha (sem taxa PRODES terrestre).</span>
        <span className="text-emerald-500 font-medium">Queda de 30,6% na Amazônia em 2024</span>
      </div>
    </div>
  );
}
