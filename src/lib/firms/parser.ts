import type { BiomeId } from "@/data/types";
import {
  BIOME_NAMES,
  FRP_INTENSITY_THRESHOLDS,
  type FirmsSourceId,
  type IntensidadeFoco,
} from "./constants";
import { classifyLocation } from "./spatial";
import {
  RawFirmsRowSchema,
  type ConfiancaNormalizada,
  type DiaNoite,
  type FiltroFocos,
  type FocoCalor,
  type PeriodoFocos,
  type ResumoBiomaFocos,
  type ResumoFocos,
} from "./types";

const BIOME_IDS: BiomeId[] = [
  "amazonia",
  "cerrado",
  "mata_atlantica",
  "caatinga",
  "pampa",
  "pantanal",
  "costeiro_marinho",
];

const INTENSIDADE_ORDER: Record<IntensidadeFoco, number> = {
  baixo: 1,
  medio: 2,
  alto: 3,
  critico: 4,
};

/**
 * Classifica a potência radiativa do fogo (FRP em MW) nas 4 faixas de intensidade
 * definidas como critério operacional do projeto EcoMind 360°:
 * - Crítico: ≥ 100 MW
 * - Alto: ≥ 40 MW e < 100 MW
 * - Médio: ≥ 15 MW e < 40 MW
 * - Baixo: < 15 MW
 */
export function classifyFrpIntensity(frp: number): IntensidadeFoco {
  if (!Number.isFinite(frp) || frp < FRP_INTENSITY_THRESHOLDS.MEDIO) {
    return "baixo";
  }
  if (frp >= FRP_INTENSITY_THRESHOLDS.CRITICO) {
    return "critico";
  }
  if (frp >= FRP_INTENSITY_THRESHOLDS.ALTO) {
    return "alto";
  }
  return "medio";
}

/**
 * Normaliza as escalas distintas de confiança entre os sensores:
 * - VIIRS usa categorias textuais: 'l' / 'low' -> baixa, 'n' / 'nominal' -> nominal, 'h' / 'high' -> alta
 * - MODIS usa escala numérica de 0 a 100%: < 30 -> baixa, 30..79 -> nominal, >= 80 -> alta
 */
export function normalizeConfidence(
  rawConfidence: string,
  instrument: "VIIRS" | "MODIS",
): { confianca: ConfiancaNormalizada; confiancaBruta: string } {
  const clean = rawConfidence.trim().toLowerCase();

  if (instrument === "VIIRS") {
    if (clean === "h" || clean === "high" || clean === "alta") {
      return { confianca: "alta", confiancaBruta: "alta (h)" };
    }
    if (clean === "l" || clean === "low" || clean === "baixa") {
      return { confianca: "baixa", confiancaBruta: "baixa (l)" };
    }
    return { confianca: "nominal", confiancaBruta: "nominal (n)" };
  }

  const num = Number.parseFloat(clean);
  if (!Number.isNaN(num)) {
    const pct = `${Math.round(num)}%`;
    if (num >= 80) return { confianca: "alta", confiancaBruta: pct };
    if (num >= 30) return { confianca: "nominal", confiancaBruta: pct };
    return { confianca: "baixa", confiancaBruta: pct };
  }

  return { confianca: "nominal", confiancaBruta: rawConfidence.trim() || "nominal" };
}

export function normalizeSatelliteName(rawSat: string, source: FirmsSourceId): string {
  const clean = rawSat.trim().toUpperCase();
  if (clean === "N20" || clean === "J1" || source === "VIIRS_NOAA20_NRT") {
    return "NOAA-20";
  }
  if (clean === "N21" || clean === "J2" || source === "VIIRS_NOAA21_NRT") {
    return "NOAA-21";
  }
  if (clean === "N" || clean === "SNPP" || source === "VIIRS_SNPP_NRT") {
    return "Suomi-NPP";
  }
  if (clean === "T" || clean === "TERRA") {
    return "Terra";
  }
  if (clean === "A" || clean === "AQUA") {
    return "Aqua";
  }
  return rawSat.trim() || source;
}

/**
 * Converte acq_date (YYYY-MM-DD) e acq_time (HHMM ou HMM ou MM) do FIRMS em ISO 8601 UTC.
 */
export function parseAcqDateTimeUtc(acqDate: string, acqTime: string): string {
  const padded = acqTime.trim().padStart(4, "0");
  const hh = padded.slice(0, 2);
  const mm = padded.slice(2, 4);
  const isoCandidate = `${acqDate.trim()}T${hh}:${mm}:00.000Z`;
  const parsed = new Date(isoCandidate);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Data/hora inválida no CSV FIRMS: ${acqDate} ${acqTime}`);
  }
  return parsed.toISOString();
}

/**
 * Faz o parse de um CSV retornado pelo NASA FIRMS, valida cada linha com Zod,
 * normaliza campos e classifica bioma e UF usando o índice espacial oficial do IBGE.
 */
export function parseFirmsCsvToFocos(
  csvText: string,
  source: FirmsSourceId,
  options?: { filterForeignContinent?: boolean },
): FocoCalor[] {
  const filterForeign = options?.filterForeignContinent ?? true;
  const trimmed = csvText.trim();
  if (!trimmed) return [];

  const lines = trimmed.split(/\r?\n/);
  if (lines.length < 2) return [];

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const latIdx = header.indexOf("latitude");
  const lonIdx = header.indexOf("longitude");
  const dateIdx = header.indexOf("acq_date");
  const timeIdx = header.indexOf("acq_time");
  const satIdx = header.indexOf("satellite");
  const instIdx = header.indexOf("instrument");
  const confIdx = header.indexOf("confidence");
  const frpIdx = header.indexOf("frp");
  const dnIdx = header.indexOf("daynight");

  if (latIdx === -1 || lonIdx === -1 || dateIdx === -1 || timeIdx === -1 || frpIdx === -1) {
    return [];
  }

  const results: FocoCalor[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = line.split(",");
    if (cols.length < header.length) continue;

    const rawCandidate = {
      latitude: Number.parseFloat(cols[latIdx]),
      longitude: Number.parseFloat(cols[lonIdx]),
      acq_date: cols[dateIdx]?.trim() ?? "",
      acq_time: cols[timeIdx]?.trim() ?? "",
      satellite: satIdx !== -1 && cols[satIdx]?.trim() ? cols[satIdx].trim() : source,
      instrument:
        instIdx !== -1 && cols[instIdx]?.trim()
          ? cols[instIdx].trim().toUpperCase()
          : source.startsWith("MODIS")
            ? "MODIS"
            : "VIIRS",
      confidence: confIdx !== -1 ? (cols[confIdx]?.trim() ?? "n") : "n",
      frp: Number.parseFloat(cols[frpIdx]),
      daynight: (dnIdx !== -1 ? cols[dnIdx]?.trim().toUpperCase() : "D") as DiaNoite,
    };

    const parsed = RawFirmsRowSchema.safeParse(rawCandidate);
    if (!parsed.success) {
      continue;
    }

    const row = parsed.data;
    const instrumento: "VIIRS" | "MODIS" =
      row.instrument.includes("MODIS") || source === "MODIS_NRT" ? "MODIS" : "VIIRS";

    let dataHoraUtc: string;
    try {
      dataHoraUtc = parseAcqDateTimeUtc(row.acq_date, row.acq_time);
    } catch {
      continue;
    }

    const latitude = Number(row.latitude.toFixed(4));
    const longitude = Number(row.longitude.toFixed(4));
    const frp = Number(row.frp.toFixed(1));

    const { bioma, biomaNome, uf, isForeignContinent } = classifyLocation(latitude, longitude);
    if (filterForeign && isForeignContinent) {
      continue;
    }

    const { confianca, confiancaBruta } = normalizeConfidence(row.confidence, instrumento);
    const satelite = normalizeSatelliteName(row.satellite, source);
    const intensidade = classifyFrpIntensity(frp);

    results.push({
      id: `${source}-${row.acq_date}-${row.acq_time.padStart(4, "0")}-${latitude.toFixed(4)}-${longitude.toFixed(4)}`,
      latitude,
      longitude,
      dataHoraUtc,
      satelite,
      instrumento,
      fonte: source,
      confianca,
      confiancaBruta,
      frp,
      intensidade,
      diaNoite: row.daynight,
      bioma,
      biomaNome,
      uf,
    });
  }

  return results;
}

/**
 * Combina detecções mantendo VIIRS (375 m) como fonte principal e MODIS (1 km) como complementar,
 * sem contar duplicatas entre satélites de forma enganosa:
 * 1. Entre satélites VIIRS (NOAA-20, NOAA-21, Suomi-NPP), colapsa detecções na mesma célula (~375 m)
 *    e janela de 30 minutos mantendo a de maior FRP.
 * 2. Para pontos MODIS (1 km), só adiciona o ponto complementar se não houver detecção VIIRS
 *    num raio de ~1,1 km (célula de 0,01°) na janela de 4 horas.
 */
export function deduplicateFocosAcrossSatellites(focos: FocoCalor[]): FocoCalor[] {
  const viirsList = focos.filter((f) => f.instrumento === "VIIRS");
  const modisList = focos.filter((f) => f.instrumento === "MODIS");

  // 1. Deduplicação fina dentro do VIIRS (mesma passagem/célula de ~0.0035°)
  const viirsByKey = new Map<string, FocoCalor>();
  for (const f of viirsList) {
    const timeBucket = Math.floor(Date.parse(f.dataHoraUtc) / (30 * 60 * 1000));
    const latCell = Math.round(f.latitude * 280);
    const lonCell = Math.round(f.longitude * 280);
    const key = `${latCell}:${lonCell}:${timeBucket}`;
    const existing = viirsByKey.get(key);
    if (!existing || f.frp > existing.frp) {
      viirsByKey.set(key, f);
    }
  }

  const dedupedViirs = Array.from(viirsByKey.values());

  // Índice rápido de células de 0.01° (~1.1 km) do VIIRS para verificar sobreposição com MODIS
  const viirsGrid1km = new Map<string, number[]>();
  for (const v of dedupedViirs) {
    const t = Date.parse(v.dataHoraUtc);
    const rLat = Math.round(v.latitude * 100);
    const rLon = Math.round(v.longitude * 100);
    for (let dLat = -1; dLat <= 1; dLat++) {
      for (let dLon = -1; dLon <= 1; dLon++) {
        const cellKey = `${rLat + dLat}:${rLon + dLon}`;
        const list = viirsGrid1km.get(cellKey);
        if (list) {
          list.push(t);
        } else {
          viirsGrid1km.set(cellKey, [t]);
        }
      }
    }
  }

  // 2. Filtra MODIS complementar (apenas onde VIIRS não detectou no mesmo km e janela de 4h)
  const modisByKey = new Map<string, FocoCalor>();
  const FOUR_HOURS_MS = 4 * 3600 * 1000;

  for (const m of modisList) {
    const t = Date.parse(m.dataHoraUtc);
    const cellKey = `${Math.round(m.latitude * 100)}:${Math.round(m.longitude * 100)}`;
    const nearbyViirsTimes = viirsGrid1km.get(cellKey);
    if (nearbyViirsTimes?.some((vt) => Math.abs(vt - t) <= FOUR_HOURS_MS)) {
      continue;
    }

    const modisDedupeKey = `${cellKey}:${Math.floor(t / (60 * 60 * 1000))}`;
    const prev = modisByKey.get(modisDedupeKey);
    if (!prev || m.frp > prev.frp) {
      modisByKey.set(modisDedupeKey, m);
    }
  }

  return [...dedupedViirs, ...Array.from(modisByKey.values())].sort(
    (a, b) => Date.parse(b.dataHoraUtc) - Date.parse(a.dataHoraUtc),
  );
}

/**
 * Filtra a lista de focos conforme os parâmetros do usuário.
 */
export function applyFiltroFocos(focos: FocoCalor[], filtro: FiltroFocos): FocoCalor[] {
  return focos.filter((f) => {
    if (filtro.bioma !== "all" && f.bioma !== filtro.bioma) {
      return false;
    }
    if (
      filtro.uf !== "all" &&
      filtro.uf.toUpperCase() !== "ALL" &&
      filtro.uf !== "" &&
      f.uf !== filtro.uf.toUpperCase()
    ) {
      return false;
    }
    if (filtro.frpMin > 0 && f.frp < filtro.frpMin) {
      return false;
    }
    if (filtro.intensidadeMin !== "all") {
      if (INTENSIDADE_ORDER[f.intensidade] < INTENSIDADE_ORDER[filtro.intensidadeMin]) {
        return false;
      }
    }
    if (filtro.fonte !== "all") {
      if (filtro.fonte === "VIIRS") {
        if (f.instrumento !== "VIIRS") return false;
      } else if (f.fonte !== filtro.fonte) {
        return false;
      }
    }
    if (filtro.diaNoite !== "all" && f.diaNoite !== filtro.diaNoite) {
      return false;
    }
    return true;
  });
}

/**
 * Agrega os focos normalizados para construir o ResumoFocos unificado usado pelo mapa,
 * home, radar dos biomas, dashboard, comparador e fichas técnicas.
 */
export function buildResumoFocos(
  focos: FocoCalor[],
  meta: {
    periodo: PeriodoFocos;
    atualizadoEm: string;
    fontesAtivas: string[];
    desatualizado: boolean;
    semChave: boolean;
    erro?: string;
  },
): ResumoFocos {
  const porBioma = {} as Record<BiomeId, ResumoBiomaFocos>;
  for (const id of BIOME_IDS) {
    porBioma[id] = {
      bioma: id,
      nome: BIOME_NAMES[id],
      total: 0,
      frpTotal: 0,
      frpMaximo: 0,
      porIntensidade: {
        baixo: 0,
        medio: 0,
        alto: 0,
        critico: 0,
      },
    };
  }

  const porUf: Record<string, number> = {};
  const porIntensidade: Record<IntensidadeFoco, number> = {
    baixo: 0,
    medio: 0,
    alto: 0,
    critico: 0,
  };

  let totalNosBiomas = 0;
  let foraDosBiomas = 0;
  let frpTotal = 0;
  let frpMaximo = 0;
  let latestMs = 0;

  for (const f of focos) {
    frpTotal += f.frp;
    if (f.frp > frpMaximo) {
      frpMaximo = f.frp;
    }
    porIntensidade[f.intensidade] += 1;

    const ms = Date.parse(f.dataHoraUtc);
    if (ms > latestMs) {
      latestMs = ms;
    }

    if (f.uf) {
      porUf[f.uf] = (porUf[f.uf] ?? 0) + 1;
    }

    if (f.bioma === "fora_dos_biomas") {
      foraDosBiomas += 1;
    } else {
      totalNosBiomas += 1;
      const b = porBioma[f.bioma];
      if (b) {
        b.total += 1;
        b.frpTotal = Number((b.frpTotal + f.frp).toFixed(1));
        if (f.frp > b.frpMaximo) {
          b.frpMaximo = f.frp;
        }
        b.porIntensidade[f.intensidade] += 1;
      }
    }
  }

  return {
    total: focos.length,
    totalNosBiomas,
    foraDosBiomas,
    porBioma,
    porUf,
    porIntensidade,
    frpTotal: Number(frpTotal.toFixed(1)),
    frpMaximo: Number(frpMaximo.toFixed(1)),
    atualizadoEm: meta.atualizadoEm,
    ultimoFocoEm: latestMs > 0 ? new Date(latestMs).toISOString() : null,
    periodo: meta.periodo,
    fonte: "NASA FIRMS (VIIRS 375 m / MODIS 1 km)",
    fontesAtivas: meta.fontesAtivas,
    latenciaDeclarada: "Quase em tempo real (latência orbital típica de ~3 h após a passagem do satélite)",
    desatualizado: meta.desatualizado,
    semChave: meta.semChave,
    erro: meta.erro,
  };
}
