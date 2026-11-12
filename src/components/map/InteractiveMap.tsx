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

function createPulseIcon(color: string) {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; inset: 0; border-radius: 9999px; background-color: ${color}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <span style="position: relative; width: 12px; height: 12px; margin: auto; border-radius: 9999px; background-color: ${color}; border: 2px solid #101512;"></span>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

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

  const getBiomeColor = (id: string) => {
    const biome = BIOMES_DATA[id];
    return biome ? biome.color : '#789B7C';
  };

  const geoJsonStyle = (feature?: Feature<Geometry>) => {
    const id = String(feature?.properties?.id || feature?.id || '');
    const isSelected = selectedBiome === id;
    const isAll = selectedBiome === 'all';
    const color = getBiomeColor(id);

    return {
      fillColor: color,
      weight: isSelected ? 2.5 : 1.5,
      opacity: isSelected ? 1 : isAll ? 0.7 : 0.25,
      color: isSelected ? '#DCE5DD' : color,
      fillOpacity: isSelected ? 0.35 : isAll ? 0.18 : 0.06,
      dashArray: id === 'costeiro_marinho' ? '4, 4' : undefined,
    };
  };

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
          l.setStyle({ fillOpacity: 0.4, weight: 2.5 });
        },
        mouseout: (e: L.LeafletMouseEvent) => {
          const l = e.target;
          l.setStyle(geoJsonStyle(feature));
        }
      });
    }
  };

  const displayedAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (selectedBiome !== 'all' && a.biomeId !== selectedBiome) return false;
      if (a.type === 'foco_calor' && !showFires) return false;
      if (a.type === 'alerta_desmatamento' && !showDeforestation) return false;
      return true;
    });
  }, [alerts, selectedBiome, showFires, showDeforestation]);

  return (
    <div className={`relative w-full rounded-[14px] overflow-hidden border border-[#29362D] shadow-lift bg-[#101512] transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' 
        : 'h-[680px] md:h-[780px]'
    }`}>
      {/* HUD Superior */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-[#171F1A]/95 backdrop-blur-md p-1.5 rounded-[10px] border border-[#29362D] shadow-soft">
          <div className="flex items-center gap-2 pl-2">
            <span className="w-2 h-2 rounded-full bg-[#83A989]" />
            <span className="text-xs font-medium text-[#DCE5DD]">Ambiente:</span>
          </div>
          <select
            value={selectedBiome}
            onChange={(e) => {
              setSelectedBiome(e.target.value);
              setSelectedBiomeDetails(e.target.value === 'all' ? null : BIOMES_DATA[e.target.value]);
            }}
            className="text-xs bg-[#131A16] text-[#DCE5DD] rounded-[7px] px-3 py-1.5 border border-[#29362D] focus:outline-none focus:border-[#789B7C] font-medium cursor-pointer"
          >
            <option value="all">Todos os 7 Ambientes do Brasil</option>
            {BIOMES_LIST.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.percentageBrazil}% BR)
              </option>
            ))}
          </select>
        </div>

        <div className="pointer-events-auto hidden sm:flex items-center gap-1.5 bg-[#171F1A]/95 backdrop-blur-md p-1.5 rounded-[10px] border border-[#29362D] shadow-soft text-xs">
          <button
            onClick={() => setShowBiomes(!showBiomes)}
            className={`px-3 py-1.5 rounded-[7px] font-medium transition-colors flex items-center gap-1.5 ${
              showBiomes 
                ? 'bg-[#1D2821] text-[#91A88F] border border-[#29362D]' 
                : 'text-[#78877D] hover:text-[#DCE5DD]'
            }`}
          >
            <Trees size={13} />
            <span>Polígonos IBGE</span>
          </button>

          <button
            onClick={() => setShowFires(!showFires)}
            className={`px-3 py-1.5 rounded-[7px] font-medium transition-colors flex items-center gap-1.5 ${
              showFires 
                ? 'bg-[#1D2821] text-[#A9A17A] border border-[#29362D]' 
                : 'text-[#78877D] hover:text-[#DCE5DD]'
            }`}
          >
            <Flame size={13} className="text-[#A9A17A]" />
            <span>Focos NASA/INPE</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-[5px] bg-[#131A16] text-[#A9A17A] font-mono">
              {alerts.filter(a => a.type === 'foco_calor').length}
            </span>
          </button>

          <button
            onClick={() => setShowDeforestation(!showDeforestation)}
            className={`px-3 py-1.5 rounded-[7px] font-medium transition-colors flex items-center gap-1.5 ${
              showDeforestation 
                ? 'bg-[#1D2821] text-[#83A989] border border-[#29362D]' 
                : 'text-[#78877D] hover:text-[#DCE5DD]'
            }`}
          >
            <AlertTriangle size={13} className="text-[#83A989]" />
            <span>DETER</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-[5px] bg-[#131A16] text-[#83A989] font-mono">
              {alerts.filter(a => a.type === 'alerta_desmatamento').length}
            </span>
          </button>
        </div>

        <div className="pointer-events-auto">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-[10px] bg-[#171F1A]/95 backdrop-blur-md border border-[#29362D] text-[#DCE5DD] hover:text-[#91A88F] transition-colors shadow-soft flex items-center gap-1.5 text-xs font-medium"
            title={isFullscreen ? 'Reduzir tela' : 'Expandir para tela cheia'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
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

        {showBiomes && geoJsonData && (
          <GeoJSON
            key={`geojson-${selectedBiome}`}
            data={geoJsonData}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {displayedAlerts.map((alert) => {
          const isFire = alert.type === 'foco_calor';
          const color = isFire 
            ? '#A9A17A' 
            : alert.type === 'anomalia_marinha' 
              ? '#91A88F' 
              : '#789B7C';
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
                <div className="p-1.5 text-xs font-sans">
                  <div className="font-semibold text-[#91A88F] mb-1">
                    {isFire ? 'Foco Satelital' : 'Detecção Ambiental'}
                  </div>
                  <div className="text-[#DCE5DD] font-medium">
                    {alert.typeName}
                  </div>
                  <div className="text-[#A7B3A9] text-[11px] mt-1">
                    {alert.municipality}/{alert.state} ({alert.biomeName})
                  </div>
                  <div className="text-[#78877D] text-[10px] font-mono mt-0.5">
                    Satélite: {alert.satellite} · {alert.date}
                  </div>
                  <button
                    onClick={() => setSelectedAlert(alert)}
                    className="mt-2 text-[#91A88F] font-medium hover:underline block text-[11px]"
                  >
                    Abrir laudo completo →
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Coordenadas */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-[#171F1A]/95 backdrop-blur-md px-3 py-1.5 rounded-[7px] border border-[#29362D] shadow-soft flex items-center gap-2.5 text-[11px] font-mono text-[#A7B3A9] pointer-events-none">
        <div className="flex items-center gap-1.5 text-[#91A88F]">
          <Navigation size={12} />
          <span>COORD:</span>
        </div>
        <span>Lat {cursorCoords.lat}°</span>
        <span className="text-[#29362D]">|</span>
        <span>Lon {cursorCoords.lng}°</span>
      </div>

      {/* Legenda */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-[#171F1A]/95 backdrop-blur-md p-3.5 rounded-[10px] border border-[#29362D] shadow-soft max-w-xs text-xs text-[#A7B3A9] hidden md:block">
        <div className="font-medium text-[#DCE5DD] text-[11px] uppercase font-mono tracking-wider mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Compass size={13} className="text-[#789B7C]" />
            <span>Ambientes Oficiais</span>
          </div>
          <span className="text-[10px] text-[#78877D]">IBGE 2024</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
          {BIOMES_LIST.map((b) => (
            <div key={b.id} className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
              <span className="truncate">{b.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2.5 border-t border-[#222D25] flex items-center justify-between text-[10px] text-[#78877D]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#A9A17A] inline-block" />
            Focos NASA/INPE
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#789B7C] inline-block" />
            Alertas DETER
          </span>
        </div>
      </div>

      {/* Painel Lateral */}
      <AnimatePresence>
        {(selectedAlert || selectedBiomeDetails) && (
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute top-0 right-0 bottom-0 w-80 md:w-[400px] z-[1001] bg-[#171F1A]/98 backdrop-blur-xl border-l border-[#29362D] shadow-lift p-6 overflow-y-auto flex flex-col justify-between text-xs font-sans"
          >
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-[#222D25] mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#91A88F] flex items-center gap-1.5">
                  <Activity size={13} />
                  {selectedAlert ? 'Detecção Orbital Verificada' : 'Indicadores Oficiais do Bioma'}
                </span>
                <button
                  onClick={() => {
                    setSelectedAlert(null);
                    setSelectedBiomeDetails(null);
                  }}
                  className="p-1.5 rounded-[7px] text-[#78877D] hover:text-[#DCE5DD] hover:bg-[#1D2821] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {selectedAlert && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-semibold text-[#DCE5DD] mb-1.5 leading-snug">
                      {selectedAlert.typeName}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-[5px] text-[10px] font-mono bg-[#1D2821] text-[#83A989] border border-[#29362D]">
                        {selectedAlert.status}
                      </span>
                      <span className="text-[#A7B3A9] font-medium">
                        {selectedAlert.biomeName}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-[10px] bg-[#131A16] border border-[#222D25] space-y-2.5 text-[#A7B3A9]">
                    <div className="flex justify-between">
                      <span className="text-[#78877D]">Localização:</span>
                      <span className="font-medium text-[#DCE5DD]">{selectedAlert.municipality} - {selectedAlert.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#78877D]">Coordenadas:</span>
                      <span className="font-mono text-[#91A88F]">{selectedAlert.latitude}, {selectedAlert.longitude}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#78877D]">Data e Horário:</span>
                      <span className="text-[#DCE5DD] font-mono">{selectedAlert.date} {selectedAlert.time || ''}</span>
                    </div>
                    {selectedAlert.areaHectares && (
                      <div className="flex justify-between">
                        <span className="text-[#78877D]">Área Estimada:</span>
                        <span className="font-mono font-medium text-[#83A989]">{selectedAlert.areaHectares} hectares</span>
                      </div>
                    )}
                    {selectedAlert.frp && (
                      <div className="flex justify-between">
                        <span className="text-[#78877D]">Potência Térmica (FRP):</span>
                        <span className="font-mono font-medium text-[#A9A17A]">{selectedAlert.frp} MW</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#78877D]">Satélite / Sensor:</span>
                      <span className="text-[#DCE5DD]">{selectedAlert.satellite} ({selectedAlert.sensor})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#78877D]">Grau de Confiança:</span>
                      <span className="font-medium text-[#83A989]">{selectedAlert.confidence}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-[#DCE5DD] mb-1">Nota Técnica do Monitoramento</h5>
                    <p className="text-[#A7B3A9] text-xs leading-relaxed">
                      {selectedAlert.description}
                    </p>
                  </div>

                  <div className="p-4 rounded-[10px] bg-[#131A16] border border-[#222D25]">
                    <div className="text-[10px] text-[#78877D] uppercase font-mono tracking-wider">Fonte Primária Pública</div>
                    <div className="text-[#DCE5DD] font-medium mt-1">{selectedAlert.source}</div>
                    <a
                      href={selectedAlert.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 text-[#91A88F] text-xs font-medium hover:underline inline-flex items-center gap-1.5"
                    >
                      <span>Acessar portal da fonte oficial</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}

              {selectedBiomeDetails && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedBiomeDetails.color }} />
                      <h4 className="text-lg font-semibold text-[#DCE5DD]">
                        {selectedBiomeDetails.name}
                      </h4>
                    </div>
                    <span className="text-[#78877D] text-xs">
                      {selectedBiomeDetails.category} · {selectedBiomeDetails.percentageBrazil}% do território nacional
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-[10px] bg-[#131A16] border border-[#222D25]">
                      <div className="text-[10px] text-[#78877D] uppercase font-mono">Área Oficial IBGE</div>
                      <div className="font-mono font-medium text-[#DCE5DD] text-xs mt-1">
                        {selectedBiomeDetails.areaKm2.toLocaleString('pt-BR')} km²
                      </div>
                    </div>
                    <div className="p-3 rounded-[10px] bg-[#131A16] border border-[#222D25]">
                      <div className="text-[10px] text-[#78877D] uppercase font-mono">Veg. Nativa</div>
                      <div className="font-mono font-medium text-[#83A989] text-xs mt-1">
                        {selectedBiomeDetails.nativeVegetationPercentage}% (MapBiomas)
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-[10px] bg-[#131A16] border border-[#222D25] space-y-2 text-[#A7B3A9]">
                    <div className="flex justify-between">
                      <span className="text-[#78877D]">Áreas Protegidas (UCs):</span>
                      <span className="font-mono font-medium text-[#91A88F]">{selectedBiomeDetails.protectedAreaPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#78877D]">Focos 24h:</span>
                      <span className="font-mono font-medium text-[#A9A17A]">{selectedBiomeDetails.activeFireHotspots24h} focos</span>
                    </div>
                    {selectedBiomeDetails.deforestationProdes2024Km2 && (
                      <div className="flex justify-between">
                        <span className="text-[#78877D]">PRODES 2024:</span>
                        <span className="font-mono font-medium text-[#83A989]">
                          {selectedBiomeDetails.deforestationProdes2024Km2.toLocaleString('pt-BR')} km² ({selectedBiomeDetails.deforestationTrendPercent}%)
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h5 className="font-medium text-[#DCE5DD] mb-1">Importância Ecológica</h5>
                    <p className="text-[#A7B3A9] text-xs leading-relaxed">
                      {selectedBiomeDetails.ecologicalImportance}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium text-[#DCE5DD] mb-1.5">Principais Vetores de Degradação</h5>
                    <ul className="space-y-1.5 text-[#A7B3A9] text-xs">
                      {selectedBiomeDetails.mainThreats.map((threat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A9A17A] mt-1.5 flex-shrink-0" />
                          <span>{threat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#222D25] text-[10px] text-[#78877D] flex items-center justify-between font-mono">
              <span>EcoMind 360 · SIG Integrado</span>
              <span className="text-[#91A88F]">100% Auditado</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
