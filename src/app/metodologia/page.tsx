import React from 'react';
import { 
  BookOpenCheck, 
  Database, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  CheckCircle2
} from 'lucide-react';
import { PageIntro } from '@/components/PageIntro';

const OFFICIAL_SOURCES = [
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
    program: 'Sistema DETER (Detecção do Desmatamento em Tempo Real)',
    type: 'Alerta Rápido para Fiscalização',
    url: 'https://terrabrasilis.dpi.inpe.br',
    sensor: 'Amazonia-1, CBERS-4A (WFI 64m)',
    role: 'Sistema diário de alerta voltado à fiscalização imediata em campo pelo IBAMA e ICMBio, priorizando velocidade sobre precisão fina de contorno.',
    status: 'Ativo / Verificado',
    lastAudit: 'Diário (Operacional)'
  },
  {
    institution: 'NASA EOSDIS',
    program: 'NASA FIRMS (Fire Information for Resource Management System)',
    type: 'Detecção Térmica Ativa em Tempo Real',
    url: 'https://firms.modaps.eosdis.nasa.gov',
    sensor: 'MODIS (Terra/Aqua 1km) e VIIRS (Suomi-NPP/NOAA-20 375m)',
    role: 'Detecção de anomalias térmicas infravermelhas e estimativa de potência radiativa do fogo (FRP) atualizada a cada passagem orbital.',
    status: 'Ativo / Feed 24h',
    lastAudit: 'Tempo Real'
  },
  {
    institution: 'INPE',
    program: 'Programa Queimadas (BDQueimadas)',
    type: 'Monitoramento Nacional de Incêndios',
    url: 'https://queimadas.dgi.inpe.br',
    sensor: 'Satélite de referência AQUA Tarde',
    role: 'Série histórica oficial e comparável do número de focos de calor no Brasil desde 1998.',
    status: 'Ativo / Verificado',
    lastAudit: 'Novembro / 2024'
  },
  {
    institution: 'Rede MapBiomas',
    program: 'MapBiomas Brasil (Coleção 9: 1985-2023)',
    type: 'Mapeamento Histórico de Uso da Terra',
    url: 'https://mapbiomas.org',
    sensor: 'Série histórica Landsat (30m) processada com IA no Google Earth Engine',
    role: 'Percentuais anuais de cobertura vegetal nativa, agropecuária, corpos hídricos e urbanização para todos os biomas brasileiros.',
    status: 'Ativo / Verificado',
    lastAudit: 'Agosto / 2024'
  },
  {
    institution: 'IBGE',
    program: 'Biomas e Sistema Costeiro-Marinho do Brasil',
    type: 'Cartografia Oficial e Limites Territoriais',
    url: 'https://www.ibge.gov.br/geociencias/cartografia/biomas-e-sistema-costeiro-marinho.html',
    sensor: 'Bases Geodésicas e Cartográficas Oficiais (escala 1:250.000)',
    role: 'Delimitação territorial de alta precisão dos 6 biomas terrestres e do Sistema Costeiro-Marinho da República Federativa do Brasil.',
    status: 'Ativo / Integrado via GeoJSON',
    lastAudit: '2024'
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
            Rastreabilidade irrestrita, critérios metodológicos, tratamento computacional e limites operacionais
            dos dados integrados ao EcoMind 360.
          </p>
        </PageIntro>
      </div>

      {/* Compromisso de Honestidade Intelectual */}
      <div className="p-6 rounded-[10px] bg-[#131A16] border border-[#29362D] space-y-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#DCE5DD]">
          <ShieldCheck size={18} className="text-[#83A989]" />
          <span>Compromisso Fundamental da Missão EcoMind 360</span>
        </div>
        <p className="text-xs sm:text-sm text-[#A7B3A9] leading-relaxed">
          Nenhum dado exibido nesta aplicação é fruto de simulação arbitrária ou estimativa fictícia. Em conformidade rigorosa com as diretrizes do projeto escolar e os parâmetros da ciência aberta, todos os dados são oriundos de repositórios oficiais públicos e auditados (INPE, NASA, IBGE, MapBiomas e ICMBio). Quando uma base apresenta latência, informamos explicitamente a restrição e direcionamos para a fonte primária.
        </p>
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
              1. Foco de Calor ≠ Área Queimada
            </div>
            <p className="text-xs leading-relaxed text-[#A7B3A9]">
              <strong className="text-[#DCE5DD]">Foco de Calor (Hotspot):</strong> É uma anomalia térmica detectada pelo sensor infravermelho de satélite no momento do sobrevoo orbital em que a temperatura do solo excede o limiar de combustão (1 pixel de detecção térmica).
            </p>
            <p className="text-xs leading-relaxed text-[#A7B3A9]">
              <strong className="text-[#DCE5DD]">Área Queimada (Burn Scar):</strong> É o polígono cartografado da cicatriz deixada pelo fogo na vegetação, medido em hectares ou km². Um único foco de calor pode alastrar-se por dezenas de hectares, assim como vários focos contíguos podem pertencer à mesma frente de fogo.
            </p>
          </div>

          <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] p-6 space-y-3">
            <div className="font-display font-semibold text-base text-[#83A989]">
              2. Alerta DETER ≠ Taxa Oficial PRODES
            </div>
            <p className="text-xs leading-relaxed text-[#A7B3A9]">
              <strong className="text-[#DCE5DD]">DETER (INPE):</strong> Sistema de detecção de corte raso e degradação em tempo quase-real (diário/semanal), baseado em sensores de resolução ampla (WFI 64m). Sua função é orientar ações imediatas do IBAMA. Não substitui a taxa anual por causa de nuvens.
            </p>
            <p className="text-xs leading-relaxed text-[#A7B3A9]">
              <strong className="text-[#DCE5DD]">PRODES (INPE):</strong> Taxa anual definitiva auditada desde 1988 pelo INPE. Utiliza imagens de alta resolução (Sentinel-2 e Landsat) em períodos de céu claro, computando apenas áreas com perda total de dossel florestal (corte raso) acima de 6,25 hectares.
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
                  <th className="py-3.5 px-4 font-medium">Última Auditoria</th>
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
          <span>Limitações do Sensoriamento Remoto Orbital</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#A7B3A9] leading-relaxed">
          <div className="p-4 rounded-[7px] bg-[#131A16] border border-[#222D25] space-y-1.5">
            <strong className="text-[#DCE5DD] block font-medium">Cobertura de Nuvens:</strong>
            Sensores ópticos (visível e infravermelho) não conseguem penetrar camadas densas de nuvens, o que pode mascarar focos em épocas chuvosas até a abertura de janelas atmosféricas.
          </div>
          <div className="p-4 rounded-[7px] bg-[#131A16] border border-[#222D25] space-y-1.5">
            <strong className="text-[#DCE5DD] block font-medium">Resolução Espacial:</strong>
            O sensor MODIS possui resolução de 1 km no nadir; o sensor VIIRS possui resolução de 375 m. Pequenas queimas de quintal podem não ser registradas caso sua emissão térmica não atinja a sensibilidade mínima do sensor.
          </div>
          <div className="p-4 rounded-[7px] bg-[#131A16] border border-[#222D25] space-y-1.5">
            <strong className="text-[#DCE5DD] block font-medium">Periodicidade Temporal:</strong>
            Satélites heliosíncronos passam sobre a mesma coordenada em horários específicos do dia (geralmente às 10h30 e 13h30 locais), registrando o estado instantâneo naquele instante.
          </div>
        </div>
      </div>
    </div>
  );
}
