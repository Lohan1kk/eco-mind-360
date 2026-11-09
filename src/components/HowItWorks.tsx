'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Satellite, Cpu, Users, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    n: '01',
    icon: Satellite,
    title: 'Telemetria Orbital',
    desc: 'Satélites de órbita polar e heliosíncrona (MODIS, VIIRS, Landsat-8 e Sentinel-2) captam radiação térmica e imagens ópticas ao sobrevoar o Brasil.',
  },
  {
    n: '02',
    icon: Cpu,
    title: 'Classificação por FRP',
    desc: 'O motor do EcoMind 360 processa as anomalias, calcula o FRP (Potência Radiativa do Fogo em Megawatts) e cruza as coordenadas com os 7 biomas.',
  },
  {
    n: '03',
    icon: Users,
    title: 'Cidadania & Sala de Aula',
    desc: 'Alunos, professores e cidadãos acessam indicadores auditados, calculam sua pegada de carbono e participam da gincana pedagógica do folclore.',
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section bg-slate-50 border-b border-slate-200/70">
      <div className="section-inner space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="badge-360">
            <Cpu size={12} className="text-emerald-600" />
            <span>Fluxo Operacional 360°</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Do Espaço à Prática Escolar em Três Etapas
          </h2>
          <p className="text-base text-slate-600">
            Como os dados públicos mais avançados do mundo se transformam em consciência viva para a sua comunidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <motion.article
                key={s.n}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-panel p-7 flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-display text-3xl font-black text-slate-300">
                      {s.n}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {s.title}
                  </h3>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-emerald-700">
                  <span>Etapa {s.n} de 03</span>
                  <ArrowRight size={13} />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
