'use client';

import React from 'react';
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
    <section id="escola" className="section bg-[#131A16] border-b border-[#222D25] text-[#DCE5DD] relative">
      <div className="section-inner relative z-10 space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="badge-360">
            <GraduationCap size={13} className="text-[#789B7C]" />
            <span>Educação Transformadora</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#DCE5DD]">
            Transformando o Tema Ambiental em Aprendizagem Viva
          </h2>
          <p className="text-base text-[#A7B3A9] leading-relaxed">
            O EcoMind 360 conecta a grade curricular às notícias de queimadas e desmatamento — permitindo
            que a turma investigue, formule hipóteses e proponha soluções com dados reais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {POINTS.map((pt) => (
            <div
              key={pt.title}
              className="glass-panel p-6 space-y-2.5"
            >
              <div className="flex items-center gap-2 font-display text-base font-semibold text-[#DCE5DD]">
                <CheckCircle2 size={16} className="text-[#83A989]" />
                <span>{pt.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#A7B3A9] leading-relaxed">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
