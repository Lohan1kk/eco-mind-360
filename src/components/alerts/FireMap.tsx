"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Trees, RefreshCw, Plus } from "lucide-react";
import { usePerfProfile } from "@/components/hooks/usePerfProfile";
import { readFiresCache, writeFiresCache } from "@/lib/alerts/firesCache";
import { isInBrazil } from "@/lib/alerts/geo";
import { ALERT_LEVELS, LEVEL_META } from "@/lib/alerts/levels";
import { addLocalReport, readLocalReports } from "@/lib/alerts/localReports";
import { selectVisibleAlerts } from "@/lib/alerts/selectVisible";
import type { AlertLevel, FireAlert } from "@/lib/alerts/types";
import { FireLegend } from "./FireLegend";
import { MapView } from "./MapView";
import { ReportFireModal } from "./ReportFireModal";

type MapLayer = "map" | "satellite";

interface FiresMeta {
  count: number;
  inpe: number;
  nasa: number;
  seed?: number;
  inpeSource: string | null;
  nasaEnabled: boolean;
  firmsKeyConfigured?: boolean;
  worldwide?: boolean;
  updatedAt: string;
  errors?: string[];
}

export default function FireMap() {
  const perf = usePerfProfile();
  const [alerts, setAlerts] = useState<FireAlert[]>([]);
  const [meta, setMeta] = useState<FiresMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [layer, setLayer] = useState<MapLayer>("map");
  const [showBiomes, setShowBiomes] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pickMode, setPickMode] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<AlertLevel | "all">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [partialWarning, setPartialWarning] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const loadSatellite = useCallback(async (fresh = false) => {
    const url = fresh ? "/api/fires?refresh=1" : "/api/fires";
    const firesRes = await fetch(
      url,
      fresh ? { cache: "no-store" } : undefined,
    );

    if (!firesRes.ok) {
      throw new Error("Falha ao buscar focos de satélite.");
    }

    const firesData = (await firesRes.json()) as {
      alerts: FireAlert[];
      meta: FiresMeta;
    };

    return {
      satellite: firesData.alerts,
      meta: firesData.meta,
    };
  }, []);

  const mergeAlerts = useCallback((satellite: FireAlert[]) => {
    const local = readLocalReports();
    return [...local, ...satellite];
  }, []);

  const applySatelliteResult = useCallback(
    (satellite: FireAlert[], m: FiresMeta, cached = false) => {
      setAlerts(mergeAlerts(satellite));
      setMeta(m);
      setFromCache(cached);
      if (!cached) {
        writeFiresCache(satellite, m);
      }
      if (m.errors?.length) {
        if (satellite.length === 0 && !cached) {
          setError(m.errors.join(" "));
          setPartialWarning(null);
        } else {
          setPartialWarning(m.errors.join(" "));
        }
      } else if (!cached) {
        setPartialWarning(null);
      }
    },
    [mergeAlerts],
  );

  useEffect(() => {
    loadSatellite()
      .then(({ satellite, meta: m }) => applySatelliteResult(satellite, m))
      .catch(() => {
        const cached = readFiresCache();
        if (cached) {
          applySatelliteResult(cached.alerts, cached.meta, true);
          setPartialWarning(
            "Sem conexão com o satélite — mostrando último mapa salvo neste aparelho.",
          );
        } else {
          setError("Não foi possível carregar os focos de queimada.");
        }
      })
      .finally(() => setLoading(false));
  }, [loadSatellite, applySatelliteResult]);

  async function refreshData() {
    setRefreshing(true);
    setError(null);
    setPartialWarning(null);
    try {
      const { satellite, meta: m } = await loadSatellite(true);
      applySatelliteResult(satellite, m);
    } catch {
      const cached = readFiresCache();
      if (cached) {
        applySatelliteResult(cached.alerts, cached.meta, true);
        setPartialWarning(
          "Atualização falhou — mantendo último mapa salvo neste aparelho.",
        );
      } else {
        setError("Não foi possível atualizar os dados.");
      }
    } finally {
      setRefreshing(false);
    }
  }

  function openReport() {
    setError(null);
    setCoords(null);
    setPickMode(false);
    setModalOpen(true);
  }

  function closeReport() {
    setModalOpen(false);
    setPickMode(false);
    setCoords(null);
    setError(null);
  }

  function handleMapClick(lat: number, lng: number) {
    if (!pickMode) return;
    if (!isInBrazil(lat, lng)) {
      setError("Marque um ponto dentro do Brasil.");
      return;
    }
    setCoords({ lat, lng });
    setPickMode(false);
    setError(null);
  }

  function handleGeolocation() {
    if (!navigator.geolocation) {
      setError("Geolocalização não disponível neste navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (!isInBrazil(lat, lng)) {
          setError("Sua localização está fora do Brasil.");
          return;
        }
        setCoords({ lat, lng });
        setPickMode(false);
        setError(null);
      },
      () => setError("Não foi possível obter sua localização."),
    );
  }

  async function handleSubmit(data: {
    lat: number;
    lng: number;
    level: AlertLevel;
    description?: string;
  }) {
    setSubmitting(true);
    setError(null);
    try {
      addLocalReport(data);
      setAlerts((prev) => {
        const satellite = prev.filter((a) => a.source !== "user");
        return mergeAlerts(satellite);
      });
      closeReport();
      loadSatellite()
        .then(({ satellite, meta: m }) => applySatelliteResult(satellite, m))
        .catch(() => {});
    } catch {
      setError("Não foi possível salvar o reporte neste aparelho.");
    } finally {
      setSubmitting(false);
    }
  }

  const filteredAlerts = useMemo(() => {
    const byLevel =
      levelFilter === "all"
        ? alerts
        : alerts.filter((a) => a.level === levelFilter);

    return selectVisibleAlerts(byLevel, perf.mapMaxAlerts);
  }, [alerts, levelFilter, perf.mapMaxAlerts]);

  const levelCounts = ALERT_LEVELS.reduce(
    (acc, level) => {
      acc[level] = alerts.filter((a) => a.level === level).length;
      return acc;
    },
    {} as Record<AlertLevel, number>,
  );

  const levelsWithData = ALERT_LEVELS.filter((level) => levelCounts[level] > 0);
  const showLevelFilters = levelsWithData.length > 1;

  const sourceLabel = (() => {
    if (!meta) return null;
    const parts: string[] = [];
    if (meta.inpe > 0) parts.push(`INPE ${meta.inpe}`);
    if (meta.nasa > 0) parts.push(`NASA mundo ${meta.nasa}`);
    if ((meta.seed ?? 0) > 0) parts.push(`demo ${meta.seed}`);
    if (!parts.length) return null;
    return parts.join(" · ");
  })();

  const freshnessLabel =
    meta?.inpeSource === "inpe-10min"
      ? " · INPE ~10 min"
      : meta?.inpeSource === "inpe-daily"
        ? " · INPE diário + FRP"
        : null;

  const tenMinNote =
    meta?.inpeSource === "inpe-10min" && !showLevelFilters
      ? "Fonte INPE 10 min sem FRP — intensidade estimada baixa. Atualize para o consolidado diário."
      : null;

  return (
    <div className="relative h-full w-full bg-[#101512]">
      {loading ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#101512] text-[#A7B3A9] text-xs font-mono">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#29362D] border-t-[#789B7C]" />
          <p>Carregando focos de satélite...</p>
        </div>
      ) : (
        <MapView
          alerts={filteredAlerts}
          layer={layer}
          pickMode={pickMode && modalOpen}
          onMapClick={handleMapClick}
          selectedCoords={coords}
          showBiomes={showBiomes}
        />
      )}

      {/* Controles Superiores Compactos */}
      <div className="pointer-events-none absolute inset-x-0 top-3 z-[1100] flex justify-center px-3">
        <div
          className="pointer-events-auto inline-flex items-center gap-1 rounded-[10px] border border-[#29362D] bg-[#171F1A]/95 p-1 shadow-lift backdrop-blur-md"
          role="tablist"
          aria-label="Tipo de mapa"
        >
          {(["map", "satellite"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={layer === mode}
              onClick={() => setLayer(mode)}
              className={`min-h-8 rounded-[7px] px-3.5 py-1 text-xs font-medium transition-colors touch-manipulation ${
                layer === mode
                  ? "bg-[#789B7C] text-[#101512] font-semibold"
                  : "text-[#A7B3A9] hover:text-[#DCE5DD] hover:bg-[#1D2821]"
              }`}
            >
              {mode === "map" ? "Mapa Vetorial" : "Satélite Orbital"}
            </button>
          ))}
          <div className="h-4 w-px bg-[#222D25] mx-1" />
          <button
            type="button"
            onClick={() => setShowBiomes((v) => !v)}
            className={`min-h-8 rounded-[7px] px-3 py-1 text-xs font-medium transition-colors inline-flex items-center gap-1.5 touch-manipulation ${
              showBiomes
                ? "bg-[#1D2821] text-[#91A88F] border border-[#29362D]"
                : "text-[#78877D] hover:text-[#DCE5DD] hover:bg-[#1D2821]"
            }`}
          >
            <Trees size={13} className="text-[#789B7C]" />
            <span>7 Biomas {showBiomes ? "Ativos" : "Ocultos"}</span>
          </button>
        </div>
      </div>

      {/* Telemetria e Filtros de Nível */}
      <div className="pointer-events-none absolute left-3 right-3 top-14 sm:top-14 z-[1100] flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {sourceLabel ? (
            <div className="pointer-events-auto max-w-[calc(100%-2.75rem)] truncate rounded-[7px] border border-[#29362D] bg-[#171F1A]/95 px-2.5 py-1.5 text-[11px] font-mono text-[#DCE5DD] shadow-soft backdrop-blur-md sm:max-w-none sm:px-3">
              {sourceLabel}
              <span className="hidden sm:inline text-[#91A88F]">{freshnessLabel}</span>
              <span className="ml-1 text-[#78877D]">
                · {filteredAlerts.length} visíveis
              </span>
            </div>
          ) : !loading ? (
            <div className="pointer-events-auto rounded-[7px] border border-[#29362D] bg-[#171F1A]/95 px-3 py-1.5 text-xs font-mono text-[#A9A17A] shadow-soft">
              Sem focos no momento
            </div>
          ) : null}

          {!loading ? (
            <button
              type="button"
              onClick={refreshData}
              disabled={refreshing}
              aria-label="Atualizar dados"
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-[7px] border border-[#29362D] bg-[#171F1A]/95 text-[#A7B3A9] hover:text-[#DCE5DD] hover:bg-[#1D2821] shadow-soft transition disabled:opacity-50 touch-manipulation"
            >
              <RefreshCw size={13} className={refreshing ? "animate-spin text-[#91A88F]" : ""} />
            </button>
          ) : null}
        </div>

        {showLevelFilters ? (
          <div className="pointer-events-auto flex max-w-full w-fit gap-1 overflow-x-auto rounded-[7px] border border-[#29362D] bg-[#171F1A]/95 p-1 shadow-soft backdrop-blur-md [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setLevelFilter("all")}
              className={`shrink-0 rounded-[5px] px-2.5 py-1 text-[10px] font-mono uppercase transition-colors touch-manipulation ${
                levelFilter === "all"
                  ? "bg-[#789B7C] text-[#101512] font-semibold"
                  : "text-[#A7B3A9] hover:text-[#DCE5DD]"
              }`}
            >
              Todos ({alerts.length})
            </button>
            {ALERT_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setLevelFilter(level)}
                className={`shrink-0 rounded-[5px] px-2.5 py-1 text-[10px] font-mono uppercase transition-colors touch-manipulation ${
                  levelFilter === level
                    ? "text-[#101512] font-semibold"
                    : "text-[#A7B3A9] hover:text-[#DCE5DD]"
                }`}
                style={
                  levelFilter === level
                    ? { backgroundColor: LEVEL_META[level].color }
                    : undefined
                }
              >
                {LEVEL_META[level].label} ({levelCounts[level]})
              </button>
            ))}
          </div>
        ) : tenMinNote ? (
          <p className="pointer-events-auto max-w-sm rounded-[7px] border border-[#29362D] bg-[#171F1A]/95 px-3 py-1.5 text-[11px] text-[#A7B3A9] shadow-soft">
            {tenMinNote}
          </p>
        ) : null}

        {fromCache ? (
          <p className="pointer-events-auto max-w-md rounded-[7px] border border-[#29362D] bg-[#171F1A]/95 px-3 py-1.5 text-[11px] font-mono text-[#91A88F] shadow-soft">
            Dados em cache neste aparelho
            {meta?.updatedAt
              ? ` · ${new Date(meta.updatedAt).toLocaleString("pt-BR")}`
              : ""}
          </p>
        ) : null}

        {partialWarning ? (
          <p className="pointer-events-auto max-w-md rounded-[7px] border border-[#29362D] bg-[#171F1A]/95 px-3 py-1.5 text-[11px] text-[#A9A17A] shadow-soft">
            {partialWarning}
          </p>
        ) : null}
      </div>

      {/* Legenda Inferior Esquerda */}
      <div className="pointer-events-none absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-2 z-[1100] sm:bottom-6 sm:left-3">
        <div className="pointer-events-auto">
          <FireLegend />
        </div>
      </div>

      {/* Botão Discreto de Reportar Queimada */}
      <button
        type="button"
        onClick={openReport}
        aria-label="Reportar queimada"
        className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-3 z-[1100] flex items-center gap-2 rounded-[10px] border border-[#29362D] bg-[#1D2821] hover:bg-[#243129] px-3.5 py-2.5 text-xs font-medium text-[#DCE5DD] shadow-lift transition touch-manipulation sm:bottom-6 sm:right-4"
      >
        <Plus size={15} className="text-[#91A88F]" />
        <span className="hidden sm:inline">Reportar foco</span>
      </button>

      {error && !modalOpen ? (
        <div className="absolute bottom-20 right-3 z-[1100] flex max-w-[min(20rem,calc(100vw-5rem))] flex-col gap-2 rounded-[10px] border border-[#A77D78]/40 bg-[#171F1A] px-3.5 py-2.5 text-xs text-[#DCE5DD] shadow-lift sm:right-4">
          <p className="text-[#A77D78]">{error}</p>
          <button
            type="button"
            onClick={refreshData}
            disabled={refreshing}
            className="self-start rounded-[5px] bg-[#1D2821] border border-[#29362D] px-2.5 py-1 text-[11px] font-medium text-[#DCE5DD] hover:bg-[#243129] disabled:opacity-50 touch-manipulation"
          >
            Tentar de novo
          </button>
        </div>
      ) : null}

      <ReportFireModal
        open={modalOpen}
        onClose={closeReport}
        onSubmit={handleSubmit}
        coords={coords}
        pickMode={pickMode}
        onStartPickMode={() => {
          setPickMode(true);
          setCoords(null);
          setError(null);
        }}
        onCancelPickMode={() => {
          setPickMode(false);
          setError(null);
        }}
        onUseGeolocation={handleGeolocation}
        submitting={submitting}
        error={error}
      />
    </div>
  );
}
