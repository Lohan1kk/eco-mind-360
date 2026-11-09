'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, LayoutDashboard, Calculator, HelpCircle, ArrowUpRight, Sparkles } from 'lucide-react';

const TOOLS = [
  {
    href: '/mapa',
    tag: 'Tempo Real',
    title: 'Mapa Orbital de Queimadas',
    desc: 'Focos de calor instantâneos (INPE e NASA FIRMS) graduados por potência radiativa (FRP), com a malha vetorial dos 7 biomas.',
    cta: 'Abrir mapa 360°',
    icon: MapPin,
    gradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    href: '/dashboard',
    tag: 'Telemetria',
    title: 'Dashboard dos 7 Ambientes',
    desc: 'Indicadores territoriais consolidados: desmatamento PRODES 2024, áreas protegidas ICMBio e cobertura vegetal nativa.',
    cta: 'Acessar painel',
    icon: LayoutDashboard,
    gradient: 'from-teal-500 to-cyan-600',
    iconBg: 'bg-teal-500/10 text-teal-600',
  },
  {
    href: '/calculadora',
    tag: 'Pegada Pessoal',
    title: 'Calculadora de Carbono',
    desc: 'Descubra sua emissão anual estimada em kg de CO₂e nos eixos transporte, alimentação e energia com recomendações práticas.',
    cta: 'Calcular emissão',
    icon: Calculator,
    gradient: 'from-emerald-600 to-green-600',
    iconBg: 'bg-green-500/10 text-green-600',
  },
  {
    href: '/quiz',
    tag: 'Gincana Escolar',
    title: 'Quiz & Folclore Protetor',
    desc: 'Educação ambiental conectada às lendas brasileiras: o papel do Curupira, Caipora e Boitatá na proteção das matas nativas.',
    cta: 'Iniciar gincana',
    icon: HelpCircle,
    gradient: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-500/10 text-amber-600',
  },
];

export function Tools() {
  return (
    <section id="ferramentas" className="section bg-white border-y border-slate-200/70">
      <div className="section-inner space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/70 pb-6">
          <div>
            <div className="badge-360 mb-2">
              <Sparkles size={12} />
              <span>Ferramentas Integradas</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Quatro Módulos de Consciência e Ação
            </h2>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              Da detecção orbital de queimadas à gincana escolar: uma plataforma unificada
              desenvolvida por alunos para transformar dados complexos em ações concretas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <motion.article
                key={t.title}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {t.tag}
                    </span>
                    <div className={`h-10 w-10 rounded-xl ${t.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {t.title}
                  </h3>

                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                    {t.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80">
                  <Link
                    href={t.href}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 group/link"
                  >
                    <span>{t.cta}</span>
                    <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
