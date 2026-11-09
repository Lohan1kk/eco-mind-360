import React from 'react';
import Link from 'next/link';
import { 
  Map as MapIcon, 
  LayoutDashboard, 
  AlertTriangle, 
  BookOpenCheck, 
  ShieldCheck, 
  Satellite, 
  ArrowRight,
  Database,
  Layers
} from 'lucide-react';
import { BIOMES_LIST } from '@/data/biomes';

export default function HomePage() {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative rounded-3xl p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-slate-900 via-slate-950 to-[#070b12] border border-slate-800 shadow-2xl overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">
            <Satellite size={14} className="animate-pulse" />
            <span>Plataforma de Inteligência Territorial do Brasil</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            EcoMind <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">360</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Monitoramento e visualização científica contínua dos <strong className="text-emerald-400">7 ambientes brasileiros</strong>. 
            Uma plataforma aberta integrando dados oficiais de sensoriamento remoto, alertas de desmatamento e focos de calor com rigor metodológico.
          </p>

          {/* Botões de Ação Primária */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 group"
            >
              <LayoutDashboard size={18} />
              <span>Entrar no Dashboard Geral</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/mapa"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
            >
              <MapIcon size={18} className="text-cyan-400" />
              <span>Explorar Mapa Interativo</span>
            </Link>
          </div>
        </div>

        {/* Métricas Rápidas do Hero */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold font-mono text-white">8,51 M km²</div>
            <div className="text-xs text-slate-400 mt-0.5">Território Continental Monitorado</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-400">7 Ambientes</div>
            <div className="text-xs text-slate-400 mt-0.5">Biomas Terrestres e Costeiro-Marinho</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-cyan-400">100% Real</div>
            <div className="text-xs text-slate-400 mt-0.5">Fontes Públicas e Auditadas</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-amber-400">R$ 0</div>
            <div className="text-xs text-slate-400 mt-0.5">Custo de Infraestrutura (MVP 48h)</div>
          </div>
        </div>
      </section>

      {/* Os 7 Ambientes Monitorados */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs uppercase font-semibold text-emerald-500 tracking-wider">
              Abrangência Nacional
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Os Sete Ambientes Brasileiros
            </h2>
          </div>
          <Link
            href="/biomas"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Ver fichas técnicas completas →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {BIOMES_LIST.map((biome) => (
            <Link
              key={biome.id}
              href={`/biomas/${biome.id}`}
              className="p-5 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: biome.color }} />
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">
                      {biome.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    {biome.percentageBrazil}% BR
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {biome.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {biome.nativeVegetationPercentage}% nativo
                </span>
                <span className="text-slate-400 group-hover:text-white transition-colors flex items-center gap-0.5 text-[11px]">
                  Detalhes →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pilares Científicos e Tecnológicos */}
      <section className="p-8 rounded-3xl bg-slate-100 dark:bg-[#090e18] border border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <span className="text-xs uppercase font-semibold text-emerald-500 tracking-wider">
            Arquitetura & Compromisso
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Pilares da Plataforma EcoMind 360
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Projetado especialmente para uma apresentação de alto impacto com compromisso irrestrito à veracidade científica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Database size={20} />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Dados Oficiais e Rastreáveis
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Integração direta com o <strong>INPE (PRODES e DETER)</strong>, <strong>NASA FIRMS</strong>, 
              <strong>MapBiomas Coleção 9</strong>, <strong>IBGE</strong> e <strong>ICMBio</strong>. Nenhum indicador foi inventado.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Cartografia Geoespacial Real
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Polígonos geográficos oficiais do IBGE com limites precisos para os 7 ambientes, 
              renderizados com Leaflet de alto desempenho e alternância entre mapa vetorial e satélite orbital.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1522] border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Rigor Metodológico Escolar
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Distinção científica transparente entre <em>foco de calor</em> (anomalia de temperatura) e <em>área queimada</em>, 
              bem como entre <em>alerta de desmatamento</em> (DETER) e <em>taxa anual auditada</em> (PRODES).
            </p>
          </div>
        </div>
      </section>

      {/* Atalhos Rápidos para Apresentação */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard"
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900/40 border border-emerald-500/20 hover:border-emerald-500/50 transition-all flex items-center gap-4 group"
        >
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <div className="font-bold text-sm text-white">Dashboard Geral</div>
            <div className="text-xs text-slate-400">Indicadores e gráficos</div>
          </div>
        </Link>

        <Link
          href="/mapa"
          className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900/40 border border-cyan-500/20 hover:border-cyan-500/50 transition-all flex items-center gap-4 group"
        >
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
            <MapIcon size={22} />
          </div>
          <div>
            <div className="font-bold text-sm text-white">Mapa Interativo</div>
            <div className="text-xs text-slate-400">Leaflet e camadas reais</div>
          </div>
        </Link>

        <Link
          href="/alertas"
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900/40 border border-amber-500/20 hover:border-amber-500/50 transition-all flex items-center gap-4 group"
        >
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="font-bold text-sm text-white">Alertas & Ocorrências</div>
            <div className="text-xs text-slate-400">Filtros e tabela</div>
          </div>
        </Link>

        <Link
          href="/metodologia"
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900/40 border border-blue-500/20 hover:border-blue-500/50 transition-all flex items-center gap-4 group"
        >
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
            <BookOpenCheck size={22} />
          </div>
          <div>
            <div className="font-bold text-sm text-white">Metodologia & Fontes</div>
            <div className="text-xs text-slate-400">Transparência científica</div>
          </div>
        </Link>
      </section>
    </div>
  );
}
