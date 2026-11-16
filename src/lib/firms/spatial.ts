import fs from "node:fs";
import path from "node:path";
import RBush from "rbush";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import type { FeatureCollection, Geometry, Polygon, Position } from "geojson";
import type { BiomeId } from "@/data/types";
import { BIOME_NAMES } from "./constants";
import type { BiomaClassificado } from "./types";

interface BiomeBboxItem {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  id: BiomeId;
  priority: number;
  polygon: Polygon;
}

interface UfBboxItem {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  sigla: string;
  nome: string;
  polygon: Polygon;
}

interface SpatialIndexSingleton {
  biomeTree: RBush<BiomeBboxItem>;
  ufTree: RBush<UfBboxItem>;
}

let cachedSpatialIndex: SpatialIndexSingleton | null = null;

function computeRingBbox(ring: Position[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  let minX = 180;
  let minY = 90;
  let maxX = -180;
  let maxY = -90;
  for (const coord of ring) {
    const lon = coord[0];
    const lat = coord[1];
    if (lon < minX) minX = lon;
    if (lon > maxX) maxX = lon;
    if (lat < minY) minY = lat;
    if (lat > maxY) maxY = lat;
  }
  return { minX, minY, maxX, maxY };
}

function loadGeoJsonFile(relPath: string): FeatureCollection<Geometry> {
  const fullPath = path.join(process.cwd(), relPath);
  const raw = fs.readFileSync(fullPath, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw) as FeatureCollection<Geometry>;
}

/**
 * Constrói o índice espacial RBush uma única vez em memória no servidor e o reutiliza
 * em todas as requisições e agregações subsequentes.
 */
export function getSpatialIndex(): SpatialIndexSingleton {
  if (cachedSpatialIndex) {
    return cachedSpatialIndex;
  }

  const biomasGeo = loadGeoJsonFile("public/data/geojson/biomas-brasil.json");
  const ufsGeo = loadGeoJsonFile("public/data/geojson/estados-brasil.json");

  const biomeTree = new RBush<BiomeBboxItem>();
  const biomeItems: BiomeBboxItem[] = [];

  for (const feat of biomasGeo.features) {
    const rawId = String(feat.id || feat.properties?.id || "") as BiomeId;
    if (!rawId || !feat.geometry) continue;

    const geom = feat.geometry;
    const polys: Position[][][] =
      geom.type === "MultiPolygon"
        ? geom.coordinates
        : geom.type === "Polygon"
          ? [geom.coordinates]
          : [];

    const priority = rawId === "costeiro_marinho" ? 2 : 1;

    for (const polyCoords of polys) {
      if (!polyCoords.length || !polyCoords[0].length) continue;
      const bbox = computeRingBbox(polyCoords[0]);
      biomeItems.push({
        ...bbox,
        id: rawId,
        priority,
        polygon: {
          type: "Polygon",
          coordinates: polyCoords,
        },
      });
    }
  }
  biomeTree.load(biomeItems);

  const ufTree = new RBush<UfBboxItem>();
  const ufItems: UfBboxItem[] = [];

  for (const feat of ufsGeo.features) {
    const sigla = String(feat.properties?.sigla || feat.id || "");
    const nome = String(feat.properties?.nome || sigla);
    if (!sigla || !feat.geometry) continue;

    const geom = feat.geometry;
    const polys: Position[][][] =
      geom.type === "MultiPolygon"
        ? geom.coordinates
        : geom.type === "Polygon"
          ? [geom.coordinates]
          : [];

    for (const polyCoords of polys) {
      if (!polyCoords.length || !polyCoords[0].length) continue;
      const bbox = computeRingBbox(polyCoords[0]);
      ufItems.push({
        ...bbox,
        sigla,
        nome,
        polygon: {
          type: "Polygon",
          coordinates: polyCoords,
        },
      });
    }
  }
  ufTree.load(ufItems);

  cachedSpatialIndex = { biomeTree, ufTree };
  return cachedSpatialIndex;
}

/**
 * Classifica um ponto (lat, lon) contra a malha oficial do IBGE de biomas e estados.
 * - Pontos dentro dos 6 biomas terrestres recebem o respectivo bioma.
 * - Pontos sobre o oceano/costa são classificados como `costeiro_marinho` APENAS se
 *   estiverem dentro do polígono oficial de Sistema Costeiro-Marinho definido pelo projeto.
 * - Os demais pontos ficam como `fora_dos_biomas` e entram apenas no total geral.
 */
export function classifyLocation(
  lat: number,
  lon: number,
): {
  bioma: BiomaClassificado;
  biomaNome: string;
  uf: string | null;
  isForeignContinent: boolean;
} {
  const { biomeTree, ufTree } = getSpatialIndex();
  const pt = point([lon, lat]);
  const searchBox = { minX: lon, minY: lat, maxX: lon, maxY: lat };

  const biomeCandidates = biomeTree
    .search(searchBox)
    .sort((a, b) => a.priority - b.priority);

  let bioma: BiomaClassificado = "fora_dos_biomas";
  for (const candidate of biomeCandidates) {
    if (booleanPointInPolygon(pt, candidate.polygon)) {
      bioma = candidate.id;
      break;
    }
  }

  const ufCandidates = ufTree.search(searchBox);
  let uf: string | null = null;
  for (const candidate of ufCandidates) {
    if (booleanPointInPolygon(pt, candidate.polygon)) {
      uf = candidate.sigla;
      break;
    }
  }

  // Se o ponto está fora dos 7 biomas e fora das 27 UFs, verificamos se está em países
  // vizinhos continentais (oeste/norte/sudoeste do Brasil) ou sobre o Oceano Atlântico.
  // Pontos sobre o Oceano Atlântico fora da malha permanecem como "fora_dos_biomas" e entram no total geral.
  const isForeignContinent =
    bioma === "fora_dos_biomas" &&
    uf === null &&
    (lon < -53.4 ||
      (lat > 4.45 && lon < -50.8) ||
      (lat < -33.75 && lon < -52.0) ||
      (lat > -5.0 && lat <= 4.45 && lon < -51.5));

  return {
    bioma,
    biomaNome: BIOME_NAMES[bioma],
    uf,
    isForeignContinent,
  };
}
