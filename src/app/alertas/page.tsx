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
          setLiveSourceInfo(data.mode === 'live' ? 'Conexão NASA FIRMS Ativa (Feed 24h)' : 'Base Oficial Auditada (Última auditoria)');
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
        return <Flame className="w-4 h-4 text-[#A9A17A]" />;
      case 'alerta_desmatamento':
        return <Trees className="w-4 h-4 text-[#83A989]" />;
      case 'anomalia_marinha':
        return <Waves className="w-4 h-4 text-[#91A88F]" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-[#A77D78]" />;
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
    <div className="section-inner max-w-6xl mx-auto py-8 space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#222D25] pb-6">
        <PageIntro
          eyebrow="Sensoriamento Remoto Contínuo"
          title="Alertas & Ocorrências Ambientais"
          eyebrowClassName="eyebrow text-[#789B7C]"
          titleClassName="display mt-2 text-3xl text-[#DCE5DD] md:text-4xl font-semibold"
        >
          <p className="mt-2.5 max-w-2xl text-sm sm:text-base text-[#A7B3A9]">
            Registro unificado de alertas DETER (INPE), anomalias termais (NASA FIRMS / BDQueimadas)
            e cicatrizes de fogo nos 7 ambientes brasileiros.
          </p>
        </PageIntro>

        <div className="flex flex-wrap items-center gap-2.5">
          {liveSourceInfo && (
            <div className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-[7px] bg-[#171F1A] border border-[#29362D] text-[#A7B3A9]">
              <span className="h-2 w-2 rounded-full bg-[#83A989]" />
              <span>{liveSourceInfo}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleExportAlerts}
            className="btn-secondary !py-2 !px-3.5 text-xs inline-flex items-center gap-1.5"
            title="Exportar alertas em formato CSV"
          >
            <Download size={14} />
            <span>Exportar Ocorrências</span>
          </button>
        </div>
      </div>

      {/* Nota Metodológica de Orientação */}
      <div className="p-4 rounded-[10px] bg-[#131A16] border border-[#222D25] text-xs text-[#A7B3A9] leading-relaxed flex items-start gap-3">
        <Info size={16} className="text-[#789B7C] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#DCE5DD]">Diferenciação Metodológica:</strong> <em>Focos de calor</em> representam anomalias térmicas instantâneas captadas por sensores orbitais (MODIS/VIIRS) no momento do sobrevoo. Já os <em>Alertas DETER</em> são polígonos de corte raso ou degradação florestal produzidos pelo INPE para suporte à fiscalização ambiental.
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Campo de Busca */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#78877D] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar município, satélite, UF..."
            className="w-full pl-9 pr-3 py-2 rounded-[7px] bg-[#131A16] text-[#DCE5DD] placeholder:text-[#78877D] border border-[#29362D] focus:outline-none focus:border-[#789B7C]"
          />
        </div>

        {/* Dropdowns de Filtro */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Bioma */}
          <select
            value={selectedBiome}
            onChange={(e) => setSelectedBiome(e.target.value)}
            className="px-3 py-2 rounded-[7px] bg-[#131A16] border border-[#29362D] text-[#DCE5DD] font-medium focus:outline-none focus:border-[#789B7C] cursor-pointer"
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
            className="px-3 py-2 rounded-[7px] bg-[#131A16] border border-[#29362D] text-[#DCE5DD] font-medium focus:outline-none focus:border-[#789B7C] cursor-pointer"
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
            className="px-3 py-2 rounded-[7px] bg-[#131A16] border border-[#29362D] text-[#DCE5DD] font-medium focus:outline-none focus:border-[#789B7C] cursor-pointer"
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
              className="text-xs text-[#A77D78] hover:text-[#DCE5DD] font-medium underline px-2 py-1"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabela de Ocorrências com Design Limpo */}
      <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#DCE5DD]">
            <thead className="bg-[#131A16] text-[11px] font-mono uppercase text-[#78877D] border-b border-[#222D25]">
              <tr>
                <th className="py-3.5 px-4 font-medium">Tipo & Ocorrência</th>
                <th className="py-3.5 px-4 font-medium">Ambiente</th>
                <th className="py-3.5 px-4 font-medium">Localização (UF)</th>
                <th className="py-3.5 px-4 font-medium">Data / Hora</th>
                <th className="py-3.5 px-4 font-medium">Métrica (Área / FRP)</th>
                <th className="py-3.5 px-4 font-medium">Satélite / Sensor</th>
                <th className="py-3.5 px-4 font-medium">Fonte Oficial</th>
                <th className="py-3.5 px-4 text-right font-medium">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222D25] font-mono">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <tr 
                    key={alert.id}
                    onClick={() => setActiveAlert(alert)}
                    className="hover:bg-[#1D2821]/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-sans font-medium">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(alert.type)}
                        <span className="text-[#DCE5DD] truncate max-w-xs">{alert.typeName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded-[7px] bg-[#131A16] border border-[#222D25] text-[#91A88F] text-[11px] font-medium">
                        {alert.biomeName}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-[#DCE5DD]">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#78877D] shrink-0" />
                        <span>{alert.municipality}/{alert.state}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#A7B3A9]">
                      {alert.date} {alert.time ? `(${alert.time})` : ''}
                    </td>
                    <td className="py-3 px-4">
                      {alert.areaHectares ? (
                        <span className="font-semibold text-[#83A989]">{alert.areaHectares} ha</span>
                      ) : alert.frp ? (
                        <span className="font-semibold text-[#A9A17A]">{alert.frp} MW</span>
                      ) : (
                        <span className="text-[#78877D] text-[11px]">Anomalia</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#A7B3A9] font-sans">
                      {alert.satellite}
                    </td>
                    <td className="py-3 px-4 text-[#78877D] font-sans truncate max-w-[120px]" title={alert.source}>
                      {alert.source}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveAlert(alert);
                        }}
                        className="btn-secondary !py-1 !px-2.5 text-[11px] font-medium"
                      >
                        Laudo
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#78877D] font-sans">
                    Nenhum registro encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé da tabela com total de registros */}
        <div className="p-4 border-t border-[#222D25] bg-[#131A16] flex items-center justify-between text-xs text-[#78877D] font-sans">
          <span>Exibindo {filteredAlerts.length} de {alerts.length} ocorrências cadastradas</span>
          <span className="text-[#91A88F] font-mono text-[11px]">Dados auditados por satélite</span>
        </div>
      </div>

      {/* Modal Lateral de Detalhes da Ocorrência */}
      <AnimatePresence>
        {activeAlert && (
          <div className="fixed inset-0 z-50 bg-[#101512]/80 backdrop-blur-sm flex justify-end">
            <motion.div 
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 200 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full max-w-lg bg-[#171F1A] h-full shadow-2xl border-l border-[#29362D] p-6 overflow-y-auto flex flex-col justify-between text-xs font-sans"
            >
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-[#222D25] mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#91A88F] flex items-center gap-1.5">
                    <Satellite size={15} />
                    Ficha Técnica da Ocorrência
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveAlert(null)}
                    className="p-1.5 rounded-[7px] text-[#78877D] hover:text-[#DCE5DD] hover:bg-[#1D2821] transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-[#DCE5DD] mb-2">
                      {activeAlert.typeName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-[7px] text-[10px] font-mono font-medium bg-[#294C35] text-[#DCE5DD] border border-[#365C40]">
                        {activeAlert.status}
                      </span>
                      <span className="text-[#91A88F] font-medium">
                        {activeAlert.biomeName}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-[10px] bg-[#131A16] border border-[#222D25] space-y-2.5 text-[#DCE5DD]">
                    <div className="flex justify-between">
                      <span className="text-[#78877D]">Identificador (ID):</span>
                      <span className="font-mono font-medium">{activeAlert.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#78877D]">Município / Estado:</span>
                      <span className="font-medium text-[#DCE5DD]">{activeAlert.municipality} - {activeAlert.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#78877D]">Coordenadas Geográficas:</span>
                      <span className="font-mono text-[#91A88F]">{activeAlert.latitude}, {activeAlert.longitude}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#78877D]">Data e Hora de Passagem:</span>
                      <span className="font-mono">{activeAlert.date} {activeAlert.time ? `(${activeAlert.time})` : ''}</span>
                    </div>
                    {activeAlert.areaHectares && (
                      <div className="flex justify-between">
                        <span className="text-[#78877D]">Área Estimada:</span>
                        <span className="font-mono font-semibold text-[#83A989]">{activeAlert.areaHectares} hectares</span>
                      </div>
                    )}
                    {activeAlert.frp && (
                      <div className="flex justify-between">
                        <span className="text-[#78877D]">Potência Radiativa do Fogo:</span>
                        <span className="font-mono font-semibold text-[#A9A17A]">{activeAlert.frp} MW (Megawatts)</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#78877D]">Satélite / Sensor:</span>
                      <span className="font-medium">{activeAlert.satellite} ({activeAlert.sensor})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#78877D]">Índice de Confiança:</span>
                      <span className="font-medium text-[#83A989]">{activeAlert.confidence}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-[#DCE5DD] mb-1.5">Descrição e Contexto Territorial</h4>
                    <p className="text-[#A7B3A9] leading-relaxed text-xs">
                      {activeAlert.description}
                    </p>
                  </div>

                  <div className="p-4 rounded-[10px] bg-[#131A16] border border-[#222D25] space-y-2">
                    <div className="text-[10px] text-[#78877D] uppercase font-mono tracking-wider">Fonte Primária dos Dados</div>
                    <div className="font-medium text-[#DCE5DD]">{activeAlert.source}</div>
                    <a
                      href={activeAlert.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#91A88F] hover:text-[#DCE5DD] font-medium hover:underline inline-flex items-center gap-1.5 pt-1"
                    >
                      <span>Consultar registro no portal da fonte oficial</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#222D25] flex items-center gap-3">
                <Link
                  href="/mapa"
                  className="flex-1 btn-primary text-center flex items-center justify-center gap-1.5"
                >
                  <MapPin size={14} />
                  <span>Visualizar no Mapa</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveAlert(null)}
                  className="btn-secondary !py-2.5 !px-4 text-xs font-medium"
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
