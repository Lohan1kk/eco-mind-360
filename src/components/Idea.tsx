'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const HIGHLIGHTS = [
  'Inteligência territorial aberta: dados oficiais direto da NASA e do INPE sem intermediários.',
  'Orçamento R$ 0: infraestrutura moderna gratuita que prova que a tecnologia pode ser democrática.',
  'Foco nos 7 Ambientes: da floresta tropical densa ao ambiente recifal costeiro-marinho.',
  'Aprendizado ativo: calculadora de carbono e gincana para envolver alunos e comunidade.',
];

export function Idea() {
  return (
    <section id="ideia" className="section bg-white border-b border-slate-200/70 overflow-hidden relative">
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="badge-360">
              <Sparkles size={12} className="text-emerald-600" />
              <span>A Nossa Proposta</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Ponte entre os Satélites e a Sala de Aula.
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              O <strong className="text-slate-900 font-bold">EcoMind 360°</strong> nasceu de um grupo de estudantes
              do Colégio Paulo de Tarso. Em vez de apenas lamentar o desmatamento, unimos engenharia de software,
              design e geografia para criar um centro de inteligência ambiental que qualquer pessoa pode acessar no celular.
            </p>

            <ul className="space-y-3 pt-2">
              {HIGHLIGHTS.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/mapa"
                className="btn-primary !py-2.5 !px-5 text-xs font-bold"
              >
                <span>Acessar o Mapa 360°</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/metodologia"
                className="btn-secondary !py-2.5 !px-5 text-xs font-bold"
              >
                <span>Metodologia & Dados</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative p-8 rounded-3xl bg-gradient-to-br from-emerald-900/5 to-teal-900/10 border border-emerald-500/20 text-center space-y-4 max-w-sm w-full shadow-lg"
            >
              <div className="relative mx-auto h-28 w-28 drop-shadow-md">
                <Image
                  src="/brand/icon-ecomind.png"
                  alt="EcoMind 360 Logo"
                  fill
                  className="object-contain"
                />
              </div>

              <div>
                <span className="font-display text-2xl font-black text-slate-900">
                  EcoMind <span className="text-emerald-600">360°</span>
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Inteligência Territorial & Educação Ambiental
                </p>
              </div>

              <div className="pt-3 border-t border-emerald-900/10 grid grid-cols-2 gap-2 text-left text-[11px]">
                <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Iniciativa</span>
                  <span className="font-bold text-slate-800">Paulo de Tarso</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/60">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Custo de API</span>
                  <span className="font-bold text-emerald-700">R$ 0,00</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
