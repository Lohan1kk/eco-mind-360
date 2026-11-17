"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Copy,
  Crosshair,
  Download,
  ExternalLink,
  Filter,
  Flame,
  Layers,
  Loader2,
  MapPin,
  PanelRightClose,
  PanelRightOpen,
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
      aria-label="Carregando mapa"
    >
      <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" aria-hidden="true" />
      <p className="text-sm font-medium text-[var(--foreground)]">
        Inicializando Painel do Fogo (WebGL)...
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
  const [showEstadosLayer, setShowEstadosLayer] = useState(true);
  const [baseMap, setBaseMap] = useState<"dark" | "satellite" | "light">("dark");

  const [apiData, setApiData] = useState<RespostaApiFocos | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [webGlFailed, setWebGlFailed] = useState(false);

  const [selectedFoco, setSelectedFoco] = useState<FocoCalor | null>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"resumo" | "criticos" | "camadas">("resumo");
  const [showTop20Table, setShowTop20Table] = useState(false);
  const [showAllUfs, setShowAllUfs] = useState(false);

  const [sheetHeight, setSheetHeight] = useState<"collapsed" | "medium" | "expanded">("collapsed");

  const [cityQuery, setCityQuery] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<IbgeMunicipioItem[]>([]);
  const [searchingCity, setSearchingCity] = useState(false);

  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [geoStatusMsg, setGeoStatusMsg] = useState<string | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);

  const [flyToTarget, setFlyToTarget] = useState<{
    lat: number;
    lon: number;
    zoom: number;
    token: number;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const restored = parseMapUrlState(window.location.search);
    setMapState(restored);
    setUrlReady(true);
  }, []);

  useEffect(() => {
    if (!urlReady || typeof window === "undefined") return;
    const qs = serializeMapUrlState(mapState);
    const nextUrl = `${window.location.pathname}?${qs}`;
    window.history.replaceState(null, "", nextUrl);
  }, [mapState, urlReady]);

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);

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
      // fallback UF
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

    if (key === "uf" && typeof value === "string") {
      if (value === "all") {
        setFlyToTarget({
          lat: DEFAULT_MAP_URL_STATE.lat,
          lon: DEFAULT_MAP_URL_STATE.lon,
          zoom: DEFAULT_MAP_URL_STATE.zoom,
          token: Date.now(),
        });
      } else {
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

  const handleMeuLocal = () => {
    setGeoStatusMsg(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatusMsg(
        "Seu navegador não oferece suporte a geolocalização. Use a busca por município acima.",
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
            "Permissão de localização negada. Autorize no navegador ou busque seu município.",
          );
        } else {
          setGeoStatusMsg(
            "Não foi possível obter sua localização. Busque seu município na barra superior.",
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

  const nearbyStats = useMemo(() => {
    if (!userLocation) return null;
    return analyzeNearbyFocos(userLocation.lat, userLocation.lon, focos, 50);
  }, [userLocation, focos]);

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

  const ufRanking = useMemo(() => {
    if (!resumo?.porUf) return [];
    return Object.entries(resumo.porUf)
      .filter(([, count]) => count > 0)
      .map(([sigla, total]) => {
        const ufMeta = BRAZIL_UFS.find((u) => u.sigla === sigla);
        return {
          sigla,
          nome: ufMeta?.nome ?? sigla,
          total,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [resumo]);

  const top20Focos = useMemo(() => {
    return [...focos]
      .sort((a, b) => b.frp - a.frp || Date.parse(b.dataHoraUtc) - Date.parse(a.dataHoraUtc))
      .slice(0, 20);
  }, [focos]);

  const handleExportCsv = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const updatedIso = resumo?.atualizadoEm ?? new Date().toISOString();
    const headerComments = [
      `# Fonte: ${resumo?.fonte ?? "NASA FIRMS (VIIRS 375 m / MODIS 1 km)"}`,
      `# Periodo: ${formatPeriodoLabel(mapState.filtros.periodo)} (${mapState.filtros.periodo})`,
      `# Atualizado_em_UTC: ${updatedIso}`,
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
  const visibleUfList = showAllUfs ? ufRanking : ufRanking.slice(0, 8);

  return (
    <div className="flex flex-col w-full bg-[var(--background)] text-[var(--foreground)]">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {loading
          ? "Carregando focos de calor do NASA FIRMS..."
          : resumo
            ? `${resumo.total} focos de calor carregados para o período ${formatPeriodoLabel(
                mapState.filtros.periodo,
              )}. Fonte: ${resumo.fonte}.`
            : ""}
      </div>

      {/* BARRA OPERACIONAL SUPERIOR FIXA (ESTILO PAINEL DO FOGO CENSIPAM / BDQUEIMADAS INPE — NÃO COBRE O MAPA) */}
      <div className="z-30 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs">
        {/* Esquerda: Título Institucional + Período + Status NASA FIRMS */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden xl:flex items-center gap-1.5 pr-2 border-r border-[var(--border)]">
            <Flame size={14} className="text-[#EF4444]" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Painel do Fogo
            </span>
          </div>

          {/* Seletor de Período */}
          <div
            className="inline-flex items-center rounded-[6px] border border-[var(--border)] bg-[var(--background-secondary)] p-0.5"
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
                  className={`rounded-[4px] px-2.5 py-1 text-[11px] font-mono font-medium transition-colors ${
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

          {/* Seletor rápido de UF */}
          <select
            value={mapState.filtros.uf}
            onChange={(e) => updateFiltro("uf", e.target.value)}
            aria-label="Filtrar por Estado (UF)"
            className="h-8 rounded-[6px] border border-[var(--border)] bg-[var(--background-secondary)] px-2 text-xs font-medium text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
          >
            <option value="all">Brasil (27 UFs)</option>
            {BRAZIL_UFS.map((u) => (
              <option key={u.sigla} value={u.sigla}>
                {u.sigla} — {u.nome}
              </option>
            ))}
          </select>

          {/* Seletor rápido de Bioma */}
          <select
            value={mapState.filtros.bioma}
            onChange={(e) => updateFiltro("bioma", e.target.value as FiltroFocos["bioma"])}
            aria-label="Filtrar por Bioma"
            className="hidden sm:block h-8 rounded-[6px] border border-[var(--border)] bg-[var(--background-secondary)] px-2 text-xs font-medium text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
          >
            <option value="all">Todos os 7 Biomas</option>
            {BIOMES_LIST.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFiltros}
              className="inline-flex h-8 items-center gap-1 rounded-[6px] border border-[var(--primary)]/50 bg-[var(--surface-elevated)] px-2.5 text-[11px] font-medium text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[#101512] transition-colors"
            >
              <RotateCcw size={12} />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>

        {/* Direita: Busca de Município + Mapa Base + Localização + Atualizar */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Busca de Município IBGE */}
          <div className="relative">
            <div className="flex h-8 items-center rounded-[6px] border border-[var(--border)] bg-[var(--background-secondary)]">
              <Search size={12} className="ml-2 shrink-0 text-[var(--muted)]" />
              <input
                type="search"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                placeholder="Buscar município..."
                aria-label="Buscar município ou UF"
                className="h-full w-36 sm:w-44 bg-transparent px-2 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
              />
              {cityQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setCityQuery("");
                    setCitySuggestions([]);
                  }}
                  aria-label="Limpar busca"
                  className="mr-1 flex h-5 w-5 items-center justify-center rounded text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <X size={11} />
                </button>
              )}
            </div>

            {citySuggestions.length > 0 && (
              <ul
                role="listbox"
                className="absolute left-0 right-0 top-full mt-1 max-h-56 overflow-y-auto rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-1 shadow-lift z-50"
              >
                {citySuggestions.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => void handleSelectMunicipio(item)}
                      className="flex w-full items-center justify-between rounded-[5px] px-2.5 py-1.5 text-left text-xs text-[var(--foreground)] hover:bg-[var(--surface-elevated)]"
                    >
                      <span className="font-medium truncate">{item.nome}</span>
                      <span className="ml-2 shrink-0 font-mono text-[10px] text-[var(--sage)]">
                        {item.ufSigla}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {searchingCity && citySuggestions.length === 0 && cityQuery.length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-1 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[11px] text-[var(--muted)] shadow-soft z-50">
                Buscando...
              </div>
            )}
          </div>

          {/* Seletor de Mapa Base (Escuro | Satélite | Claro — estilo CENSIPAM/INPE) */}
          <div
            className="hidden md:inline-flex items-center rounded-[6px] border border-[var(--border)] bg-[var(--background-secondary)] p-0.5"
            role="group"
            aria-label="Mapa base"
          >
            {(
              [
                { id: "dark", label: "Escuro" },
                { id: "satellite", label: "Satélite" },
                { id: "light", label: "Claro" },
              ] as const
            ).map((bm) => {
              const active = baseMap === bm.id;
              return (
                <button
                  key={bm.id}
                  type="button"
                  onClick={() => setBaseMap(bm.id)}
                  aria-pressed={active}
                  className={`rounded-[4px] px-2 py-1 text-[11px] font-medium transition-colors ${
                    active
                      ? "bg-[var(--surface-elevated)] text-[var(--foreground)] font-semibold border border-[var(--primary)]/50"
                      : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {bm.label}
                </button>
              );
            })}
          </div>

          {/* Botão Perto de Mim */}
          <button
            type="button"
            onClick={handleMeuLocal}
            disabled={locatingUser}
            title="Focos num raio de 50 km da minha localização"
            className="flex h-8 items-center gap-1 rounded-[6px] border border-[var(--border)] bg-[var(--background-secondary)] px-2 text-[11px] font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
          >
            <Crosshair
              size={12}
              className={locatingUser ? "animate-spin text-[var(--primary)]" : "text-[var(--primary)]"}
            />
            <span className="hidden lg:inline">Meu local</span>
          </button>

          {/* Copiar Link */}
          <button
            type="button"
            onClick={() => void handleCopyLink()}
            title="Copiar link desta visualização"
            className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
          >
            {copiedLink ? (
              <Check size={12} className="text-[var(--success)]" />
            ) : (
              <Copy size={12} />
            )}
          </button>

          {/* Status NASA FIRMS + INPE + Refresh */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--background-secondary)] px-2 h-8 text-[11px] font-mono text-[var(--foreground-secondary)]">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                resumo?.desatualizado ? "bg-[var(--warning)]" : "bg-[var(--success)]"
              }`}
            />
            <span>NASA FIRMS + INPE</span>
            <span>·</span>
            <span>
              {loading ? "atualizando..." : formatMinutesAgo(resumo?.atualizadoEm, nowMs)}
            </span>
            <button
              type="button"
              onClick={() => void fetchFocos(mapState.filtros, true)}
              disabled={refreshing || loading}
              aria-label="Atualizar dados agora"
              title="Atualizar dados agora"
              className="ml-1 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] disabled:opacity-50"
            >
              <RefreshCw
                size={12}
                className={refreshing || loading ? "animate-spin text-[var(--primary)]" : ""}
              />
            </button>
          </div>

          {/* Alternar Painel Lateral no Desktop */}
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            title={sidebarOpen ? "Recolher painel lateral" : "Abrir painel lateral"}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
          >
            {sidebarOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
          </button>
        </div>
      </div>

      {/* CONTAINER DO MAPA (100% DESOBSTRUÍDO) + PAINEL OPERACIONAL LATERAL */}
      <section
        aria-label="Mapa Interativo de Focos de Calor"
        className="relative flex flex-col lg:flex-row w-full h-[calc(100dvh-6.25rem)] min-h-[540px] overflow-hidden border-b border-[var(--border)]"
      >
        {/* ÁREA DO MAPA */}
        <div className="relative flex-1 h-full w-full min-h-[480px] overflow-hidden">
          {webGlFailed ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[var(--surface)] p-6 text-center">
              <AlertTriangle className="h-10 w-10 text-[var(--warning)]" aria-hidden="true" />
              <div className="max-w-md space-y-2">
                <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  WebGL indisponível neste dispositivo
                </h2>
                <p className="text-xs leading-relaxed text-[var(--foreground-secondary)]">
                  Consulte e exporte os dados diretamente na{" "}
                  <button
                    type="button"
                    onClick={() => setShowTop20Table(true)}
                    className="font-semibold text-[var(--primary)] underline"
                  >
                    tabela de focos abaixo
                  </button>
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
              camadas={{
                ...mapState.camadas,
                estados: showEstadosLayer,
              }}
              baseMap={baseMap}
              selectedFoco={selectedFoco}
              selectedBiome={mapState.filtros.bioma}
              userLocation={userLocation}
              flyToTarget={flyToTarget}
              onMoveEnd={handleMoveEnd}
              onSelectFoco={(f) => setSelectedFoco(f)}
              onWebGlError={() => setWebGlFailed(true)}
            />
          )}

          {/* AVISOS DISCRETOS (SÓ QUANDO ATIVOS: RAIO 50KM OU ERRO) */}
          {(userLocation || geoStatusMsg || fetchError) && (
            <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-col gap-2">
              {(userLocation || geoStatusMsg) && (
                <div className="pointer-events-auto max-w-xs rounded-[8px] border border-[var(--border)] bg-[var(--surface)]/95 p-2.5 text-xs shadow-lift backdrop-blur-md">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                        <Crosshair size={12} className="text-[#3B82F6]" />
                        <span>Raio de 50 km do seu local</span>
                      </p>
                      {geoStatusMsg ? (
                        <p className="text-[var(--warning)]">{geoStatusMsg}</p>
                      ) : nearbyStats ? (
                        <div className="text-[var(--foreground-secondary)]">
                          <p>
                            Focos próximos:{" "}
                            <strong className="font-mono text-[var(--foreground)]">
                              {nearbyStats.countWithinRadius}
                            </strong>
                            {nearbyStats.nearestDistanceKm !== null && (
                              <span>
                                {" "}
                                (a {nearbyStats.nearestDistanceKm.toLocaleString("pt-BR")} km)
                              </span>
                            )}
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
                      aria-label="Fechar"
                      className="p-0.5 text-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              )}

              {fetchError && (
                <div
                  role="alert"
                  className="pointer-events-auto max-w-sm rounded-[8px] border border-[var(--danger)]/50 bg-[var(--surface)]/95 p-2.5 text-xs shadow-lift backdrop-blur-md flex items-center justify-between gap-3"
                >
                  <span className="text-[var(--danger)] font-medium">{fetchError}</span>
                  <button
                    type="button"
                    onClick={() => void fetchFocos(mapState.filtros, true)}
                    className="btn-secondary !py-1 !px-2 text-xs shrink-0"
                  >
                    Tentar de novo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* LEGENDA CARTÓGRAFICA INFERIOR ESQUERDA (ESTILO PAINEL DO FOGO / INPE) */}
          <div className="pointer-events-none hidden sm:block absolute bottom-3 left-3 z-20">
            <div
              className="pointer-events-auto rounded-[6px] border border-[var(--border)] bg-[var(--surface)]/92 px-3 py-1.5 shadow-soft backdrop-blur-md text-[11px]"
              aria-label="Legenda de severidade dos focos"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                  Severidade (FRP):
                </span>
                {(["baixo", "medio", "alto", "critico"] as const).map((lvl) => {
                  const meta = INTENSIDADE_META[lvl];
                  return (
                    <span
                      key={lvl}
                      className="inline-flex items-center gap-1.5 font-medium text-[var(--foreground)]"
                      title={meta.faixa}
                    >
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: meta.colorDark }}
                      />
                      <span>{meta.label}</span>
                      <span className="hidden xl:inline font-mono text-[10px] text-[var(--muted)]">
                        ({meta.faixa})
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FICHA TÉCNICA AO CLICAR NUM FOCO NO MAPA */}
          {selectedFoco && (
            <div
              role="dialog"
              aria-label="Detalhes do foco selecionado"
              className="pointer-events-auto absolute right-3 top-3 z-30 w-[calc(100vw-1.5rem)] max-w-xs rounded-[10px] border border-[var(--border)] bg-[var(--surface)]/98 p-3.5 shadow-lift backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-2 border-b border-[var(--border)] pb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <IntensityShapeBadge intensidade={selectedFoco.intensidade} size="md" />
                    <span className="font-mono text-[11px] uppercase font-semibold text-[var(--foreground)]">
                      {INTENSIDADE_META[selectedFoco.intensidade].label} ·{" "}
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
                  aria-label="Fechar"
                  className="flex h-6 w-6 items-center justify-center rounded-[5px] text-[var(--muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
                >
                  <X size={14} />
                </button>
              </div>

              <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                <div>
                  <dt className="text-[10px] font-mono text-[var(--muted)]">Coordenadas</dt>
                  <dd className="font-mono text-[var(--foreground)]">
                    {selectedFoco.latitude.toFixed(4)}°, {selectedFoco.longitude.toFixed(4)}°
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-mono text-[var(--muted)]">Passagem (BR)</dt>
                  <dd className="font-mono text-[var(--foreground)]">
                    {new Date(selectedFoco.dataHoraUtc).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-mono text-[var(--muted)]">Satélite / Sensor</dt>
                  <dd className="text-[var(--foreground)]">
                    {selectedFoco.satelite} ({selectedFoco.instrumento})
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-mono text-[var(--muted)]">Confiança / Turno</dt>
                  <dd className="text-[var(--foreground)] capitalize">
                    {selectedFoco.confianca} ·{" "}
                    {selectedFoco.diaNoite === "D" ? "Diurno" : "Noturno"}
                  </dd>
                </div>
              </dl>

              <div className="mt-2.5 flex items-center justify-between border-t border-[var(--border)] pt-2 text-[11px]">
                <a
                  href={`https://firms.modaps.eosdis.nasa.gov/map/#d:24hrs;@${selectedFoco.longitude},${selectedFoco.latitude},10z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-[var(--primary)] hover:underline"
                >
                  <span>Inspecionar no NASA FIRMS</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* PAINEL ANALÍTICO LATERAL ESTILO PAINEL DO FOGO CENSIPAM / BDQUEIMADAS INPE */}
        {sidebarOpen && (
          <aside
            aria-label="Painel Analítico de Focos e Camadas"
            className={`z-20 flex flex-col border-t lg:border-t-0 lg:border-l border-[var(--border)] bg-[var(--surface)] transition-all duration-200 lg:static lg:h-full lg:w-[360px] shrink-0 ${
              sheetHeight === "collapsed"
                ? "fixed inset-x-0 bottom-14 h-14 lg:h-full"
                : sheetHeight === "medium"
                  ? "fixed inset-x-0 bottom-14 h-[48dvh] lg:h-full"
                  : "fixed inset-x-0 bottom-14 h-[78dvh] lg:h-full"
            }`}
          >
            {/* Barra mobile */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5 lg:hidden">
              <div className="flex items-center gap-2">
                <Flame size={15} className="text-[#EF4444]" />
                <span className="font-display text-xs font-semibold text-[var(--foreground)]">
                  {resumo
                    ? `${resumo.total.toLocaleString("pt-BR")} focos ativos (${mapState.filtros.periodo})`
                    : "Carregando..."}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSheetHeight((prev) => (prev === "collapsed" ? "medium" : "collapsed"))
                }
                className="inline-flex items-center gap-1 rounded-[6px] bg-[var(--surface-elevated)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)]"
              >
                <span>{sheetHeight === "collapsed" ? "Abrir painel" : "Recolher"}</span>
                {sheetHeight === "collapsed" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Navegação por Abas do Painel (Resumo | Eventos Críticos | Camadas) */}
            <div
              className="grid grid-cols-3 border-b border-[var(--border)] bg-[var(--background-secondary)] p-1 gap-1"
              role="tablist"
              aria-label="Seções do Painel do Fogo"
            >
              {(
                [
                  { id: "resumo", label: "Resumo & UFs", icon: Flame },
                  { id: "criticos", label: "Focos Críticos", icon: AlertTriangle },
                  { id: "camadas", label: "Camadas & Filtros", icon: Layers },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-1.5 rounded-[5px] py-1.5 px-2 text-[11px] font-medium transition-colors ${
                      active
                        ? "bg-[var(--surface)] text-[var(--foreground)] font-semibold shadow-sm border border-[var(--border)]"
                        : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Icon size={12} className={active ? "text-[var(--primary)]" : ""} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* CONTEÚDO DAS ABAS */}
            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs"
            >
              {activeTab === "resumo" && (
                <>
                  {/* KPIs Principais */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-[8px] border border-[var(--border)] bg-[var(--background-secondary)] p-2.5">
                      <span className="text-[10px] font-mono uppercase text-[var(--muted)]">
                        Focos Ativos ({mapState.filtros.periodo})
                      </span>
                      <p className="mt-0.5 font-display text-2xl font-semibold tabular-nums text-[var(--foreground)]">
                        {loading && !resumo ? "..." : <AnimatedCount value={resumo?.total ?? 0} />}
                      </p>
                      <span className="block mt-0.5 text-[10px] font-mono text-[var(--muted)]">
                        {mapState.filtros.uf !== "all"
                          ? `Recorte: ${mapState.filtros.uf}`
                          : "Território Nacional"}
                      </span>
                    </div>

                    <div className="rounded-[8px] border border-[var(--border)] bg-[var(--background-secondary)] p-2.5">
                      <span className="text-[10px] font-mono uppercase text-[var(--muted)]">
                        Pico Radiativo (FRP)
                      </span>
                      <p className="mt-0.5 font-display text-2xl font-semibold tabular-nums text-[#FB923C]">
                        {resumo ? `${resumo.frpMaximo.toLocaleString("pt-BR")} MW` : "..."}
                      </p>
                      <span className="block mt-0.5 text-[10px] font-mono text-[var(--muted)]">
                        Soma: {resumo ? `${Math.round(resumo.frpTotal).toLocaleString("pt-BR")} MW` : "..."}
                      </span>
                    </div>
                  </div>

                  {/* Severidade por FRP */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                        Severidade (Potência FRP)
                      </span>
                      {mapState.filtros.intensidadeMin !== "all" && (
                        <button
                          type="button"
                          onClick={() => updateFiltro("intensidadeMin", "all")}
                          className="text-[11px] text-[var(--primary)] hover:underline"
                        >
                          Mostrar todas
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(["critico", "alto", "medio", "baixo"] as const).map((lvl) => {
                        const count = resumo?.porIntensidade[lvl] ?? 0;
                        const meta = INTENSIDADE_META[lvl];
                        const active = mapState.filtros.intensidadeMin === lvl;
                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => updateFiltro("intensidadeMin", active ? "all" : lvl)}
                            aria-pressed={active}
                            className={`flex items-center justify-between rounded-[6px] border px-2.5 py-1.5 text-left transition-colors ${
                              active
                                ? "border-[var(--primary)] bg-[var(--surface-elevated)]"
                                : "border-[var(--border)] bg-[var(--background-secondary)] hover:bg-[var(--surface-elevated)]"
                            }`}
                          >
                            <span className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
                              <IntensityShapeBadge intensidade={lvl} />
                              <span>{meta.label}</span>
                            </span>
                            <span className="font-mono font-semibold tabular-nums text-[var(--foreground)]">
                              {count.toLocaleString("pt-BR")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ranking por Estado (UF) com Barras — Estilo Painel do Fogo CENSIPAM / INPE */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                        Focos por Estado (UF)
                      </span>
                      {mapState.filtros.uf !== "all" && (
                        <button
                          type="button"
                          onClick={() => updateFiltro("uf", "all")}
                          className="text-[11px] text-[var(--primary)] hover:underline"
                        >
                          Ver todas UFs
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      {visibleUfList.map((u) => {
                        const maxUf = Math.max(1, ufRanking[0]?.total ?? 1);
                        const pct = Math.min(100, Math.max(2, Math.round((u.total / maxUf) * 100)));
                        const active = mapState.filtros.uf === u.sigla;
                        return (
                          <button
                            key={u.sigla}
                            type="button"
                            onClick={() => updateFiltro("uf", active ? "all" : u.sigla)}
                            aria-pressed={active}
                            className={`w-full rounded-[6px] border px-2.5 py-1.5 text-left transition-colors ${
                              active
                                ? "border-[var(--primary)] bg-[var(--surface-elevated)]"
                                : "border-[var(--border)] bg-[var(--background-secondary)] hover:bg-[var(--surface-elevated)]"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="flex items-center gap-1.5 font-medium text-[var(--foreground)] truncate">
                                <span className="font-mono text-[11px] font-semibold text-[var(--sage)] w-6">
                                  {u.sigla}
                                </span>
                                <span className="truncate">{u.nome}</span>
                              </span>
                              <span className="font-mono font-semibold tabular-nums text-[var(--foreground)]">
                                {u.total.toLocaleString("pt-BR")}
                              </span>
                            </div>
                            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[var(--surface)]">
                              <div
                                className="h-full rounded-full transition-all duration-300 bg-[#F97316]"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {ufRanking.length > 8 && (
                      <button
                        type="button"
                        onClick={() => setShowAllUfs((v) => !v)}
                        className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--background-secondary)] py-1 text-center text-[11px] font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                      >
                        {showAllUfs
                          ? "Mostrar apenas Top 8 Estados"
                          : `Ver todos os ${ufRanking.length} Estados com focos`}
                      </button>
                    )}
                  </div>

                  {/* Ranking por Bioma */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                        Focos por Bioma (IBGE)
                      </span>
                      {mapState.filtros.bioma !== "all" && (
                        <button
                          type="button"
                          onClick={() => updateFiltro("bioma", "all")}
                          className="text-[11px] text-[var(--primary)] hover:underline"
                        >
                          Todos os biomas
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      {biomeRanking.map((b) => {
                        const maxTotal = Math.max(1, biomeRanking[0]?.total ?? 1);
                        const pct = Math.min(100, Math.round((b.total / maxTotal) * 100));
                        const isSelected = mapState.filtros.bioma === b.id;

                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => updateFiltro("bioma", isSelected ? "all" : b.id)}
                            aria-pressed={isSelected}
                            className={`w-full rounded-[6px] border px-2.5 py-1.5 text-left transition-colors ${
                              isSelected
                                ? "border-[var(--primary)] bg-[var(--surface-elevated)]"
                                : "border-[var(--border)] bg-[var(--background-secondary)] hover:bg-[var(--surface-elevated)]"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="flex items-center gap-2 font-medium text-[var(--foreground)]">
                                <span
                                  className="h-2 w-2 shrink-0 rounded-full"
                                  style={{ backgroundColor: b.color }}
                                />
                                <span>{b.nome}</span>
                              </span>
                              <span className="font-mono font-semibold tabular-nums text-[var(--foreground)]">
                                {b.total.toLocaleString("pt-BR")}
                              </span>
                            </div>
                            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[var(--surface)]">
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
                    </div>
                  </div>
                </>
              )}

              {activeTab === "criticos" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                      Top 20 Eventos por Potência (FRP)
                    </span>
                    <button
                      type="button"
                      onClick={handleExportCsv}
                      disabled={top20Focos.length === 0}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--primary)] hover:underline disabled:opacity-50"
                    >
                      <Download size={12} />
                      <span>Baixar CSV</span>
                    </button>
                  </div>

                  {top20Focos.length === 0 ? (
                    <p className="rounded-[8px] border border-[var(--border)] bg-[var(--background-secondary)] p-4 text-center text-[var(--muted)]">
                      Nenhum foco encontrado para o recorte selecionado.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {top20Focos.map((f, idx) => {
                        const isSelected = selectedFoco?.id === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => {
                              setSelectedFoco(f);
                              setFlyToTarget({
                                lat: f.latitude,
                                lon: f.longitude,
                                zoom: 9.5,
                                token: Date.now(),
                              });
                            }}
                            className={`w-full rounded-[7px] border p-2.5 text-left transition-colors ${
                              isSelected
                                ? "border-[var(--primary)] bg-[var(--surface-elevated)]"
                                : "border-[var(--border)] bg-[var(--background-secondary)] hover:bg-[var(--surface-elevated)]"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--foreground)]">
                                <span className="text-[10px] text-[var(--muted)]">#{idx + 1}</span>
                                <IntensityShapeBadge intensidade={f.intensidade} />
                                <span>{f.frp.toFixed(1)} MW</span>
                              </span>
                              <span className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--sage)] border border-[var(--border)]">
                                {f.uf ?? "BR"} · {f.biomaNome}
                              </span>
                            </div>
                            <div className="mt-1.5 flex items-center justify-between text-[11px] text-[var(--muted)]">
                              <span className="font-mono">
                                {f.latitude.toFixed(3)}°, {f.longitude.toFixed(3)}° · {f.satelite}
                              </span>
                              <span className="inline-flex items-center gap-0.5 text-[var(--primary)] font-medium">
                                <span>Localizar</span>
                                <ChevronRight size={12} />
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "camadas" && (
                <div className="space-y-4">
                  {/* Camadas Vetoriais e Matriciais */}
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                      Camadas Geoespaciais
                    </span>

                    <div className="space-y-1 rounded-[8px] border border-[var(--border)] bg-[var(--background-secondary)] p-2">
                      <label className="flex cursor-pointer items-center justify-between gap-2 rounded-[6px] px-2 py-1.5 hover:bg-[var(--surface-elevated)]">
                        <span className="flex items-center gap-2 font-medium">
                          <Flame size={13} className="text-[#FB923C]" />
                          Focos de Calor (VIIRS/MODIS)
                        </span>
                        <input
                          type="checkbox"
                          checked={mapState.camadas.focos}
                          onChange={() => toggleCamada("focos")}
                          className="h-4 w-4 accent-[var(--primary)]"
                        />
                      </label>

                      <label className="flex cursor-pointer items-center justify-between gap-2 rounded-[6px] px-2 py-1.5 hover:bg-[var(--surface-elevated)]">
                        <span className="flex items-center gap-2 font-medium">
                          <Sparkles size={13} className="text-[#EF4444]" />
                          Mancha Térmica (Heatmap)
                        </span>
                        <input
                          type="checkbox"
                          checked={mapState.camadas.heatmap}
                          onChange={() => toggleCamada("heatmap")}
                          className="h-4 w-4 accent-[var(--primary)]"
                        />
                      </label>

                      <label className="flex cursor-pointer items-center justify-between gap-2 rounded-[6px] px-2 py-1.5 hover:bg-[var(--surface-elevated)]">
                        <span className="flex items-center gap-2 font-medium">
                          <MapPin size={13} className="text-[var(--sage)]" />
                          Limites Estaduais (27 UFs IBGE)
                        </span>
                        <input
                          type="checkbox"
                          checked={showEstadosLayer}
                          onChange={() => setShowEstadosLayer((v) => !v)}
                          className="h-4 w-4 accent-[var(--primary)]"
                        />
                      </label>

                      <label className="flex cursor-pointer items-center justify-between gap-2 rounded-[6px] px-2 py-1.5 hover:bg-[var(--surface-elevated)]">
                        <span className="flex items-center gap-2 font-medium">
                          <Trees size={13} className="text-[var(--primary)]" />
                          Limites dos 7 Biomas (IBGE)
                        </span>
                        <input
                          type="checkbox"
                          checked={mapState.camadas.biomas}
                          onChange={() => toggleCamada("biomas")}
                          className="h-4 w-4 accent-[var(--primary)]"
                        />
                      </label>

                      <label className="flex cursor-pointer items-center justify-between gap-2 rounded-[6px] px-2 py-1.5 hover:bg-[var(--surface-elevated)]">
                        <div>
                          <span className="flex items-center gap-2 font-medium">
                            <Satellite size={13} className="text-[#38BDF8]" />
                            Mosaico Diário NASA GIBS
                          </span>
                          <span className="block text-[10px] font-mono text-[var(--muted)] pl-5">
                            VIIRS True Color ({gibsDateLabel})
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={mapState.camadas.gibs}
                          onChange={() => toggleCamada("gibs")}
                          className="h-4 w-4 accent-[var(--primary)]"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Mapa Base */}
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                      Mapa Base Cartográfico
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(
                        [
                          { id: "dark", label: "Escuro" },
                          { id: "satellite", label: "Satélite" },
                          { id: "light", label: "Claro" },
                        ] as const
                      ).map((bm) => {
                        const active = baseMap === bm.id;
                        return (
                          <button
                            key={bm.id}
                            type="button"
                            onClick={() => setBaseMap(bm.id)}
                            className={`rounded-[6px] border py-2 text-xs font-medium transition-colors ${
                              active
                                ? "border-[var(--primary)] bg-[var(--surface-elevated)] text-[var(--foreground)] font-semibold"
                                : "border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground-secondary)]"
                            }`}
                          >
                            {bm.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Filtros Técnicos de Sensor e Turno */}
                  <div className="space-y-2.5 border-t border-[var(--border)] pt-3">
                    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                      <Filter size={11} />
                      <span>Parâmetros do Sensor Orbital</span>
                    </span>

                    <label className="block space-y-1">
                      <span className="block text-[11px] text-[var(--foreground-secondary)]">
                        Constelação de Satélites
                      </span>
                      <select
                        value={mapState.filtros.fonte}
                        onChange={(e) =>
                          updateFiltro("fonte", e.target.value as FiltroFocos["fonte"])
                        }
                        className="h-8 w-full rounded-[6px] border border-[var(--border)] bg-[var(--background-secondary)] px-2 text-xs text-[var(--foreground)]"
                      >
                        <option value="all">Todos (VIIRS 375 m + MODIS 1 km)</option>
                        <option value="VIIRS">Apenas VIIRS 375 m (NOAA-20/21 + SNPP)</option>
                        <option value="MODIS_NRT">Apenas MODIS 1 km (Terra + Aqua)</option>
                      </select>
                    </label>

                    <label className="block space-y-1">
                      <span className="block text-[11px] text-[var(--foreground-secondary)]">
                        Turno da Passagem Orbital
                      </span>
                      <select
                        value={mapState.filtros.diaNoite}
                        onChange={(e) =>
                          updateFiltro("diaNoite", e.target.value as FiltroFocos["diaNoite"])
                        }
                        className="h-8 w-full rounded-[6px] border border-[var(--border)] bg-[var(--background-secondary)] px-2 text-xs text-[var(--foreground)]"
                      >
                        <option value="all">Diurno e Noturno</option>
                        <option value="D">Apenas Diurno (D)</option>
                        <option value="N">Apenas Noturno (N)</option>
                      </select>
                    </label>

                    <label className="block space-y-1">
                      <span className="block text-[11px] text-[var(--foreground-secondary)]">
                        Potência Radiativa Mínima (FRP em MW)
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
                        className="h-8 w-full rounded-[6px] border border-[var(--border)] bg-[var(--background-secondary)] px-2 text-xs font-mono text-[var(--foreground)]"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Rodapé do Painel */}
              <div className="pt-2 border-t border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTop20Table((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline"
                  >
                    <Table2 size={13} />
                    <span>{showTop20Table ? "Ocultar tabela" : "Tabela completa Top 20"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCsv}
                    disabled={top20Focos.length === 0}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] disabled:opacity-50"
                  >
                    <Download size={13} />
                    <span>Exportar CSV</span>
                  </button>
                </div>

                <p className="text-[11px] text-[var(--muted)] leading-relaxed flex items-center justify-between">
                  <span>Fonte: NASA FIRMS · Malhas IBGE</span>
                  <Link href="/metodologia" className="text-[var(--sage)] hover:underline">
                    Metodologia →
                  </Link>
                </p>
              </div>
            </div>
          </aside>
        )}
      </section>

      {/* TABELA DE TOP 20 FOCOS (RECOLHIDA POR PADRÃO) */}
      {showTop20Table && (
        <section
          id="tabela-alternativa-focos"
          aria-labelledby="titulo-tabela-focos"
          className="section-inner max-w-7xl mx-auto py-8 space-y-4"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div className="space-y-1">
              <h2
                id="titulo-tabela-focos"
                className="font-display text-lg sm:text-xl font-semibold text-[var(--foreground)]"
              >
                Os 20 Focos Mais Intensos no Filtro Atual
              </h2>
              <FreshnessSeal
                atualizadoEm={resumo?.atualizadoEm}
                ultimoFocoEm={resumo?.ultimoFocoEm}
                desatualizado={resumo?.desatualizado}
                fonte={resumo?.fonte}
                periodo={mapState.filtros.periodo}
                compact
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={top20Focos.length === 0}
                className="btn-secondary !py-1.5 !px-3 text-xs disabled:opacity-50"
              >
                <Download size={13} />
                <span>Exportar CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setShowTop20Table(false)}
                className="btn-secondary !py-1.5 !px-3 text-xs"
              >
                Fechar tabela
              </button>
            </div>
          </div>

          <div
            data-lenis-prevent
            className="overflow-x-auto rounded-[12px] border border-[var(--border)] bg-[var(--surface)] shadow-soft"
          >
            <table className="w-full text-left text-xs text-[var(--foreground)]">
              <thead className="border-b border-[var(--border)] bg-[var(--background-secondary)] font-mono text-[11px] uppercase text-[var(--muted)]">
                <tr>
                  <th scope="col" className="py-3 px-3.5">#</th>
                  <th scope="col" className="py-3 px-3.5">Intensidade / FRP</th>
                  <th scope="col" className="py-3 px-3.5">Bioma</th>
                  <th scope="col" className="py-3 px-3.5">UF</th>
                  <th scope="col" className="py-3 px-3.5">Coordenadas</th>
                  <th scope="col" className="py-3 px-3.5">Horário (UTC)</th>
                  <th scope="col" className="py-3 px-3.5">Satélite</th>
                  <th scope="col" className="py-3 px-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] font-mono">
                {top20Focos.map((f, index) => (
                  <tr key={f.id} className="hover:bg-[var(--surface-elevated)] transition-colors">
                    <td className="py-2.5 px-3.5 text-[var(--muted)]">{index + 1}</td>
                    <td className="py-2.5 px-3.5">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
                        <IntensityShapeBadge intensidade={f.intensidade} />
                        <span>{f.frp.toFixed(1)} MW</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 font-sans font-medium">{f.biomaNome}</td>
                    <td className="py-2.5 px-3.5">{f.uf ?? "—"}</td>
                    <td className="py-2.5 px-3.5 text-[var(--foreground-secondary)]">
                      {f.latitude.toFixed(3)}°, {f.longitude.toFixed(3)}°
                    </td>
                    <td className="py-2.5 px-3.5 text-[var(--foreground-secondary)]">
                      {f.dataHoraUtc.replace("T", " ").slice(0, 16)}
                    </td>
                    <td className="py-2.5 px-3.5 font-sans">
                      {f.satelite} ({f.instrumento})
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-sans">
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
                        className="inline-flex items-center gap-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1 text-[11px] font-medium text-[var(--foreground)] hover:border-[var(--primary)]"
                      >
                        <MapPin size={12} className="text-[var(--primary)]" />
                        <span>Ver no mapa</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
