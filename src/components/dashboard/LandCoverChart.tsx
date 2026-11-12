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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#91A88F]">
            MapBiomas Coleção 9
          </span>
          <h3 className="font-display font-semibold text-lg text-[#DCE5DD] mt-1">
            Uso e Cobertura do Solo
          </h3>
          <p className="text-xs text-[#78877D] mt-0.5">
            Vegetação nativa remanescente vs atividades agropecuárias e corpos d&apos;água (%)
          </p>
        </div>
      </div>

      <div className="w-full h-72 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={LAND_COVER_DISTRIBUTION}
            layout="vertical"
            margin={{ top: 5, right: 15, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#222D25" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} unit="%" stroke="#78877D" fontSize={11} axisLine={{ stroke: '#222D25' }} />
            <YAxis 
              type="category" 
              dataKey="biomeName" 
              stroke="#A7B3A9" 
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: '#222D25' }}
              width={108}
            />
            <Tooltip
              cursor={{ fill: 'rgba(36, 49, 41, 0.4)' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 bg-[#171F1A] border border-[#29362D] rounded-[10px] shadow-lift text-xs">
                      <div className="font-semibold text-[#DCE5DD] mb-2">{label}</div>
                      <div className="space-y-1.5 font-mono">
                        {payload.map((entry) => (
                          <div key={entry.name} className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 font-sans text-[#A7B3A9]">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              {entry.name}:
                            </span>
                            <span className="font-medium text-[#DCE5DD]">
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
              formatter={(value) => <span className="text-[#A7B3A9] font-medium">{value}</span>}
            />
            <Bar dataKey="vegetacaoNativa" name="Vegetação Nativa" stackId="a" fill="#789B7C" radius={[0, 0, 0, 0]} />
            <Bar dataKey="agropecuaria" name="Agropecuária" stackId="a" fill="#A9A17A" />
            <Bar dataKey="agua" name="Corpos d'Água" stackId="a" fill="#365C40" />
            <Bar dataKey="outros" name="Urbano / Outros" stackId="a" fill="#78877D" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-[#222D25] flex items-center justify-between text-[11px] text-[#78877D] font-mono">
        <span>Fonte: MapBiomas Brasil (Série histórica 1985-2023)</span>
        <span className="text-[#91A88F]">Classificação Satelital</span>
      </div>
    </div>
  );
}
