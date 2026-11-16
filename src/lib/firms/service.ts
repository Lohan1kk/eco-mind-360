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
const FETCH_TIMEOUT_MS = 8500;
const MAX_RETRIES = 1;

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
  return path.join(process.cwd(), ".next", "cache", `firms-${periodo}.json`);
}

function readDiskCache(periodo: PeriodoFocos): PeriodCacheEntry | null {
  try {
    const file = getDiskCachePath(periodo);
    if (!fs.existsSync(file)) return null;
    const raw = fs.readFileSync(file, "utf8");
    const parsed = JSON.parse(raw) as PeriodCacheEntry;
    if (Array.isArray(parsed.focos) && parsed.atualizadoEm) {
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
    // Falha silenciosa se filesystem for somente-leitura (ex.: serverless sem /tmp)
  }
}

/**
 * Busca um único endpoint CSV do NASA FIRMS com timeout e retry limitado.
 * NUNCA inclui a chave ou a URL completa em mensagens de erro ou logs.
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
      if (text.includes("Invalid MAP_KEY") || text.includes("Invalid day range")) {
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

function formatUtcDateDaysAgo(daysAgo: number, baseMs = Date.now()): string {
  const d = new Date(baseMs - daysAgo * 24 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

/**
 * Busca todos os focos do Brasil para o período solicitado ('24h', '48h' ou '7d')
 * combinando VIIRS (375 m) como principal e MODIS (1 km) como complementar.
 * Para 7 dias, divide em duas janelas ([5 dias recentes] + [3 dias anteriores com data])
 * respeitando o limite máximo de 5 dias por chamada do NASA FIRMS.
 */
async function fetchPeriodFromFirms(
  mapKey: string,
  periodo: PeriodoFocos,
): Promise<PeriodCacheEntry> {
  const allRawFocos: FocoCalor[] = [];
  const fontesAtivas: string[] = [];

  const sourceResults = await Promise.allSettled(
    FIRMS_SOURCES.map(async (source) => {
      if (periodo === "24h") {
        // Pede 2 dias calendário UTC para garantir cobertura completa de 24h mesmo perto de 00:00 UTC
        const csv = await fetchFirmsCsvSafe(mapKey, source, 2);
        return { source, focos: parseFirmsCsvToFocos(csv, source) };
      }

      if (periodo === "48h") {
        // Pede 3 dias calendário UTC para cobrir 48h completas
        const csv = await fetchFirmsCsvSafe(mapKey, source, 3);
        return { source, focos: parseFirmsCsvToFocos(csv, source) };
      }

      // 7d: FIRMS permite no máximo 5 dias por requisição.
      // Fazemos 2 chamadas: últimos 5 dias + 3 dias a partir de 7 dias atrás.
      const startOlderDate = formatUtcDateDaysAgo(7);
      const [recentCsv, olderCsv] = await Promise.all([
        fetchFirmsCsvSafe(mapKey, source, 5),
        fetchFirmsCsvSafe(mapKey, source, 3, startOlderDate),
      ]);
      const recentFocos = parseFirmsCsvToFocos(recentCsv, source);
      const olderFocos = parseFirmsCsvToFocos(olderCsv, source);
      return { source, focos: [...recentFocos, ...olderFocos] };
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

  if (fulfilledCount === 0 || (allRawFocos.length === 0 && rejectedCount > 0)) {
    throw new Error("Não foi possível obter dados dos satélites do NASA FIRMS no momento.");
  }

  // Filtra para a janela exata de horas (24h, 48h ou 168h) em relação à passagem mais recente
  const windowHours = periodo === "24h" ? 24 : periodo === "48h" ? 48 : 168;
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
 * e fallback resiliente para o último dado real em cache caso a API falhe.
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
    const disk = readDiskCache(periodo);
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

  const mapKey = process.env.NASA_FIRMS_MAP_KEY?.trim();
  if (!mapKey) {
    const isDev = process.env.NODE_ENV !== "production";
    const msg = isDev
      ? "Chave NASA_FIRMS_MAP_KEY não configurada. Copie .env.example para .env.local e defina sua chave do NASA FIRMS."
      : "Dados orbitais temporariamente indisponíveis no momento.";

    if (cached) {
      return {
        entry: cached,
        desatualizado: true,
        semChave: true,
        erro: msg,
      };
    }
    return {
      entry: null,
      desatualizado: true,
      semChave: true,
      erro: msg,
    };
  }

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
        erro: "A API do NASA FIRMS não respondeu no tempo limite. Exibindo o último dado real salvo em cache.",
      };
    }
    return {
      entry: null,
      desatualizado: true,
      semChave: false,
      erro: "Não foi possível conectar ao servidor do NASA FIRMS no momento e não há dados anteriores em cache.",
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
 * Função única `getResumoFocos()` compartilhada por todas as páginas do site
 * (Home, Radar dos Biomas, Dashboard, Comparador, Fichas dos Biomas e Mapa)
 * para garantir que os números nunca divirjam.
 */
export async function getResumoFocos(
  rawFiltro?: Partial<FiltroFocos>,
): Promise<ResumoFocos> {
  const result = await queryFocos(rawFiltro);
  return result.resumo;
}
