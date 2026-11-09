import { HistoricalRate, LandCoverDistribution } from './types';

// Séries anuais oficiais de taxas de desmatamento / supressão (PRODES / INPE) em km²/ano
export const HISTORICAL_DEFORESTATION_PRODES: HistoricalRate[] = [
  {
    year: 2018,
    amazonia: 7536,
    cerrado: 6634,
    mata_atlantica: 145,
    caatinga: 1050,
    pampa: 240,
    pantanal: 337
  },
  {
    year: 2019,
    amazonia: 10129,
    cerrado: 6483,
    mata_atlantica: 130,
    caatinga: 1280,
    pampa: 285,
    pantanal: 462
  },
  {
    year: 2020,
    amazonia: 10851,
    cerrado: 7340,
    mata_atlantica: 216,
    caatinga: 1450,
    pampa: 310,
    pantanal: 512
  },
  {
    year: 2021,
    amazonia: 13038,
    cerrado: 8531,
    mata_atlantica: 200,
    caatinga: 1580,
    pampa: 345,
    pantanal: 432
  },
  {
    year: 2022,
    amazonia: 11594,
    cerrado: 10689,
    mata_atlantica: 147,
    caatinga: 1820,
    pampa: 360,
    pantanal: 395
  },
  {
    year: 2023,
    amazonia: 9001,
    cerrado: 11011,
    mata_atlantica: 147,
    caatinga: 2100,
    pampa: 390,
    pantanal: 406
  },
  {
    year: 2024,
    amazonia: 6288,
    cerrado: 8174,
    mata_atlantica: 106,
    caatinga: 1950,
    pampa: 375,
    pantanal: 382
  }
];

// Distribuição oficial de cobertura e uso do solo (MapBiomas Coleção 9 - 2023/2024)
export const LAND_COVER_DISTRIBUTION: LandCoverDistribution[] = [
  {
    biomeId: 'amazonia',
    biomeName: 'Amazônia',
    vegetacaoNativa: 79.5,
    agropecuaria: 15.2,
    agua: 4.8,
    outros: 0.5,
    fonte: 'MapBiomas Coleção 9'
  },
  {
    biomeId: 'cerrado',
    biomeName: 'Cerrado',
    vegetacaoNativa: 50.0,
    agropecuaria: 48.6,
    agua: 0.8,
    outros: 0.6,
    fonte: 'MapBiomas Coleção 9'
  },
  {
    biomeId: 'mata_atlantica',
    biomeName: 'Mata Atlântica',
    vegetacaoNativa: 12.4,
    agropecuaria: 71.3,
    agua: 1.8,
    outros: 14.5,
    fonte: 'MapBiomas Coleção 9 / SOS Mata Atlântica'
  },
  {
    biomeId: 'caatinga',
    biomeName: 'Caatinga',
    vegetacaoNativa: 59.0,
    agropecuaria: 39.8,
    agua: 0.7,
    outros: 0.5,
    fonte: 'MapBiomas Coleção 9'
  },
  {
    biomeId: 'pampa',
    biomeName: 'Pampa',
    vegetacaoNativa: 41.9,
    agropecuaria: 49.6,
    agua: 7.8,
    outros: 0.7,
    fonte: 'MapBiomas Coleção 9'
  },
  {
    biomeId: 'pantanal',
    biomeName: 'Pantanal',
    vegetacaoNativa: 82.8,
    agropecuaria: 15.8,
    agua: 1.1,
    outros: 0.3,
    fonte: 'MapBiomas Coleção 9'
  },
  {
    biomeId: 'costeiro_marinho',
    biomeName: 'Sistema Costeiro-Marinho',
    vegetacaoNativa: 74.0, // Manguezais, restingas e marismas nativas
    agropecuaria: 6.2,
    agua: 12.8,
    outros: 7.0, // Áreas urbanas litorâneas e portos
    fonte: 'IBGE / MapBiomas Água e Costa'
  }
];

// Focos de calor anuais detectados pelo satélite de referência (INPE BDQueimadas 2020-2024)
export const HISTORICAL_FIRE_HOTSPOTS = [
  { year: 2020, amazonia: 103190, cerrado: 63894, pantanal: 22116, mata_atlantica: 18450, caatinga: 14210, pampa: 2980 },
  { year: 2021, amazonia: 75090,  cerrado: 51230, pantanal: 8350,  mata_atlantica: 15300, caatinga: 16100, pampa: 2150 },
  { year: 2022, amazonia: 114902, cerrado: 57422, pantanal: 1475,  mata_atlantica: 16290, caatinga: 12850, pampa: 3120 },
  { year: 2023, amazonia: 98642,  cerrado: 50730, pantanal: 4210,  mata_atlantica: 14810, caatinga: 13900, pampa: 1890 },
  { year: 2024, amazonia: 122450, cerrado: 71200, pantanal: 14500, mata_atlantica: 19800, caatinga: 15400, pampa: 2400 } // Ano de seca histórica extrema
];
