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
  { key: 'amazonia', name: 'Amazônia', color: '#789B7C' },
  { key: 'cerrado', name: 'Cerrado', color: '#A9A17A' },
  { key: 'caatinga', name: 'Caatinga', color: '#91A88F' },
  { key: 'pantanal', name: 'Pantanal', color: '#5A8068' },
  { key: 'pampa', name: 'Pampa', color: '#667F61' },
  { key: 'mata_atlantica', name: 'Mata Atlântica', color: '#83A989' },
];

export function DeforestationChart() {
  const [selectedBiome, setSelectedBiome] = useState<string>('all');

  return (
    <div className="glass-panel flex flex-col justify-between p-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#91A88F]">
            PRODES / INPE · Série Histórica
          </span>
          <h3 className="font-display font-semibold text-lg text-[#DCE5DD] mt-1">
            Evolução do Desmatamento
          </h3>
          <p className="text-xs text-[#78877D] mt-0.5">
            Taxa anual oficial consolidada (km²/ano de 2018 a 2024)
          </p>
        </div>

        {/* Seletor de foco de bioma */}
        <div className="flex items-center gap-1 border border-[#29362D] bg-[#131A16] p-1 rounded-[7px] text-xs">
          <button
            type="button"
            onClick={() => setSelectedBiome('all')}
            className={`px-2.5 py-1 rounded-[5px] font-medium transition-colors ${
              selectedBiome === 'all'
                ? 'bg-[#789B7C] text-[#101512] font-semibold'
                : 'text-[#A7B3A9] hover:text-[#DCE5DD]'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setSelectedBiome('amazonia')}
            className={`px-2.5 py-1 rounded-[5px] font-medium transition-colors ${
              selectedBiome === 'amazonia'
                ? 'bg-[#789B7C] text-[#101512] font-semibold'
                : 'text-[#A7B3A9] hover:text-[#DCE5DD]'
            }`}
          >
            Amazônia
          </button>
          <button
            type="button"
            onClick={() => setSelectedBiome('cerrado')}
            className={`px-2.5 py-1 rounded-[5px] font-medium transition-colors ${
              selectedBiome === 'cerrado'
                ? 'bg-[#789B7C] text-[#101512] font-semibold'
                : 'text-[#A7B3A9] hover:text-[#DCE5DD]'
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
                  <stop offset="5%" stopColor={biome.color} stopOpacity={0.28} />
                  <stop offset="95%" stopColor={biome.color} stopOpacity={0.0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222D25" />
            <XAxis dataKey="year" stroke="#78877D" fontSize={11} tickLine={false} axisLine={{ stroke: '#222D25' }} />
            <YAxis 
              stroke="#78877D" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#222D25' }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k km²`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 bg-[#171F1A] border border-[#29362D] rounded-[10px] shadow-lift text-xs">
                      <div className="font-semibold text-[#DCE5DD] mb-2 font-mono">Ano {label} (PRODES/INPE)</div>
                      <div className="space-y-1.5 font-mono">
                        {payload.map((entry) => (
                          <div key={entry.name} className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 font-sans text-[#A7B3A9]">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              {entry.name}:
                            </span>
                            <span className="font-medium text-[#DCE5DD]">
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
              formatter={(value) => <span className="text-[#A7B3A9] font-medium">{value}</span>}
            />
            {BIOME_CONFIGS.filter(b => selectedBiome === 'all' || b.key === selectedBiome).map((biome) => (
              <Area
                key={biome.key}
                type="monotone"
                dataKey={biome.key}
                name={biome.name}
                stroke={biome.color}
                strokeWidth={1.75}
                fillOpacity={1}
                fill={`url(#grad-${biome.key})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-[#222D25] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-[#78877D] gap-1 font-mono">
        <span>* Auditoria MCTI / INPE em imagens livres de nuvens.</span>
        <span className="text-[#83A989]">Queda de 30,6% na Amazônia em 2024</span>
      </div>
    </div>
  );
}
