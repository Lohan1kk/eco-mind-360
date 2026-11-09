import React from 'react';
import { 
  BookOpenCheck, 
  Database, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  CheckCircle2
} from 'lucide-react';

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
    <div className="space-y-8 py-2 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Metodologia & Transparência Científica
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
            Padrão Acadêmico
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Rastreabilidade irrestrita, critérios metodológicos, tratamento computacional e limites operacionais
        </p>
      </div>

      {/* Compromisso de Honestidade Intelectual */}
      <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-400">
          <ShieldCheck size={18} />
          <span>Compromisso Fundamental da Missão EcoMind 360</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Nenhum dado exibido nesta aplicação é fruto de simulação arbitrária ou estimativa fictícia. Em conformidade rigorosa com as diretrizes do projeto escolar, quando uma base apresenta latência ou limitação de integração em tempo real, informamos explicitamente a restrição técnica, fornecemos a data da última auditoria pública e direcionamos o usuário aos portais de dados abertos governamentais.
        </p>
      </div>

      {/* Conceitos Científicos Chave */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpenCheck size={18} className="text-emerald-500" />
          <span>Glossário e Distinções Técnicas Obrigatórias</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="font-bold text-sm text-amber-500">
              1. Foco de Calor ≠ Área Queimada
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Foco de Calor (Hotspot):</strong> É uma anomalia térmica detectada pelo sensor infravermelho de satélite no momento exato do sobrevoo orbital em que a temperatura do solo excede o limiar de combustão (tipicamente 1 pixel contendo fogo ativo).
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Área Queimada (Burn Scar):</strong> É o polígono cartografado da cicatriz deixada pelo fogo na vegetação, medido em hectares ou km² (sistemas como ALARMES/LASA-UFRJ ou MapBiomas Fogo). Um único foco de calor pode queimar dezenas de hectares, assim como vários focos contíguos podem pertencer à mesma queimada.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="font-bold text-sm text-emerald-500">
              2. Alerta DETER ≠ Taxa Oficial PRODES
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>DETER (INPE):</strong> Sistema de detecção de corte raso e degradação em tempo quase-real (diário/semanal), baseado em sensores de resolução moderada (WFI 64m). Sua função precípua é orientar a fiscalização do IBAMA. Não mede a taxa oficial devido à cobertura parcial de nuvens.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>PRODES (INPE):</strong> Taxa anual definitiva auditada desde 1988 pelo INPE. Utiliza mosaicos de imagens de alta resolução (Sentinel-2 e Landsat) em períodos secos com céu limpo, computando apenas áreas com perda total de dossel florestal (corte raso) acima de 6,25 hectares.
            </p>
          </div>
        </div>
      </div>

      {/* Tabela de Fontes Primárias e Status */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database size={18} className="text-blue-500" />
          <span>Tabela Geral de Fontes Primárias Auditadas</span>
        </h2>

        <div className="overflow-x-auto rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Instituição / Programa</th>
                <th className="py-3 px-4">Natureza dos Dados</th>
                <th className="py-3 px-4">Sensores Orbitais</th>
                <th className="py-3 px-4">Status no MVP</th>
                <th className="py-3 px-4">Última Auditoria</th>
                <th className="py-3 px-4 text-right">Link Oficial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              {OFFICIAL_SOURCES.map((source, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{source.institution}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{source.program}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{source.type}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">{source.sensor}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 size={10} />
                      {source.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">{source.lastAudit}</td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>Acessar</span>
                      <ExternalLink size={11} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Limitações Técnicas Reconhecidas */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />
          <span>Limitações do Sensoriamento Remoto Orbital</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 space-y-1">
            <strong className="text-slate-900 dark:text-slate-200 block">Cobertura de Nuvens:</strong>
            Sensores ópticos (visível e infravermelho) não conseguem penetrar camadas densas de nuvens, o que pode subestimar focos em épocas chuvosas até a abertura de janelas atmosféricas.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 space-y-1">
            <strong className="text-slate-900 dark:text-slate-200 block">Resolução Espacial:</strong>
            O sensor MODIS possui resolução de 1 km no nadir; o sensor VIIRS possui resolução de 375 m. Pequenas queimas controladas podem não ser registradas caso sua emissão térmica não atinja a sensibilidade mínima do canal.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 space-y-1">
            <strong className="text-slate-900 dark:text-slate-200 block">Periodicidade Temporal:</strong>
            Satélites heliosíncronos passam sobre a mesma coordenada em horários específicos do dia (geralmente às 10h30 e 13h30 locais), registrando o estado instantâneo naquele momento.
          </div>
        </div>
      </div>
    </div>
  );
}
