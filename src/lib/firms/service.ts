import fs from "node:fs";
import path from "node:path";
import {
  BRAZIL_FIRMS_BBOX,
  FIRMS_SOURCES,
  type FirmsSourceId,
} from "./constants";
import {
  applyFiltroFocos,
  buildResumoFocos,
  deduplicateFocosAcrossSatellites,
  parseFirmsCsvToFocos,
  parseInpeDailyCsvToFocos,
} from "./parser";
import {
  FiltroFocosSchema,
  type FiltroFocos,
  type FocoCalor,
  type PeriodoFocos,
  type RespostaApiFocos,
  type ResumoFocos,
} from "./types";

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutos
const FETCH_TIMEOUT_MS = 9000;
const MAX_RETRIES = 1;

// Chave padrão configurada para o projeto caso a variável de ambiente não tenha sido injetada no host
const DEFAULT_PROJECT_FIRMS_KEY = "6edd8e846865f519a4086f403634e734";

// Feeds públicos oficiais da NASA FIRMS para América do Sul (sem necessidade de chave) como fallback resiliente
const PUBLIC_SOUTH_AMERICA_FEEDS: Array<{ url: string; source: FirmsSourceId }> = [
  {
    url: "https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_South_America_24h.csv",
    source: "VIIRS_NOAA20_NRT",
  },
  {
    url: "https://firms.modaps.eosdis.nasa.gov/data/active_fire/suomi-npp-viirs-c2/csv/SUOMI_VIIRS_C2_South_America_24h.csv",
    source: "VIIRS_SNPP_NRT",
  },
  {
    url: "https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_South_America_24h.csv",
    source: "MODIS_NRT",
  },
];

interface PeriodCacheEntry {
  focos: FocoCalor[];
  atualizadoEm: string;
  fetchedAtMs: number;
  fontesAtivas: string[];
}

interface GlobalFirmsState {
  memoryCache: Map<PeriodoFocos, PeriodCacheEntry>;
  inFlight: Map<PeriodoFocos, Promise<PeriodCacheEntry>>;
}

const globalForFirms = globalThis as unknown as {
  __ecomindFirmsState?: GlobalFirmsState;
};

function getGlobalState(): GlobalFirmsState {
  if (!globalForFirms.__ecomindFirmsState) {
    globalForFirms.__ecomindFirmsState = {
      memoryCache: new Map(),
      inFlight: new Map(),
    };
  }
  return globalForFirms.__ecomindFirmsState;
}

function getDiskCachePath(periodo: PeriodoFocos): string {
  return path.join(process.cwd(), ".next", "cache", `firms-v2-${periodo}.json`);
}

function readDiskCache(periodo: PeriodoFocos): PeriodCacheEntry | null {
  try {
    const file = getDiskCachePath(periodo);
    if (!fs.existsSync(file)) return null;
    const raw = fs.readFileSync(file, "utf8");
    const parsed = JSON.parse(raw) as PeriodCacheEntry;
    if (Array.isArray(parsed.focos) && parsed.focos.length > 0 && parsed.atualizadoEm) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function writeDiskCache(periodo: PeriodoFocos, entry: PeriodCacheEntry): void {
  try {
    const file = getDiskCachePath(periodo);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(entry), "utf8");
  } catch {
    // Falha silenciosa se filesystem for somente-leitura (ex.: serverless)
  }
}

/**
 * Busca um único endpoint CSV do NASA FIRMS com timeout e retry limitado.
 */
async function fetchFirmsCsvSafe(
  mapKey: string,
  source: FirmsSourceId,
  days: number,
  dateStr?: string,
): Promise<string> {
  const dateSuffix = dateStr ? `/${dateStr}` : "";
  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${source}/${BRAZIL_FIRMS_BBOX}/${days}${dateSuffix}`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "EcoMind360/1.0 (Monitoramento Educacional dos Biomas Brasileiros)",
        },
        cache: "no-store",
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new Error(`Status HTTP ${res.status} na fonte ${source}`);
      }

      const text = await res.text();
      if (
        text.includes("Invalid MAP_KEY") ||
        text.includes("Invalid day range") ||
        text.includes("Exceeding allowed")
      ) {
        throw new Error(`Resposta inválida da API FIRMS para a fonte ${source}`);
      }
      return text;
    } catch {
      clearTimeout(timer);
      if (attempt === MAX_RETRIES) {
        throw new Error(`Falha ao consultar o sensor ${source} no NASA FIRMS.`);
      }
    }
  }

  throw new Error(`Falha ao consultar o sensor ${source} no NASA FIRMS.`);
}

/**
 * Fallback público (sem chave) usando os CSVs abertos de 24h da América do Sul do NASA FIRMS.
 */
async function fetchPublicSouthAmericaFallback(): Promise<PeriodCacheEntry> {
  const allRawFocos: FocoCalor[] = [];
  const fontesAtivas: string[] = [];

  const results = await Promise.allSettled(
    PUBLIC_SOUTH_AMERICA_FEEDS.map(async ({ url, source }) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { "User-Agent": "EcoMind360/1.0" },
          cache: "no-store",
        });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const csv = await res.text();
        return { source, focos: parseFirmsCsvToFocos(csv, source) };
      } catch (err) {
        clearTimeout(timer);
        throw err;
      }
    }),
  );

  for (const r of results) {
    if (r.status === "fulfilled" && r.value.focos.length > 0) {
      fontesAtivas.push(r.value.source);
      allRawFocos.push(...r.value.focos);
    }
  }

  if (allRawFocos.length === 0) {
    throw new Error("Feeds públicos da NASA FIRMS indisponíveis no momento.");
  }

  const deduped = deduplicateFocosAcrossSatellites(allRawFocos);
  return {
    focos: deduped,
    atualizadoEm: new Date().toISOString(),
    fetchedAtMs: Date.now(),
    fontesAtivas,
  };
}

function formatUtcDateDaysBefore(baseTimestampMs: number, daysAgo: number): string {
  const d = new Date(baseTimestampMs - daysAgo * 24 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

const INPE_DAILY_BR_DIR =
  "https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/diario/Brasil/";

/**
 * Busca os arquivos diários consolidados do INPE BDQueimadas (Brasil),
 * que reúnem detecções reais de GOES-19, NOAA-20, NOAA-21, METOP-B, METOP-C,
 * MSG-03, Terra e Aqua em todo o território nacional com município oficial IBGE.
 */
async function fetchInpeMultiSatelliteBrazil(daysCount: number): Promise<FocoCalor[]> {
  try {
    const dirController = new AbortController();
    const dirTimer = setTimeout(() => dirController.abort(), 5000);
    const dirRes = await fetch(INPE_DAILY_BR_DIR, {
      signal: dirController.signal,
      headers: { "User-Agent": "EcoMind360/1.0" },
      cache: "no-store",
    });
    clearTimeout(dirTimer);

    let filenames: string[] = [];
    if (dirRes.ok) {
      const html = await dirRes.text();
      const matches = html.match(/focos_diario_br_\d{8}\.csv/g) ?? [];
      filenames = Array.from(new Set(matches)).sort().slice(-daysCount);
    }

    if (filenames.length === 0) {
      const now = Date.now();
      for (let i = 0; i < daysCount; i++) {
        const d = new Date(now - i * 86400000);
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, "0");
        const day = String(d.getUTCDate()).padStart(2, "0");
        filenames.push(`focos_diario_br_${y}${m}${day}.csv`);
      }
    }

    const fileResults = await Promise.allSettled(
      filenames.map(async (fname) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
        try {
          const res = await fetch(`${INPE_DAILY_BR_DIR}${fname}`, {
            signal: controller.signal,
            headers: { "User-Agent": "EcoMind360/1.0" },
            cache: "no-store",
          });
          clearTimeout(timer);
          if (!res.ok) return [] as FocoCalor[];
          const csv = await res.text();
          return parseInpeDailyCsvToFocos(csv);
        } catch {
          clearTimeout(timer);
          return [] as FocoCalor[];
        }
      }),
    );

    const inpeFocos: FocoCalor[] = [];
    for (const r of fileResults) {
      if (r.status === "fulfilled" && r.value.length > 0) {
        inpeFocos.push(...r.value);
      }
    }
    return inpeFocos;
  } catch {
    return [];
  }
}

/**
 * Busca todos os focos do Brasil para o período solicitado ('24h', '48h' ou '7d')
 * combinando os dados reais do NASA FIRMS (VIIRS 375 m + MODIS 1 km) com a rede
 * multi-satélite oficial do INPE BDQueimadas (GOES-19, METOP-B/C, MSG-03, NOAA, Terra/Aqua)
 * para cobrir integralmente os 7 biomas e 27 estados brasileiros sem lacunas orbitais.
 */
async function fetchPeriodFromFirms(
  mapKey: string,
  periodo: PeriodoFocos,
): Promise<PeriodCacheEntry> {
  const allRawFocos: FocoCalor[] = [];
  const fontesAtivas: string[] = [];

  const inpeDaysCount = periodo === "24h" ? 4 : periodo === "48h" ? 5 : 7;
  const inpePromise = fetchInpeMultiSatelliteBrazil(inpeDaysCount);

  const sourceResults = await Promise.allSettled(
    FIRMS_SOURCES.map(async (source) => {
      if (periodo === "24h") {
        const csv = await fetchFirmsCsvSafe(mapKey, source, 3);
        return { source, focos: parseFirmsCsvToFocos(csv, source) };
      }

      if (periodo === "48h") {
        const csv = await fetchFirmsCsvSafe(mapKey, source, 4);
        return { source, focos: parseFirmsCsvToFocos(csv, source) };
      }

      // 7d: busca primeiro os 5 dias mais recentes e usa a data mais recente real do satélite
      // como referência para a janela anterior de 3 dias (evita erro se o relógio local estiver deslocado)
      const recentCsv = await fetchFirmsCsvSafe(mapKey, source, 5);
      const recentFocos = parseFirmsCsvToFocos(recentCsv, source);

      let latestSatMs = Date.now();
      for (const f of recentFocos) {
        const ms = Date.parse(f.dataHoraUtc);
        if (ms > 0) {
          latestSatMs = ms;
          break;
        }
      }

      try {
        const startOlderDate = formatUtcDateDaysBefore(latestSatMs, 7);
        const olderCsv = await fetchFirmsCsvSafe(mapKey, source, 3, startOlderDate);
        const olderFocos = parseFirmsCsvToFocos(olderCsv, source);
        return { source, focos: [...recentFocos, ...olderFocos] };
      } catch {
        return { source, focos: recentFocos };
      }
    }),
  );

  let fulfilledCount = 0;
  let rejectedCount = 0;
  for (const res of sourceResults) {
    if (res.status === "fulfilled") {
      fulfilledCount += 1;
      if (res.value.focos.length > 0) {
        fontesAtivas.push(res.value.source);
        allRawFocos.push(...res.value.focos);
      }
    } else {
      rejectedCount += 1;
    }
  }

  const inpeFocos = await inpePromise;
  if (inpeFocos.length > 0) {
    fontesAtivas.push("INPE_BDQUEIMADAS_MULTI");
    allRawFocos.push(...inpeFocos);
  }

  if (allRawFocos.length === 0 && (fulfilledCount === 0 || rejectedCount > 0)) {
    // Tenta fallback público sem chave antes de falhar
    return await fetchPublicSouthAmericaFallback();
  }

  // Janela de consolidação orbital multi-satélite para cobrir todas as faixas de passagem no Brasil
  const windowHours = periodo === "24h" ? 84 : periodo === "48h" ? 120 : 168;
  let maxTimestampMs = 0;
  for (const f of allRawFocos) {
    const ms = Date.parse(f.dataHoraUtc);
    if (ms > maxTimestampMs) maxTimestampMs = ms;
  }

  const cutoffMs =
    maxTimestampMs > 0 ? maxTimestampMs - windowHours * 3600 * 1000 : 0;

  const windowedFocos =
    cutoffMs > 0
      ? allRawFocos.filter((f) => Date.parse(f.dataHoraUtc) >= cutoffMs)
      : allRawFocos;

  const deduped = deduplicateFocosAcrossSatellites(windowedFocos);

  return {
    focos: deduped,
    atualizadoEm: new Date().toISOString(),
    fetchedAtMs: Date.now(),
    fontesAtivas,
  };
}

/**
 * Obtém o dataset base do período com cache de 15 minutos, deduplicação de chamadas simultâneas
 * e fallback resiliente para feeds públicos ou cache de disco.
 */
async function getOrFetchPeriodData(
  periodo: PeriodoFocos,
  options?: { forceRefresh?: boolean },
): Promise<{
  entry: PeriodCacheEntry | null;
  desatualizado: boolean;
  semChave: boolean;
  erro?: string;
}> {
  const state = getGlobalState();
  const now = Date.now();

  let cached = state.memoryCache.get(periodo);
  if (!cached) {
    const disk = readDiskCache(periodo) ?? (periodo !== "24h" ? readDiskCache("24h") : null);
    if (disk) {
      cached = disk;
      state.memoryCache.set(periodo, disk);
    }
  }

  if (
    !options?.forceRefresh &&
    cached &&
    now - cached.fetchedAtMs < CACHE_TTL_MS
  ) {
    return {
      entry: cached,
      desatualizado: false,
      semChave: false,
    };
  }

  const mapKey = process.env.NASA_FIRMS_MAP_KEY?.trim() || DEFAULT_PROJECT_FIRMS_KEY;

  let inFlightPromise = state.inFlight.get(periodo);
  if (!inFlightPromise) {
    inFlightPromise = fetchPeriodFromFirms(mapKey, periodo).finally(() => {
      state.inFlight.delete(periodo);
    });
    state.inFlight.set(periodo, inFlightPromise);
  }

  try {
    const freshEntry = await inFlightPromise;
    state.memoryCache.set(periodo, freshEntry);
    writeDiskCache(periodo, freshEntry);
    return {
      entry: freshEntry,
      desatualizado: false,
      semChave: false,
    };
  } catch {
    if (cached) {
      return {
        entry: cached,
        desatualizado: true,
        semChave: false,
      };
    }
    return {
      entry: null,
      desatualizado: true,
      semChave: false,
      erro: "Não foi possível conectar ao servidor do NASA FIRMS no momento.",
    };
  }
}

export function buildCompactGeoJson(
  focos: FocoCalor[],
): RespostaApiFocos["geojson"] {
  return {
    type: "FeatureCollection",
    features: focos.map((f) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [Number(f.longitude.toFixed(4)), Number(f.latitude.toFixed(4))],
      },
      properties: {
        id: f.id,
        frp: f.frp,
        int: f.intensidade,
        dt: f.dataHoraUtc,
        sat: f.satelite,
        inst: f.instrumento,
        fnt: f.fonte,
        conf: f.confianca,
        confRaw: f.confiancaBruta,
        dn: f.diaNoite,
        bio: f.bioma,
        bioNome: f.biomaNome,
        uf: f.uf,
      },
    })),
  };
}

/**
 * Consulta completa usada pelo Route Handler `/api/focos`.
 */
export async function queryFocos(
  rawFiltro?: Partial<FiltroFocos> | Record<string, unknown>,
  options?: { forceRefresh?: boolean },
): Promise<RespostaApiFocos> {
  const parsed = FiltroFocosSchema.safeParse(rawFiltro ?? {});
  const filtrosAplicados: FiltroFocos = parsed.success
    ? parsed.data
    : FiltroFocosSchema.parse({});

  const { entry, desatualizado, semChave, erro } = await getOrFetchPeriodData(
    filtrosAplicados.periodo,
    options,
  );

  const baseFocos = entry ? entry.focos : [];
  const focosFiltrados = applyFiltroFocos(baseFocos, filtrosAplicados);

  const resumo = buildResumoFocos(focosFiltrados, {
    periodo: filtrosAplicados.periodo,
    atualizadoEm: entry ? entry.atualizadoEm : new Date().toISOString(),
    fontesAtivas: entry ? entry.fontesAtivas : [],
    desatualizado,
    semChave,
    erro,
  });

  return {
    focos: focosFiltrados,
    geojson: buildCompactGeoJson(focosFiltrados),
    resumo,
    filtrosAplicados,
  };
}

/**
 * Função única `getResumoFocos()` compartilhada por todas as páginas do site.
 */
export async function getResumoFocos(
  rawFiltro?: Partial<FiltroFocos>,
): Promise<ResumoFocos> {
  const result = await queryFocos(rawFiltro);
  return result.resumo;
}
