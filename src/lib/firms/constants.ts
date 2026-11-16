import type { BiomeId } from "@/data/types";

/**
 * ESCALA DE INTENSIDADE POR FRP (Fire Radiative Power em Megawatts - MW)
 *
 * NOTA METODOLÓGICA IMPORTANTE:
 * Esta classificação em 4 faixas (Crítico ≥ 100 MW, Alto ≥ 40 MW, Médio ≥ 15 MW, Baixo < 15 MW)
 * é um CRITÉRIO DIDÁTICO E OPERACIONAL DO PROJETO ECOMIND 360°, definido para facilitar a leitura
 * de severidade radiativa em mapas educacionais. Não se trata de um padrão normativo oficial
 * da NASA ou do INPE (que publicam o valor contínuo em MW).
 */
export const FRP_INTENSITY_THRESHOLDS = {
  CRITICO: 100,
  ALTO: 40,
  MEDIO: 15,
} as const;

export type IntensidadeFoco = "critico" | "alto" | "medio" | "baixo";

export const INTENSIDADE_META: Record<
  IntensidadeFoco,
  {
    label: string;
    faixa: string;
    colorDark: string;
    colorLight: string;
    radiusBase: number;
    shape: "diamond" | "triangle" | "square" | "circle";
  }
> = {
  baixo: {
    label: "Baixo",
    faixa: "< 15 MW",
    colorDark: "#FACC15", // Amarelo
    colorLight: "#CA8A04",
    radiusBase: 5,
    shape: "circle",
  },
  medio: {
    label: "Médio",
    faixa: "15 a 39,9 MW",
    colorDark: "#FB923C", // Laranja
    colorLight: "#EA580C",
    radiusBase: 7,
    shape: "square",
  },
  alto: {
    label: "Alto",
    faixa: "40 a 99,9 MW",
    colorDark: "#EF4444", // Vermelho
    colorLight: "#DC2626",
    radiusBase: 9.5,
    shape: "triangle",
  },
  critico: {
    label: "Crítico",
    faixa: "≥ 100 MW",
    colorDark: "#991B1B", // Vinho
    colorLight: "#7F1D1D",
    radiusBase: 12.5,
    shape: "diamond",
  },
};

/**
 * Caixa delimitadora do Brasil para consultas no NASA FIRMS (formato: west,south,east,north).
 * Estende-se até -28° leste para cobrir integralmente o território continental brasileiro e
 * as ilhas oceânicas (Fernando de Noronha, Atol das Rocas, Arquipélago de São Pedro e São Paulo,
 * Trindade e Martim Vaz) e a Zona Econômica Exclusiva (Sistema Costeiro-Marinho).
 */
export const BRAZIL_FIRMS_BBOX = "-74,-34,-28,6";

export const FIRMS_SOURCES = [
  "VIIRS_NOAA20_NRT",
  "VIIRS_NOAA21_NRT",
  "VIIRS_SNPP_NRT",
  "MODIS_NRT",
] as const;

export type FirmsSourceId = (typeof FIRMS_SOURCES)[number];

export const FIRMS_SOURCE_LABELS: Record<FirmsSourceId, string> = {
  VIIRS_NOAA20_NRT: "VIIRS NOAA-20 (375 m · Principal)",
  VIIRS_NOAA21_NRT: "VIIRS NOAA-21 (375 m · Principal)",
  VIIRS_SNPP_NRT: "VIIRS Suomi-NPP (375 m · Principal)",
  MODIS_NRT: "MODIS Terra/Aqua (1 km · Complementar)",
};

export const BIOME_NAMES: Record<BiomeId | "fora_dos_biomas", string> = {
  amazonia: "Amazônia",
  cerrado: "Cerrado",
  mata_atlantica: "Mata Atlântica",
  caatinga: "Caatinga",
  pampa: "Pampa",
  pantanal: "Pantanal",
  costeiro_marinho: "Sistema Costeiro-Marinho",
  fora_dos_biomas: "Fora dos biomas",
};

export const BIOME_COLORS: Record<BiomeId, string> = {
  amazonia: "#789B7C",
  cerrado: "#D4A359",
  mata_atlantica: "#5B9A68",
  caatinga: "#C89D66",
  pampa: "#84A970",
  pantanal: "#528B88",
  costeiro_marinho: "#3B7A9E",
};

export const BRAZIL_UFS: Array<{ sigla: string; nome: string; center: [number, number] }> = [
  { sigla: "AC", nome: "Acre", center: [-9.02, -70.81] },
  { sigla: "AL", nome: "Alagoas", center: [-9.57, -36.78] },
  { sigla: "AM", nome: "Amazonas", center: [-3.47, -65.1] },
  { sigla: "AP", nome: "Amapá", center: [1.41, -51.77] },
  { sigla: "BA", nome: "Bahia", center: [-12.58, -41.7] },
  { sigla: "CE", nome: "Ceará", center: [-5.5, -39.32] },
  { sigla: "DF", nome: "Distrito Federal", center: [-15.8, -47.86] },
  { sigla: "ES", nome: "Espírito Santo", center: [-19.19, -40.34] },
  { sigla: "GO", nome: "Goiás", center: [-15.98, -49.86] },
  { sigla: "MA", nome: "Maranhão", center: [-5.42, -45.44] },
  { sigla: "MG", nome: "Minas Gerais", center: [-18.51, -44.55] },
  { sigla: "MS", nome: "Mato Grosso do Sul", center: [-20.51, -54.54] },
  { sigla: "MT", nome: "Mato Grosso", center: [-12.64, -55.42] },
  { sigla: "PA", nome: "Pará", center: [-3.79, -52.48] },
  { sigla: "PB", nome: "Paraíba", center: [-7.28, -36.72] },
  { sigla: "PE", nome: "Pernambuco", center: [-8.38, -37.86] },
  { sigla: "PI", nome: "Piauí", center: [-7.72, -42.73] },
  { sigla: "PR", nome: "Paraná", center: [-24.89, -51.55] },
  { sigla: "RJ", nome: "Rio de Janeiro", center: [-22.25, -42.66] },
  { sigla: "RN", nome: "Rio Grande do Norte", center: [-5.81, -36.59] },
  { sigla: "RO", nome: "Rondônia", center: [-10.83, -63.34] },
  { sigla: "RR", nome: "Roraima", center: [1.99, -61.33] },
  { sigla: "RS", nome: "Rio Grande do Sul", center: [-30.17, -53.5] },
  { sigla: "SC", nome: "Santa Catarina", center: [-27.45, -50.95] },
  { sigla: "SE", nome: "Sergipe", center: [-10.57, -37.45] },
  { sigla: "SP", nome: "São Paulo", center: [-22.19, -48.79] },
  { sigla: "TO", nome: "Tocantins", center: [-9.46, -48.26] },
];
