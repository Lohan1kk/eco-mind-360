"use client";

import React, { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import type { FeatureCollection, Geometry } from "geojson";
import { useTheme } from "@/components/layout/ThemeContext";
import type { FocoCalor, RespostaApiFocos } from "@/lib/firms/types";

export const MAP_STYLES = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
} as const;

export function getDefaultGibsDate(): string {
  // Usa 30h atrás em UTC para garantir mosaico consolidado
  return new Date(Date.now() - 30 * 3600 * 1000).toISOString().slice(0, 10);
}

interface FirmsMapCanvasProps {
  geojson: RespostaApiFocos["geojson"];
  focosById: Map<string, FocoCalor>;
  lat: number;
  lon: number;
  zoom: number;
  camadas: {
    focos: boolean;
    biomas: boolean;
    gibs: boolean;
    heatmap: boolean;
  };
  selectedFoco: FocoCalor | null;
  selectedBiome: string;
  userLocation: { lat: number; lon: number } | null;
  flyToTarget: { lat: number; lon: number; zoom: number; token: number } | null;
  onMoveEnd: (lat: number, lon: number, zoom: number) => void;
  onSelectFoco: (foco: FocoCalor | null) => void;
  onWebGlError: () => void;
}

export default function FirmsMapCanvas({
  geojson,
  focosById,
  lat,
  lon,
  zoom,
  camadas,
  selectedFoco,
  selectedBiome,
  userLocation,
  flyToTarget,
  onMoveEnd,
  onSelectFoco,
  onWebGlError,
}: FirmsMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const styleLoadedRef = useRef(false);
  const biomesGeoJsonRef = useRef<FeatureCollection<Geometry> | null>(null);
  const ufsGeoJsonRef = useRef<FeatureCollection<Geometry> | null>(null);
  const currentStyleThemeRef = useRef<"dark" | "light" | null>(null);

  const focosByIdRef = useRef(focosById);
  focosByIdRef.current = focosById;
  const geojsonRef = useRef(geojson);
  geojsonRef.current = geojson;
  const camadasRef = useRef(camadas);
  camadasRef.current = camadas;
  const selectedFocoRef = useRef(selectedFoco);
  selectedFocoRef.current = selectedFoco;
  const selectedBiomeRef = useRef(selectedBiome);
  selectedBiomeRef.current = selectedBiome;
  const userLocationRef = useRef(userLocation);
  userLocationRef.current = userLocation;

  const { theme } = useTheme();

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const setupLayers = (map: maplibregl.Map, isDark: boolean) => {
    const c = camadasRef.current;
    const gibsDate = getDefaultGibsDate();

    const emptyFc: FeatureCollection<Geometry> = {
      type: "FeatureCollection",
      features: [],
    };

    try {
      // 1. Camada opcional de imagem orbital NASA GIBS (WMTS sem chave)
      if (!map.getSource("nasa-gibs")) {
        map.addSource("nasa-gibs", {
          type: "raster",
          tiles: [
            `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_NOAA20_CorrectedReflectance_TrueColor/default/${gibsDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
          ],
          tileSize: 256,
          maxzoom: 9,
          attribution: "NASA GIBS / VIIRS NOAA-20",
        });
      }
      if (!map.getLayer("nasa-gibs-layer")) {
        map.addLayer({
          id: "nasa-gibs-layer",
          type: "raster",
          source: "nasa-gibs",
          layout: {
            visibility: c.gibs ? "visible" : "none",
          },
          paint: {
            "raster-opacity": 0.78,
          },
        });
      }
    } catch {
      // Ignora caso o tile server GIBS esteja indisponível
    }

    try {
      // 2. Camada de contorno oficial dos 7 Biomas do IBGE
      if (!map.getSource("biomas-ibge")) {
        map.addSource("biomas-ibge", {
          type: "geojson",
          data: biomesGeoJsonRef.current ?? emptyFc,
        });
      } else {
        const bSrc = map.getSource("biomas-ibge") as maplibregl.GeoJSONSource | undefined;
        if (bSrc && biomesGeoJsonRef.current) {
          bSrc.setData(biomesGeoJsonRef.current);
        }
      }

      const biomeColorExpr: maplibregl.ExpressionSpecification = [
        "match",
        ["coalesce", ["get", "id"], ""],
        "amazonia",
        "#789B7C",
        "cerrado",
        "#D4A359",
        "mata_atlantica",
        "#5B9A68",
        "caatinga",
        "#C89D66",
        "pampa",
        "#84A970",
        "pantanal",
        "#528B88",
        "costeiro_marinho",
        "#3B7A9E",
        "#789B7C",
      ];

      if (!map.getLayer("biomas-fill")) {
        map.addLayer({
          id: "biomas-fill",
          type: "fill",
          source: "biomas-ibge",
          layout: {
            visibility: c.biomas ? "visible" : "none",
          },
          paint: {
            "fill-color": biomeColorExpr,
            "fill-opacity": isDark ? 0.09 : 0.14,
          },
        });
      }

      if (!map.getLayer("biomas-outline")) {
        map.addLayer({
          id: "biomas-outline",
          type: "line",
          source: "biomas-ibge",
          layout: {
            visibility: c.biomas ? "visible" : "none",
          },
          paint: {
            "line-color": biomeColorExpr,
            "line-width": 1.25,
            "line-opacity": isDark ? 0.65 : 0.75,
          },
        });
      }

      // 2b. Limites estaduais discretos (27 UFs do IBGE — estilo Painel do Fogo Gov)
      if (!map.getSource("estados-ibge")) {
        map.addSource("estados-ibge", {
          type: "geojson",
          data: ufsGeoJsonRef.current ?? emptyFc,
        });
      } else {
        const uSrc = map.getSource("estados-ibge") as maplibregl.GeoJSONSource | undefined;
        if (uSrc && ufsGeoJsonRef.current) {
          uSrc.setData(ufsGeoJsonRef.current);
        }
      }

      if (!map.getLayer("estados-outline")) {
        map.addLayer({
          id: "estados-outline",
          type: "line",
          source: "estados-ibge",
          paint: {
            "line-color": isDark ? "rgba(220, 229, 221, 0.18)" : "rgba(18, 28, 22, 0.22)",
            "line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.6, 7, 1.1],
          },
        });
      }
    } catch {
      // Ignora erro na camada de biomas/estados
    }

    try {
      // 3. Fonte direta na GPU com todos os focos reais (sem bolhas de cluster escondendo pontos)
      if (!map.getSource("focos-raw")) {
        map.addSource("focos-raw", {
          type: "geojson",
          data: geojsonRef.current,
        });
      } else {
        const rSrc = map.getSource("focos-raw") as maplibregl.GeoJSONSource | undefined;
        rSrc?.setData(geojsonRef.current);
      }

      // Camada opcional de Mancha de Calor intensa (Heatmap)
      if (!map.getLayer("focos-heatmap")) {
        map.addLayer({
          id: "focos-heatmap",
          type: "heatmap",
          source: "focos-raw",
          maxzoom: 11,
          layout: {
            visibility: c.heatmap ? "visible" : "none",
          },
          paint: {
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["coalesce", ["get", "frp"], 1],
              0,
              0.2,
              15,
              0.45,
              40,
              0.8,
              100,
              1,
            ],
            "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 3, 1.1, 9, 2.5],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(0, 0, 0, 0)",
              0.18,
              "rgba(250, 204, 21, 0.48)",
              0.45,
              "rgba(251, 146, 60, 0.72)",
              0.75,
              "rgba(239, 68, 68, 0.88)",
              1,
              "rgba(185, 28, 28, 0.96)",
            ],
            "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 3, 10, 8, 24],
            "heatmap-opacity": 0.85,
          },
        });
      }

      // Halo térmico sutil sob os pontos individuais (estilo Painel do Fogo / BDQueimadas)
      if (!map.getLayer("focos-glow")) {
        map.addLayer({
          id: "focos-glow",
          type: "circle",
          source: "focos-raw",
          layout: {
            visibility: c.focos ? "visible" : "none",
          },
          paint: {
            "circle-color": [
              "match",
              ["get", "int"],
              "critico",
              "#EF4444",
              "alto",
              "#F97316",
              "medio",
              "#FB923C",
              "#FACC15",
            ],
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              3,
              [
                "match",
                ["get", "int"],
                "critico",
                9,
                "alto",
                6.5,
                "medio",
                4.5,
                3.2,
              ],
              8,
              [
                "match",
                ["get", "int"],
                "critico",
                18,
                "alto",
                14,
                "medio",
                10,
                7,
              ],
            ],
            "circle-blur": 0.9,
            "circle-opacity": isDark ? 0.22 : 0.16,
          },
        });
      }

      // Todos os pontos individuais renderizados diretamente na GPU (ordenados por FRP para destacar os mais intensos no topo)
      if (!map.getLayer("focos-unclustered")) {
        map.addLayer({
          id: "focos-unclustered",
          type: "circle",
          source: "focos-raw",
          layout: {
            visibility: c.focos ? "visible" : "none",
            "circle-sort-key": ["coalesce", ["get", "frp"], 0],
          },
          paint: {
            "circle-color": [
              "match",
              ["get", "int"],
              "critico",
              "#DC2626",
              "alto",
              "#EF4444",
              "medio",
              "#F97316",
              "#FACC15",
            ],
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              3,
              [
                "interpolate",
                ["linear"],
                ["coalesce", ["get", "frp"], 1],
                0,
                1.6,
                15,
                2.4,
                40,
                3.4,
                100,
                4.8,
                300,
                6.5,
              ],
              5,
              [
                "interpolate",
                ["linear"],
                ["coalesce", ["get", "frp"], 1],
                0,
                2.3,
                15,
                3.3,
                40,
                4.6,
                100,
                6.4,
                300,
                8.5,
              ],
              8,
              [
                "interpolate",
                ["linear"],
                ["coalesce", ["get", "frp"], 1],
                0,
                4.5,
                15,
                6.5,
                40,
                9,
                100,
                12.5,
                300,
                16,
              ],
              12,
              [
                "interpolate",
                ["linear"],
                ["coalesce", ["get", "frp"], 1],
                0,
                7,
                15,
                9.5,
                40,
                12.5,
                100,
                16,
                300,
                20,
              ],
            ],
            "circle-opacity": [
              "match",
              ["get", "int"],
              "critico",
              0.98,
              "alto",
              0.94,
              "medio",
              0.88,
              0.8,
            ],
            "circle-stroke-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              3,
              ["match", ["get", "int"], "critico", 1.0, "alto", 0.6, 0],
              7,
              ["match", ["get", "int"], "critico", 1.8, "alto", 1.2, 0.8],
            ],
            "circle-stroke-color": [
              "match",
              ["get", "int"],
              "critico",
              "#FECACA",
              isDark ? "#0B0F0D" : "#FFFFFF",
            ],
          },
        });
      }

      // Anel de destaque do foco selecionado
      if (!map.getLayer("focos-selected-ring")) {
        map.addLayer({
          id: "focos-selected-ring",
          type: "circle",
          source: "focos-raw",
          filter: ["==", ["get", "id"], selectedFocoRef.current?.id ?? ""],
          paint: {
            "circle-radius": 16,
            "circle-color": "rgba(250, 204, 21, 0.2)",
            "circle-stroke-width": 2.5,
            "circle-stroke-color": "#FFFFFF",
          },
        });
      }
    } catch {
      // Ignora erro em camadas de focos
    }

    try {
      // 5. Localização do usuário (100% local no cliente)
      const userFc: FeatureCollection<Geometry> = userLocationRef.current
        ? {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [userLocationRef.current.lon, userLocationRef.current.lat],
                },
                properties: {},
              },
            ],
          }
        : emptyFc;

      if (!map.getSource("user-location")) {
        map.addSource("user-location", {
          type: "geojson",
          data: userFc,
        });
      }

      if (!map.getLayer("user-location-pulse")) {
        map.addLayer({
          id: "user-location-pulse",
          type: "circle",
          source: "user-location",
          paint: {
            "circle-radius": 14,
            "circle-color": "rgba(59, 130, 246, 0.25)",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#3B82F6",
          },
        });
      }

      if (!map.getLayer("user-location-dot")) {
        map.addLayer({
          id: "user-location-dot",
          type: "circle",
          source: "user-location",
          paint: {
            "circle-radius": 6,
            "circle-color": "#3B82F6",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#FFFFFF",
          },
        });
      }
    } catch {
      // Ignora erro na camada de localização
    }
  };

  // Inicialização do MapLibre GL JS
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!gl) {
        onWebGlError();
        return;
      }
    } catch {
      onWebGlError();
      return;
    }

    const initialTheme = theme === "light" ? "light" : "dark";
    currentStyleThemeRef.current = initialTheme;

    let map: maplibregl.Map;
    try {
      maplibregl.setWorkerUrl("/maplibre-gl-worker.js");
      map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLES[initialTheme],
        center: [lon, lat],
        zoom,
        minZoom: 2.5,
        maxZoom: 17,
        attributionControl: false,
      });
    } catch {
      onWebGlError();
      return;
    }

    mapRef.current = map;

    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: "IBGE · NASA FIRMS (VIIRS/MODIS) · NASA GIBS",
      }),
      "bottom-right",
    );

    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: true,
      }),
      "bottom-right",
    );

    const handleStyleReady = () => {
      styleLoadedRef.current = true;
      setupLayers(map, currentStyleThemeRef.current === "dark");
      map.resize();
    };

    map.on("load", handleStyleReady);
    map.on("style.load", handleStyleReady);

    map.on("moveend", () => {
      const center = map.getCenter();
      onMoveEnd(center.lat, center.lng, map.getZoom());
    });

    // Clique num foco individual -> abre painel/popup de detalhes
    map.on("click", "focos-unclustered", (e: maplibregl.MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) return;
      const id = String(feature.properties?.id ?? "");
      const found = focosByIdRef.current.get(id);
      if (found) {
        onSelectFoco(found);
      }
    });

    map.on("mouseenter", "focos-unclustered", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "focos-unclustered", () => {
      map.getCanvas().style.cursor = "";
    });

    // Garante redimensionamento correto em layouts flex/responsivos
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        mapRef.current?.resize();
      });
      resizeObserver.observe(containerRef.current);
    }

    // Carrega o GeoJSON oficial dos 7 biomas do IBGE
    fetch("/data/geojson/biomas-brasil.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: FeatureCollection<Geometry> | null) => {
        if (!data) return;
        biomesGeoJsonRef.current = data;
        if (mapRef.current) {
          const src = mapRef.current.getSource("biomas-ibge") as
            | maplibregl.GeoJSONSource
            | undefined;
          if (src) {
            src.setData(data);
          }
        }
      })
      .catch(() => {});

    // Carrega o GeoJSON oficial das 27 UFs do IBGE para limites estaduais limpos
    fetch("/data/geojson/estados-brasil.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: FeatureCollection<Geometry> | null) => {
        if (!data) return;
        ufsGeoJsonRef.current = data;
        if (mapRef.current) {
          const src = mapRef.current.getSource("estados-ibge") as
            | maplibregl.GeoJSONSource
            | undefined;
          if (src) {
            src.setData(data);
          }
        }
      })
      .catch(() => {});

    return () => {
      resizeObserver?.disconnect();
      styleLoadedRef.current = false;
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Troca de estilo base (Claro / Escuro) acompanhando o tema do site
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const nextTheme = theme === "light" ? "light" : "dark";
    if (currentStyleThemeRef.current === nextTheme) return;
    currentStyleThemeRef.current = nextTheme;
    styleLoadedRef.current = false;
    map.setStyle(MAP_STYLES[nextTheme]);
  }, [theme]);

  // Atualiza dados dos focos quando o filtro/API muda
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyData = () => {
      const rawSrc = map.getSource("focos-raw") as
        | maplibregl.GeoJSONSource
        | undefined;
      if (rawSrc) {
        rawSrc.setData(geojson);
      }
    };

    if (styleLoadedRef.current || map.isStyleLoaded()) {
      applyData();
    } else {
      map.once("load", applyData);
    }
  }, [geojson]);

  // Atualiza visibilidade das camadas
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleLoadedRef.current) return;

    const setVis = (layerId: string, visible: boolean) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
      }
    };

    setVis("focos-glow", camadas.focos);
    setVis("focos-unclustered", camadas.focos);
    setVis("biomas-fill", camadas.biomas);
    setVis("biomas-outline", camadas.biomas);
    setVis("nasa-gibs-layer", camadas.gibs);
    setVis("focos-heatmap", camadas.heatmap);
  }, [camadas]);

  // Atualiza destaque do foco selecionado
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleLoadedRef.current) return;
    if (map.getLayer("focos-selected-ring")) {
      map.setFilter("focos-selected-ring", [
        "==",
        ["get", "id"],
        selectedFoco?.id ?? "",
      ]);
    }
  }, [selectedFoco]);

  // Atualiza destaque do bioma filtrado
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleLoadedRef.current) return;
    if (map.getLayer("biomas-fill")) {
      if (selectedBiome === "all" || selectedBiome === "fora_dos_biomas") {
        map.setPaintProperty(
          "biomas-fill",
          "fill-opacity",
          theme === "light" ? 0.2 : 0.16,
        );
      } else {
        map.setPaintProperty("biomas-fill", "fill-opacity", [
          "case",
          ["==", ["get", "id"], selectedBiome],
          0.35,
          0.06,
        ]);
      }
    }
  }, [selectedBiome, theme]);

  // Atualiza marcador de "Meu local"
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleLoadedRef.current) return;
    const src = map.getSource("user-location") as
      | maplibregl.GeoJSONSource
      | undefined;
    if (!src) return;
    if (!userLocation) {
      src.setData({ type: "FeatureCollection", features: [] });
    } else {
      src.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [userLocation.lon, userLocation.lat],
            },
            properties: {},
          },
        ],
      });
    }
  }, [userLocation]);

  // Animação de voo (flyTo) quando busca cidade, clica em bioma ou "Meu local"
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyToTarget) return;
    map.flyTo({
      center: [flyToTarget.lon, flyToTarget.lat],
      zoom: flyToTarget.zoom,
      duration: prefersReducedMotion ? 0 : 900,
      essential: true,
    });
  }, [flyToTarget, prefersReducedMotion]);

  return (
    <div className="relative h-full w-full min-h-[480px]">
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
        role="region"
        aria-label="Mapa interativo de focos de calor do Brasil com dados do NASA FIRMS"
      />
    </div>
  );
}
