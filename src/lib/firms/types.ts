import { z } from "zod";
import type { BiomeId } from "@/data/types";
import type { FirmsSourceId, IntensidadeFoco } from "./constants";

export type PeriodoFocos = "24h" | "48h" | "7d";
export type ConfiancaNormalizada = "baixa" | "nominal" | "alta";
export type DiaNoite = "D" | "N";
export type BiomaClassificado = BiomeId | "fora_dos_biomas";

export const FiltroFocosSchema = z.object({
  periodo: z.enum(["24h", "48h", "7d"]).default("24h"),
  bioma: z
    .enum([
      "all",
      "amazonia",
      "cerrado",
      "mata_atlantica",
      "caatinga",
      "pampa",
      "pantanal",
      "costeiro_marinho",
      "fora_dos_biomas",
    ])
    .default("all"),
  uf: z
    .string()
    .trim()
    .transform((val) => {
      const upper = val.toUpperCase();
      return upper === "ALL" || upper === "" ? "all" : upper;
    })
    .default("all"),
  frpMin: z.coerce.number().min(0).max(5000).default(0),
  fonte: z
    .enum([
      "all",
      "VIIRS",
      "VIIRS_NOAA20_NRT",
      "VIIRS_NOAA21_NRT",
      "VIIRS_SNPP_NRT",
      "MODIS_NRT",
    ])
    .default("all"),
  diaNoite: z.enum(["all", "D", "N"]).default("all"),
  intensidadeMin: z.enum(["all", "baixo", "medio", "alto", "critico"]).default("all"),
});

export type FiltroFocos = z.infer<typeof FiltroFocosSchema>;

export const RawFirmsRowSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  acq_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  acq_time: z.string().min(1).max(4),
  satellite: z.string().min(1),
  instrument: z.string().min(1),
  confidence: z.string(),
  frp: z.number().min(0),
  daynight: z.enum(["D", "N"]),
});

export interface FocoCalor {
  id: string;
  latitude: number;
  longitude: number;
  dataHoraUtc: string;
  satelite: string;
  instrumento: "VIIRS" | "MODIS";
  fonte: FirmsSourceId;
  confianca: ConfiancaNormalizada;
  confiancaBruta: string;
  frp: number;
  intensidade: IntensidadeFoco;
  diaNoite: DiaNoite;
  bioma: BiomaClassificado;
  biomaNome: string;
  uf: string | null;
  municipio?: string;
}

export interface ResumoBiomaFocos {
  bioma: BiomeId;
  nome: string;
  total: number;
  frpTotal: number;
  frpMaximo: number;
  porIntensidade: Record<IntensidadeFoco, number>;
}

export interface ResumoFocos {
  total: number;
  totalNosBiomas: number;
  foraDosBiomas: number;
  porBioma: Record<BiomeId, ResumoBiomaFocos>;
  porUf: Record<string, number>;
  porIntensidade: Record<IntensidadeFoco, number>;
  frpTotal: number;
  frpMaximo: number;
  atualizadoEm: string;
  ultimoFocoEm: string | null;
  periodo: PeriodoFocos;
  fonte: string;
  fontesAtivas: string[];
  latenciaDeclarada: string;
  desatualizado: boolean;
  semChave: boolean;
  erro?: string;
}

export interface RespostaApiFocos {
  focos: FocoCalor[];
  geojson: {
    type: "FeatureCollection";
    features: Array<{
      type: "Feature";
      geometry: {
        type: "Point";
        coordinates: [number, number];
      };
      properties: {
        id: string;
        frp: number;
        int: IntensidadeFoco;
        dt: string;
        sat: string;
        inst: "VIIRS" | "MODIS";
        fnt: FirmsSourceId;
        conf: ConfiancaNormalizada;
        confRaw: string;
        dn: DiaNoite;
        bio: BiomaClassificado;
        bioNome: string;
        uf: string | null;
      };
    }>;
  };
  resumo: ResumoFocos;
  filtrosAplicados: FiltroFocos;
}
