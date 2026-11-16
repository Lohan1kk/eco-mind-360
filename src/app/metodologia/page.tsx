import React from 'react';
import { 
  BookOpenCheck, 
  Database, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  CheckCircle2,
  Flame,
  Compass,
  Clock
} from 'lucide-react';
import { PageIntro } from '@/components/PageIntro';

const OFFICIAL_SOURCES = [
  {
    institution: 'NASA EOSDIS / LANCE',
    program: 'NASA FIRMS (Fire Information for Resource Management System)',
    type: 'Detecção Térmica Quase em Tempo Real (NRT)',
    url: 'https://firms.modaps.eosdis.nasa.gov',
    sensor: 'VIIRS (NOAA-20, NOAA-21 e Suomi-NPP · 375 m) como principal e MODIS (Terra e Aqua · 1 km) como complementar',
    role: 'Detecção de anomalias térmicas infravermelhas e estimativa da Potência Radiativa do Fogo (FRP em MW) com janelas de 24 h, 48 h e 7 dias.',
    status: 'Ativo / Cache 15 min',
    lastAudit: 'Quase em tempo real (~3 h de latência orbital)'
  },
  {
    institution: 'NASA EOSDIS',
    program: 'NASA GIBS (Global Imagery Browse Services)',
    type: 'Mosaico Orbital de Refletância Corrigida (WMTS)',
    url: 'https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs',
    sensor: 'VIIRS NOAA-20 True Color (EPSG:3857)',
    role: 'Camada visual opcional de imagem de satélite no mapa interativo, tratando o atraso natural de consolidação do mosaico diário.',
    status: 'Ativo / Sem chave',
    lastAudit: 'Mosaico diário consolidado'
  },
  {
    institution: 'IBGE',
    program: 'Biomas e Sistema Costeiro-Marinho do Brasil + Malha de UFs',
    type: 'Cartografia Oficial e Limites Territoriais',
    url: 'https://www.ibge.gov.br/geociencias/cartografia/biomas-e-sistema-costeiro-marinho.html',
    sensor: 'Bases Geodésicas e Cartográficas Oficiais (escala 1:250.000)',
    role: 'Delimitação poligonal oficial dos 6 biomas terrestres, do Sistema Costeiro-Marinho e das 27 Unidades da Federação usada na classificação espacial point-in-polygon.',
    status: 'Ativo / Índice RBush',
    lastAudit: '2024'
  },
  {
    institution: 'INPE',
    program: 'Programa Queimadas (BDQueimadas)',
    type: 'Monitoramento Nacional de Incêndios',
    url: 'https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/',
    sensor: 'Satélite de referência AQUA Tarde e constelação meteorológica',
    role: 'Referência oficial nacional para séries históricas de focos de calor e validação cruzada em território brasileiro.',
    status: 'Referência Oficial',
    lastAudit: 'Contínuo'
  },
  {
    institution: 'INPE / MCTI',
    program: 'Programa PRODES (Projeto de Monitoramento do Desmatamento)',
    type: 'Auditoria Anual Consolidada',
    url: 'https://terrabrasilis.dpi.inpe.br',
    sensor: 'Landsat-8/9, Sentinel-2, CBERS-4A (20-30m)',
    role: 'Taxa oficial de desmatamento por corte raso no Brasil, auditada anualmente por especialistas sobre imagens selecionadas livres de nuvens.',
    status: 'Ativo / Verificado',
    lastAudit: 'Novembro / 2024'
  },
  {
    institution: 'INPE / MCTI',
    program: 'Sistema DETER (Detecção do Desmatamento Quase em Tempo Real)',
    type: 'Alerta Rápido para Fiscalização',
    url: 'https://terrabrasilis.dpi.inpe.br',
    sensor: 'Amazonia-1, CBERS-4A (WFI 64m)',
    role: 'Sistema diário de alerta voltado à fiscalização imediata em campo pelo IBAMA e ICMBio.',
    status: 'Ativo / Verificado',
    lastAudit: 'Diário (Operacional)'
  },
  {
    institution: 'Rede MapBiomas',
    program: 'MapBiomas Brasil (Coleção 9: 1985-2023)',
    type: 'Mapeamento Histórico de Uso da Terra',
    url: 'https://mapbiomas.org',
    sensor: 'Série histórica Landsat (30m) processada em nuvem',
    role: 'Percentuais anuais de cobertura vegetal nativa, agropecuária e corpos hídricos para os biomas brasileiros.',
    status: 'Ativo / Verificado',
    lastAudit: 'Agosto / 2024'
  },
  {
    institution: 'ICMBio / MMA',
    program: 'Cadastro Nacional de Unidades de Conservação (CNUC)',
    type: 'Áreas Legalmente Protegidas',
    url: 'https://www.gov.br/icmbio',
    sensor: 'Sistema de Informação Geográfica SisBio',
    role: 'Delimitação e percentuais de Unidades de Conservação de Proteção Integral e Uso Sustentável.',
    status: 'Ativo / Verificado',
    lastAudit: '2024'
  }
];

export default function MetodologiaPage() {
  return (
    <div className="section-inner max-w-5xl mx-auto py-8 space-y-10">
      {/* Cabeçalho */}
      <div className="border-b border-[#222D25] pb-6">
        <PageIntro
          eyebrow="Transparência & Rigor Científico"
          title="Metodologia & Fontes de Dados Oficiais"
          eyebrowClassName="eyebrow text-[#789B7C]"
          titleClassName="display mt-2 text-3xl text-[#DCE5DD] md:text-4xl font-semibold"
        >
          <p className="mt-2.5 max-w-2xl text-sm sm:text-base text-[#A7B3A9]">
            Rastreabilidade irrestrita, critérios de classificação por FRP, indexação espacial point-in-polygon
            e limites operacionais dos sensores orbitais integrados ao EcoMind 360°.
          </p>
        </PageIntro>
      </div>

      {/* Compromisso de Honestidade Intelectual */}
      <div className="p-6 rounded-[10px] bg-[#131A16] border border-[#29362D] space-y-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#DCE5DD]">
          <ShieldCheck size={18} className="text-[#83A989]" />
          <span>Compromisso Fundamental de Integridade de Dados</span>
        </div>
        <p className="text-xs sm:text-sm text-[#A7B3A9] leading-relaxed">
          Nenhum dado de foco de calor exibido nesta plataforma é fruto de simulação, preenchimento artificial ou estimativa fictícia. Todos os focos provêm da API oficial do <strong>NASA FIRMS</strong>, processados exclusivamente no servidor e acompanhados de fonte primária e carimbo de data/hora. Quando a conexão externa sofre instabilidade, o sistema exibe de forma transparente o último conjunto real em cache indicando seu horário exato.
        </p>
      </div>

      {/* Pipeline de Focos NASA FIRMS: Sensores, Biomas, FRP e Janela de Tempo */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-[#DCE5DD] flex items-center gap-2">
          <Flame size={18} className="text-[#A9A17A]" />
          <span>Arquitetura do Monitoramento de Queimadas (NASA FIRMS)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 space-y-3">
            <div className="font-display font-semibold text-base text-[#91A88F] flex items-center gap-2">
              <Compass size={16} />
              <span>1. Sensores Usados: VIIRS (375 m) e MODIS (1 km)</span>
            </div>
            <p className="text-xs leading-relaxed text-[#A7B3A9]">
              Utilizamos os sensores <strong>VIIRS (375 m de resolução espacial)</strong> a bordo dos satélites <em>NOAA-20</em>, <em>NOAA-21</em> e <em>Suomi-NPP</em> como <strong>fonte principal</strong> pela sua alta sensibilidade a frentes menores de fogo.
            </p>
            <p className="text-xs leading-relaxed text-[#A7B3A9]">
              O sensor <strong>MODIS (1 km de resolução espacial)</strong> a bordo dos satélites <em>Terra</em> e <em>Aqua</em> entra como <strong>fonte complementar</strong>. Para evitar dupla contagem enganosa do mesmo incêndio entre diferentes satélites, nosso algoritmo no servidor deduplica detecções MODIS quando já existe registro VIIRS num raio de ~1,1 km na mesma janela de 4 horas. As escalas de confiança distintas (textual <code className="font-mono">l/n/h</code> no VIIRS e percentual <code className="font-mono">0–100%</code> no MODIS) são normalizadas em <em>baixa</em>, <em>nominal</em> e <em>alta</em>.
            </p>
          </div>

          <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 space-y-3">
            <div className="font-display font-semibold text-base text-[#A9A17A] flex items-center gap-2">
              <Flame size={16} />
              <span>2. Escala de Intensidade por FRP (Critério do Projeto)</span>
            </div>
            <p className="text-xs leading-relaxed text-[#A7B3A9]">
              A <strong>Potência Radiativa do Fogo (FRP)</strong>, medida em Megawatts (MW), quantifica a energia térmica emitida pela combustão. Para fins didáticos e de visualização no mapa, o <strong>EcoMind 360° define um critério próprio de projeto</strong> (não sendo um padrão normativo oficial da NASA ou do INPE):
            </p>
            <ul className="text-xs space-y-1 text-[#DCE5DD] font-mono bg-[#131A16] p-3 rounded-[7px] border border-[#222D25]">
              <li>◆ Crítico: FRP ≥ 100 MW (Vinho)</li>
              <li>▲ Alto: 40 MW ≤ FRP &lt; 100 MW (Vermelho)</li>
              <li>■ Médio: 15 MW ≤ FRP &lt; 40 MW (Laranja)</li>
              <li>● Baixo: FRP &lt; 15 MW (Amarelo)</li>
            </ul>
          </div>

          <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 space-y-3">
            <div className="font-display font-semibold text-base text-[#83A989] flex items-center gap-2">
              <Database size={16} />
              <span>3. Atribuição Foco → Bioma e UF (Point-in-Polygon)</span>
            </div>
            <p className="text-xs leading-relaxed text-[#A7B3A9]">
              Cada coordenada <code className="font-mono">(latitude, longitude)</code> retornada pelo NASA FIRMS na caixa delimitadora do Brasil (<code className="font-mono">-74, -34, -28, 6</code>, cobrindo o território continental e ilhas oceânicas como Fernando de Noronha e Trindade) passa por um teste geométrico <strong>point-in-polygon</strong> acelerado por árvore espacial <strong>RBush</strong> construída uma única vez em memória sobre a malha oficial do IBGE.
            </p>
            <p className="text-xs leading-relaxed text-[#A7B3A9]">
              Pontos sobre o oceano são classificados como <strong>Sistema Costeiro-Marinho</strong> exclusivamente quando caem dentro do polígono oficial costeiro-marinho definido pelo projeto; demais pontos marítimos ou de faixa de fronteira ficam rotulados como <em>&ldquo;Fora dos biomas&rdquo;</em> e entram apenas no total geral.
            </p>
          </div>

          <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 space-y-3">
            <div className="font-display font-semibold text-base text-[#91A88F] flex items-center gap-2">
              <Clock size={16} />
              <span>4. Janela de Tempo e Frequência de Atualização</span>
            </div>
            <p className="text-xs leading-relaxed text-[#A7B3A9]">
              Os dados operam em regime <strong>quase em tempo real (Near Real-Time — NRT)</strong>, com latência típica de cerca de <strong>3 horas</strong> entre a passagem física do satélite sobre o Brasil e a disponibilização do registro processado pela NASA.
            </p>
            <p className="text-xs leading-relaxed text-[#A7B3A9]">
              O servidor do EcoMind 360° revalida o cache a cada <strong>15 minutos</strong>, deduplicando requisições simultâneas e oferecendo três janelas móveis de consulta: <strong>últimas 24 h</strong> (padrão sincronizado entre Home, Dashboard, Comparador, Fichas dos Biomas e Mapa), <strong>últimas 48 h</strong> e <strong>últimos 7 dias</strong> (168 h).
            </p>
          </div>
        </div>
      </div>

      {/* Conceitos Científicos Chave */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-[#DCE5DD] flex items-center gap-2">
          <BookOpenCheck size={18} className="text-[#789B7C]" />
          <span>Glossário & Distinções Cartográficas Obrigatórias</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 space-y-3">
            <div className="font-display font-semibold text-base text-[#A9A17A]">
              1. Foco de Calor ≠ Incêndio Confirmado ≠ Área Queimada
            </div>
            <p className="text-xs leading-relaxed text-[#A7B3A9]">
              <strong className="text-[#DCE5DD]">Foco de Calor (Hotspot):</strong> É um alerta orbital de anomalia térmica detectado pelo sensor infravermelho no instante da passagem do satélite. Não é por si só um incêndio florestal confirmado: exige investigação em campo ou cruzamento com cicatrizes.
            </p>
            <p className="text-xs leading-relaxed text-[#A7B3A9]">
              <strong className="text-[#DCE5DD]">Área Queimada (Burn Scar):</strong> É o polígono cartografado da cicatriz deixada pelo fogo na vegetação, medido em hectares ou km². Um único foco pode alastrar-se por dezenas de hectares, assim como vários focos contíguos podem pertencer à mesma frente de fogo.
            </p>
          </div>

          <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 space-y-3">
            <div className="font-display font-semibold text-base text-[#83A989]">
              2. Alerta DETER ≠ Taxa Oficial PRODES
            </div>
            <p className="text-xs leading-relaxed text-[#A7B3A9]">
              <strong className="text-[#DCE5DD]">DETER (INPE):</strong> Sistema de detecção de corte raso e degradação quase em tempo real (diário/semanal), baseado em sensores de resolução ampla (WFI 64m). Sua função é orientar ações imediatas do IBAMA.
            </p>
            <p className="text-xs leading-relaxed text-[#A7B3A9]">
              <strong className="text-[#DCE5DD]">PRODES (INPE):</strong> Taxa anual definitiva auditada desde 1988 pelo INPE. Utiliza imagens de alta resolução (Sentinel-2 e Landsat) em períodos de céu claro, computando apenas áreas com perda total de dossel florestal acima de 6,25 hectares.
            </p>
          </div>
        </div>
      </div>

      {/* Tabela de Fontes Primárias e Status */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-[#DCE5DD] flex items-center gap-2">
          <Database size={18} className="text-[#789B7C]" />
          <span>Fontes Primárias Auditadas</span>
        </h2>

        <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#DCE5DD]">
              <thead className="bg-[#131A16] text-[11px] font-mono uppercase text-[#78877D] border-b border-[#222D25]">
                <tr>
                  <th className="py-3.5 px-4 font-medium">Instituição / Programa</th>
                  <th className="py-3.5 px-4 font-medium">Natureza dos Dados</th>
                  <th className="py-3.5 px-4 font-medium">Sensores Orbitais</th>
                  <th className="py-3.5 px-4 font-medium">Status no App</th>
                  <th className="py-3.5 px-4 font-medium">Janela / Latência</th>
                  <th className="py-3.5 px-4 text-right font-medium">Link Oficial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222D25] font-sans">
                {OFFICIAL_SOURCES.map((source, idx) => (
                  <tr key={idx} className="hover:bg-[#1D2821]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#DCE5DD]">{source.institution}</div>
                      <div className="text-[11px] text-[#78877D]">{source.program}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#A7B3A9]">{source.type}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#A7B3A9]">{source.sensor}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-[7px] font-mono font-medium bg-[#294C35] text-[#DCE5DD] border border-[#365C40]">
                        <CheckCircle2 size={10} className="text-[#83A989]" />
                        {source.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#78877D]">{source.lastAudit}</td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#91A88F] hover:text-[#DCE5DD] font-medium hover:underline inline-flex items-center gap-1 text-xs"
                      >
                        <span>Acessar</span>
                        <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Limitações Técnicas Reconhecidas */}
      <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold text-[#DCE5DD] flex items-center gap-2">
          <AlertTriangle size={18} className="text-[#A9A17A]" />
          <span>Cobertura de Nuvens e Limitações do Sensoriamento Remoto Orbital</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#A7B3A9] leading-relaxed">
          <div className="p-4 rounded-[7px] bg-[#131A16] border border-[#222D25] space-y-1.5">
            <strong className="text-[#DCE5DD] block font-medium">Cobertura de Nuvens e Fumaça Densa:</strong>
            Sensores ópticos e infravermelhos térmicos (VIIRS e MODIS) não atravessam nuvens espessas de tempestade (cumulonimbus), podendo ocultar focos ativos sob nebulosidade até a abertura de janelas atmosféricas.
          </div>
          <div className="p-4 rounded-[7px] bg-[#131A16] border border-[#222D25] space-y-1.5">
            <strong className="text-[#DCE5DD] block font-medium">Resolução Espacial e Fogo de Sub-bosque:</strong>
            O VIIRS possui pixel nominal de 375 m e o MODIS de 1 km no nadir. Queimas muito pequenas ou incêndios rasteiros sob dossel florestal fechado podem não atingir o limiar radiativo mínimo para detecção orbital.
          </div>
          <div className="p-4 rounded-[7px] bg-[#131A16] border border-[#222D25] space-y-1.5">
            <strong className="text-[#DCE5DD] block font-medium">Passagens Orbitais e Falsos Positivos:</strong>
            Satélites de órbita polar registram retratos instantâneos nas horas de sobrevoo (diurno e noturno). Fontes térmicas industriais isoladas (siderúrgicas, flares de plataformas ou chaminés) também podem gerar anomalias térmicas pontuais.
          </div>
        </div>
      </div>
    </div>
  );
}
