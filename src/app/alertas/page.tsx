'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  Flame, 
  Trees, 
  Waves, 
  Search, 
  X,
  ExternalLink,
  MapPin, 
  Info,
  Satellite
} from 'lucide-react';
import { VERIFIED_ALERTS } from '@/data/alerts';
import { BIOMES_LIST } from '@/data/biomes';
import { EnvironmentalAlert } from '@/data/types';

export default function AlertasPage() {
  const [alerts, setAlerts] = useState<EnvironmentalAlert[]>(VERIFIED_ALERTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBiome, setSelectedBiome] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedConfidence, setSelectedConfidence] = useState('all');
  const [activeAlert, setActiveAlert] = useState<EnvironmentalAlert | null>(null);
  const [liveSourceInfo, setLiveSourceInfo] = useState<string | null>(null);

  // Buscar feed em tempo real da NASA / INPE
  useEffect(() => {
    fetch('/api/alerts/firms')
      .then(res => res.json())
      .then(data => {
        if (data.alerts && data.alerts.length > 0) {
          setAlerts(data.alerts);
          setLiveSourceInfo(data.mode === 'live' ? '🟢 Conexão NASA FIRMS Ativa (Feed 24h)' : '🟡 Base Oficial Auditada (Última auditoria)');
        }
      })
      .catch(err => {
        console.warn('Erro ao carregar feed:', err);
      });
  }, []);

  // Filtragem dos alertas
  const filteredAlerts = alerts.filter(alert => {
    if (selectedBiome !== 'all' && alert.biomeId !== selectedBiome) return false;
    if (selectedType !== 'all' && alert.type !== selectedType) return false;
    if (selectedConfidence !== 'all' && alert.confidence !== selectedConfidence) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        alert.municipality.toLowerCase().includes(q) ||
        alert.state.toLowerCase().includes(q) ||
        alert.biomeName.toLowerCase().includes(q) ||
        alert.typeName.toLowerCase().includes(q) ||
        alert.satellite.toLowerCase().includes(q) ||
        alert.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getTypeIcon = (type: EnvironmentalAlert['type']) => {
    switch (type) {
      case 'foco_calor':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'alerta_desmatamento':
        return <Trees className="w-4 h-4 text-emerald-500" />;
      case 'anomalia_marinha':
        return <Waves className="w-4 h-4 text-blue-500" />;
      case 'area_queimada':
        return <Flame className="w-4 h-4 text-rose-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Alertas & Ocorrências Ambientais
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
              Sensoriamento Contínuo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Registro unificado de alertas DETER (INPE), focos de calor (NASA/BDQueimadas) e cicatrizes
          </p>
        </div>

        {liveSourceInfo && (
          <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            {liveSourceInfo}
          </div>
        )}
      </div>

      {/* Nota Metodológica de Orientação */}
      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed flex items-start gap-3">
        <Info size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Diferenciação Científica Obrigatória:</strong> <em>Focos de calor</em> representam anomalias termais instantâneas captadas por sensores infravermelhos (como MODIS e VIIRS) no momento exato do sobrevoo do satélite. Já os <em>Alertas DETER</em> são polígonos de corte raso ou degradação florestal produzidos pelo INPE para suporte à fiscalização ambiental do IBAMA e ICMBio.
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Campo de Busca */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar município, satélite, UF..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Dropdowns de Filtro */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Bioma */}
          <select
            value={selectedBiome}
            onChange={(e) => setSelectedBiome(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="all">Todos os Biomas</option>
            {BIOMES_LIST.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          {/* Tipo de Ocorrência */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="all">Todos os Tipos</option>
            <option value="foco_calor">Foco de Calor (Térmico)</option>
            <option value="alerta_desmatamento">Supressão Vegetal (DETER)</option>
            <option value="area_queimada">Área Queimada (ALARMES)</option>
            <option value="anomalia_marinha">Anomalia Marinha (Recifes)</option>
          </select>

          {/* Confiança */}
          <select
            value={selectedConfidence}
            onChange={(e) => setSelectedConfidence(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="all">Qualquer Confiança</option>
            <option value="Alta">Alta Confiança</option>
            <option value="Média">Média Confiança</option>
          </select>

          {(searchQuery || selectedBiome !== 'all' || selectedType !== 'all' || selectedConfidence !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBiome('all');
                setSelectedType('all');
                setSelectedConfidence('all');
              }}
              className="px-2.5 py-2 text-rose-500 hover:underline font-medium"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabela de Ocorrências */}
      <div className="rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Tipo & Ocorrência</th>
                <th className="py-3 px-4">Ambiente</th>
                <th className="py-3 px-4">Localização (UF)</th>
                <th className="py-3 px-4">Data / Hora</th>
                <th className="py-3 px-4">Métrica (Área / FRP)</th>
                <th className="py-3 px-4">Satélite / Sensor</th>
                <th className="py-3 px-4">Fonte Oficial</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <tr 
                    key={alert.id}
                    onClick={() => setActiveAlert(alert)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-sans font-semibold">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(alert.type)}
                        <span className="text-slate-900 dark:text-white truncate max-w-xs">{alert.typeName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                        {alert.biomeName}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-800 dark:text-slate-200">
                      📍 {alert.municipality}/{alert.state}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {alert.date} {alert.time ? `(${alert.time})` : ''}
                    </td>
                    <td className="py-3 px-4">
                      {alert.areaHectares ? (
                        <span className="font-bold text-emerald-500">{alert.areaHectares} ha</span>
                      ) : alert.frp ? (
                        <span className="font-bold text-amber-500">{alert.frp} MW</span>
                      ) : (
                        <span className="text-blue-500 text-[11px]">Anomalia</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-sans">
                      {alert.satellite}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-sans truncate max-w-[120px]" title={alert.source}>
                      {alert.source}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveAlert(alert);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white font-sans font-semibold text-[11px] text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-sans italic">
                    Nenhum registro encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé da tabela com total de registros */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-sans">
          <span>Exibindo {filteredAlerts.length} de {alerts.length} ocorrências cadastradas</span>
          <span className="text-emerald-500 font-medium">Dados atualizados com satélites operacionais</span>
        </div>
      </div>

      {/* Drawer Lateral de Detalhes da Ocorrência */}
      {activeAlert && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-[#090e18] h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto flex flex-col justify-between text-xs animate-in slide-in-from-right duration-250">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                  <Satellite size={15} />
                  Ficha Técnica da Ocorrência
                </span>
                <button
                  onClick={() => setActiveAlert(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 font-sans">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {activeAlert.typeName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {activeAlert.status}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {activeAlert.biomeName}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Identificador (ID):</span>
                    <span className="font-mono font-semibold">{activeAlert.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Município / Estado:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{activeAlert.municipality} - {activeAlert.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Coordenadas Geográficas:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{activeAlert.latitude}, {activeAlert.longitude}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Data e Hora de Passagem:</span>
                    <span className="font-mono">{activeAlert.date} {activeAlert.time ? `(${activeAlert.time})` : ''}</span>
                  </div>
                  {activeAlert.areaHectares && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Área Estimada:</span>
                      <span className="font-mono font-bold text-emerald-500">{activeAlert.areaHectares} hectares</span>
                    </div>
                  )}
                  {activeAlert.frp && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Potência Radiativa do Fogo:</span>
                      <span className="font-mono font-bold text-amber-500">{activeAlert.frp} MW (Megawatts)</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Satélite / Sensor:</span>
                    <span className="font-medium">{activeAlert.satellite} ({activeAlert.sensor})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Índice de Confiança:</span>
                    <span className="font-semibold text-emerald-500">{activeAlert.confidence}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Descrição e Contexto Territorial</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                    {activeAlert.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Fonte Primária dos Dados</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{activeAlert.source}</div>
                  <a
                    href={activeAlert.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1 pt-1"
                  >
                    <span>Consultar registro no portal da fonte oficial</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Link
                href={`/mapa?biome=${activeAlert.biomeId}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MapPin size={14} />
                <span>Visualizar Região no Mapa</span>
              </Link>
              <button
                onClick={() => setActiveAlert(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
