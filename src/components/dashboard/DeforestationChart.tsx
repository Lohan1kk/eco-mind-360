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
  { key: 'amazonia', name: 'Amazônia', color: '#163d2a' },
  { key: 'cerrado', name: 'Cerrado', color: '#c45524' },
  { key: 'caatinga', name: 'Caatinga', color: '#87441f' },
  { key: 'pantanal', name: 'Pantanal', color: '#2f7a4f' },
  { key: 'pampa', name: 'Pampa', color: '#529668' },
  { key: 'mata_atlantica', name: 'Mata Atlântica', color: '#1f5438' },
];

export function DeforestationChart() {
  const [selectedBiome, setSelectedBiome] = useState<string>('all');

  return (
    <div className="panel-soft flex flex-col justify-between p-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest-mid">
            PRODES / INPE · Série Histórica
          </span>
          <h3 className="display font-bold text-xl text-forest mt-0.5">
            Evolução do Desmatamento
          </h3>
          <p className="text-xs text-ash mt-1">
            Taxa anual oficial consolidada (km²/ano de 2018 a 2024)
          </p>
        </div>

        {/* Seletor de foco de bioma */}
        <div className="flex items-center gap-1 border border-forest/15 bg-mist p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setSelectedBiome('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              selectedBiome === 'all'
                ? 'bg-forest text-mist shadow-sm'
                : 'text-ash hover:text-forest'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setSelectedBiome('amazonia')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              selectedBiome === 'amazonia'
                ? 'bg-forest text-mist shadow-sm'
                : 'text-ash hover:text-forest'
            }`}
          >
            Amazônia
          </button>
          <button
            type="button"
            onClick={() => setSelectedBiome('cerrado')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              selectedBiome === 'cerrado'
                ? 'bg-forest text-mist shadow-sm'
                : 'text-ash hover:text-forest'
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
            <CartesianGrid strokeDasharray="3 3" stroke="#163d2a" opacity={0.08} />
            <XAxis dataKey="year" stroke="#5f675f" fontSize={12} tickLine={false} />
            <YAxis 
              stroke="#5f675f" 
              fontSize={11} 
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k km²`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 bg-white/95 border border-forest/15 rounded-xl shadow-lg text-xs backdrop-blur-md">
                      <div className="font-bold text-forest mb-2">Ano {label} (PRODES/INPE)</div>
                      <div className="space-y-1">
                        {payload.map((entry) => (
                          <div key={entry.name} className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              {entry.name}:
                            </span>
                            <span className="font-mono font-bold text-ink">
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
              formatter={(value) => <span className="text-forest font-semibold">{value}</span>}
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

      <div className="mt-3 pt-3 border-t border-forest/10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-ash gap-1">
        <span>* Taxas oficiais auditadas sem nuvens pelo MCTI / INPE.</span>
        <span className="text-forest font-bold">Queda de 30,6% na Amazônia em 2024</span>
      </div>
    </div>
  );
}
