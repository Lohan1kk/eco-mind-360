import { BRAZIL_UFS } from "./constants";
import { FiltroFocosSchema, type FiltroFocos } from "./types";

export interface MapUrlState {
  filtros: FiltroFocos;
  lat: number;
  lon: number;
  zoom: number;
  camadas: {
    focos: boolean;
    biomas: boolean;
    gibs: boolean;
    heatmap: boolean;
  };
}

export const DEFAULT_MAP_URL_STATE: MapUrlState = {
  filtros: {
    periodo: "24h",
    bioma: "all",
    uf: "all",
    frpMin: 0,
    fonte: "all",
    diaNoite: "all",
    intensidadeMin: "all",
  },
  lat: -14.235,
  lon: -51.925,
  zoom: 4,
  camadas: {
    focos: true,
    biomas: true,
    gibs: false,
    heatmap: false,
  },
};

const VALID_UFS = new Set(BRAZIL_UFS.map((u) => u.sigla));

function getParam(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  if (params instanceof URLSearchParams) {
    const val = params.get(key);
    return val !== null ? val : undefined;
  }
  const raw = params[key];
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

/**
 * Restaura filtros, coordenadas do mapa e visibilidade de camadas a partir da query string da URL.
 */
export function parseMapUrlState(
  input: string | URLSearchParams | Record<string, string | string[] | undefined>,
): MapUrlState {
  const params =
    typeof input === "string"
      ? new URLSearchParams(input.startsWith("?") ? input.slice(1) : input)
      : input;

  const rawPeriodo = getParam(params, "periodo");
  const rawBioma = getParam(params, "bioma");
  const rawUf = getParam(params, "uf")?.toUpperCase();
  const rawFrpMin = getParam(params, "frpMin");
  const rawFonte = getParam(params, "fonte");
  const rawDiaNoite = getParam(params, "diaNoite");
  const rawIntensidadeMin = getParam(params, "intensidadeMin");

  const parsedFiltros = FiltroFocosSchema.safeParse({
    periodo: rawPeriodo,
    bioma: rawBioma,
    uf: rawUf && (rawUf === "ALL" || VALID_UFS.has(rawUf)) ? (rawUf === "ALL" ? "all" : rawUf) : "all",
    frpMin: rawFrpMin !== undefined ? Number(rawFrpMin) : 0,
    fonte: rawFonte,
    diaNoite: rawDiaNoite,
    intensidadeMin: rawIntensidadeMin,
  });

  const filtros: FiltroFocos = parsedFiltros.success
    ? parsedFiltros.data
    : { ...DEFAULT_MAP_URL_STATE.filtros };

  // Individual field recovery if only one field failed
  if (!parsedFiltros.success) {
    const p = FiltroFocosSchema.shape.periodo.safeParse(rawPeriodo);
    if (p.success) filtros.periodo = p.data;
    const b = FiltroFocosSchema.shape.bioma.safeParse(rawBioma);
    if (b.success) filtros.bioma = b.data;
    if (rawUf && VALID_UFS.has(rawUf)) filtros.uf = rawUf;
    const f = FiltroFocosSchema.shape.frpMin.safeParse(rawFrpMin);
    if (f.success) filtros.frpMin = f.data;
    const s = FiltroFocosSchema.shape.fonte.safeParse(rawFonte);
    if (s.success) filtros.fonte = s.data;
    const d = FiltroFocosSchema.shape.diaNoite.safeParse(rawDiaNoite);
    if (d.success) filtros.diaNoite = d.data;
    const i = FiltroFocosSchema.shape.intensidadeMin.safeParse(rawIntensidadeMin);
    if (i.success) filtros.intensidadeMin = i.data;
  }

  const rawLat = Number(getParam(params, "lat"));
  const rawLon = Number(getParam(params, "lon"));
  const rawZoom = Number(getParam(params, "zoom"));

  const lat =
    Number.isFinite(rawLat) && rawLat >= -60 && rawLat <= 30
      ? Number(rawLat.toFixed(4))
      : DEFAULT_MAP_URL_STATE.lat;
  const lon =
    Number.isFinite(rawLon) && rawLon >= -100 && rawLon <= -10
      ? Number(rawLon.toFixed(4))
      : DEFAULT_MAP_URL_STATE.lon;
  const zoom =
    Number.isFinite(rawZoom) && rawZoom >= 2 && rawZoom <= 18
      ? Number(rawZoom.toFixed(2))
      : DEFAULT_MAP_URL_STATE.zoom;

  const rawCamadas = getParam(params, "camadas");
  const camadas = { ...DEFAULT_MAP_URL_STATE.camadas };
  if (rawCamadas !== undefined) {
    const set = new Set(
      rawCamadas
        .split(",")
        .map((c) => c.trim().toLowerCase())
        .filter(Boolean),
    );
    camadas.focos = set.has("focos");
    camadas.biomas = set.has("biomas");
    camadas.gibs = set.has("gibs");
    camadas.heatmap = set.has("heatmap");
  }

  return {
    filtros,
    lat,
    lon,
    zoom,
    camadas,
  };
}

/**
 * Serializa o estado de filtros, posição e camadas do mapa em uma query string limpa e compartilhável.
 */
export function serializeMapUrlState(state: MapUrlState): string {
  const params = new URLSearchParams();
  const { filtros, lat, lon, zoom, camadas } = state;

  params.set("periodo", filtros.periodo);
  if (filtros.bioma !== "all") params.set("bioma", filtros.bioma);
  if (filtros.uf !== "all") params.set("uf", filtros.uf);
  if (filtros.frpMin > 0) params.set("frpMin", String(filtros.frpMin));
  if (filtros.intensidadeMin !== "all") params.set("intensidadeMin", filtros.intensidadeMin);
  if (filtros.fonte !== "all") params.set("fonte", filtros.fonte);
  if (filtros.diaNoite !== "all") params.set("diaNoite", filtros.diaNoite);

  params.set("lat", lat.toFixed(4));
  params.set("lon", lon.toFixed(4));
  params.set("zoom", zoom.toFixed(2));

  const activeLayers: string[] = [];
  if (camadas.focos) activeLayers.push("focos");
  if (camadas.biomas) activeLayers.push("biomas");
  if (camadas.gibs) activeLayers.push("gibs");
  if (camadas.heatmap) activeLayers.push("heatmap");
  params.set("camadas", activeLayers.join(","));

  return params.toString();
}
