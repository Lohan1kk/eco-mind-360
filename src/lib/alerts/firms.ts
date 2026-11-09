import { isInBrazil } from "./geo";
import { resolveFireLevel } from "./frp";
import type { FireAlert } from "./types";

/**
 * Official NASA FIRMS South America 24h CSV feeds (public, no API key required).
 * Highly optimized (< 2MB, fast, reliable, updated on every orbital pass).
 * @see https://firms.modaps.eosdis.nasa.gov/active_fire/
 */
const SOUTH_AMERICA_FEEDS = [
  {
    url: "https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_South_America_24h.csv",
    tag: "modis-sa",
  },
  {
    url: "https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_South_America_24h.csv",
    tag: "viirs-j1",
  },
] as const;

function parseCsvLine(line: string): string[] {
  return line.split(",").map((cell) => cell.trim());
}

function parseFirmsCsv(text: string, sourceTag: string): FireAlert[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const latIdx = header.indexOf("latitude");
  const lngIdx = header.indexOf("longitude");
  const frpIdx = header.findIndex((h) => h === "frp");
  const brightIdx = header.findIndex(
    (h) => h.includes("bright_ti4") || h === "brightness",
  );
  const dateIdx = header.indexOf("acq_date");
  const timeIdx = header.indexOf("acq_time");
  const satIdx = header.indexOf("satellite");
  const confIdx = header.indexOf("confidence");

  if (latIdx === -1 || lngIdx === -1) return [];

  const results: FireAlert[] = [];

  for (let index = 1; index < lines.length; index++) {
    const parts = parseCsvLine(lines[index]);
    if (parts.length < 3) continue;

    const lat = Number.parseFloat(parts[latIdx]);
    const lng = Number.parseFloat(parts[lngIdx]);
    if (Number.isNaN(lat) || Number.isNaN(lng)) continue;

    // Filter strictly to Brazilian territory
    if (!isInBrazil(lat, lng)) continue;

    const confidence = confIdx >= 0 ? parts[confIdx]?.toLowerCase() : "";
    // Skip low-confidence VIIRS detections
    if (confidence === "low" || confidence === "l") continue;

    const frp = frpIdx >= 0 ? Number.parseFloat(parts[frpIdx]) : Number.NaN;
    const bright =
      brightIdx >= 0 ? Number.parseFloat(parts[brightIdx]) : Number.NaN;
    const date = dateIdx >= 0 ? parts[dateIdx] : "";
    const time = timeIdx >= 0 ? parts[timeIdx]?.padStart(4, "0") : "0000";
    const satelite = satIdx >= 0 ? parts[satIdx] : "NASA FIRMS";

    const reportedAt =
      date && time
        ? `${date}T${time.slice(0, 2)}:${time.slice(2, 4)}:00.000Z`
        : new Date().toISOString();

    const level = resolveFireLevel({
      frp: Number.isNaN(frp) ? null : frp,
      brightness: Number.isNaN(bright) ? null : bright,
    });

    const confLabel = confidence ? ` · conf. ${confidence}` : "";

    results.push({
      id: `nasa-${sourceTag}-${index}-${lat.toFixed(3)}-${lng.toFixed(3)}`,
      lat,
      lng,
      level,
      description: `NASA FIRMS (${satelite}${confLabel})`,
      reportedAt,
      source: "nasa",
      satelite: satelite === "T" ? "Terra" : satelite === "A" ? "Aqua" : satelite,
      frp: Number.isNaN(frp) ? undefined : frp,
    });
  }

  return results;
}

/**
 * Spread fires across a lat/lng grid and across severity levels
 * so the map shows balanced geographical coverage across Brazil.
 */
function diversifyByGrid(alerts: FireAlert[], limit: number): FireAlert[] {
  if (alerts.length <= limit) return alerts;

  const byLevel = {
    critico: [] as FireAlert[],
    alto: [] as FireAlert[],
    medio: [] as FireAlert[],
    baixo: [] as FireAlert[],
  };
  for (const a of alerts) {
    byLevel[a.level].push(a);
  }
  for (const list of Object.values(byLevel)) {
    list.sort((a, b) => (b.frp ?? 0) - (a.frp ?? 0));
  }

  const quotas = {
    critico: Math.ceil(limit * 0.15),
    alto: Math.ceil(limit * 0.25),
    medio: Math.ceil(limit * 0.35),
    baixo: Math.ceil(limit * 0.25),
  };

  const cellCap = Math.max(3, Math.ceil(limit / 60));
  const perCell = new Map<string, number>();
  const seen = new Set<string>();
  const picked: FireAlert[] = [];

  function tryPick(alert: FireAlert): boolean {
    const dedupe = `${alert.lat.toFixed(2)}:${alert.lng.toFixed(2)}`;
    if (seen.has(dedupe)) return false;
    const cell = `${Math.floor(alert.lat / 4)}:${Math.floor(alert.lng / 6)}`;
    const count = perCell.get(cell) ?? 0;
    if (count >= cellCap) return false;
    seen.add(dedupe);
    perCell.set(cell, count + 1);
    picked.push(alert);
    return true;
  }

  for (const level of ["critico", "alto", "medio", "baixo"] as const) {
    let taken = 0;
    for (const alert of byLevel[level]) {
      if (taken >= quotas[level]) break;
      if (tryPick(alert)) taken += 1;
    }
  }

  if (picked.length < limit) {
    const rest = [...alerts].sort((a, b) => (b.frp ?? 0) - (a.frp ?? 0));
    for (const alert of rest) {
      if (picked.length >= limit) break;
      tryPick(alert);
    }
  }

  return picked.slice(0, limit);
}

export async function fetchNasaFirmsGlobal(
  options?: { fresh?: boolean; limit?: number },
): Promise<FireAlert[]> {
  const fresh = Boolean(options?.fresh);
  const limit = options?.limit ?? 450;
  const fetchInit: RequestInit = fresh
    ? { cache: "no-store" }
    : { next: { revalidate: 1800 } };

  const batches = await Promise.all(
    SOUTH_AMERICA_FEEDS.map(async ({ url, tag }) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4500);
        const res = await fetch(url, {
          ...fetchInit,
          signal: controller.signal,
          headers: { "User-Agent": "Mozilla/5.0 EcoMind360" },
        });
        clearTimeout(timeout);
        if (!res.ok) return [] as FireAlert[];
        const text = await res.text();
        return parseFirmsCsv(text, tag);
      } catch {
        return [] as FireAlert[];
      }
    }),
  );

  return diversifyByGrid(batches.flat(), limit);
}

/** Optional key-based Brazil denser pull. */
export async function fetchNasaFirmsFires(
  mapKey: string,
  days = 1,
  options?: { fresh?: boolean },
): Promise<FireAlert[]> {
  const { BRAZIL_BBOX_FIRMS } = await import("./geo");
  const fresh = Boolean(options?.fresh);
  const fetchInit: RequestInit = fresh
    ? { cache: "no-store" }
    : { next: { revalidate: 3600 } };

  const sources = ["VIIRS_NOAA20_NRT", "MODIS_NRT"] as const;
  const batches = await Promise.all(
    sources.map(async (source) => {
      const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${source}/${BRAZIL_BBOX_FIRMS}/${days}`;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4500);
        const res = await fetch(url, { ...fetchInit, signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) return [] as FireAlert[];
        return parseFirmsCsv(await res.text(), source);
      } catch {
        return [] as FireAlert[];
      }
    }),
  );

  return diversifyByGrid(batches.flat(), 250);
}
