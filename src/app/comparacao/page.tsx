'use client';

import React, { useState } from 'react';
import { BIOMES_DATA, BIOMES_LIST } from '@/data/biomes';
import { PageIntro } from '@/components/PageIntro';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
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

  const radarData = [
    { subject: 'Extensão Territorial', A: Math.min(100, (biomeA.areaKm2 / 4196943) * 100), B: Math.min(100, (biomeB.areaKm2 / 4196943) * 100) },
    { subject: 'Vegetação Nativa', A: biomeA.nativeVegetationPercentage, B: biomeB.nativeVegetationPercentage },
    { subject: 'Cobertura de UCs', A: Math.min(100, biomeA.protectedAreaPercentage * 2), B: Math.min(100, biomeB.protectedAreaPercentage * 2) },
    { subject: 'Focos 24h (Inverso)', A: Math.max(10, 100 - (biomeA.activeFireHotspots24h / 450) * 80), B: Math.max(10, 100 - (biomeB.activeFireHotspots24h / 450) * 80) },
    { subject: 'Estabilidade 2024', A: biomeA.deforestationTrendPercent ? Math.abs(biomeA.deforestationTrendPercent) * 2.5 : 80, B: biomeB.deforestationTrendPercent ? Math.abs(biomeB.deforestationTrendPercent) * 2.5 : 80 },
  ];

  return (
    <div className="section-inner max-w-6xl mx-auto py-6 space-y-8">
      {/* Cabeçalho */}
      <div className="border-b border-forest/10 pb-6">
        <PageIntro
          eyebrow="Análise Multicritério Oficial"
          title="Comparador Científico de Ambientes"
          eyebrowClassName="eyebrow text-forest-mid"
          titleClassName="display mt-2 text-3xl text-forest md:text-5xl"
        >
          <p className="mt-3 max-w-2xl text-base text-ash">
            Confronte diretamente dois ambientes brasileiros lado a lado com dados de vegetação remanescente,
            unidades de conservação, desmatamento auditado e focos termais.
          </p>
        </PageIntro>
      </div>

      {/* Seletores dos Dois Biomas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 panel-soft p-5">
        <div className="space-y-2 p-4 rounded-xl bg-mist border border-forest/10">
          <label className="text-xs font-bold text-forest flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: biomeA.color }} />
              <span>Ambiente Referência (A):</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-forest">{biomeA.percentageBrazil}% BR</span>
          </label>
          <select
            value={biomeAId}
            onChange={(e) => setBiomeAId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-forest/20 text-forest font-bold text-sm focus:outline-none focus:ring-2 focus:ring-forest cursor-pointer shadow-sm"
          >
            {BIOMES_LIST.map((b) => (
              <option key={b.id} value={b.id} disabled={b.id === biomeBId}>
                {b.name} ({b.percentageBrazil}% BR)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 p-4 rounded-xl bg-mist border border-forest/10">
          <label className="text-xs font-bold text-forest flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: biomeB.color }} />
              <span>Ambiente Comparado (B):</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-forest">{biomeB.percentageBrazil}% BR</span>
          </label>
          <select
            value={biomeBId}
            onChange={(e) => setBiomeBId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-forest/20 text-forest font-bold text-sm focus:outline-none focus:ring-2 focus:ring-forest cursor-pointer shadow-sm"
          >
            {BIOMES_LIST.map((b) => (
              <option key={b.id} value={b.id} disabled={b.id === biomeAId}>
                {b.name} ({b.percentageBrazil}% BR)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gráficos de Confronto: Barras & Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras */}
        <div className="panel-soft p-6 space-y-4">
          <div>
            <h3 className="display font-bold text-xl text-forest">
              Percentuais Comparativos (%)
            </h3>
            <p className="text-xs text-ash mt-1">
              {biomeA.name} vs {biomeB.name} — Dados MapBiomas e ICMBio
            </p>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#163d2a" opacity={0.08} />
                <XAxis dataKey="metric" stroke="#5f675f" fontSize={12} />
                <YAxis unit="%" stroke="#5f675f" fontSize={11} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#163d2a',
                    borderRadius: '12px',
                    color: '#122018',
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

        {/* Gráfico Radar */}
        <div className="panel-soft p-6 space-y-4">
          <div>
            <h3 className="display font-bold text-xl text-forest">
              Equilíbrio Ecológico & Vulnerabilidade
            </h3>
            <p className="text-xs text-ash mt-1">
              Comparação multidimensional normalizada
            </p>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#163d2a" opacity={0.15} />
                <PolarAngleAxis dataKey="subject" stroke="#5f675f" fontSize={10} />
                <PolarRadiusAxis stroke="#5f675f" fontSize={9} domain={[0, 100]} />
                <Radar name={biomeA.name} dataKey="A" stroke={biomeA.color} fill={biomeA.color} fillOpacity={0.3} />
                <Radar name={biomeB.name} dataKey="B" stroke={biomeB.color} fill={biomeB.color} fillOpacity={0.3} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#163d2a',
                    borderRadius: '12px',
                    color: '#122018',
                    fontSize: '12px'
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabela de Confronto Detalhado Lado a Lado */}
      <div className="panel-soft p-6 space-y-4">
        <h3 className="display font-bold text-xl text-forest">
          Tabela Comparativa Multicritério
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink">
            <thead className="bg-mist text-[11px] uppercase font-bold text-forest-mid border-b border-forest/10">
              <tr>
                <th className="py-3.5 px-4 w-1/3">Critério / Indicador</th>
                <th className="py-3.5 px-4 w-1/3 font-bold" style={{ color: biomeA.color }}>
                  {biomeA.name}
                </th>
                <th className="py-3.5 px-4 w-1/3 font-bold" style={{ color: biomeB.color }}>
                  {biomeB.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/10 font-sans">
              <tr>
                <td className="py-3 px-4 font-semibold text-ash">Classificação Oficial</td>
                <td className="py-3 px-4 font-bold">{biomeA.category}</td>
                <td className="py-3 px-4 font-bold">{biomeB.category}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-ash">Área Oficial (IBGE)</td>
                <td className="py-3 px-4 font-mono font-bold">{biomeA.areaKm2.toLocaleString('pt-BR')} km²</td>
                <td className="py-3 px-4 font-mono font-bold">{biomeB.areaKm2.toLocaleString('pt-BR')} km²</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-ash">% do Território Brasileiro</td>
                <td className="py-3 px-4 font-mono font-bold">{biomeA.percentageBrazil}%</td>
                <td className="py-3 px-4 font-mono font-bold">{biomeB.percentageBrazil}%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-ash">Vegetação Nativa Remanescente</td>
                <td className="py-3 px-4 font-mono font-bold text-forest">{biomeA.nativeVegetationPercentage}% (MapBiomas)</td>
                <td className="py-3 px-4 font-mono font-bold text-forest">{biomeB.nativeVegetationPercentage}% (MapBiomas)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-ash">Áreas Protegidas em UCs</td>
                <td className="py-3 px-4 font-mono font-bold text-forest-mid">{biomeA.protectedAreaPercentage}%</td>
                <td className="py-3 px-4 font-mono font-bold text-forest-mid">{biomeB.protectedAreaPercentage}%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-ash">Taxa de Desmatamento (PRODES 2024)</td>
                <td className="py-3 px-4 font-mono font-semibold">
                  {biomeA.deforestationProdes2024Km2 
                    ? `${biomeA.deforestationProdes2024Km2.toLocaleString('pt-BR')} km² (${biomeA.deforestationTrendPercent}%)` 
                    : 'Não aplicável (Eco Marinho)'}
                </td>
                <td className="py-3 px-4 font-mono font-semibold">
                  {biomeB.deforestationProdes2024Km2 
                    ? `${biomeB.deforestationProdes2024Km2.toLocaleString('pt-BR')} km² (${biomeB.deforestationTrendPercent}%)` 
                    : 'Não aplicável (Eco Marinho)'}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-ash">Focos de Calor (24h)</td>
                <td className="py-3 px-4 font-mono font-bold text-burn">{biomeA.activeFireHotspots24h} focos</td>
                <td className="py-3 px-4 font-mono font-bold text-burn">{biomeB.activeFireHotspots24h} focos</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-ash">Estados de Ocorrência</td>
                <td className="py-3 px-4 font-mono">{biomeA.states.join(', ')}</td>
                <td className="py-3 px-4 font-mono">{biomeB.states.join(', ')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
