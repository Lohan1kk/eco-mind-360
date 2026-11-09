'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  GeoJSON, 
  Marker, 
  Popup, 
  LayersControl, 
  useMap,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import type { FeatureCollection, Feature, Geometry } from 'geojson';
import 'leaflet/dist/leaflet.css';
import { BIOMES_DATA, BIOMES_LIST } from '@/data/biomes';
import { VERIFIED_ALERTS } from '@/data/alerts';
import { EnvironmentalAlert, BiomeInfo } from '@/data/types';
import { 
  Flame, 
  Trees, 
  AlertTriangle, 
  X, 
  ExternalLink, 
  Compass,
  Maximize2,
  Minimize2,
  Navigation,
  Activity
} from 'lucide-react';

const { BaseLayer } = LayersControl;

// Custom pulse markers via Leaflet divIcon
function createPulseIcon(color: string, isFire = false) {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position: relative; width: 26px; height: 26px; display: flex; items-center; justify-content: center;">
        <span style="position: absolute; inset: 0; border-radius: 9999px; background-color: ${color}; opacity: 0.45; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <span style="position: relative; width: 14px; height: 14px; margin: auto; border-radius: 9999px; background-color: ${color}; border: 2.5px solid #ffffff; box-shadow: 0 0 14px ${color};"></span>
        ${isFire ? `<span style="position: absolute; top: -6px; right: -6px; font-size: 10px;">🔥</span>` : ''}
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

// Subcomponente de controle de voo orbital do mapa
function MapController({ selectedBiomeId }: { selectedBiomeId: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedBiomeId || selectedBiomeId === 'all') {
      map.flyTo([-14.235, -51.9253], 4, { duration: 1.5 });
    } else {
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
        map.flyTo([target[0], target[1]], target[2], { duration: 1.5 });
      }
    }
  }, [selectedBiomeId, map]);

  return null;
}

// Subcomponente para capturar coordenadas em tempo real sob o cursor
function MouseCoordinateTracker({ onCoordsChange }: { onCoordsChange: (coords: { lat: number; lng: number }) => void }) {
  useMapEvents({
    mousemove: (e) => {
      onCoordsChange({
        lat: Number(e.latlng.lat.toFixed(4)),
        lng: Number(e.latlng.lng.toFixed(4)),
      });
    },
  });
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number }>({ lat: -14.235, lng: -51.9253 });

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
      weight: isSelected ? 3.5 : 1.8,
      opacity: isSelected ? 1 : isAll ? 0.75 : 0.25,
      color: isSelected ? '#ffffff' : color,
      fillOpacity: isSelected ? 0.45 : isAll ? 0.24 : 0.08,
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
          l.setStyle({ fillOpacity: 0.55, weight: 3 });
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
    <div className={`relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950 transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' 
        : 'h-[680px] md:h-[780px]'
    }`}>
      {/* HUD Superior: Controles de Camadas, Seletores e Modo Tela Cheia */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        {/* Seletor de Bioma com Estilo Cyber-Ambiental */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-950/90 dark:bg-[#070b14]/90 backdrop-blur-xl p-2 rounded-2xl border border-slate-700/80 shadow-2xl">
          <div className="flex items-center gap-2 pl-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide">Ambiente:</span>
          </div>
          <select
            value={selectedBiome}
            onChange={(e) => {
              setSelectedBiome(e.target.value);
              setSelectedBiomeDetails(e.target.value === 'all' ? null : BIOMES_DATA[e.target.value]);
            }}
            className="text-xs bg-slate-900 text-white rounded-xl px-3 py-1.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
          >
            <option value="all">🇧🇷 Todos os 7 Ambientes do Brasil</option>
            {BIOMES_LIST.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.percentageBrazil}% BR)
              </option>
            ))}
          </select>
        </div>

        {/* Filtros de Camadas Rápidas com Badges Numéricos */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-2 bg-slate-950/90 dark:bg-[#070b14]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl text-xs">
          <button
            onClick={() => setShowBiomes(!showBiomes)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              showBiomes 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trees size={14} />
            <span>Polígonos IBGE</span>
          </button>

          <button
            onClick={() => setShowFires(!showFires)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              showFires 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame size={14} className="text-amber-400" />
            <span>Focos NASA/INPE</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-200 font-mono">
              {alerts.filter(a => a.type === 'foco_calor').length}
            </span>
          </button>

          <button
            onClick={() => setShowDeforestation(!showDeforestation)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              showDeforestation 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle size={14} className="text-cyan-400" />
            <span>DETER</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/30 text-cyan-200 font-mono">
              {alerts.filter(a => a.type === 'alerta_desmatamento').length}
            </span>
          </button>
        </div>

        {/* Botão de Tela Cheia */}
        <div className="pointer-events-auto">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-2xl bg-slate-950/90 dark:bg-[#070b14]/90 backdrop-blur-xl border border-slate-700/80 text-white hover:text-emerald-400 transition-colors shadow-2xl flex items-center gap-1.5 text-xs font-semibold"
            title={isFullscreen ? 'Reduzir tela' : 'Expandir para tela cheia'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span className="hidden md:inline">{isFullscreen ? 'Sair' : 'Tela Cheia'}</span>
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
        <MouseCoordinateTracker onCoordsChange={setCursorCoords} />

        <LayersControl position="topright">
          <BaseLayer checked name="CartoDB Escuro (Padrão)">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              maxZoom={19}
            />
          </BaseLayer>
          <BaseLayer name="Satélite Orbital Real (ESRI)">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri World Imagery</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={18}
            />
          </BaseLayer>
          <BaseLayer name="OpenStreetMap Topográfico">
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

        {/* Marcadores dos Alertas e Focos de Calor com Pulsos */}
        {displayedAlerts.map((alert) => {
          const isFire = alert.type === 'foco_calor';
          const color = isFire 
            ? '#f59e0b' 
            : alert.type === 'anomalia_marinha' 
              ? '#3b82f6' 
              : '#10b981';
          const icon = createPulseIcon(color, isFire);

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
                <div className="p-1.5 text-xs font-sans">
                  <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                    {isFire ? '🔥 Foco Satelital' : '🛰️ Detecção Ambiental'}
                  </div>
                  <div className="text-slate-200 font-semibold">
                    {alert.typeName}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-1">
                    📍 {alert.municipality}/{alert.state} ({alert.biomeName})
                  </div>
                  <div className="text-slate-400 text-[10px] mt-0.5">
                    Satélite: {alert.satellite} • {alert.date}
                  </div>
                  <button
                    onClick={() => setSelectedAlert(alert)}
                    className="mt-2.5 text-emerald-400 font-bold hover:underline block text-[11px]"
                  >
                    Abrir laudo completo no painel lateral →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Telemetria Flutuante no Canto Inferior Direito (Coordenadas em Tempo Real) */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-slate-950/90 dark:bg-[#070b14]/90 backdrop-blur-xl px-3.5 py-2 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center gap-3 text-[11px] font-mono text-slate-300 pointer-events-none">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Navigation size={13} className="animate-spin" style={{ animationDuration: '8s' }} />
          <span>MIRA:</span>
        </div>
        <span>Lat: {cursorCoords.lat}°</span>
        <span className="text-slate-600">|</span>
        <span>Lon: {cursorCoords.lng}°</span>
      </div>

      {/* Legenda Flutuante no Canto Inferior Esquerdo */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-slate-950/90 dark:bg-[#070b14]/90 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-700/80 shadow-2xl max-w-xs text-xs text-slate-300 hidden md:block">
        <div className="font-bold text-white text-[11px] uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Compass size={14} className="text-emerald-400" />
            <span>Ambientes Oficiais</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">IBGE 2024</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
          {BIOMES_LIST.map((b) => (
            <div key={b.id} className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: b.color }} />
              <span className="truncate">{b.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
            Focos NASA/INPE
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Alertas DETER
          </span>
        </div>
      </div>

      {/* Painel Lateral com Animação Fluida do Framer Motion */}
      <AnimatePresence>
        {(selectedAlert || selectedBiomeDetails) && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute top-0 right-0 bottom-0 w-80 md:w-[420px] z-[1001] bg-slate-950/95 dark:bg-[#070c16]/95 backdrop-blur-2xl border-l border-slate-700/80 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between text-xs font-sans"
          >
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Activity size={14} />
                  {selectedAlert ? 'Detecção Orbital Verificada' : 'Indicadores Oficiais do Bioma'}
                </span>
                <button
                  onClick={() => {
                    setSelectedAlert(null);
                    setSelectedBiomeDetails(null);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Ficha Técnica do Alerta */}
              {selectedAlert && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-black text-white mb-1.5 leading-snug">
                      {selectedAlert.typeName}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {selectedAlert.status}
                      </span>
                      <span className="text-slate-400 font-semibold">
                        {selectedAlert.biomeName}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Localização:</span>
                      <span className="font-bold text-white">{selectedAlert.municipality} - {selectedAlert.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Coordenadas:</span>
                      <span className="font-mono text-emerald-400 font-semibold">{selectedAlert.latitude}, {selectedAlert.longitude}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Data e Horário:</span>
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
                      <span className="font-bold text-emerald-400">{selectedAlert.confidence}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-200 mb-1">Nota Técnica do Monitoramento</h5>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {selectedAlert.description}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fonte Primária Pública</div>
                    <div className="text-white font-semibold mt-1">{selectedAlert.source}</div>
                    <a
                      href={selectedAlert.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2.5 text-emerald-400 text-xs font-bold hover:underline inline-flex items-center gap-1.5"
                    >
                      <span>Acessar portal da fonte oficial</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}

              {/* Ficha Técnica do Bioma Selecionado */}
              {selectedBiomeDetails && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: selectedBiomeDetails.color }} />
                      <h4 className="text-xl font-black text-white">
                        {selectedBiomeDetails.name}
                      </h4>
                    </div>
                    <span className="text-slate-400 text-xs">
                      {selectedBiomeDetails.category} • {selectedBiomeDetails.percentageBrazil}% do território nacional
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Área Oficial IBGE</div>
                      <div className="font-mono font-bold text-white text-sm mt-1">
                        {selectedBiomeDetails.areaKm2.toLocaleString('pt-BR')} km²
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Veg. Nativa</div>
                      <div className="font-mono font-bold text-emerald-400 text-sm mt-1">
                        {selectedBiomeDetails.nativeVegetationPercentage}% (MapBiomas)
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Áreas Protegidas (UCs):</span>
                      <span className="font-mono font-bold text-blue-400">{selectedBiomeDetails.protectedAreaPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Focos 24h:</span>
                      <span className="font-mono font-bold text-amber-400">{selectedBiomeDetails.activeFireHotspots24h} focos</span>
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
                    <h5 className="font-bold text-slate-200 mb-1">Importância Ecológica</h5>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {selectedBiomeDetails.ecologicalImportance}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-200 mb-1.5">Principais Vetores de Degradação</h5>
                    <ul className="space-y-1.5 text-slate-400 text-xs">
                      {selectedBiomeDetails.mainThreats.map((threat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                          <span>{threat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
              <span>EcoMind 360 • SIG Integrado</span>
              <span className="text-emerald-400 font-mono">100% Auditado</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
