"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { GeoJsonObject } from "geojson";
import { usePerfProfile } from "@/components/hooks/usePerfProfile";
import { BRAZIL_CENTER, BRAZIL_DEFAULT_ZOOM } from "@/lib/alerts/geo";
import { LEVEL_META } from "@/lib/alerts/levels";
import type { FireAlert } from "@/lib/alerts/types";
import { createPinIcon } from "./createPinIcon";

type MapLayer = "map" | "satellite";

const TILES: Record<
  MapLayer,
  { url: string; attribution: string; maxZoom: number }
> = {
  map: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
    maxZoom: 19,
  },
};

function MapClickHandler({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (!enabled) return;
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FixMapSize({ layer }: { layer: MapLayer }) {
  const map = useMap();
  useEffect(() => {
    const bump = () => map.invalidateSize({ animate: false });
    const t1 = window.setTimeout(bump, 50);
    const t2 = window.setTimeout(bump, 250);
    const t3 = window.setTimeout(bump, 650);
    const t4 = window.setTimeout(bump, 1200);
    window.addEventListener("orientationchange", bump);
    window.addEventListener("resize", bump);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.removeEventListener("orientationchange", bump);
      window.removeEventListener("resize", bump);
    };
  }, [map, layer]);
  return null;
}

function formatReportedAt(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("pt-BR");
}

function AlertPopup({ alert }: { alert: FireAlert }) {
  return (
    <div className="min-w-[170px] max-w-[240px] text-xs p-1">
      <p
        className="font-display font-semibold text-sm"
        style={{ color: LEVEL_META[alert.level].color }}
      >
        {LEVEL_META[alert.level].label}
      </p>
      {alert.frp != null ? (
        <p className="mt-1 text-xs font-mono font-medium text-[#DCE5DD]">
          Potência (FRP): {alert.frp.toFixed(1)} MW
        </p>
      ) : null}
      {alert.municipio ? (
        <p className="mt-1 text-xs font-medium text-[#91A88F]">
          {[alert.municipio, alert.estado].filter(Boolean).join(" · ")}
        </p>
      ) : alert.description ? (
        <p className="mt-1 text-xs text-[#A7B3A9]">{alert.description}</p>
      ) : null}
      {alert.bioma ? (
        <p className="mt-1 text-xs text-[#A7B3A9]">Bioma: {alert.bioma}</p>
      ) : null}
      {alert.satelite ? (
        <p className="mt-0.5 text-[11px] font-mono text-[#78877D]">Satélite: {alert.satelite}</p>
      ) : null}
      <p className="mt-2 text-[11px] font-mono text-[#78877D]">
        {formatReportedAt(alert.reportedAt)}
      </p>
      <div className="mt-2 pt-1.5 border-t border-[#222D25] flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-[#91A88F]">
        <span>
          {alert.source === "inpe"
            ? "INPE Queimadas"
            : alert.source === "nasa"
              ? "NASA FIRMS 24h"
              : alert.source === "user"
                ? "Reporte Local"
                : alert.source === "seed"
                  ? "Amostra Didática"
                  : "EcoMind"}
        </span>
      </div>
    </div>
  );
}

interface MapViewProps {
  alerts: FireAlert[];
  layer: MapLayer;
  pickMode: boolean;
  onMapClick: (lat: number, lng: number) => void;
  selectedCoords: { lat: number; lng: number } | null;
  showBiomes?: boolean;
}

export function MapView({
  alerts,
  layer,
  pickMode,
  onMapClick,
  selectedCoords,
  showBiomes = true,
}: MapViewProps) {
  const perf = usePerfProfile();
  const tile = TILES[layer];
  const isTouch = perf.tier !== "high";
  const pinRadius = isTouch ? 6 : 5;
  const [biomesGeoJson, setBiomesGeoJson] = useState<GeoJsonObject | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/data/geojson/biomas-brasil.json")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar GeoJSON");
        return res.json();
      })
      .then((data: GeoJsonObject) => {
        if (isMounted) setBiomesGeoJson(data);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const pathByLevel = useMemo(() => {
    const out = {} as Record<
      FireAlert["level"],
      { color: string; weight: number; fillColor: string; fillOpacity: number }
    >;
    for (const level of Object.keys(LEVEL_META) as FireAlert["level"][]) {
      out[level] = {
        color: "#101512",
        weight: isTouch ? 1.5 : 1,
        fillColor: LEVEL_META[level].color,
        fillOpacity: 0.9,
      };
    }
    return out;
  }, [isTouch]);

  return (
    <MapContainer
      center={BRAZIL_CENTER}
      zoom={BRAZIL_DEFAULT_ZOOM}
      className="z-0 h-full w-full touch-manipulation"
      style={{ height: "100%", width: "100%", minHeight: "520px" }}
      scrollWheelZoom={!isTouch}
      preferCanvas
      zoomControl={!isTouch}
      attributionControl={!isTouch}
      tapTolerance={18}
      maxZoom={isTouch ? 12 : 19}
      minZoom={3}
    >
      <TileLayer
        key={layer}
        attribution={tile.attribution}
        url={tile.url}
        maxZoom={isTouch ? 12 : tile.maxZoom}
        updateWhenZooming={!isTouch}
        updateWhenIdle
        keepBuffer={isTouch ? 1 : 2}
      />
      <FixMapSize layer={layer} />
      <MapClickHandler enabled={pickMode} onClick={onMapClick} />

      {/* Camada Poligonal dos 7 Biomas Brasileiros */}
      {showBiomes && biomesGeoJson && (
        <GeoJSON
          key={`biomes-${layer}`}
          data={biomesGeoJson}
          style={() => ({
            color: "#789B7C",
            weight: 1.25,
            opacity: 0.65,
            dashArray: "4, 4",
            fillColor: "#294C35",
            fillOpacity: 0.12,
          })}
          onEachFeature={(feature, featureLayer) => {
            const name = feature.properties?.name || feature.properties?.id;
            if (name) {
              featureLayer.bindTooltip(
                `<strong>Bioma ${name}</strong>`,
                {
                  sticky: true,
                  direction: "top",
                  opacity: 0.95,
                  className: "biome-map-tooltip",
                }
              );
            }
          }}
        />
      )}

      {/* Marcadores de Focos de Queimadas */}
      {alerts.map((alert) =>
        alert.source === "user" ? (
          <Marker
            key={alert.id}
            position={[alert.lat, alert.lng]}
            icon={createPinIcon(alert.level)}
          >
            <Popup autoPanPadding={[48, 48]}>
              <AlertPopup alert={alert} />
            </Popup>
          </Marker>
        ) : (
          <CircleMarker
            key={alert.id}
            center={[alert.lat, alert.lng]}
            radius={pinRadius}
            pathOptions={pathByLevel[alert.level]}
          >
            <Popup autoPanPadding={[48, 48]}>
              <AlertPopup alert={alert} />
            </Popup>
          </CircleMarker>
        ),
      )}

      {selectedCoords ? (
        <CircleMarker
          center={[selectedCoords.lat, selectedCoords.lng]}
          radius={8}
          pathOptions={{
            color: "#DCE5DD",
            weight: 2,
            fillColor: LEVEL_META.critico.color,
            fillOpacity: 1,
          }}
        />
      ) : null}
    </MapContainer>
  );
}
