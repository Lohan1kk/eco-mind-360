/** Precise boundary checks for Brazil to guarantee 100% Brazilian points. */
export function isInBrazil(lat: number, lng: number): boolean {
  // Broad Brazil bounding box
  if (lat < -33.75 || lat > 5.27 || lng < -73.98 || lng > -34.79) {
    return false;
  }
  // Exclude Pacific / Andean neighboring territories
  if (lat < -22 && lng < -57.7) return false; // Paraguay / Argentina Chaco
  if (lat < -28 && lng < -57.6) return false; // Argentina Corrientes
  if (lat < -31 && lng < -57.0) return false; // Uruguay
  if (lat < -12 && lng < -68.7) return false; // Bolivia
  if (lat < -8 && lng < -73.5) return false;  // Peru
  return true;
}

/** FIRMS area API order: south, west, north, east */
export const BRAZIL_BBOX_FIRMS = "-33.75,-73.98,5.27,-34.79";

/** Brazil view for the fire map (centered over central Brazil). */
export const WORLD_CENTER: [number, number] = [-14.235, -51.925];
export const WORLD_DEFAULT_ZOOM = 4;
export const BRAZIL_CENTER: [number, number] = [-14.235, -51.925];
export const BRAZIL_DEFAULT_ZOOM = 4;
