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
  { key: 'amazonia', name: 'Amazônia', color: '#059669' },
  { key: 'cerrado', name: 'Cerrado', color: '#d97706' },
  { key: 'caatinga', name: 'Caatinga', color: '#ea580c' },
  { key: 'pantanal', name: 'Pantanal', color: '#0284c7' },
  { key: 'pampa', name: 'Pampa', color: '#65a30d' },
  { key: 'mata_atlantica', name: 'Mata Atlântica', color: '#047857' },
];

export function DeforestationChart() {
  const [selectedBiome, setSelectedBiome] = useState<string>('all');

  return (
    <div className="glass-panel flex flex-col justify-between p-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            PRODES / INPE · Série Histórica
          </span>
          <h3 className="font-display font-extrabold text-xl text-slate-900 mt-1.5">
            Evolução do Desmatamento
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Taxa anual oficial consolidada (km²/ano de 2018 a 2024)
          </p>
        </div>

        {/* Seletor de foco de bioma */}
        <div className="flex items-center gap-1 border border-slate-200/80 bg-slate-50 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setSelectedBiome('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              selectedBiome === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setSelectedBiome('amazonia')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              selectedBiome === 'amazonia'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Amazônia
          </button>
          <button
            type="button"
            onClick={() => setSelectedBiome('cerrado')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              selectedBiome === 'cerrado'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
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
                  <stop offset="5%" stopColor={biome.color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={biome.color} stopOpacity={0.0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
            <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
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
                    <div className="p-3.5 bg-white/95 border border-slate-200/90 rounded-2xl shadow-xl text-xs backdrop-blur-md">
                      <div className="font-bold text-slate-900 mb-2 font-display">Ano {label} (PRODES/INPE)</div>
                      <div className="space-y-1.5 font-mono">
                        {payload.map((entry) => (
                          <div key={entry.name} className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 font-sans font-medium" style={{ color: entry.color }}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              {entry.name}:
                            </span>
                            <span className="font-bold text-slate-900">
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
              formatter={(value) => <span className="text-slate-700 font-semibold">{value}</span>}
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

      <div className="mt-3 pt-3 border-t border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 gap-1 font-mono">
        <span>* Auditoria MCTI / INPE em imagens livres de nuvens.</span>
        <span className="text-emerald-700 font-bold font-sans">Queda de 30,6% na Amazônia em 2024</span>
      </div>
    </div>
  );
}
