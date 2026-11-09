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
    <div className="panel-soft flex flex-col justify-between p-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest-mid">
            MapBiomas Coleção 9
          </span>
          <h3 className="display font-bold text-xl text-forest mt-0.5">
            Uso e Cobertura do Solo
          </h3>
          <p className="text-xs text-ash mt-1">
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
            <CartesianGrid strokeDasharray="3 3" stroke="#163d2a" opacity={0.08} horizontal={false} />
            <XAxis type="number" domain={[0, 100]} unit="%" stroke="#5f675f" fontSize={11} />
            <YAxis 
              type="category" 
              dataKey="biomeName" 
              stroke="#5f675f" 
              fontSize={11} 
              tickLine={false} 
              width={100}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 bg-white/95 border border-forest/15 rounded-xl shadow-lg text-xs backdrop-blur-md">
                      <div className="font-bold text-forest mb-2">{label}</div>
                      <div className="space-y-1">
                        {payload.map((entry) => (
                          <div key={entry.name} className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              {entry.name}:
                            </span>
                            <span className="font-mono font-bold text-ink">
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
              formatter={(value) => <span className="text-forest font-semibold">{value}</span>}
            />
            <Bar dataKey="vegetacaoNativa" name="Vegetação Nativa" stackId="a" fill="#163d2a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="agropecuaria" name="Agropecuária" stackId="a" fill="#c45524" />
            <Bar dataKey="agua" name="Corpos d'Água" stackId="a" fill="#529668" />
            <Bar dataKey="outros" name="Urbano / Outros" stackId="a" fill="#5f675f" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-forest/10 flex items-center justify-between text-[11px] text-ash">
        <span>Fonte: MapBiomas Brasil (Série histórica 1985-2023)</span>
        <span className="text-forest font-bold">Classificação Satelital</span>
      </div>
    </div>
  );
}
