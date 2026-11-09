'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { LAND_COVER_DISTRIBUTION } from '@/data/historicalSeries';

export function LandCoverChart() {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span>Uso e Cobertura do Solo por Ambiente</span>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              MapBiomas Col. 9
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Proporção de vegetação nativa remanescente vs atividades antrópicas (%)
          </p>
        </div>
      </div>

      <div className="w-full h-72 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={LAND_COVER_DISTRIBUTION}
            layout="vertical"
            margin={{ top: 5, right: 15, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} horizontal={false} />
            <XAxis type="number" domain={[0, 100]} unit="%" stroke="#64748b" fontSize={11} />
            <YAxis 
              type="category" 
              dataKey="biomeName" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              width={100}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl text-xs backdrop-blur-md">
                      <div className="font-bold text-white mb-2">{label}</div>
                      <div className="space-y-1">
                        {payload.map((entry) => (
                          <div key={entry.name} className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              {entry.name}:
                            </span>
                            <span className="font-mono font-bold text-white">
                              {entry.value}%
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
            <Bar dataKey="vegetacaoNativa" name="Vegetação Nativa" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
            <Bar dataKey="agropecuaria" name="Agropecuária" stackId="a" fill="#f59e0b" />
            <Bar dataKey="agua" name="Corpos d'Água" stackId="a" fill="#06b6d4" />
            <Bar dataKey="outros" name="Urbano / Outros" stackId="a" fill="#64748b" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>Fonte: MapBiomas Brasil (Série histórica 1985-2023 consolidada)</span>
        <span className="text-cyan-500 font-medium">Classificação Oficial</span>
      </div>
    </div>
  );
}
