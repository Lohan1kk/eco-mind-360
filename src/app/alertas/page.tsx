'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  Satellite,
  Download
} from 'lucide-react';
import { VERIFIED_ALERTS } from '@/data/alerts';
import { BIOMES_LIST } from '@/data/biomes';
import { EnvironmentalAlert } from '@/data/types';
import { PageIntro } from '@/components/PageIntro';

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
        return <Flame className="w-4 h-4 text-burn" />;
      case 'alerta_desmatamento':
        return <Trees className="w-4 h-4 text-forest" />;
      case 'anomalia_marinha':
        return <Waves className="w-4 h-4 text-forest-mid" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-burn" />;
    }
  };

  const handleExportAlerts = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Tipo,Ambiente,Municipio,Estado,Latitude,Longitude,Data,Hora,Area_ha,FRP_MW,Satelite,Sensor,Confianca,Status,Fonte\n" +
      filteredAlerts.map(a => `${a.id},${a.typeName},${a.biomeName},${a.municipality},${a.state},${a.latitude},${a.longitude},${a.date},${a.time || ''},${a.areaHectares || ''},${a.frp || ''},${a.satellite},${a.sensor},${a.confidence},${a.status},"${a.source}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ecomind_360_alertas_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="section-inner max-w-6xl mx-auto py-6 space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-forest/10 pb-6">
        <PageIntro
          eyebrow="Sensoriamento Remoto Contínuo"
          title="Alertas & Ocorrências Ambientais"
          eyebrowClassName="eyebrow text-forest-mid"
          titleClassName="display mt-2 text-3xl text-forest md:text-5xl"
        >
          <p className="mt-3 max-w-2xl text-base text-ash">
            Registro unificado de alertas DETER (INPE), anomalias termais (NASA FIRMS / BDQueimadas)
            e cicatrizes de fogo nos 7 ambientes brasileiros.
          </p>
        </PageIntro>

        <div className="flex flex-wrap items-center gap-2">
          {liveSourceInfo && (
            <div className="text-xs font-mono px-3 py-1.5 rounded-full bg-mist border border-forest/15 text-forest font-semibold">
              {liveSourceInfo}
            </div>
          )}

          <button
            type="button"
            onClick={handleExportAlerts}
            className="btn btn-secondary !py-2 !px-3.5 text-xs inline-flex items-center gap-1.5"
            title="Exportar alertas em formato CSV"
          >
            <Download size={14} />
            <span>Exportar Ocorrências</span>
          </button>
        </div>
      </div>

      {/* Nota Metodológica de Orientação */}
      <div className="p-4 rounded-2xl bg-forest/5 border border-forest/15 text-xs text-forest leading-relaxed flex items-start gap-3">
        <Info size={18} className="text-forest flex-shrink-0 mt-0.5" />
        <div>
          <strong>Diferenciação Metodológica:</strong> <em>Focos de calor</em> representam anomalias térmicas instantâneas captadas por sensores orbitais (MODIS/VIIRS) no momento do sobrevoo. Já os <em>Alertas DETER</em> são polígonos de corte raso ou degradação florestal produzidos pelo INPE para suporte à fiscalização ambiental.
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="panel-soft p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Campo de Busca */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-ash pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar município, satélite, UF..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-mist text-ink border border-forest/15 focus:outline-none focus:ring-2 focus:ring-forest"
          />
        </div>

        {/* Dropdowns de Filtro */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Bioma */}
          <select
            value={selectedBiome}
            onChange={(e) => setSelectedBiome(e.target.value)}
            className="px-3 py-2 rounded-xl bg-mist border border-forest/15 text-ink font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">Todos os Ambientes</option>
            {BIOMES_LIST.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          {/* Tipo de Ocorrência */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-mist border border-forest/15 text-ink font-semibold focus:outline-none cursor-pointer"
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
            className="px-3 py-2 rounded-xl bg-mist border border-forest/15 text-ink font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">Qualquer Confiança</option>
            <option value="Alta">Alta Confiança</option>
            <option value="Nominal">Confiança Nominal</option>
            <option value="Auditoria Final">Auditoria Final</option>
          </select>

          {(selectedBiome !== 'all' || selectedType !== 'all' || selectedConfidence !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedBiome('all');
                setSelectedType('all');
                setSelectedConfidence('all');
                setSearchQuery('');
              }}
              className="text-xs text-burn font-bold underline px-2 py-1"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabela de Ocorrências com Design Limpo */}
      <div className="panel-soft overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink">
            <thead className="bg-mist text-[11px] uppercase font-bold text-forest-mid border-b border-forest/10">
              <tr>
                <th className="py-3.5 px-4">Tipo & Ocorrência</th>
                <th className="py-3.5 px-4">Ambiente</th>
                <th className="py-3.5 px-4">Localização (UF)</th>
                <th className="py-3.5 px-4">Data / Hora</th>
                <th className="py-3.5 px-4">Métrica (Área / FRP)</th>
                <th className="py-3.5 px-4">Satélite / Sensor</th>
                <th className="py-3.5 px-4">Fonte Oficial</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/10 font-mono">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <tr 
                    key={alert.id}
                    onClick={() => setActiveAlert(alert)}
                    className="hover:bg-forest/5 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-sans font-bold">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(alert.type)}
                        <span className="text-forest truncate max-w-xs">{alert.typeName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded-full bg-forest/8 text-forest text-[11px] font-semibold">
                        {alert.biomeName}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-ink">
                      📍 {alert.municipality}/{alert.state}
                    </td>
                    <td className="py-3 px-4 text-ash">
                      {alert.date} {alert.time ? `(${alert.time})` : ''}
                    </td>
                    <td className="py-3 px-4">
                      {alert.areaHectares ? (
                        <span className="font-bold text-forest">{alert.areaHectares} ha</span>
                      ) : alert.frp ? (
                        <span className="font-bold text-burn">{alert.frp} MW</span>
                      ) : (
                        <span className="text-forest-mid text-[11px]">Anomalia</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-ash font-sans">
                      {alert.satellite}
                    </td>
                    <td className="py-3 px-4 text-ash font-sans truncate max-w-[120px]" title={alert.source}>
                      {alert.source}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveAlert(alert);
                        }}
                        className="btn btn-secondary !py-1 !px-2.5 text-[11px] font-bold"
                      >
                        Laudo
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-ash font-sans italic">
                    Nenhum registro encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé da tabela com total de registros */}
        <div className="p-4 border-t border-forest/10 bg-mist flex items-center justify-between text-xs text-ash font-sans">
          <span>Exibindo {filteredAlerts.length} de {alerts.length} ocorrências cadastradas</span>
          <span className="text-forest font-bold">Dados auditados por satélite</span>
        </div>
      </div>

      {/* Modal Lateral de Detalhes da Ocorrência */}
      <AnimatePresence>
        {activeAlert && (
          <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm flex justify-end">
            <motion.div 
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 200 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full max-w-lg bg-mist h-full shadow-2xl border-l border-forest/15 p-6 overflow-y-auto flex flex-col justify-between text-xs font-sans"
            >
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-forest/10 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
                    <Satellite size={15} />
                    Ficha Técnica da Ocorrência
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveAlert(null)}
                    className="p-1.5 rounded-full text-ash hover:text-forest hover:bg-forest/10 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="display text-2xl font-bold text-forest mb-1.5">
                      {activeAlert.typeName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sprout text-forest">
                        {activeAlert.status}
                      </span>
                      <span className="text-forest-mid font-bold">
                        {activeAlert.biomeName}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-paper border border-forest/10 space-y-2.5 text-ink">
                    <div className="flex justify-between">
                      <span className="text-ash">Identificador (ID):</span>
                      <span className="font-mono font-bold">{activeAlert.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ash">Município / Estado:</span>
                      <span className="font-bold text-forest">{activeAlert.municipality} - {activeAlert.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ash">Coordenadas Geográficas:</span>
                      <span className="font-mono text-forest font-bold">{activeAlert.latitude}, {activeAlert.longitude}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ash">Data e Hora de Passagem:</span>
                      <span className="font-mono">{activeAlert.date} {activeAlert.time ? `(${activeAlert.time})` : ''}</span>
                    </div>
                    {activeAlert.areaHectares && (
                      <div className="flex justify-between">
                        <span className="text-ash">Área Estimada:</span>
                        <span className="font-mono font-bold text-forest">{activeAlert.areaHectares} hectares</span>
                      </div>
                    )}
                    {activeAlert.frp && (
                      <div className="flex justify-between">
                        <span className="text-ash">Potência Radiativa do Fogo:</span>
                        <span className="font-mono font-bold text-burn">{activeAlert.frp} MW (Megawatts)</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-ash">Satélite / Sensor:</span>
                      <span className="font-semibold">{activeAlert.satellite} ({activeAlert.sensor})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ash">Índice de Confiança:</span>
                      <span className="font-bold text-forest">{activeAlert.confidence}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-forest mb-1">Descrição e Contexto Territorial</h4>
                    <p className="text-ash leading-relaxed text-xs">
                      {activeAlert.description}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-paper border border-forest/10 space-y-2">
                    <div className="text-[10px] text-ash uppercase font-bold tracking-wider">Fonte Primária dos Dados</div>
                    <div className="font-bold text-forest">{activeAlert.source}</div>
                    <a
                      href={activeAlert.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-forest font-bold hover:underline inline-flex items-center gap-1.5 pt-1"
                    >
                      <span>Consultar registro no portal da fonte oficial</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-forest/10 flex items-center gap-3">
                <Link
                  href="/mapa"
                  className="flex-1 btn btn-primary text-center flex items-center justify-center gap-1.5"
                >
                  <MapPin size={14} />
                  <span>Visualizar no Mapa</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveAlert(null)}
                  className="btn btn-secondary !py-2.5 !px-4 text-xs font-bold"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
