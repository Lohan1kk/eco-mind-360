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
    <div className="glass-panel flex flex-col justify-between p-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            MapBiomas Coleção 9
          </span>
          <h3 className="font-display font-extrabold text-xl text-slate-900 mt-1.5">
            Uso e Cobertura do Solo
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Vegetação nativa remanescente vs atividades agropecuárias e corpos d&apos;água (%)
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
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} horizontal={false} />
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
                    <div className="p-3.5 bg-white/95 border border-slate-200/90 rounded-2xl shadow-xl text-xs backdrop-blur-md">
                      <div className="font-bold text-slate-900 mb-2 font-display">{label}</div>
                      <div className="space-y-1.5 font-mono">
                        {payload.map((entry) => (
                          <div key={entry.name} className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 font-sans font-medium" style={{ color: entry.color }}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              {entry.name}:
                            </span>
                            <span className="font-bold text-slate-900">
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
              formatter={(value) => <span className="text-slate-700 font-semibold">{value}</span>}
            />
            <Bar dataKey="vegetacaoNativa" name="Vegetação Nativa" stackId="a" fill="#059669" radius={[0, 0, 0, 0]} />
            <Bar dataKey="agropecuaria" name="Agropecuária" stackId="a" fill="#d97706" />
            <Bar dataKey="agua" name="Corpos d'Água" stackId="a" fill="#0284c7" />
            <Bar dataKey="outros" name="Urbano / Outros" stackId="a" fill="#64748b" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Fonte: MapBiomas Brasil (Série histórica 1985-2023)</span>
        <span className="text-emerald-700 font-bold font-sans">Classificação Satelital</span>
      </div>
    </div>
  );
}
