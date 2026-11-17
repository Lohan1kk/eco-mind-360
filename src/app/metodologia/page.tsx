import React from "react";
import type { Metadata } from "next";
import {
  BookOpenCheck,
  Database,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  Flame,
  Compass,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Metodologia & Fontes Oficiais",
  description:
    "Critérios científicos, sensores orbitais (NASA FIRMS e INPE BDQueimadas), classificação por FRP e fontes primárias auditadas.",
};

const OFFICIAL_SOURCES = [
  {
    institution: "NASA EOSDIS / LANCE",
    program: "NASA FIRMS (Fire Information for Resource Management System)",
    type: "Detecção Térmica Quase em Tempo Real (NRT)",
    url: "https://firms.modaps.eosdis.nasa.gov",
    sensor: "VIIRS (NOAA-20, NOAA-21 e Suomi-NPP · 375 m) e MODIS (Terra e Aqua · 1 km)",
    status: "Ativo / Cache 15 min",
    lastAudit: "Quase em tempo real (~3 h de latência)",
  },
  {
    institution: "INPE / MCTI",
    program: "Programa Queimadas (BDQueimadas)",
    type: "Rede Multi-Satélite Nacional",
    url: "https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/",
    sensor: "GOES-19, NOAA-20/21, METOP-B/C, MSG-03, Terra e Aqua",
    status: "Ativo / Integrado",
    lastAudit: "Contínuo (Diário / 10 min)",
  },
  {
    institution: "IBGE",
    program: "Biomas e Sistema Costeiro-Marinho + Malha de UFs",
    type: "Cartografia Oficial e Limites Territoriais",
    url: "https://www.ibge.gov.br/geociencias/cartografia/biomas-e-sistema-costeiro-marinho.html",
    sensor: "Bases Geodésicas e Cartográficas Oficiais (1:250.000)",
    status: "Ativo / Índice RBush",
    lastAudit: "2024",
  },
  {
    institution: "INPE / MCTI",
    program: "Programa PRODES & Sistema DETER",
    type: "Auditoria Anual e Alerta Diário de Desmatamento",
    url: "https://terrabrasilis.dpi.inpe.br",
    sensor: "Landsat-8/9, Sentinel-2, CBERS-4A, Amazonia-1",
    status: "Ativo / Verificado",
    lastAudit: "Novembro / 2024",
  },
  {
    institution: "Rede MapBiomas",
    program: "MapBiomas Brasil (Coleção 9: 1985–2023)",
    type: "Mapeamento Histórico de Uso e Cobertura da Terra",
    url: "https://mapbiomas.org",
    sensor: "Série histórica Landsat (30 m)",
    status: "Ativo / Verificado",
    lastAudit: "Agosto / 2024",
  },
  {
    institution: "ICMBio / MMA",
    program: "Cadastro Nacional de Unidades de Conservação (CNUC)",
    type: "Áreas Legalmente Protegidas",
    url: "https://www.gov.br/icmbio",
    sensor: "Sistema SisBio / MMA",
    status: "Ativo / Verificado",
    lastAudit: "2024",
  },
];

export default function MetodologiaPage() {
  return (
    <div className="section-inner py-8 space-y-10">
      <header className="border-b border-[var(--border)] pb-6 space-y-2">
        <span className="eyebrow">Transparência Científica</span>
        <h1 className="font-display text-4xl sm:text-5xl text-[var(--foreground)]">
          Metodologia e fontes de dados
        </h1>
        <p className="lede text-sm sm:text-base text-[var(--foreground-secondary)]">
          Critérios de classificação por potência radiativa (FRP), indexação espacial nos 7 ambientes brasileiros e bases oficiais auditadas.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr] items-start">
        {/* Índice lateral fixo no desktop */}
        <aside
          aria-label="Índice da página"
          className="hidden lg:block sticky top-24 space-y-2 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4 text-xs"
        >
          <span className="block font-medium text-[var(--foreground)] pb-1 border-b border-[var(--border)]">
            Nesta página
          </span>
          <nav className="flex flex-col space-y-2 pt-1 text-[var(--foreground-secondary)]">
            <a href="#integridade" className="hover:text-[var(--primary)] transition-colors">
              1. Integridade dos dados
            </a>
            <a href="#arquitetura" className="hover:text-[var(--primary)] transition-colors">
              2. Sensores e escala FRP
            </a>
            <a href="#distincoes" className="hover:text-[var(--primary)] transition-colors">
              3. Distinções cartográficas
            </a>
            <a href="#fontes" className="hover:text-[var(--primary)] transition-colors">
              4. Fontes primárias
            </a>
            <a href="#limitacoes" className="hover:text-[var(--primary)] transition-colors">
              5. Limitações orbitais
            </a>
          </nav>
        </aside>

        {/* Conteúdo de leitura confortável */}
        <div className="space-y-12">
          <section id="integridade" className="scroll-mt-24 glass-panel p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
              <ShieldCheck size={18} strokeWidth={1.5} />
              <span>1. Compromisso de integridade de dados</span>
            </div>
            <p className="lede text-sm text-[var(--foreground-secondary)]">
              Nenhum foco de calor exibido nesta plataforma é fruto de simulação ou estimativa fictícia. Todos os pontos provêm das bases oficiais do <strong>NASA FIRMS</strong> e do <strong>INPE BDQueimadas</strong>, processados no servidor com identificação de satélite e horário UTC da passagem orbital.
            </p>
          </section>

          <section id="arquitetura" className="scroll-mt-24 space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl text-[var(--foreground)]">
              2. Arquitetura do monitoramento orbital
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="glass-panel p-6 space-y-2.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <Compass size={16} strokeWidth={1.5} className="text-[var(--primary)]" />
                  <span>Sensores polares e geoestacionários</span>
                </div>
                <p className="text-xs leading-relaxed text-[var(--foreground-secondary)]">
                  Combinamos os sensores <strong>VIIRS (375 m)</strong> e <strong>MODIS (1 km)</strong> da NASA com a rede multi-satélite do <strong>INPE BDQueimadas</strong> (<strong>GOES-19</strong>, <strong>METOP-B/C</strong> e <strong>MSG-03</strong>), deduplicando detecções na mesma célula territorial e preservando o município oficial do IBGE.
                </p>
              </div>

              <div className="glass-panel p-6 space-y-2.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <Flame size={16} strokeWidth={1.5} className="text-[#EA580C]" />
                  <span>Escala de severidade por FRP (MW)</span>
                </div>
                <p className="text-xs leading-relaxed text-[var(--foreground-secondary)]">
                  A Potência Radiativa do Fogo (FRP em Megawatts) estima o calor liberado pela combustão:
                </p>
                <ul className="text-xs space-y-1 font-mono bg-[var(--background)] p-3 rounded-[8px] border border-[var(--border)]">
                  <li>◆ Crítico: FRP ≥ 100 MW</li>
                  <li>▲ Alto: 40 MW ≤ FRP &lt; 100 MW</li>
                  <li>■ Médio: 15 MW ≤ FRP &lt; 40 MW</li>
                  <li>● Baixo: FRP &lt; 15 MW</li>
                </ul>
              </div>

              <div className="glass-panel p-6 space-y-2.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <Database size={16} strokeWidth={1.5} className="text-[var(--primary)]" />
                  <span>Classificação nos 7 ambientes (IBGE)</span>
                </div>
                <p className="text-xs leading-relaxed text-[var(--foreground-secondary)]">
                  Cada coordenada passa por verificação geométrica <em>point-in-polygon</em> acelerada por índice espacial RBush contra as malhas oficiais dos 6 biomas terrestres, do Sistema Costeiro-Marinho e das 27 Unidades da Federação.
                </p>
              </div>

              <div className="glass-panel p-6 space-y-2.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                  <Clock size={16} strokeWidth={1.5} className="text-[var(--primary)]" />
                  <span>Janelas de consulta e cache</span>
                </div>
                <p className="text-xs leading-relaxed text-[var(--foreground-secondary)]">
                  O servidor revalida o cache a cada 15 minutos e oferece três janelas operacionais: <strong>24 horas</strong>, <strong>48 horas</strong> e <strong>7 dias</strong>.
                </p>
              </div>
            </div>
          </section>

          <section id="distincoes" className="scroll-mt-24 space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl text-[var(--foreground)]">
              3. Distinções cartográficas essenciais
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="glass-panel p-6 space-y-2">
                <h3 className="font-display text-xl text-[var(--foreground)] flex items-center gap-2">
                  <BookOpenCheck size={16} strokeWidth={1.5} className="text-[var(--primary)]" />
                  <span>Foco de calor ≠ Área queimada</span>
                </h3>
                <p className="text-xs leading-relaxed text-[var(--foreground-secondary)]">
                  O foco de calor registra uma anomalia térmica ativa no instante da passagem do satélite, enquanto a área queimada mede a extensão total da cicatriz deixada pelo fogo em hectares ou km².
                </p>
              </div>

              <div className="glass-panel p-6 space-y-2">
                <h3 className="font-display text-xl text-[var(--foreground)] flex items-center gap-2">
                  <BookOpenCheck size={16} strokeWidth={1.5} className="text-[var(--primary)]" />
                  <span>Alerta DETER ≠ Taxa PRODES</span>
                </h3>
                <p className="text-xs leading-relaxed text-[var(--foreground-secondary)]">
                  O DETER emite alertas diários rápidos para fiscalização em campo pelo IBAMA, enquanto o PRODES consolida a taxa anual auditada de desmatamento com imagens de alta resolução livres de nuvens.
                </p>
              </div>
            </div>
          </section>

          <section id="fontes" className="scroll-mt-24 space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl text-[var(--foreground)]">
              4. Fontes primárias auditadas
            </h2>

            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto" data-lenis-prevent>
                <table className="w-full text-left text-xs text-[var(--foreground)]">
                  <thead className="border-b border-[var(--border)] bg-[var(--background)] text-[11px] font-medium uppercase text-[var(--muted)]">
                    <tr>
                      <th className="py-3.5 px-4">Instituição / Programa</th>
                      <th className="py-3.5 px-4">Sensores</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Fonte</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {OFFICIAL_SOURCES.map((source, idx) => (
                      <tr key={idx} className="hover:bg-[var(--surface-hover)] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-[var(--foreground)]">
                            {source.institution}
                          </div>
                          <div className="text-[11px] text-[var(--muted)]">{source.program}</div>
                        </td>
                        <td className="py-3.5 px-4 text-[var(--foreground-secondary)]">
                          {source.sensor}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--primary)]">
                            <CheckCircle2 size={11} strokeWidth={1.5} />
                            {source.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-[var(--primary)] hover:underline"
                          >
                            <span>Acessar</span>
                            <ExternalLink size={12} strokeWidth={1.5} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="limitacoes" className="scroll-mt-24 glass-panel p-6 space-y-3">
            <h2 className="font-display text-2xl text-[var(--foreground)] flex items-center gap-2">
              <AlertTriangle size={18} strokeWidth={1.5} className="text-[var(--warning)]" />
              <span>5. Limitações do sensoriamento remoto</span>
            </h2>
            <p className="lede text-xs sm:text-sm text-[var(--foreground-secondary)]">
              Nuvens espessas de tempestade podem bloquear temporariamente sensores ópticos e infravermelhos. A fusão de satélites polares (VIIRS/MODIS/METOP) com geoestacionários (GOES-19 e MSG-03) reduz essas lacunas ao capturar aberturas atmosféricas ao longo do dia.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
