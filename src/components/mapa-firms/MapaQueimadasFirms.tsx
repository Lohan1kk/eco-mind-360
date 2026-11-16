"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Crosshair,
  Download,
  ExternalLink,
  Filter,
  Flame,
  Info,
  Layers,
  Loader2,
  MapPin,
  RefreshCw,
  RotateCcw,
  Satellite,
  Search,
  Sparkles,
  Table2,
  Trees,
  X,
} from "lucide-react";
import { BIOMES_LIST } from "@/data/biomes";
import type { BiomeId } from "@/data/types";
import {
  BIOME_COLORS,
  BRAZIL_UFS,
  INTENSIDADE_META,
  type IntensidadeFoco,
} from "@/lib/firms/constants";
import { analyzeNearbyFocos } from "@/lib/firms/geo-utils";
import type {
  FiltroFocos,
  FocoCalor,
  RespostaApiFocos,
} from "@/lib/firms/types";
import {
  DEFAULT_MAP_URL_STATE,
  parseMapUrlState,
  serializeMapUrlState,
  type MapUrlState,
} from "@/lib/firms/url-state";
import {
  FreshnessSeal,
  formatMinutesAgo,
  formatPeriodoLabel,
} from "@/components/firms/FreshnessSeal";
import { getDefaultGibsDate } from "./FirmsMapCanvas";

const DynamicFirmsMapCanvas = dynamic(() => import("./FirmsMapCanvas"), {
  ssr: false,
  loading: () => <MapaCanvasSkeleton />,
});

function MapaCanvasSkeleton() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[var(--background)] p-6 text-center"
      role="status"
      aria-label="Carregando motor cartográfico"
    >
      <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" aria-hidden="true" />
      <p className="text-sm font-medium text-[var(--foreground)]">
        Inicializando atlas vetorial e telemetria NASA FIRMS...
      </p>
      <p className="text-xs font-mono text-[var(--muted)]">
        Carregando malha oficial do IBGE e sensores VIIRS (375 m) / MODIS (1 km)
      </p>
    </div>
  );
}

const BIOME_CENTERS: Record<string, { lat: number; lon: number; zoom: number }> = {
  all: { lat: -14.235, lon: -51.925, zoom: 4 },
  amazonia: { lat: -4.2, lon: -60.5, zoom: 5 },
  cerrado: { lat: -14.0, lon: -48.0, zoom: 5.2 },
  mata_atlantica: { lat: -20.5, lon: -44.0, zoom: 5.2 },
  caatinga: { lat: -8.5, lon: -39.5, zoom: 5.8 },
  pampa: { lat: -30.2, lon: -53.5, zoom: 6.2 },
  pantanal: { lat: -18.5, lon: -56.8, zoom: 6.2 },
  costeiro_marinho: { lat: -15.5, lon: -38.5, zoom: 4.8 },
};

interface IbgeMunicipioItem {
  id: number;
  nome: string;
  ufSigla: string;
  ufNome: string;
}

let cachedMunicipiosMemory: IbgeMunicipioItem[] | null = null;
const geocodeCacheMemory = new Map<string, { lat: number; lon: number }>();
const reverseMunicipioCache = new Map<string, string>();

/**
 * Contador numérico com transição suave que respeita `prefers-reduced-motion`.
 */
function AnimatedCount({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (typeof window === "undefined") {
      setDisplay(value);
      return;
    }
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const totalFrames = 14;
    const start = display;
    const delta = value - start;
    if (delta === 0) return;

    const timer = window.setInterval(() => {
      frame += 1;
      if (frame >= totalFrames) {
        setDisplay(value);
        window.clearInterval(timer);
      } else {
        const progress = frame / totalFrames;
        setDisplay(Math.round(start + delta * (1 - Math.pow(1 - progress, 2))));
      }
    }, 18);

    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{display.toLocaleString("pt-BR")}</>;
}

/**
 * Ícone geométrico + cor para distinguir classes de intensidade sem depender apenas de cor (WCAG 2.2 AA).
 */
function IntensityShapeBadge({
  intensidade,
  size = "sm",
}: {
  intensidade: IntensidadeFoco;
  size?: "sm" | "md";
}) {
  const meta = INTENSIDADE_META[intensidade];
  const symbol =
    meta.shape === "diamond"
      ? "◆"
      : meta.shape === "triangle"
        ? "▲"
        : meta.shape === "square"
          ? "■"
          : "●";

  return (
    <span
      className={`inline-flex items-center justify-center font-mono leading-none ${
        size === "md" ? "text-sm" : "text-xs"
      }`}
      style={{ color: meta.colorDark }}
      aria-hidden="true"
      title={`${meta.label} (${meta.faixa})`}
    >
      {symbol}
    </span>
  );
}

export default function MapaQueimadasFirms() {
  const [urlReady, setUrlReady] = useState(false);
  const [mapState, setMapState] = useState<MapUrlState>(DEFAULT_MAP_URL_STATE);
  const [apiData, setApiData] = useState<RespostaApiFocos | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [webGlFailed, setWebGlFailed] = useState(false);

  const [selectedFoco, setSelectedFoco] = useState<FocoCalor | null>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<string | null>(null);

  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [showLayersPopover, setShowLayersPopover] = useState(false);
  const [showLegendModal, setShowLegendModal] = useState(false);

  // Mobile bottom sheet com 3 alturas: 'collapsed' (recolhido), 'medium' (médio), 'expanded' (expandido)
  const [sheetHeight, setSheetHeight] = useState<"collapsed" | "medium" | "expanded">("medium");

  // Busca por cidade/UF com debounce
  const [cityQuery, setCityQuery] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<IbgeMunicipioItem[]>([]);
  const [searchingCity, setSearchingCity] = useState(false);

  // Botão "Meu local" (exclusivo no cliente)
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [geoStatusMsg, setGeoStatusMsg] = useState<string | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);

  // FlyTo command para o MapLibre
  const [flyToTarget, setFlyToTarget] = useState<{
    lat: number;
    lon: number;
    zoom: number;
    token: number;
  } | null>(null);

  // Botão Copiar Link
  const [copiedLink, setCopiedLink] = useState(false);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  const abortControllerRef = useRef<AbortController | null>(null);

  // 1. Restaura filtros, posição e camadas pela URL ao abrir a página
  useEffect(() => {
    if (typeof window === "undefined") return;
    const restored = parseMapUrlState(window.location.search);
    setMapState(restored);
    setUrlReady(true);
  }, []);

  // 2. Sincroniza estado com a URL (query string) sem recarregar a página
  useEffect(() => {
    if (!urlReady || typeof window === "undefined") return;
    const qs = serializeMapUrlState(mapState);
    const nextUrl = `${window.location.pathname}?${qs}`;
    window.history.replaceState(null, "", nextUrl);
  }, [mapState, urlReady]);

  // Atualiza relógio para o selo de frescor
  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);

  // 3. Busca dados reais na rota /api/focos
  const fetchFocos = useCallback(
    async (filtros: FiltroFocos, forceRefresh = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setFetchError(null);

      try {
        const params = new URLSearchParams();
        params.set("periodo", filtros.periodo);
        if (filtros.bioma !== "all") params.set("bioma", filtros.bioma);
        if (filtros.uf !== "all") params.set("uf", filtros.uf);
        if (filtros.frpMin > 0) params.set("frpMin", String(filtros.frpMin));
        if (filtros.intensidadeMin !== "all") {
          params.set("intensidadeMin", filtros.intensidadeMin);
        }
        if (filtros.fonte !== "all") params.set("fonte", filtros.fonte);
        if (filtros.diaNoite !== "all") params.set("diaNoite", filtros.diaNoite);
        if (forceRefresh) params.set("refresh", "1");

        const res = await fetch(`/api/focos?${params.toString()}`, {
          signal: controller.signal,
          cache: forceRefresh ? "no-store" : "default",
        });

        if (!res.ok) {
          throw new Error("Não foi possível consultar a camada de focos no momento.");
        }

        const json = (await res.json()) as RespostaApiFocos;
        setApiData(json);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setFetchError(
          err instanceof Error
            ? err.message
            : "Falha ao carregar os dados orbitais do NASA FIRMS.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!urlReady) return;
    void fetchFocos(mapState.filtros, false);
  }, [urlReady, mapState.filtros, fetchFocos]);

  // Lookup reverso opcional de município ao selecionar um foco
  useEffect(() => {
    if (!selectedFoco) {
      setSelectedMunicipio(null);
      return;
    }
    if (selectedFoco.municipio) {
      setSelectedMunicipio(selectedFoco.municipio);
      return;
    }
    const key = `${selectedFoco.latitude.toFixed(2)}:${selectedFoco.longitude.toFixed(2)}`;
    const cached = reverseMunicipioCache.get(key);
    if (cached) {
      setSelectedMunicipio(cached);
      return;
    }

    let cancelled = false;
    setSelectedMunicipio(null);
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedFoco.latitude}&lon=${selectedFoco.longitude}&zoom=10&addressdetails=1`,
      { headers: { "Accept-Language": "pt-BR" } },
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d?.address) return;
        const muni =
          d.address.city ||
          d.address.town ||
          d.address.municipality ||
          d.address.village ||
          null;
        if (muni) {
          reverseMunicipioCache.set(key, String(muni));
          setSelectedMunicipio(String(muni));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [selectedFoco]);

  // Autocomplete de municípios do IBGE com debounce de 300 ms e cache
  useEffect(() => {
    const q = cityQuery.trim().toLowerCase();
    if (q.length < 2) {
      setCitySuggestions([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      setSearchingCity(true);
      try {
        if (!cachedMunicipiosMemory) {
          const res = await fetch(
            "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome",
          );
          if (res.ok) {
            const raw = (await res.json()) as Array<{
              id: number;
              nome: string;
              microrregiao?: { mesorregiao?: { UF?: { sigla?: string; nome?: string } } };
              "regiao-imediata"?: {
                "regiao-intermediaria"?: { UF?: { sigla?: string; nome?: string } };
              };
            }>;
            cachedMunicipiosMemory = raw.map((m) => {
              const ufSigla =
                m.microrregiao?.mesorregiao?.UF?.sigla ||
                m["regiao-imediata"]?.["regiao-intermediaria"]?.UF?.sigla ||
                "BR";
              const ufNome =
                m.microrregiao?.mesorregiao?.UF?.nome ||
                m["regiao-imediata"]?.["regiao-intermediaria"]?.UF?.nome ||
                "";
              return {
                id: m.id,
                nome: m.nome,
                ufSigla,
                ufNome,
              };
            });
          }
        }

        const list = cachedMunicipiosMemory ?? [];
        const matches = list
          .filter(
            (m) =>
              m.nome.toLowerCase().includes(q) ||
              `${m.nome.toLowerCase()} ${m.ufSigla.toLowerCase()}`.includes(q) ||
              m.ufSigla.toLowerCase() === q,
          )
          .slice(0, 8);
        setCitySuggestions(matches);
      } catch {
        setCitySuggestions([]);
      } finally {
        setSearchingCity(false);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [cityQuery]);

  const handleSelectMunicipio = async (item: IbgeMunicipioItem) => {
    setCityQuery(`${item.nome} - ${item.ufSigla}`);
    setCitySuggestions([]);

    const cacheKey = `${item.nome}|${item.ufSigla}`;
    const cachedCoord = geocodeCacheMemory.get(cacheKey);
    if (cachedCoord) {
      setFlyToTarget({
        lat: cachedCoord.lat,
        lon: cachedCoord.lon,
        zoom: 9.5,
        token: Date.now(),
      });
      return;
    }

    try {
      const q = encodeURIComponent(`${item.nome}, ${item.ufSigla}, Brasil`);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&limit=1&q=${q}`,
      );
      if (res.ok) {
        const arr = (await res.json()) as Array<{ lat: string; lon: string }>;
        if (arr[0]) {
          const lat = Number.parseFloat(arr[0].lat);
          const lon = Number.parseFloat(arr[0].lon);
          if (Number.isFinite(lat) && Number.isFinite(lon)) {
            geocodeCacheMemory.set(cacheKey, { lat, lon });
            setFlyToTarget({ lat, lon, zoom: 9.5, token: Date.now() });
            return;
          }
        }
      }
    } catch {
      // fallback para o centro da UF
    }

    const ufObj = BRAZIL_UFS.find((u) => u.sigla === item.ufSigla);
    if (ufObj) {
      setFlyToTarget({
        lat: ufObj.center[0],
        lon: ufObj.center[1],
        zoom: 6.5,
        token: Date.now(),
      });
    }
  };

  // Manipuladores de filtro
  const updateFiltro = <K extends keyof FiltroFocos>(
    key: K,
    value: FiltroFocos[K],
  ) => {
    setMapState((prev) => ({
      ...prev,
      filtros: {
        ...prev.filtros,
        [key]: value,
      },
    }));

    if (key === "bioma" && typeof value === "string") {
      const center = BIOME_CENTERS[value];
      if (center) {
        setFlyToTarget({
          lat: center.lat,
          lon: center.lon,
          zoom: center.zoom,
          token: Date.now(),
        });
      }
    }

    if (key === "uf" && typeof value === "string" && value !== "all") {
      const ufInfo = BRAZIL_UFS.find((u) => u.sigla === value);
      if (ufInfo) {
        setFlyToTarget({
          lat: ufInfo.center[0],
          lon: ufInfo.center[1],
          zoom: 6.2,
          token: Date.now(),
        });
      }
    }
  };

  const resetFiltros = () => {
    setMapState((prev) => ({
      ...prev,
      filtros: { ...DEFAULT_MAP_URL_STATE.filtros },
    }));
    setFlyToTarget({
      lat: DEFAULT_MAP_URL_STATE.lat,
      lon: DEFAULT_MAP_URL_STATE.lon,
      zoom: DEFAULT_MAP_URL_STATE.zoom,
      token: Date.now(),
    });
  };

  const toggleCamada = (key: keyof MapUrlState["camadas"]) => {
    setMapState((prev) => ({
      ...prev,
      camadas: {
        ...prev.camadas,
        [key]: !prev.camadas[key],
      },
    }));
  };

  const handleMoveEnd = useCallback((lat: number, lon: number, zoom: number) => {
    setMapState((prev) => ({
      ...prev,
      lat: Number(lat.toFixed(4)),
      lon: Number(lon.toFixed(4)),
      zoom: Number(zoom.toFixed(2)),
    }));
  }, []);

  const handleCopyLink = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  // Botão "Meu local" (100% no navegador, nunca enviado ao servidor nem salvo)
  const handleMeuLocal = () => {
    setGeoStatusMsg(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatusMsg(
        "Seu navegador não oferece suporte a geolocalização. Você pode buscar sua cidade pelo campo de busca acima.",
      );
      return;
    }

    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocatingUser(false);
        const uLat = Number(pos.coords.latitude.toFixed(4));
        const uLon = Number(pos.coords.longitude.toFixed(4));
        setUserLocation({ lat: uLat, lon: uLon });
        setFlyToTarget({ lat: uLat, lon: uLon, zoom: 8.5, token: Date.now() });
      },
      (err) => {
        setLocatingUser(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoStatusMsg(
            "Permissão de localização negada. Para ver focos num raio de 50 km, autorize o acesso à localização no navegador (sua posição nunca sai do seu aparelho).",
          );
        } else {
          setGeoStatusMsg(
            "Não foi possível obter sua localização atual. Tente usar a busca por cidade ou UF.",
          );
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };

  const focos = useMemo(() => apiData?.focos ?? [], [apiData]);
  const resumo = apiData?.resumo ?? null;

  const focosById = useMemo(() => {
    const map = new Map<string, FocoCalor>();
    for (const f of focos) {
      map.set(f.id, f);
    }
    return map;
  }, [focos]);

  // Análise de raio de 50 km para "Meu local"
  const nearbyStats = useMemo(() => {
    if (!userLocation) return null;
    return analyzeNearbyFocos(userLocation.lat, userLocation.lon, focos, 50);
  }, [userLocation, focos]);

  // Ranking por bioma ordenado por quantidade de focos
  const biomeRanking = useMemo(() => {
    if (!resumo) return [];
    return BIOMES_LIST.map((b) => {
      const r = resumo.porBioma[b.id as BiomeId];
      return {
        id: b.id as BiomeId,
        nome: b.name,
        color: BIOME_COLORS[b.id as BiomeId] || b.color,
        total: r?.total ?? 0,
        frpMaximo: r?.frpMaximo ?? 0,
      };
    }).sort((a, b) => b.total - a.total);
  }, [resumo]);

  // 20 focos mais intensos para a tabela acessível (Passo 2.12)
  const top20Focos = useMemo(() => {
    return [...focos]
      .sort((a, b) => b.frp - a.frp || Date.parse(b.dataHoraUtc) - Date.parse(a.dataHoraUtc))
      .slice(0, 20);
  }, [focos]);

  // Exportação CSV com cabeçalho documentando fonte, período e data
  const handleExportCsv = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const updatedIso = resumo?.atualizadoEm ?? new Date().toISOString();
    const headerComments = [
      `# Fonte: ${resumo?.fonte ?? "NASA FIRMS (VIIRS 375 m / MODIS 1 km)"}`,
      `# Periodo: ${formatPeriodoLabel(mapState.filtros.periodo)} (${mapState.filtros.periodo})`,
      `# Atualizado_em_UTC: ${updatedIso}`,
      `# Criterio_Intensidade_EcoMind360: Critico>=100MW | Alto>=40MW | Medio>=15MW | Baixo<15MW`,
      "id,latitude,longitude,data_hora_utc,satelite,instrumento,fonte_firms,confianca,frp_mw,intensidade,dia_noite,bioma,uf",
    ];

    const rows = top20Focos.map((f) =>
      [
        f.id,
        f.latitude.toFixed(4),
        f.longitude.toFixed(4),
        f.dataHoraUtc,
        `"${f.satelite}"`,
        f.instrumento,
        f.fonte,
        f.confianca,
        f.frp.toFixed(1),
        f.intensidade,
        f.diaNoite,
        `"${f.biomaNome}"`,
        f.uf ?? "",
      ].join(","),
    );

    const csvText = [...headerComments, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csvText], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `focos_queimadas_ecomind360_${mapState.filtros.periodo}_${todayStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters =
    mapState.filtros.bioma !== "all" ||
    mapState.filtros.uf !== "all" ||
    mapState.filtros.frpMin > 0 ||
    mapState.filtros.intensidadeMin !== "all" ||
    mapState.filtros.fonte !== "all" ||
    mapState.filtros.diaNoite !== "all";

  const gibsDateLabel = getDefaultGibsDate();

  return (
    <div className="flex flex-col w-full bg-[var(--background)] text-[var(--foreground)]">
      {/* Anúncio acessível (WCAG 2.2 AA aria-live) quando os filtros mudam */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {loading
          ? "Carregando focos de calor do NASA FIRMS..."
          : resumo
            ? `${resumo.total} focos de calor carregados para o período ${formatPeriodoLabel(
                mapState.filtros.periodo,
              )}. Fonte: ${resumo.fonte}.`
            : ""}
      </div>

      {/* SEÇÃO 1: CONTAINER DO MAPA EM TELA QUASE CHEIA + PAINEL LATERAL / BOTTOM SHEET */}
      <section
        aria-label="Atlas Interativo de Focos de Calor"
        className="relative flex flex-col lg:flex-row w-full h-[calc(100dvh-3.5rem)] min-h-[540px] overflow-hidden border-b border-[var(--border)]"
      >
        {/* ÁREA DO MAPA */}
        <div className="relative flex-1 h-full w-full overflow-hidden">
          {webGlFailed ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[var(--surface)] p-6 text-center">
              <AlertTriangle className="h-10 w-10 text-[var(--warning)]" aria-hidden="true" />
              <div className="max-w-md space-y-2">
                <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  Aceleração gráfica (WebGL) indisponível neste dispositivo
                </h2>
                <p className="text-xs leading-relaxed text-[var(--foreground-secondary)]">
                  O mapa interativo utiliza WebGL para renderizar milhares de focos a 60 quadros por segundo.
                  Você pode consultar e exportar todos os dados reais diretamente na{" "}
                  <a
                    href="#tabela-alternativa-focos"
                    className="font-semibold text-[var(--primary)] underline"
                  >
                    tabela acessível de focos abaixo
                  </a>
                  .
                </p>
              </div>
            </div>
          ) : (
            <DynamicFirmsMapCanvas
              geojson={
                apiData?.geojson ?? {
                  type: "FeatureCollection",
                  features: [],
                }
              }
              focosById={focosById}
              lat={mapState.lat}
              lon={mapState.lon}
              zoom={mapState.zoom}
              camadas={mapState.camadas}
              selectedFoco={selectedFoco}
              selectedBiome={mapState.filtros.bioma}
              userLocation={userLocation}
              flyToTarget={flyToTarget}
              onMoveEnd={handleMoveEnd}
              onSelectFoco={(f) => setSelectedFoco(f)}
              onWebGlError={() => setWebGlFailed(true)}
            />
          )}

          {/* BARRA FLUTUANTE SUPERIOR (ESTILO ATLAS MODERNO) */}
          <div className="pointer-events-none absolute inset-x-2.5 top-2.5 z-20 flex flex-col gap-2 sm:inset-x-4 sm:top-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Grupo Esquerdo: Selo de Frescor + Seletor Rápido de Período */}
              <div className="pointer-events-auto flex flex-wrap items-center gap-2 rounded-[12px] border border-[var(--border)] bg-[var(--surface)]/95 p-1.5 shadow-soft backdrop-blur-md">
                {/* Período: 24h, 48h, 7d */}
                <div
                  className="inline-flex items-center rounded-[8px] bg-[var(--background-secondary)] p-0.5"
                  role="group"
                  aria-label="Período de monitoramento"
                >
                  {(
                    [
                      { id: "24h", label: "24h" },
                      { id: "48h", label: "48h" },
                      { id: "7d", label: "7 dias" },
                    ] as const
                  ).map((p) => {
                    const active = mapState.filtros.periodo === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => updateFiltro("periodo", p.id)}
                        aria-pressed={active}
                        className={`min-h-[38px] min-w-[44px] rounded-[6px] px-2.5 py-1 text-xs font-mono font-medium transition-colors ${
                          active
                            ? "bg-[var(--primary)] text-white dark:text-[#101512] font-semibold"
                            : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>

                {/* Selo de Frescor sempre visível */}
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      resumo?.desatualizado
                        ? "bg-[var(--warning)]"
                        : "bg-[var(--success)]"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="text-[var(--foreground)] font-medium">
                    Fonte: NASA FIRMS (VIIRS/MODIS)
                  </span>
                  <span className="text-[var(--muted)]" aria-hidden="true">·</span>
                  <span className="text-[var(--foreground-secondary)]">
                    {loading
                      ? "atualizando..."
                      : `atualizado ${formatMinutesAgo(resumo?.atualizadoEm, nowMs)}`}
                  </span>
                  {resumo?.desatualizado && resumo.atualizadoEm && (
                    <span className="rounded bg-[#A9A17A]/20 px-1.5 py-0.5 text-[10px] text-[var(--warning)]">
                      Cache ({new Date(resumo.atualizadoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })})
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => void fetchFocos(mapState.filtros, true)}
                  disabled={refreshing || loading}
                  aria-label="Atualizar focos do satélite agora"
                  title="Atualizar dados agora"
                  className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] disabled:opacity-50"
                >
                  <RefreshCw
                    size={14}
                    className={refreshing || loading ? "animate-spin text-[var(--primary)]" : ""}
                  />
                </button>
              </div>

              {/* Grupo Direito: Busca por Cidade/UF + Filtros + Camadas + Meu Local + Copiar Link */}
              <div className="pointer-events-auto flex flex-wrap items-center gap-1.5">
                {/* Busca por Cidade / UF */}
                <div className="relative">
                  <div className="flex items-center rounded-[10px] border border-[var(--border)] bg-[var(--surface)]/95 shadow-soft backdrop-blur-md">
                    <Search
                      size={14}
                      className="ml-3 shrink-0 text-[var(--muted)]"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={cityQuery}
                      onChange={(e) => setCityQuery(e.target.value)}
                      placeholder="Buscar cidade ou UF..."
                      aria-label="Buscar cidade ou UF para centralizar o mapa"
                      className="min-h-[44px] w-40 sm:w-52 bg-transparent px-2.5 py-1.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
                    />
                    {cityQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setCityQuery("");
                          setCitySuggestions([]);
                        }}
                        aria-label="Limpar busca de cidade"
                        className="mr-1.5 flex h-7 w-7 items-center justify-center rounded text-[var(--muted)] hover:text-[var(--foreground)]"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {citySuggestions.length > 0 && (
                    <ul
                      role="listbox"
                      aria-label="Sugestões de municípios do IBGE"
                      className="absolute left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-1 shadow-lift z-30"
                    >
                      {citySuggestions.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => void handleSelectMunicipio(item)}
                            className="flex w-full items-center justify-between rounded-[7px] px-3 py-2 text-left text-xs text-[var(--foreground)] hover:bg-[var(--surface-elevated)]"
                          >
                            <span className="font-medium truncate">{item.nome}</span>
                            <span className="ml-2 shrink-0 rounded bg-[var(--surface-elevated)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--sage)]">
                              {item.ufSigla}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {searchingCity && citySuggestions.length === 0 && cityQuery.length >= 2 && (
                    <div className="absolute left-0 right-0 top-full mt-1 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[11px] text-[var(--muted)] shadow-soft">
                      Consultando malha municipal do IBGE...
                    </div>
                  )}
                </div>

                {/* Botão de Filtros Avançados */}
                <button
                  type="button"
                  onClick={() => {
                    setShowFiltersPanel((v) => !v);
                    setShowLayersPopover(false);
                  }}
                  aria-expanded={showFiltersPanel}
                  aria-label="Abrir painel de filtros"
                  className={`flex min-h-[44px] items-center gap-1.5 rounded-[10px] border px-3 py-2 text-xs font-medium shadow-soft backdrop-blur-md transition-colors ${
                    showFiltersPanel || hasActiveFilters
                      ? "border-[var(--primary)] bg-[var(--surface-elevated)] text-[var(--foreground)]"
                      : "border-[var(--border)] bg-[var(--surface)]/95 text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Filter size={14} className="text-[var(--primary)]" />
                  <span>Filtros</span>
                  {hasActiveFilters && (
                    <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                  )}
                </button>

                {/* Botão de Camadas */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLayersPopover((v) => !v);
                      setShowFiltersPanel(false);
                    }}
                    aria-expanded={showLayersPopover}
                    aria-label="Alternar camadas do mapa"
                    className={`flex min-h-[44px] items-center gap-1.5 rounded-[10px] border px-3 py-2 text-xs font-medium shadow-soft backdrop-blur-md transition-colors ${
                      showLayersPopover
                        ? "border-[var(--primary)] bg-[var(--surface-elevated)] text-[var(--foreground)]"
                        : "border-[var(--border)] bg-[var(--surface)]/95 text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Layers size={14} className="text-[var(--primary)]" />
                    <span className="hidden sm:inline">Camadas</span>
                  </button>

                  {showLayersPopover && (
                    <div
                      role="dialog"
                      aria-label="Painel de camadas cartográficas"
                      className="absolute right-0 top-full mt-2 w-72 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-lift z-30 space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--sage)]">
                          Camadas do Atlas
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowLayersPopover(false)}
                          aria-label="Fechar painel de camadas"
                          className="p-1 text-[var(--muted)] hover:text-[var(--foreground)]"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <label className="flex min-h-[40px] cursor-pointer items-center justify-between gap-2 rounded-[8px] px-2 py-1.5 hover:bg-[var(--surface-elevated)]">
                        <span className="flex items-center gap-2 font-medium text-[var(--foreground)]">
                          <Flame size={14} className="text-[#FB923C]" />
                          Focos de calor (FRP)
                        </span>
                        <input
                          type="checkbox"
                          checked={mapState.camadas.focos}
                          onChange={() => toggleCamada("focos")}
                          className="h-4 w-4 accent-[var(--primary)]"
                        />
                      </label>

                      <label className="flex min-h-[40px] cursor-pointer items-center justify-between gap-2 rounded-[8px] px-2 py-1.5 hover:bg-[var(--surface-elevated)]">
                        <span className="flex items-center gap-2 font-medium text-[var(--foreground)]">
                          <Trees size={14} className="text-[var(--primary)]" />
                          Contorno dos 7 Biomas (IBGE)
                        </span>
                        <input
                          type="checkbox"
                          checked={mapState.camadas.biomas}
                          onChange={() => toggleCamada("biomas")}
                          className="h-4 w-4 accent-[var(--primary)]"
                        />
                      </label>

                      <label className="flex min-h-[40px] cursor-pointer items-center justify-between gap-2 rounded-[8px] px-2 py-1.5 hover:bg-[var(--surface-elevated)]">
                        <div>
                          <span className="flex items-center gap-2 font-medium text-[var(--foreground)]">
                            <Satellite size={14} className="text-[#38BDF8]" />
                            Satélite NASA GIBS (WMTS)
                          </span>
                          <span className="block text-[10px] font-mono text-[var(--muted)] pl-5">
                            VIIRS True Color · mosaico {gibsDateLabel}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={mapState.camadas.gibs}
                          onChange={() => toggleCamada("gibs")}
                          className="h-4 w-4 accent-[var(--primary)]"
                        />
                      </label>

                      <label className="flex min-h-[40px] cursor-pointer items-center justify-between gap-2 rounded-[8px] px-2 py-1.5 hover:bg-[var(--surface-elevated)]">
                        <div>
                          <span className="flex items-center gap-2 font-medium text-[var(--foreground)]">
                            <Sparkles size={14} className="text-[#EF4444]" />
                            Mapa de Densidade (Heatmap)
                          </span>
                          <span className="block text-[10px] font-mono text-[var(--muted)] pl-5">
                            Mancha térmica ponderada por FRP
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={mapState.camadas.heatmap}
                          onChange={() => toggleCamada("heatmap")}
                          className="h-4 w-4 accent-[var(--primary)]"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Botão Meu Local */}
                <button
                  type="button"
                  onClick={handleMeuLocal}
                  disabled={locatingUser}
                  aria-label="Centralizar no meu local e calcular focos num raio de 50 km"
                  title="Meu local (focos num raio de 50 km)"
                  className="flex min-h-[44px] items-center gap-1.5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)]/95 px-3 py-2 text-xs font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] shadow-soft backdrop-blur-md transition-colors"
                >
                  <Crosshair
                    size={14}
                    className={locatingUser ? "animate-spin text-[var(--primary)]" : "text-[var(--primary)]"}
                  />
                  <span className="hidden md:inline">Meu local</span>
                </button>

                {/* Botão Copiar Link */}
                <button
                  type="button"
                  onClick={() => void handleCopyLink()}
                  aria-label="Copiar link compartilhável com os filtros e posição atuais"
                  className="flex min-h-[44px] items-center gap-1.5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)]/95 px-3 py-2 text-xs font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] shadow-soft backdrop-blur-md transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check size={14} className="text-[var(--success)]" />
                      <span className="text-[var(--success)] font-semibold">Link copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="text-[var(--primary)]" />
                      <span className="hidden md:inline">Copiar link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* PAINEL DE FILTROS EXPANSÍVEL */}
            {showFiltersPanel && (
              <div
                role="region"
                aria-label="Filtros detalhados de focos de calor"
                className="pointer-events-auto rounded-[12px] border border-[var(--border)] bg-[var(--surface)]/98 p-4 shadow-lift backdrop-blur-xl"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
                  {/* Bioma */}
                  <label className="space-y-1">
                    <span className="block font-mono text-[10px] uppercase text-[var(--muted)]">
                      Bioma / Ambiente
                    </span>
                    <select
                      value={mapState.filtros.bioma}
                      onChange={(e) =>
                        updateFiltro("bioma", e.target.value as FiltroFocos["bioma"])
                      }
                      className="min-h-[42px] w-full rounded-[8px] border border-[var(--border)] bg-[var(--background-secondary)] px-2.5 py-1.5 text-xs text-[var(--foreground)]"
                    >
                      <option value="all">Todos os 7 Ambientes</option>
                      {BIOMES_LIST.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                      <option value="fora_dos_biomas">Fora dos biomas (Oceano/Fronteira)</option>
                    </select>
                  </label>

                  {/* Estado (UF) */}
                  <label className="space-y-1">
                    <span className="block font-mono text-[10px] uppercase text-[var(--muted)]">
                      Estado (UF - IBGE)
                    </span>
                    <select
                      value={mapState.filtros.uf}
                      onChange={(e) => updateFiltro("uf", e.target.value)}
                      className="min-h-[42px] w-full rounded-[8px] border border-[var(--border)] bg-[var(--background-secondary)] px-2.5 py-1.5 text-xs text-[var(--foreground)]"
                    >
                      <option value="all">Todas as 27 UFs</option>
                      {BRAZIL_UFS.map((u) => (
                        <option key={u.sigla} value={u.sigla}>
                          {u.sigla} — {u.nome}
                        </option>
                      ))}
                    </select>
                  </label>

                  {/* Classe de Intensidade Mínima */}
                  <label className="space-y-1">
                    <span className="block font-mono text-[10px] uppercase text-[var(--muted)]">
                      Intensidade mínima
                    </span>
                    <select
                      value={mapState.filtros.intensidadeMin}
                      onChange={(e) =>
                        updateFiltro(
                          "intensidadeMin",
                          e.target.value as FiltroFocos["intensidadeMin"],
                        )
                      }
                      className="min-h-[42px] w-full rounded-[8px] border border-[var(--border)] bg-[var(--background-secondary)] px-2.5 py-1.5 text-xs text-[var(--foreground)]"
                    >
                      <option value="all">Todas as classes</option>
                      <option value="medio">Médio ou maior (≥ 15 MW)</option>
                      <option value="alto">Alto ou maior (≥ 40 MW)</option>
                      <option value="critico">Apenas Crítico (≥ 100 MW)</option>
                    </select>
                  </label>

                  {/* FRP Mínimo numérico */}
                  <label className="space-y-1">
                    <span className="block font-mono text-[10px] uppercase text-[var(--muted)]">
                      FRP mínimo (MW)
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={1000}
                      step={5}
                      value={mapState.filtros.frpMin}
                      onChange={(e) =>
                        updateFiltro("frpMin", Math.max(0, Number(e.target.value) || 0))
                      }
                      className="min-h-[42px] w-full rounded-[8px] border border-[var(--border)] bg-[var(--background-secondary)] px-2.5 py-1.5 text-xs font-mono text-[var(--foreground)]"
                    />
                  </label>

                  {/* Fonte / Satélite */}
                  <label className="space-y-1">
                    <span className="block font-mono text-[10px] uppercase text-[var(--muted)]">
                      Sensor / Satélite
                    </span>
                    <select
                      value={mapState.filtros.fonte}
                      onChange={(e) =>
                        updateFiltro("fonte", e.target.value as FiltroFocos["fonte"])
                      }
                      className="min-h-[42px] w-full rounded-[8px] border border-[var(--border)] bg-[var(--background-secondary)] px-2.5 py-1.5 text-xs text-[var(--foreground)]"
                    >
                      <option value="all">VIIRS (375 m) + MODIS (1 km)</option>
                      <option value="VIIRS">Apenas VIIRS (375 m)</option>
                      <option value="VIIRS_NOAA20_NRT">VIIRS NOAA-20 (375 m)</option>
                      <option value="VIIRS_NOAA21_NRT">VIIRS NOAA-21 (375 m)</option>
                      <option value="VIIRS_SNPP_NRT">VIIRS Suomi-NPP (375 m)</option>
                      <option value="MODIS_NRT">MODIS Terra/Aqua (1 km)</option>
                    </select>
                  </label>

                  {/* Turno (Dia / Noite) */}
                  <label className="space-y-1">
                    <span className="block font-mono text-[10px] uppercase text-[var(--muted)]">
                      Passagem (Dia / Noite)
                    </span>
                    <select
                      value={mapState.filtros.diaNoite}
                      onChange={(e) =>
                        updateFiltro("diaNoite", e.target.value as FiltroFocos["diaNoite"])
                      }
                      className="min-h-[42px] w-full rounded-[8px] border border-[var(--border)] bg-[var(--background-secondary)] px-2.5 py-1.5 text-xs text-[var(--foreground)]"
                    >
                      <option value="all">Diurno e Noturno</option>
                      <option value="D">Apenas Diurno (D)</option>
                      <option value="N">Apenas Noturno (N)</option>
                    </select>
                  </label>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-2.5 text-xs">
                  <span className="text-[var(--muted)]">
                    Todos os filtros e coordenadas ficam salvos automaticamente no link da página.
                  </span>
                  <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={resetFiltros}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-[7px] border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1 text-xs font-medium text-[var(--foreground)] hover:border-[var(--primary)]"
                      >
                        <RotateCcw size={13} />
                        <span>Limpar filtros</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowFiltersPanel(false)}
                      className="btn-primary !py-1.5 !px-3.5 text-xs"
                    >
                      Concluir
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* AVISOS DE GEOLOCALIZAÇÃO ("MEU LOCAL") */}
            {(userLocation || geoStatusMsg) && (
              <div className="pointer-events-auto max-w-md rounded-[10px] border border-[var(--border)] bg-[var(--surface)]/95 p-3 text-xs shadow-lift backdrop-blur-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                      <Crosshair size={14} className="text-[#3B82F6]" />
                      <span>Monitoramento no seu entorno (raio de 50 km)</span>
                    </p>
                    {geoStatusMsg ? (
                      <p className="text-[var(--warning)] leading-relaxed">{geoStatusMsg}</p>
                    ) : nearbyStats ? (
                      <div className="space-y-1 text-[var(--foreground-secondary)]">
                        <p>
                          Focos num raio de 50 km:{" "}
                          <strong className="font-mono text-[var(--foreground)]">
                            {nearbyStats.countWithinRadius}
                          </strong>
                        </p>
                        <p>
                          Foco mais próximo:{" "}
                          {nearbyStats.nearestDistanceKm !== null ? (
                            <>
                              <strong className="font-mono text-[var(--foreground)]">
                                {nearbyStats.nearestDistanceKm.toLocaleString("pt-BR")} km
                              </strong>
                              {nearbyStats.nearestFoco && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nf = nearbyStats.nearestFoco!;
                                    setSelectedFoco(nf);
                                    setFlyToTarget({
                                      lat: nf.latitude,
                                      lon: nf.longitude,
                                      zoom: 10,
                                      token: Date.now(),
                                    });
                                  }}
                                  className="ml-2 font-medium text-[var(--primary)] underline"
                                >
                                  Ver foco ({nearbyStats.nearestFoco.frp.toFixed(1)} MW)
                                </button>
                              )}
                            </>
                          ) : (
                            "nenhum foco no filtro atual"
                          )}
                        </p>
                        <p className="text-[10px] font-mono text-[var(--muted)]">
                          Privacidade garantida: sua localização é calculada apenas no seu navegador.
                        </p>
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserLocation(null);
                      setGeoStatusMsg(null);
                    }}
                    aria-label="Fechar card de localização"
                    className="p-1 text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ESTADO SEM CHAVE OU ERRO OU VAZIO */}
            {resumo?.semChave && (
              <div
                role="alert"
                className="pointer-events-auto max-w-lg rounded-[10px] border border-[#A9A17A]/60 bg-[var(--surface)]/95 p-3.5 text-xs shadow-lift backdrop-blur-md"
              >
                <div className="flex items-start gap-2.5">
                  <AlertTriangle size={16} className="shrink-0 text-[var(--warning)] mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-[var(--foreground)]">
                      {resumo.erro ||
                        "Dados orbitais temporariamente indisponíveis."}
                    </p>
                    {resumo.desatualizado && resumo.total > 0 && (
                      <p className="text-[var(--foreground-secondary)]">
                        Exibindo último conjunto real em cache de{" "}
                        <span className="font-mono">
                          {new Date(resumo.atualizadoEm).toLocaleString("pt-BR")}
                        </span>
                        .
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {fetchError && (
              <div
                role="alert"
                className="pointer-events-auto max-w-md rounded-[10px] border border-[var(--danger)]/50 bg-[var(--surface)]/95 p-3.5 text-xs shadow-lift backdrop-blur-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[var(--danger)] font-medium">{fetchError}</span>
                  <button
                    type="button"
                    onClick={() => void fetchFocos(mapState.filtros, true)}
                    className="btn-secondary !py-1.5 !px-3 text-xs shrink-0"
                  >
                    Tentar de novo
                  </button>
                </div>
              </div>
            )}

            {!loading && !fetchError && resumo && resumo.total === 0 && !resumo.semChave && (
              <div
                role="status"
                className="pointer-events-auto max-w-md rounded-[10px] border border-[var(--border)] bg-[var(--surface)]/95 p-3.5 text-xs shadow-lift backdrop-blur-md flex items-center justify-between gap-3"
              >
                <span>Nenhum foco encontrado com esses filtros.</span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFiltros}
                    className="btn-secondary !py-1.5 !px-3 text-xs shrink-0"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            )}
          </div>

          {/* LEGENDA SEMPRE ACESSÍVEL DA ESCALA FRP (CANTO INFERIOR ESQUERDO) */}
          <div className="pointer-events-none absolute bottom-24 left-2.5 z-20 lg:bottom-4 sm:left-4">
            <div
              className="pointer-events-auto rounded-[12px] border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-lift backdrop-blur-md text-xs max-w-[260px]"
              aria-label="Legenda da escala de Potência Radiativa do Fogo (FRP)"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--sage)] font-semibold">
                  Escala FRP (Critério EcoMind)
                </span>
                <button
                  type="button"
                  onClick={() => setShowLegendModal((v) => !v)}
                  aria-label="Mais informações sobre a escala FRP"
                  className="text-[var(--muted)] hover:text-[var(--foreground)] p-0.5"
                >
                  <Info size={13} />
                </button>
              </div>

              <ul className="space-y-1.5">
                {(["critico", "alto", "medio", "baixo"] as const).map((lvl) => {
                  const meta = INTENSIDADE_META[lvl];
                  const dotSize =
                    lvl === "critico"
                      ? "h-4 w-4"
                      : lvl === "alto"
                        ? "h-3.5 w-3.5"
                        : lvl === "medio"
                          ? "h-2.5 w-2.5"
                          : "h-2 w-2";
                  return (
                    <li key={lvl} className="flex items-center justify-between gap-3 text-[11px]">
                      <span className="flex items-center gap-2 font-medium text-[var(--foreground)]">
                        <span className="inline-flex w-4 items-center justify-center">
                          <span
                            className={`inline-block rounded-full border border-black/40 ${dotSize}`}
                            style={{ backgroundColor: meta.colorDark }}
                            aria-hidden="true"
                          />
                        </span>
                        <IntensityShapeBadge intensidade={lvl} />
                        <span>{meta.label}</span>
                      </span>
                      <span className="font-mono text-[10px] text-[var(--foreground-secondary)]">
                        {meta.faixa}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {showLegendModal && (
                <p className="mt-2 border-t border-[var(--border)] pt-2 text-[10px] leading-relaxed text-[var(--foreground-secondary)]">
                  Tamanho do círculo e símbolo geométrico acompanham a potência em Megawatts (MW).
                  Esta divisão em 4 faixas é um critério didático do projeto EcoMind 360°.
                </p>
              )}
            </div>
          </div>

          {/* POPUP / CARD DE DETALHES AO TOCAR UM FOCO (PASSO 2.5) */}
          {selectedFoco && (
            <div
              role="dialog"
              aria-label="Detalhes do foco de calor selecionado"
              className="pointer-events-auto absolute right-2.5 top-20 z-30 w-[calc(100vw-1.25rem)] max-w-sm rounded-[14px] border border-[var(--border)] bg-[var(--surface)]/98 p-4 shadow-lift backdrop-blur-xl sm:right-4 sm:top-20"
            >
              <div className="flex items-start justify-between gap-2 border-b border-[var(--border)] pb-2.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    <IntensityShapeBadge intensidade={selectedFoco.intensidade} size="md" />
                    <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-[var(--foreground)]">
                      Intensidade {INTENSIDADE_META[selectedFoco.intensidade].label} ·{" "}
                      {selectedFoco.frp.toFixed(1)} MW
                    </span>
                  </div>
                  <h3 className="font-display text-sm font-semibold text-[var(--foreground)] mt-0.5">
                    {selectedFoco.biomaNome}
                    {selectedFoco.uf ? ` · ${selectedFoco.uf}` : ""}
                    {selectedMunicipio ? ` (${selectedMunicipio})` : ""}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFoco(null)}
                  aria-label="Fechar detalhes do foco"
                  className="flex h-8 w-8 items-center justify-center rounded-[7px] text-[var(--muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
                >
                  <X size={16} />
                </button>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                <div>
                  <dt className="text-[10px] font-mono uppercase text-[var(--muted)]">
                    Coordenadas
                  </dt>
                  <dd className="font-mono font-medium text-[var(--foreground)]">
                    {selectedFoco.latitude.toFixed(4)}°, {selectedFoco.longitude.toFixed(4)}°
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-mono uppercase text-[var(--muted)]">
                    Potência (FRP)
                  </dt>
                  <dd className="font-mono font-semibold text-[var(--foreground)]">
                    {selectedFoco.frp.toFixed(1)} MW ({INTENSIDADE_META[selectedFoco.intensidade].label})
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-mono uppercase text-[var(--muted)]">
                    Horário Local (BR)
                  </dt>
                  <dd className="font-mono text-[var(--foreground)]">
                    {new Date(selectedFoco.dataHoraUtc).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-mono uppercase text-[var(--muted)]">
                    Horário Orbital (UTC)
                  </dt>
                  <dd className="font-mono text-[var(--foreground-secondary)]">
                    {selectedFoco.dataHoraUtc.replace("T", " ").slice(0, 16)} UTC
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-mono uppercase text-[var(--muted)]">
                    Satélite / Sensor
                  </dt>
                  <dd className="text-[var(--foreground)] font-medium">
                    {selectedFoco.satelite} · {selectedFoco.instrumento} (
                    {selectedFoco.instrumento === "VIIRS" ? "375 m" : "1 km"})
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-mono uppercase text-[var(--muted)]">
                    Confiança / Turno
                  </dt>
                  <dd className="text-[var(--foreground)] capitalize">
                    {selectedFoco.confianca} ({selectedFoco.confiancaBruta}) ·{" "}
                    {selectedFoco.diaNoite === "D" ? "Diurno" : "Noturno"}
                  </dd>
                </div>
              </dl>

              {/* Aviso científico obrigatório (Passo 2.5) */}
              <div className="mt-3 rounded-[8px] border border-[var(--border)] bg-[var(--background-secondary)] p-2.5 text-[11px] leading-relaxed text-[var(--foreground-secondary)]">
                <strong className="text-[var(--foreground)]">Nota importante:</strong> Foco de calor não é incêndio confirmado: é um alerta orbital para investigar.
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-2.5 text-[11px]">
                <a
                  href={`https://firms.modaps.eosdis.nasa.gov/map/#d:24hrs;@${selectedFoco.longitude},${selectedFoco.latitude},10z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-[var(--primary)] hover:underline"
                >
                  <span>Fonte: NASA FIRMS</span>
                  <ExternalLink size={12} />
                </a>
                <a
                  href="https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-[var(--sage)] hover:underline"
                >
                  <span>INPE Queimadas</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* PAINEL DE RESUMO (LATERAL NO DESKTOP, BOTTOM SHEET COM 3 ALTURAS NO MOBILE) */}
        <aside
          aria-label="Resumo e ranking de focos de calor"
          className={`z-20 flex flex-col border-t lg:border-t-0 lg:border-l border-[var(--border)] bg-[var(--surface)] transition-all duration-200 lg:static lg:h-full lg:w-[390px] xl:w-[410px] shrink-0 ${
            sheetHeight === "collapsed"
              ? "fixed inset-x-0 bottom-14 h-20 lg:h-full"
              : sheetHeight === "medium"
                ? "fixed inset-x-0 bottom-14 h-[44dvh] lg:h-full"
                : "fixed inset-x-0 bottom-14 h-[80dvh] lg:h-full"
          }`}
        >
          {/* Controle de 3 alturas do Bottom Sheet no Mobile */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2 lg:hidden">
            <div className="flex items-center gap-2">
              <Flame size={15} className="text-[#FB923C]" />
              <span className="font-display text-xs font-semibold text-[var(--foreground)]">
                Resumo ({resumo ? resumo.total.toLocaleString("pt-BR") : "..."} focos)
              </span>
            </div>
            <div className="inline-flex items-center gap-1" role="group" aria-label="Altura do painel">
              {(
                [
                  { id: "collapsed", label: "Recolher" },
                  { id: "medium", label: "Médio" },
                  { id: "expanded", label: "Expandir" },
                ] as const
              ).map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSheetHeight(h.id)}
                  aria-pressed={sheetHeight === h.id}
                  className={`min-h-[36px] rounded-[6px] px-2 py-1 text-[10px] font-mono ${
                    sheetHeight === h.id
                      ? "bg-[var(--primary)] text-white dark:text-[#101512] font-semibold"
                      : "bg-[var(--surface-elevated)] text-[var(--foreground-secondary)]"
                  }`}
                >
                  {h.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() =>
                  setSheetHeight((prev) =>
                    prev === "expanded"
                      ? "collapsed"
                      : prev === "medium"
                        ? "expanded"
                        : "medium",
                  )
                }
                aria-label="Alternar altura do painel"
                className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[var(--surface-elevated)] text-[var(--foreground)]"
              >
                {sheetHeight === "expanded" ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
              </button>
            </div>
          </div>

          {/* Conteúdo rolável do Painel de Resumo */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
            {/* KPIs Principais: Total de Focos e FRP Máximo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--sage)]">
                  Telemetria no Filtro Atual ({formatPeriodoLabel(mapState.filtros.periodo)})
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFiltros}
                    className="text-[11px] font-medium text-[var(--primary)] hover:underline"
                  >
                    Ver Brasil inteiro
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-[10px] border border-[var(--border)] bg-[var(--background-secondary)] p-3">
                  <span className="text-[10px] font-mono uppercase text-[var(--muted)]">
                    Total de Focos
                  </span>
                  <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-[var(--foreground)]">
                    {loading && !resumo ? "..." : <AnimatedCount value={resumo?.total ?? 0} />}
                  </p>
                  <span className="text-[10px] font-mono text-[var(--foreground-secondary)]">
                    {resumo ? `Fonte: NASA FIRMS` : "Carregando..."}
                  </span>
                </div>

                <div className="rounded-[10px] border border-[var(--border)] bg-[var(--background-secondary)] p-3">
                  <span className="text-[10px] font-mono uppercase text-[var(--muted)]">
                    FRP Máximo / Total
                  </span>
                  <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-[#FB923C]">
                    {resumo ? `${resumo.frpMaximo.toLocaleString("pt-BR")} MW` : "..."}
                  </p>
                  <span className="text-[10px] font-mono text-[var(--foreground-secondary)]">
                    Soma: {resumo ? `${resumo.frpTotal.toLocaleString("pt-BR")} MW` : "..."}
                  </span>
                </div>
              </div>
            </div>

            {/* Distribuição por Intensidade (FRP) */}
            <div className="space-y-2">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                Distribuição por Classe de Intensidade (FRP)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(["critico", "alto", "medio", "baixo"] as const).map((lvl) => {
                  const count = resumo?.porIntensidade[lvl] ?? 0;
                  const meta = INTENSIDADE_META[lvl];
                  const active = mapState.filtros.intensidadeMin === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() =>
                        updateFiltro("intensidadeMin", active ? "all" : lvl)
                      }
                      aria-pressed={active}
                      className={`flex min-h-[44px] items-center justify-between rounded-[8px] border px-2.5 py-2 text-left transition-colors ${
                        active
                          ? "border-[var(--primary)] bg-[var(--surface-elevated)]"
                          : "border-[var(--border)] bg-[var(--background-secondary)] hover:bg-[var(--surface-elevated)]"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <IntensityShapeBadge intensidade={lvl} />
                        <span>
                          <span className="block font-medium text-[var(--foreground)]">
                            {meta.label}
                          </span>
                          <span className="block text-[10px] font-mono text-[var(--muted)]">
                            {meta.faixa}
                          </span>
                        </span>
                      </span>
                      <span className="font-mono text-sm font-semibold tabular-nums text-[var(--foreground)]">
                        {count.toLocaleString("pt-BR")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ranking por Bioma (Clicar num bioma filtra o mapa) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                  Ranking por Ambiente (clique para filtrar)
                </span>
                {mapState.filtros.bioma !== "all" && (
                  <button
                    type="button"
                    onClick={() => updateFiltro("bioma", "all")}
                    className="text-[11px] font-mono text-[var(--primary)] hover:underline"
                  >
                    Todos
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {biomeRanking.map((b) => {
                  const maxTotal = Math.max(1, biomeRanking[0]?.total ?? 1);
                  const pct = Math.min(100, Math.round((b.total / maxTotal) * 100));
                  const isSelected = mapState.filtros.bioma === b.id;

                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() =>
                        updateFiltro("bioma", isSelected ? "all" : b.id)
                      }
                      aria-pressed={isSelected}
                      className={`w-full min-h-[44px] rounded-[8px] border p-2.5 text-left transition-colors ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--surface-elevated)]"
                          : "border-[var(--border)] bg-[var(--background-secondary)] hover:bg-[var(--surface-elevated)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="flex items-center gap-2 font-medium text-[var(--foreground)]">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: b.color }}
                            aria-hidden="true"
                          />
                          <span>{b.nome}</span>
                        </span>
                        <span className="font-mono font-semibold tabular-nums text-[var(--foreground)]">
                          {b.total.toLocaleString("pt-BR")}{" "}
                          <span className="text-[10px] font-normal text-[var(--muted)]">
                            focos
                          </span>
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface)]">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: b.color,
                          }}
                        />
                      </div>
                    </button>
                  );
                })}

                {resumo && resumo.foraDosBiomas > 0 && (
                  <div className="flex items-center justify-between rounded-[8px] border border-[var(--border-subtle)] bg-[var(--background-secondary)] px-3 py-2 text-[11px] text-[var(--muted)]">
                    <span>Fora dos biomas (oceano / faixa de fronteira)</span>
                    <span className="font-mono font-semibold text-[var(--foreground-secondary)]">
                      {resumo.foraDosBiomas.toLocaleString("pt-BR")} focos
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Texto Educativo Curto no Painel (Passo 3.5) */}
            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--background-secondary)] p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
                <BookOpen size={14} className="text-[var(--primary)]" />
                <span>Entenda os Dados Orbitais</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[var(--foreground-secondary)]">
                <strong>O que é um foco de calor?</strong> É uma anomalia térmica na superfície registrada pelos sensores infravermelhos <strong>VIIRS (375 m)</strong> e <strong>MODIS (1 km)</strong> quando o satélite passa sobre o local.
              </p>
              <p className="text-[11px] leading-relaxed text-[var(--foreground-secondary)]">
                <strong>O que é FRP?</strong> A <em>Potência Radiativa do Fogo</em> (medida em Megawatts, MW) estima a taxa de energia térmica liberada pela combustão.
              </p>
              <p className="text-[11px] leading-relaxed text-[var(--foreground-secondary)]">
                <strong>Foco ≠ Área queimada:</strong> Um foco indica um ponto ativo na passagem do satélite, e não o total de hectares queimados (cicatriz).
              </p>
              <div className="pt-1 flex items-center justify-between">
                <Link
                  href="/metodologia"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)] hover:underline"
                >
                  <span>Ler metodologia completa →</span>
                </Link>
                <a
                  href="#tabela-alternativa-focos"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--sage)] hover:underline"
                >
                  <Table2 size={12} />
                  <span>Ver tabela (Top 20)</span>
                </a>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* SEÇÃO 2: ALTERNATIVA SEM MAPA / TABELA ACESSÍVEL DOS 20 FOCOS MAIS INTENSOS (PASSO 2.12) */}
      <section
        id="tabela-alternativa-focos"
        aria-labelledby="titulo-tabela-focos"
        className="section-inner max-w-7xl mx-auto py-8 space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div className="space-y-1.5">
            <div className="badge-360">
              <Table2 size={12} />
              <span>Alternativa Textual Acessível (WCAG 2.2 AA)</span>
            </div>
            <h2
              id="titulo-tabela-focos"
              className="font-display text-xl sm:text-2xl font-semibold text-[var(--foreground)]"
            >
              Os 20 Focos de Calor Mais Intensos no Filtro Atual
            </h2>
            <p className="text-xs sm:text-sm text-[var(--foreground-secondary)]">
              Listagem direta ordenada pela Potência Radiativa do Fogo (FRP em MW), sincronizada com os mesmos filtros selecionados no mapa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <FreshnessSeal
              atualizadoEm={resumo?.atualizadoEm}
              ultimoFocoEm={resumo?.ultimoFocoEm}
              desatualizado={resumo?.desatualizado}
              fonte={resumo?.fonte}
              periodo={mapState.filtros.periodo}
              compact
            />

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={top20Focos.length === 0}
              className="btn-secondary !py-2 !px-3.5 text-xs min-h-[44px] disabled:opacity-50"
            >
              <Download size={14} />
              <span>Exportar CSV ({top20Focos.length})</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[12px] border border-[var(--border)] bg-[var(--surface)] shadow-soft">
          <table className="w-full text-left text-xs text-[var(--foreground)]">
            <caption className="sr-only">
              Tabela dos 20 focos de calor mais intensos detectados pelo NASA FIRMS para o filtro atual, com fonte e horário UTC.
            </caption>
            <thead className="border-b border-[var(--border)] bg-[var(--background-secondary)] font-mono text-[11px] uppercase text-[var(--muted)]">
              <tr>
                <th scope="col" className="py-3 px-3.5">#</th>
                <th scope="col" className="py-3 px-3.5">Intensidade / FRP</th>
                <th scope="col" className="py-3 px-3.5">Bioma (IBGE)</th>
                <th scope="col" className="py-3 px-3.5">UF</th>
                <th scope="col" className="py-3 px-3.5">Coordenadas</th>
                <th scope="col" className="py-3 px-3.5">Data / Hora (UTC)</th>
                <th scope="col" className="py-3 px-3.5">Satélite / Sensor</th>
                <th scope="col" className="py-3 px-3.5">Confiança</th>
                <th scope="col" className="py-3 px-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] font-mono">
              {top20Focos.length > 0 ? (
                top20Focos.map((f, index) => (
                  <tr
                    key={f.id}
                    className="hover:bg-[var(--surface-elevated)] transition-colors"
                  >
                    <td className="py-3 px-3.5 text-[var(--muted)]">{index + 1}</td>
                    <td className="py-3 px-3.5">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
                        <IntensityShapeBadge intensidade={f.intensidade} />
                        <span>{f.frp.toFixed(1)} MW</span>
                        <span className="font-sans text-[11px] font-normal text-[var(--foreground-secondary)]">
                          ({INTENSIDADE_META[f.intensidade].label})
                        </span>
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-sans font-medium text-[var(--foreground)]">
                      {f.biomaNome}
                    </td>
                    <td className="py-3 px-3.5">{f.uf ?? "—"}</td>
                    <td className="py-3 px-3.5 text-[var(--foreground-secondary)]">
                      {f.latitude.toFixed(4)}°, {f.longitude.toFixed(4)}°
                    </td>
                    <td className="py-3 px-3.5 text-[var(--foreground-secondary)]">
                      {f.dataHoraUtc.replace("T", " ").slice(0, 16)} UTC
                    </td>
                    <td className="py-3 px-3.5 font-sans">
                      {f.satelite} ({f.instrumento})
                    </td>
                    <td className="py-3 px-3.5 font-sans capitalize">
                      {f.confianca} ({f.confiancaBruta})
                    </td>
                    <td className="py-3 px-3.5 text-right font-sans">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFoco(f);
                          setFlyToTarget({
                            lat: f.latitude,
                            lon: f.longitude,
                            zoom: 9,
                            token: Date.now(),
                          });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="inline-flex min-h-[36px] items-center gap-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1 text-[11px] font-medium text-[var(--foreground)] hover:border-[var(--primary)]"
                      >
                        <MapPin size={12} className="text-[var(--primary)]" />
                        <span>Destacar no mapa</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center font-sans text-[var(--muted)]">
                    {loading
                      ? "Carregando registros orbitais do NASA FIRMS..."
                      : "Nenhum foco de calor encontrado para os filtros selecionados."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
