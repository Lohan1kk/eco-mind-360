import { BiomeInfo } from './types';

export const BIOMES_DATA: Record<string, BiomeInfo> = {
  amazonia: {
    id: 'amazonia',
    name: 'Amazônia',
    category: 'Bioma Terrestre',
    areaKm2: 4196943,
    percentageBrazil: 49.29,
    nativeVegetationPercentage: 79.5,
    protectedAreaPercentage: 46.5,
    states: ['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'MA', 'TO', 'MT'],
    climate: 'Equatorial úmido e quente com altos índices pluviométricos (1.500 a 3.000 mm/ano).',
    description: 'Maior floresta tropical e bacia hidrográfica do planeta. Abriga mais de 10% de toda a biodiversidade mundial e atua como regulador do regime de chuvas da América do Sul por meio dos "rios voadores".',
    ecologicalImportance: 'Estoque massivo de carbono orgânico global, estabilização climática continental e abrigo de milhares de comunidades indígenas e ribeirinhas.',
    mainThreats: [
      'Avanço de pastagens ilegais e grilagem de terras públicas',
      'Garimpo clandestino e contaminação hídrica por mercúrio',
      'Exploração predatória de madeira e abertura de ramais ilegais'
    ],
    color: '#10b981',
    borderColor: '#059669',
    deforestationProdes2024Km2: 6288,
    deforestationTrendPercent: -30.6,
    activeFireHotspots24h: 312,
    sources: [
      {
        name: 'INPE / PRODES Amazônia',
        url: 'https://terrabrasilis.dpi.inpe.br',
        description: 'Taxa anual consolidada de corte raso (auditoria satelital Landsat/Sentinel).',
        lastUpdated: '06/11/2024'
      },
      {
        name: 'MapBiomas Coleção 9',
        url: 'https://mapbiomas.org',
        description: 'Mapeamento anual de cobertura e uso da terra (série 1985-2023).',
        lastUpdated: 'Agosto/2024'
      },
      {
        name: 'IBGE Geociências',
        url: 'https://www.ibge.gov.br/geociencias/cartografia/biomas-e-sistema-costeiro-marinho.html',
        description: 'Malha oficial de delimitação territorial e biomas.',
        lastUpdated: '2024'
      }
    ]
  },
  cerrado: {
    id: 'cerrado',
    name: 'Cerrado',
    category: 'Bioma Terrestre',
    areaKm2: 2036448,
    percentageBrazil: 23.92,
    nativeVegetationPercentage: 50.0,
    protectedAreaPercentage: 8.6,
    states: ['GO', 'TO', 'MT', 'MS', 'MG', 'BA', 'MA', 'PI', 'SP', 'PR', 'DF'],
    climate: 'Tropical estacional, caracterizado por estação chuvosa no verão e seca prolongada no inverno.',
    description: 'A savana mais biodiversa do planeta e a "caixa d\'água do Brasil", abrigando nascentes de 8 das 12 bacias hidrográficas nacionais (São Francisco, Araguaia-Tocantins, Paraná, Paraguai, etc.).',
    ecologicalImportance: 'Recarga dos aquíferos Guarani, Urucuia e Bambuí; conectividade ecológica entre a Amazônia, Mata Atlântica e Caatinga.',
    mainThreats: [
      'Expansão rápida da fronteira agrícola (polo MATOPIBA: MA, TO, PI, BA)',
      'Substituição de vegetação nativa de raízes profundas por monoculturas',
      'Queimadas induzidas e rebaixamento do lençol freático'
    ],
    color: '#d97706',
    borderColor: '#b45309',
    deforestationProdes2024Km2: 8174,
    deforestationTrendPercent: -25.8,
    activeFireHotspots24h: 428,
    sources: [
      {
        name: 'INPE / PRODES Cerrado',
        url: 'https://terrabrasilis.dpi.inpe.br',
        description: 'Monitoramento anual de supressão vegetal no Cerrado.',
        lastUpdated: '06/11/2024'
      },
      {
        name: 'MapBiomas Alerta',
        url: 'https://alerta.mapbiomas.org',
        description: 'Validação e refinamento de alertas de desmatamento com imagens de alta resolução.',
        lastUpdated: 'Outubro/2024'
      }
    ]
  },
  mata_atlantica: {
    id: 'mata_atlantica',
    name: 'Mata Atlântica',
    category: 'Bioma Terrestre',
    areaKm2: 1110182,
    percentageBrazil: 13.04,
    nativeVegetationPercentage: 12.4,
    protectedAreaPercentage: 10.1,
    states: ['RS', 'SC', 'PR', 'SP', 'RJ', 'MG', 'ES', 'BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MS', 'GO'],
    climate: 'Variável de tropical úmido litorâneo a subtropical de altitude, com chuvas bem distribuídas.',
    description: 'Hotspot mundial de biodiversidade. Abriga mais de 72% da população brasileira, os principais centros urbanos e econômicos e mais de 20.000 espécies vegetais.',
    ecologicalImportance: 'Abastecimento hídrico de mais de 140 milhões de habitantes, regulação microclimática e contenção de encostas e deslizamentos.',
    mainThreats: [
      'Fragmentação extrema do habitat (ilhas de vegetação menores que 50 hectares)',
      'Especulação imobiliária no litoral e expansão urbana desordenada',
      'Poluição hídrica e invasão de espécies exóticas'
    ],
    color: '#059669',
    borderColor: '#047857',
    deforestationProdes2024Km2: 106,
    deforestationTrendPercent: -27.0,
    activeFireHotspots24h: 89,
    sources: [
      {
        name: 'SOS Mata Atlântica / INPE',
        url: 'https://www.sosma.org.br/iniciativas/atlas-da-mata-atlantica',
        description: 'Atlas dos Remanescentes Florestais da Mata Atlântica.',
        lastUpdated: 'Maio/2024'
      },
      {
        name: 'MapBiomas Mata Atlântica',
        url: 'https://mapbiomas.org',
        description: 'Mapeamento de regeneração e perda de cobertura florestal.',
        lastUpdated: 'Agosto/2024'
      }
    ]
  },
  caatinga: {
    id: 'caatinga',
    name: 'Caatinga',
    category: 'Bioma Terrestre',
    areaKm2: 844453,
    percentageBrazil: 9.92,
    nativeVegetationPercentage: 59.0,
    protectedAreaPercentage: 9.1,
    states: ['CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA', 'PI', 'MG', 'MA'],
    climate: 'Semiárido quente, caracterizado por chuvas escassas e irregulares (300 a 800 mm/ano).',
    description: 'Único bioma com ocorrência 100% exclusiva no território brasileiro. Possui uma rica flora e fauna altamente adaptada ao estresse hídrico crônico.',
    ecologicalImportance: 'Centro singular de especiação genética adaptada a climas áridos e barreira natural contra a desertificação no semiárido.',
    mainThreats: [
      'Processos graves de desertificação decorrentes de sobrepastoreio',
      'Extração ilegal de lenha para olarias, siderúrgicas e carvoarias',
      'Falta de Unidades de Conservação de proteção integral (apenas ~1,3%)'
    ],
    color: '#ea580c',
    borderColor: '#c2410c',
    deforestationProdes2024Km2: 1950,
    deforestationTrendPercent: -7.1,
    activeFireHotspots24h: 154,
    sources: [
      {
        name: 'INPE / PRODES Caatinga',
        url: 'https://terrabrasilis.dpi.inpe.br',
        description: 'Taxa anual de perda de vegetação caducifólia na Caatinga.',
        lastUpdated: 'Novembro/2024'
      },
      {
        name: 'Ministério do Meio Ambiente (MMA) - Desertificação',
        url: 'https://www.gov.br/mma',
        description: 'Monitoramento de áreas suscetíveis à desertificação (ASD).',
        lastUpdated: '2024'
      }
    ]
  },
  pampa: {
    id: 'pampa',
    name: 'Pampa',
    category: 'Bioma Terrestre',
    areaKm2: 176496,
    percentageBrazil: 2.07,
    nativeVegetationPercentage: 41.9,
    protectedAreaPercentage: 3.0,
    states: ['RS'],
    climate: 'Subtropical úmido com temperaturas amenas, invernos rigorosos e geadas frequentes.',
    description: 'Caracterizado por relevo suave-ondulado e vegetação campestre nativa rica em gramíneas e leguminosas adaptadas ao pastejo tradicional.',
    ecologicalImportance: 'Conservação de campos nativos antigos do Cone Sul, conservação de polinizadores e infiltração no Aquífero Guarani meridional.',
    mainThreats: [
      'Avanço acelerado da sojicultura sobre campos nativos',
      'Expansão da monocultura de silvicultura (eucalipto e pinus)',
      'Menor taxa de áreas formalmente protegidas entre todos os biomas terrestres (< 3%)'
    ],
    color: '#84cc16',
    borderColor: '#65a30d',
    deforestationProdes2024Km2: 375,
    deforestationTrendPercent: -3.8,
    activeFireHotspots24h: 21,
    sources: [
      {
        name: 'INPE / PRODES Pampa',
        url: 'https://terrabrasilis.dpi.inpe.br',
        description: 'Mapeamento de conversão de vegetação campestre nativa.',
        lastUpdated: 'Novembro/2024'
      },
      {
        name: 'MapBiomas Pampa',
        url: 'https://pampa.mapbiomas.org',
        description: 'Monitoramento da transformação dos campos do bioma Pampa.',
        lastUpdated: 'Agosto/2024'
      }
    ]
  },
  pantanal: {
    id: 'pantanal',
    name: 'Pantanal',
    category: 'Bioma Terrestre',
    areaKm2: 150355,
    percentageBrazil: 1.76,
    nativeVegetationPercentage: 82.8,
    protectedAreaPercentage: 4.6,
    states: ['MT', 'MS'],
    climate: 'Tropical com marcada sazonalidade hidrológica (pulsos de cheia e vazante alternados).',
    description: 'Maior área úmida continental contínua do globo terrestre. Patrimônio Nacional pela Constituição Federal e Reserva da Biosfera pela UNESCO.',
    ecologicalImportance: 'Filtro biológico de sedimentos e nutrientes da bacia do Alto Paraguai e concentração da mais espetacular fauna de vertebrados das Américas.',
    mainThreats: [
      'Mega-incêndios associados a secas extremas históricas (crises 2020 e 2024)',
      'Assoreamento do Rio Taquari decorrente de erosão no planalto vizinho',
      'Drenagem de banhados e alterações do regime natural de inundação'
    ],
    color: '#06b6d4',
    borderColor: '#0891b2',
    deforestationProdes2024Km2: 382,
    deforestationTrendPercent: -5.9,
    activeFireHotspots24h: 185,
    sources: [
      {
        name: 'INPE / BDQueimadas Pantanal',
        url: 'https://queimadas.dgi.inpe.br',
        description: 'Monitoramento diário de focos de calor com satélites de referência.',
        lastUpdated: '08/11/2024'
      },
      {
        name: 'LASA-UFRJ (Sistema ALARMES)',
        url: 'https://alarmes.lasa.ufrj.br',
        description: 'Mapeamento quase em tempo real de cicatrizes de área queimada.',
        lastUpdated: '07/11/2024'
      }
    ]
  },
  costeiro_marinho: {
    id: 'costeiro_marinho',
    name: 'Sistema Costeiro-Marinho',
    category: 'Sistema Costeiro e Marinho',
    areaKm2: 4114000, // ~514.000 km² faixa costeira terrestre + 3.600.000 km² ZEE marítima
    percentageBrazil: 42.4, // em relação ao espaço marítimo sob jurisdição brasileira (Amazônia Azul)
    nativeVegetationPercentage: 74.0, // manguezais e restingas preservadas
    protectedAreaPercentage: 26.3, // 26,3% da ZEE protegida em UCs marítimas
    states: ['AP', 'PA', 'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA', 'ES', 'RJ', 'SP', 'PR', 'SC', 'RS'],
    climate: 'Variável de equatorial a subtropical ao longo de mais de 7.491 km de litoral contínuo.',
    description: 'Engloba a plataforma continental, recifes de corais, manguezais, marismas, restingas, dunas, ilhas oceânicas (Fernando de Noronha, Trindade, Abrolhos, Atol das Rocas) e a Zona Econômica Exclusiva (Amazônia Azul).',
    ecologicalImportance: 'Berçário reprodutivo da ictiofauna marinha, sequestro de "carbono azul" em manguezais, proteção costeira contra erosão e tempestades oceânicas.',
    mainThreats: [
      'Eventos severos de branqueamento de corais devido ao aquecimento oceânico',
      'Poluição marinha por plásticos, esgoto sanitário e efluentes industriais',
      'Supressão de manguezais para carcinicultura e especulação imobiliária',
      'Sobrepesca predatória e prospecção petrolífera em áreas sensíveis'
    ],
    color: '#3b82f6',
    borderColor: '#2563eb',
    deforestationProdes2024Km2: null, // Nota metodológica oficial: PRODES é voltado à vegetação terrestre; manguezais monitorados por MapBiomas/ICMBio
    deforestationTrendPercent: null,
    activeFireHotspots24h: 38,
    sources: [
      {
        name: 'IBGE - Biomas e Sistema Costeiro-Marinho do Brasil',
        url: 'https://www.ibge.gov.br',
        description: 'Classificação oficial de ecossistemas costeiros e limites da ZEE.',
        lastUpdated: '2024'
      },
      {
        name: 'ICMBio / SisBio - UCs Marinhas',
        url: 'https://www.gov.br/icmbio',
        description: 'Base de dados das Unidades de Conservação Federais Costeiras e Marinhas.',
        lastUpdated: '2024'
      },
      {
        name: 'MapBiomas Água e Zona Costeira',
        url: 'https://mapbiomas.org',
        description: 'Mapeamento histórico de manguezais, apicuns e recifes.',
        lastUpdated: 'Agosto/2024'
      }
    ]
  }
};

export const BIOMES_LIST = Object.values(BIOMES_DATA);
