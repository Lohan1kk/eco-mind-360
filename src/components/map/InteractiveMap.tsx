'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  GeoJSON, 
  Marker, 
  Popup, 
  LayersControl, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import type { FeatureCollection, Feature, Geometry } from 'geojson';
import 'leaflet/dist/leaflet.css';
import { BIOMES_DATA, BIOMES_LIST } from '@/data/biomes';
import { VERIFIED_ALERTS } from '@/data/alerts';
import { EnvironmentalAlert, BiomeInfo } from '@/data/types';
import { 
  Flame, 
  Trees, 
  AlertTriangle, 
  Info, 
  X, 
  ExternalLink, 
  Compass
} from 'lucide-react';

const { BaseLayer } = LayersControl;

// Custom pulse markers via Leaflet divIcon
function createPulseIcon(color: string) {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: ${color}; opacity: 0.4; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <span style="position: relative; width: 12px; height: 12px; border-radius: 9999px; background-color: ${color}; border: 2px solid #ffffff; box-shadow: 0 0 8px ${color};"></span>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

// Subcomponente para redefinir visão do mapa
function MapController({ selectedBiomeId }: { selectedBiomeId: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedBiomeId || selectedBiomeId === 'all') {
      map.setView([-14.235, -51.9253], 4);
    } else {
      // Coordenadas centrais aproximadas de cada bioma
      const centers: Record<string, [number, number, number]> = {
        amazonia: [-4.0, -60.0, 5],
        cerrado: [-14.0, -48.0, 5],
        mata_atlantica: [-20.0, -44.0, 5],
        caatinga: [-8.5, -40.0, 6],
        pampa: [-30.0, -53.5, 6],
        pantanal: [-18.0, -56.5, 6],
        costeiro_marinho: [-15.0, -38.5, 5],
      };
      const target = centers[selectedBiomeId];
      if (target) {
        map.flyTo([target[0], target[1]], target[2], { duration: 1.2 });
      }
    }
  }, [selectedBiomeId, map]);

  return null;
}

export default function InteractiveMap({ initialBiomeId }: { initialBiomeId?: string }) {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection<Geometry> | null>(null);
  const [selectedBiome, setSelectedBiome] = useState<string>(initialBiomeId || 'all');
  const [selectedAlert, setSelectedAlert] = useState<EnvironmentalAlert | null>(null);
  const [selectedBiomeDetails, setSelectedBiomeDetails] = useState<BiomeInfo | null>(null);
  const [alerts, setAlerts] = useState<EnvironmentalAlert[]>(VERIFIED_ALERTS);
  const [showBiomes, setShowBiomes] = useState(true);
  const [showFires, setShowFires] = useState(true);
  const [showDeforestation, setShowDeforestation] = useState(true);

  // Carregar GeoJSON dos biomas oficiais
  useEffect(() => {
    fetch('/data/geojson/biomas-brasil.json')
      .then(res => res.json())
      .then(data => {
        setGeoJsonData(data);
      })
      .catch(err => {
        console.error('Erro ao carregar GeoJSON dos biomas:', err);
      });
  }, []);

  // Buscar feed ao vivo de focos NASA FIRMS
  useEffect(() => {
    fetch('/api/alerts/firms')
      .then(res => res.json())
      .then(data => {
        if (data.alerts && data.alerts.length > 0) {
          setAlerts(data.alerts);
        }
      })
      .catch(err => {
        console.warn('Usando dados de alertas verificados locais:', err);
      });
  }, []);

  // Cores de cada bioma no mapa
  const getBiomeColor = (id: string) => {
    const biome = BIOMES_DATA[id];
    return biome ? biome.color : '#10b981';
  };

  // Estilização das features GeoJSON
  const geoJsonStyle = (feature?: Feature<Geometry>) => {
    const id = String(feature?.properties?.id || feature?.id || '');
    const isSelected = selectedBiome === id;
    const isAll = selectedBiome === 'all';
    const color = getBiomeColor(id);

    return {
      fillColor: color,
      weight: isSelected ? 3 : 1.5,
      opacity: isSelected ? 1 : isAll ? 0.7 : 0.3,
      color: isSelected ? '#ffffff' : color,
      fillOpacity: isSelected ? 0.45 : isAll ? 0.22 : 0.08,
      dashArray: id === 'costeiro_marinho' ? '4, 4' : undefined,
    };
  };

  // Ação ao interagir com polígono do bioma
  const onEachFeature = (feature: Feature<Geometry>, layer: L.Layer) => {
    const id = String(feature?.properties?.id || feature?.id || '');
    const biome = BIOMES_DATA[id];

    if (biome) {
      layer.on({
        click: () => {
          setSelectedBiome(id);
          setSelectedBiomeDetails(biome);
          setSelectedAlert(null);
        },
        mouseover: (e: L.LeafletMouseEvent) => {
          const l = e.target;
          l.setStyle({ fillOpacity: 0.5, weight: 2.5 });
        },
        mouseout: (e: L.LeafletMouseEvent) => {
          const l = e.target;
          l.setStyle(geoJsonStyle(feature));
        }
      });
    }
  };

  // Filtragem dos alertas
  const displayedAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (selectedBiome !== 'all' && a.biomeId !== selectedBiome) return false;
      if (a.type === 'foco_calor' && !showFires) return false;
      if (a.type === 'alerta_desmatamento' && !showDeforestation) return false;
      return true;
    });
  }, [alerts, selectedBiome, showFires, showDeforestation]);

  return (
    <div className="relative w-full h-[650px] md:h-[750px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 shadow-lg bg-slate-950">
      {/* Barra de Controles Flutuante no Topo */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Seletor de Bioma */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 dark:bg-[#070b12]/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-md">
          <span className="text-xs font-semibold text-slate-300 pl-2">Ambiente:</span>
          <select
            value={selectedBiome}
            onChange={(e) => {
              setSelectedBiome(e.target.value);
              setSelectedBiomeDetails(e.target.value === 'all' ? null : BIOMES_DATA[e.target.value]);
            }}
            className="text-xs bg-slate-800 text-white rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
          >
            <option value="all">🇧🇷 Todos os Biomas do Brasil</option>
            {BIOMES_LIST.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.percentageBrazil}% BR)
              </option>
            ))}
          </select>
        </div>

        {/* Filtros de Camadas Rápidas */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-1.5 bg-slate-900/90 dark:bg-[#070b12]/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-md text-xs">
          <button
            onClick={() => setShowBiomes(!showBiomes)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              showBiomes ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trees size={13} />
            <span>Limites Biomas</span>
          </button>
          <button
            onClick={() => setShowFires(!showFires)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              showFires ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame size={13} />
            <span>Focos Satelitais</span>
          </button>
          <button
            onClick={() => setShowDeforestation(!showDeforestation)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              showDeforestation ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle size={13} />
            <span>Alertas DETER</span>
          </button>
        </div>
      </div>

      {/* Mapa Leaflet */}
      <MapContainer
        center={[-14.235, -51.9253]}
        zoom={4}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController selectedBiomeId={selectedBiome} />

        <LayersControl position="topright">
          <BaseLayer checked name="CartoDB Escuro (Padrão)">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              maxZoom={19}
            />
          </BaseLayer>
          <BaseLayer name="Satélite Orbital (ESRI)">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={18}
            />
          </BaseLayer>
          <BaseLayer name="OpenStreetMap Padrão">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
        </LayersControl>

        {/* Camada GeoJSON dos Biomas */}
        {showBiomes && geoJsonData && (
          <GeoJSON
            key={`geojson-${selectedBiome}`}
            data={geoJsonData}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Marcadores dos Alertas e Focos de Calor Reais */}
        {displayedAlerts.map((alert) => {
          const color = alert.type === 'foco_calor' 
            ? '#f59e0b' 
            : alert.type === 'anomalia_marinha' 
              ? '#3b82f6' 
              : '#10b981';
          const icon = createPulseIcon(color);

          return (
            <Marker
              key={alert.id}
              position={[alert.latitude, alert.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  setSelectedAlert(alert);
                  setSelectedBiomeDetails(null);
                }
              }}
            >
              <Popup>
                <div className="p-1 text-xs">
                  <div className="font-bold text-white mb-1">{alert.typeName}</div>
                  <div className="text-slate-300">
                    📍 {alert.municipality}/{alert.state} ({alert.biomeName})
                  </div>
                  <div className="text-slate-400 text-[10px] mt-1">
                    Satélite: {alert.satellite} • {alert.date}
                  </div>
                  <button
                    onClick={() => setSelectedAlert(alert)}
                    className="mt-2 text-emerald-400 font-semibold hover:underline block text-[11px]"
                  >
                    Ver detalhes completos →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legenda Flutuante no Canto Inferior Esquerdo */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/90 dark:bg-[#070b12]/90 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 shadow-xl max-w-xs text-xs text-slate-300 hidden md:block">
        <div className="font-bold text-white text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Compass size={13} className="text-emerald-400" />
          <span>Legenda do Monitoramento</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          {BIOMES_LIST.map((b) => (
            <div key={b.id} className="flex items-center gap-1.5 truncate">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: b.color }} />
              <span className="truncate">{b.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
            Focos NASA/INPE
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Alertas DETER
          </span>
        </div>
      </div>

      {/* Painel Lateral / Drawer de Detalhes ao Clicar em Alerta ou Bioma */}
      {(selectedAlert || selectedBiomeDetails) && (
        <div className="absolute top-0 right-0 bottom-0 w-80 md:w-96 z-[1001] bg-slate-900/95 dark:bg-[#090e18]/95 backdrop-blur-lg border-l border-slate-700 shadow-2xl p-5 overflow-y-auto flex flex-col justify-between text-xs animate-in slide-in-from-right duration-200">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Info size={13} />
                {selectedAlert ? 'Detecção Orbital Verificada' : 'Indicadores Oficiais do Bioma'}
              </span>
              <button
                onClick={() => {
                  setSelectedAlert(null);
                  setSelectedBiomeDetails(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Conteúdo do Alerta */}
            {selectedAlert && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    {selectedAlert.typeName}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {selectedAlert.status}
                    </span>
                    <span className="text-slate-400 font-medium">
                      {selectedAlert.biomeName}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Localização:</span>
                    <span className="font-semibold text-white">{selectedAlert.municipality} - {selectedAlert.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Coordenadas:</span>
                    <span className="font-mono text-slate-200">{selectedAlert.latitude}, {selectedAlert.longitude}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Data e Hora:</span>
                    <span className="text-slate-200">{selectedAlert.date} {selectedAlert.time || ''}</span>
                  </div>
                  {selectedAlert.areaHectares && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Área Estimada:</span>
                      <span className="font-mono font-bold text-emerald-400">{selectedAlert.areaHectares} hectares</span>
                    </div>
                  )}
                  {selectedAlert.frp && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Potência Térmica (FRP):</span>
                      <span className="font-mono font-bold text-amber-400">{selectedAlert.frp} MW</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Satélite / Sensor:</span>
                    <span className="text-slate-200">{selectedAlert.satellite} ({selectedAlert.sensor})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Grau de Confiança:</span>
                    <span className="font-semibold text-emerald-400">{selectedAlert.confidence}</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-slate-200 mb-1">Nota Técnica Oficial</h5>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {selectedAlert.description}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Fonte Primária</div>
                  <div className="text-slate-200 font-medium mt-0.5">{selectedAlert.source}</div>
                  <a
                    href={selectedAlert.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 text-emerald-400 text-xs font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Acessar portal da fonte oficial</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )}

            {/* Conteúdo do Bioma Selecionado */}
            {selectedBiomeDetails && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedBiomeDetails.color }} />
                    <h4 className="text-lg font-bold text-white">
                      {selectedBiomeDetails.name}
                    </h4>
                  </div>
                  <span className="text-slate-400 text-xs">
                    {selectedBiomeDetails.category} • {selectedBiomeDetails.percentageBrazil}% do território nacional
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Área Oficial IBGE</div>
                    <div className="font-mono font-bold text-white mt-1">
                      {selectedBiomeDetails.areaKm2.toLocaleString('pt-BR')} km²
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Vegetação Nativa</div>
                    <div className="font-mono font-bold text-emerald-400 mt-1">
                      {selectedBiomeDetails.nativeVegetationPercentage}% (MapBiomas)
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Áreas Protegidas (UCs):</span>
                    <span className="font-mono font-semibold text-blue-400">{selectedBiomeDetails.protectedAreaPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Focos 24h:</span>
                    <span className="font-mono font-semibold text-amber-400">{selectedBiomeDetails.activeFireHotspots24h} focos</span>
                  </div>
                  {selectedBiomeDetails.deforestationProdes2024Km2 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">PRODES 2024:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {selectedBiomeDetails.deforestationProdes2024Km2.toLocaleString('pt-BR')} km² ({selectedBiomeDetails.deforestationTrendPercent}%)
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h5 className="font-semibold text-slate-200 mb-1">Importância Ecológica</h5>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {selectedBiomeDetails.ecologicalImportance}
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-slate-200 mb-1">Principais Vetores de Pressão</h5>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs">
                    {selectedBiomeDetails.mainThreats.map((threat, idx) => (
                      <li key={idx}>{threat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400 text-center">
            Plataforma EcoMind 360 • Sistema Integrado de Geoprocessamento
          </div>
        </div>
      )}
    </div>
  );
}
