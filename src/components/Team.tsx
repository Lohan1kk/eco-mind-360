'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const TEAM = [
  {
    name: 'Ana Flávia',
    role: 'Designer & Marketing',
    image: '/team/foto-ana.png',
  },
  {
    name: 'André Zauli',
    role: 'Programador Fullstack',
    image: '/team/foto-andre.png',
  },
  {
    name: 'Lucas Lohan',
    role: 'Programador & Pesquisa',
    image: '/team/foto-lucas.png',
  },
  {
    name: 'Gabriel Rosa',
    role: 'Conteúdo & Design Visual',
    image: '/team/foto-gabriel.png',
  },
];

export function Team() {
  return (
    <section id="equipe" className="section bg-slate-50 border-b border-slate-200/70">
      <div className="section-inner space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="badge-360">
            <Users size={12} className="text-emerald-600" />
            <span>Colégio Paulo de Tarso</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Quatro Alunos, Uma Causa Continental
          </h2>
          <p className="text-base text-slate-600">
            Desenvolvimento de software, cartografia digital e comunicação científica: uma equipe escolar
            provando na prática o poder do aprendizado ativo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((person) => (
            <motion.div
              key={person.name}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass-panel p-6 text-center space-y-4 relative group"
            >
              <div className="relative mx-auto h-28 w-28 rounded-full overflow-hidden ring-4 ring-emerald-500/20 group-hover:ring-emerald-500/50 transition-all shadow-md">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  {person.name}
                </h3>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                  {person.role}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-400 font-mono">
                EcoMind 360 Team
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
