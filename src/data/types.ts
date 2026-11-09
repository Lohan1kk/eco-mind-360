export type BiomeId = 
  | 'amazonia' 
  | 'cerrado' 
  | 'mata_atlantica' 
  | 'caatinga' 
  | 'pampa' 
  | 'pantanal' 
  | 'costeiro_marinho';

export interface BiomeInfo {
  id: BiomeId;
  name: string;
  category: 'Bioma Terrestre' | 'Sistema Costeiro e Marinho';
  areaKm2: number;
  percentageBrazil: number;
  nativeVegetationPercentage: number;
  protectedAreaPercentage: number;
  states: string[];
  climate: string;
  description: string;
  ecologicalImportance: string;
  mainThreats: string[];
  color: string;
  borderColor: string;
  deforestationProdes2024Km2: number | null; // null if marine or not applicable
  deforestationTrendPercent: number | null; // comparison with 2023
  activeFireHotspots24h: number;
  sources: {
    name: string;
    url: string;
    description: string;
    lastUpdated: string;
  }[];
}

export interface EnvironmentalAlert {
  id: string;
  biomeId: BiomeId;
  biomeName: string;
  type: 'foco_calor' | 'alerta_desmatamento' | 'area_queimada' | 'anomalia_marinha';
  typeName: string;
  latitude: number;
  longitude: number;
  municipality: string;
  state: string;
  date: string;
  time?: string;
  areaHectares?: number;
  confidence: 'Alta' | 'Média' | 'Baixa' | 'Nominal';
  satellite: string;
  sensor: string;
  frp?: number; // Fire Radiative Power (MW)
  source: string;
  sourceUrl: string;
  status: 'Detectado' | 'Em Análise' | 'Confirmado (Auditoria)';
  description: string;
}

export interface HistoricalRate {
  year: number;
  amazonia: number;
  cerrado: number;
  mata_atlantica: number;
  caatinga: number;
  pampa: number;
  pantanal: number;
}

export interface LandCoverDistribution {
  biomeId: BiomeId;
  biomeName: string;
  vegetacaoNativa: number; // %
  agropecuaria: number; // %
  agua: number; // %
  outros: number; // %
  fonte: string;
}
