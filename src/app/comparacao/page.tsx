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
    <div className="section-inner max-w-6xl mx-auto py-8 space-y-8">
      {/* Cabeçalho */}
      <div className="border-b border-[#222D25] pb-6">
        <PageIntro
          eyebrow="Análise Multicritério Oficial"
          title="Comparador Científico de Ambientes"
          eyebrowClassName="eyebrow text-[#789B7C]"
          titleClassName="display mt-2 text-3xl text-[#DCE5DD] md:text-4xl font-semibold"
        >
          <p className="mt-2.5 max-w-2xl text-sm sm:text-base text-[#A7B3A9]">
            Confronte diretamente dois ambientes brasileiros lado a lado com dados de vegetação remanescente,
            unidades de conservação, desmatamento auditado e focos termais.
          </p>
        </PageIntro>
      </div>

      {/* Seletores dos Dois Biomas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-[10px] border border-[#29362D] bg-[#171F1A] p-5">
        <div className="space-y-2.5 p-4 rounded-[7px] bg-[#131A16] border border-[#222D25]">
          <label className="text-xs font-medium text-[#DCE5DD] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: biomeA.color }} />
              <span>Ambiente Referência (A):</span>
            </div>
            <span className="text-[11px] font-mono text-[#91A88F]">{biomeA.percentageBrazil}% BR</span>
          </label>
          <select
            value={biomeAId}
            onChange={(e) => setBiomeAId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-[7px] bg-[#171F1A] border border-[#29362D] text-[#DCE5DD] font-medium text-sm focus:outline-none focus:border-[#789B7C] cursor-pointer"
          >
            {BIOMES_LIST.map((b) => (
              <option key={b.id} value={b.id} disabled={b.id === biomeBId}>
                {b.name} ({b.percentageBrazil}% BR)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2.5 p-4 rounded-[7px] bg-[#131A16] border border-[#222D25]">
          <label className="text-xs font-medium text-[#DCE5DD] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: biomeB.color }} />
              <span>Ambiente Comparado (B):</span>
            </div>
            <span className="text-[11px] font-mono text-[#91A88F]">{biomeB.percentageBrazil}% BR</span>
          </label>
          <select
            value={biomeBId}
            onChange={(e) => setBiomeBId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-[7px] bg-[#171F1A] border border-[#29362D] text-[#DCE5DD] font-medium text-sm focus:outline-none focus:border-[#789B7C] cursor-pointer"
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
        <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 space-y-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-[#DCE5DD]">
              Percentuais Comparativos (%)
            </h3>
            <p className="text-xs text-[#78877D] mt-1">
              {biomeA.name} vs {biomeB.name} — Dados MapBiomas e ICMBio
            </p>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222D25" />
                <XAxis dataKey="metric" stroke="#78877D" fontSize={11} tickLine={false} />
                <YAxis unit="%" stroke="#78877D" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#131A16', 
                    borderColor: '#29362D',
                    borderRadius: '7px',
                    color: '#DCE5DD',
                    fontSize: '12px'
                  }} 
                  cursor={{ fill: '#1D2821', opacity: 0.4 }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#A7B3A9' }} />
                <Bar dataKey={biomeA.name} fill={biomeA.color} radius={[5, 5, 0, 0]} />
                <Bar dataKey={biomeB.name} fill={biomeB.color} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Radar */}
        <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 space-y-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-[#DCE5DD]">
              Equilíbrio Ecológico & Vulnerabilidade
            </h3>
            <p className="text-xs text-[#78877D] mt-1">
              Comparação multidimensional normalizada
            </p>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#29362D" />
                <PolarAngleAxis dataKey="subject" stroke="#A7B3A9" fontSize={10} />
                <PolarRadiusAxis stroke="#78877D" fontSize={9} domain={[0, 100]} />
                <Radar name={biomeA.name} dataKey="A" stroke={biomeA.color} fill={biomeA.color} fillOpacity={0.25} />
                <Radar name={biomeB.name} dataKey="B" stroke={biomeB.color} fill={biomeB.color} fillOpacity={0.25} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#A7B3A9' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#131A16', 
                    borderColor: '#29362D',
                    borderRadius: '7px',
                    color: '#DCE5DD',
                    fontSize: '12px'
                  }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabela de Confronto Detalhado Lado a Lado */}
      <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 space-y-4">
        <h3 className="font-display font-semibold text-lg text-[#DCE5DD]">
          Tabela Comparativa Multicritério
        </h3>

        <div className="overflow-x-auto rounded-[7px] border border-[#222D25]">
          <table className="w-full text-left text-xs text-[#DCE5DD]">
            <thead className="bg-[#131A16] text-[11px] font-mono uppercase text-[#78877D] border-b border-[#222D25]">
              <tr>
                <th className="py-3.5 px-4 w-1/3 font-medium">Critério / Indicador</th>
                <th className="py-3.5 px-4 w-1/3 font-semibold" style={{ color: biomeA.color }}>
                  {biomeA.name}
                </th>
                <th className="py-3.5 px-4 w-1/3 font-semibold" style={{ color: biomeB.color }}>
                  {biomeB.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222D25] font-sans">
              <tr className="hover:bg-[#1D2821]/40">
                <td className="py-3 px-4 font-medium text-[#A7B3A9]">Classificação Oficial</td>
                <td className="py-3 px-4 font-medium text-[#DCE5DD]">{biomeA.category}</td>
                <td className="py-3 px-4 font-medium text-[#DCE5DD]">{biomeB.category}</td>
              </tr>
              <tr className="hover:bg-[#1D2821]/40">
                <td className="py-3 px-4 font-medium text-[#A7B3A9]">Área Oficial (IBGE)</td>
                <td className="py-3 px-4 font-mono font-medium text-[#DCE5DD]">{biomeA.areaKm2.toLocaleString('pt-BR')} km²</td>
                <td className="py-3 px-4 font-mono font-medium text-[#DCE5DD]">{biomeB.areaKm2.toLocaleString('pt-BR')} km²</td>
              </tr>
              <tr className="hover:bg-[#1D2821]/40">
                <td className="py-3 px-4 font-medium text-[#A7B3A9]">% do Território Brasileiro</td>
                <td className="py-3 px-4 font-mono font-medium text-[#DCE5DD]">{biomeA.percentageBrazil}%</td>
                <td className="py-3 px-4 font-mono font-medium text-[#DCE5DD]">{biomeB.percentageBrazil}%</td>
              </tr>
              <tr className="hover:bg-[#1D2821]/40">
                <td className="py-3 px-4 font-medium text-[#A7B3A9]">Vegetação Nativa Remanescente</td>
                <td className="py-3 px-4 font-mono font-semibold text-[#83A989]">{biomeA.nativeVegetationPercentage}% (MapBiomas)</td>
                <td className="py-3 px-4 font-mono font-semibold text-[#83A989]">{biomeB.nativeVegetationPercentage}% (MapBiomas)</td>
              </tr>
              <tr className="hover:bg-[#1D2821]/40">
                <td className="py-3 px-4 font-medium text-[#A7B3A9]">Áreas Protegidas em UCs</td>
                <td className="py-3 px-4 font-mono font-medium text-[#91A88F]">{biomeA.protectedAreaPercentage}%</td>
                <td className="py-3 px-4 font-mono font-medium text-[#91A88F]">{biomeB.protectedAreaPercentage}%</td>
              </tr>
              <tr className="hover:bg-[#1D2821]/40">
                <td className="py-3 px-4 font-medium text-[#A7B3A9]">Taxa de Desmatamento (PRODES 2024)</td>
                <td className="py-3 px-4 font-mono text-[#A7B3A9]">
                  {biomeA.deforestationProdes2024Km2 
                    ? `${biomeA.deforestationProdes2024Km2.toLocaleString('pt-BR')} km² (${biomeA.deforestationTrendPercent}%)` 
                    : 'Não aplicável (Eco Marinho)'}
                </td>
                <td className="py-3 px-4 font-mono text-[#A7B3A9]">
                  {biomeB.deforestationProdes2024Km2 
                    ? `${biomeB.deforestationProdes2024Km2.toLocaleString('pt-BR')} km² (${biomeB.deforestationTrendPercent}%)` 
                    : 'Não aplicável (Eco Marinho)'}
                </td>
              </tr>
              <tr className="hover:bg-[#1D2821]/40">
                <td className="py-3 px-4 font-medium text-[#A7B3A9]">Focos de Calor (24h)</td>
                <td className="py-3 px-4 font-mono font-semibold text-[#A9A17A]">{biomeA.activeFireHotspots24h} focos</td>
                <td className="py-3 px-4 font-mono font-semibold text-[#A9A17A]">{biomeB.activeFireHotspots24h} focos</td>
              </tr>
              <tr className="hover:bg-[#1D2821]/40">
                <td className="py-3 px-4 font-medium text-[#A7B3A9]">Estados de Ocorrência</td>
                <td className="py-3 px-4 font-mono text-[#A7B3A9]">{biomeA.states.join(', ')}</td>
                <td className="py-3 px-4 font-mono text-[#A7B3A9]">{biomeB.states.join(', ')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
