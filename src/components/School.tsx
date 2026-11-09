'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, CheckCircle2 } from 'lucide-react';

const POINTS = [
  {
    title: 'Aprendizado Ativo',
    desc: 'O estudante analisa dados geoespaciais e anomalias térmicas diretamente, desenvolvendo pensamento crítico científico.',
  },
  {
    title: 'Interdisciplinaridade Real',
    desc: 'Integração de Geografia Física, Biologia da Conservação, Matemática Estatística e Tecnologia da Informação.',
  },
  {
    title: 'Cidadania Ecológica',
    desc: 'Compreensão de que a preservação do Cerrado e da Amazônia afeta a água e o regime de chuvas da nossa cidade.',
  },
  {
    title: 'Feito por Estudantes',
    desc: 'A demonstração viva de que jovens do Ensino Médio podem construir ferramentas digitais de padrão acadêmico.',
  },
];

export function School() {
  return (
    <section id="escola" className="section bg-[#064e3b] text-white relative overflow-hidden">
      {/* Luz ambiente */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="section-inner relative z-10 space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <GraduationCap size={14} />
            <span>Educação Transformadora</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Transformando o Tema Ambiental em Aprendizagem Viva
          </h2>
          <p className="text-base text-emerald-100/80 leading-relaxed">
            O EcoMind 360 conecta a grade curricular às notícias de queimadas e desmatamento — permitindo
            que a turma investigue, formule hipóteses e proponha soluções com dados reais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {POINTS.map((pt) => (
            <motion.div
              key={pt.title}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-white/10 border border-emerald-400/20 backdrop-blur-md space-y-2.5"
            >
              <div className="flex items-center gap-2 font-display text-lg font-bold text-emerald-200">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span>{pt.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/75 leading-relaxed">
                {pt.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
