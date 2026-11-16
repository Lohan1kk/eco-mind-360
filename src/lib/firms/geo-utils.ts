import type { FocoCalor } from "./types";

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Calcula a distância geodésica (fórmula de Haversine) em quilômetros entre dois pontos.
 * Executado exclusivamente no cliente para o recurso "Meu local" (privacidade total).
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function analyzeNearbyFocos(
  userLat: number,
  userLon: number,
  focos: FocoCalor[],
  radiusKm = 50,
): {
  countWithinRadius: number;
  nearestDistanceKm: number | null;
  nearestFoco: FocoCalor | null;
} {
  let countWithinRadius = 0;
  let nearestDistanceKm: number | null = null;
  let nearestFoco: FocoCalor | null = null;

  for (const f of focos) {
    const dist = haversineDistanceKm(userLat, userLon, f.latitude, f.longitude);
    if (dist <= radiusKm) {
      countWithinRadius += 1;
    }
    if (nearestDistanceKm === null || dist < nearestDistanceKm) {
      nearestDistanceKm = dist;
      nearestFoco = f;
    }
  }

  return {
    countWithinRadius,
    nearestDistanceKm:
      nearestDistanceKm !== null ? Number(nearestDistanceKm.toFixed(1)) : null,
    nearestFoco,
  };
}
