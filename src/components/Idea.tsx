'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const HIGHLIGHTS = [
  'Inteligência territorial aberta: dados oficiais direto da NASA e do INPE sem intermediários.',
  'Orçamento R$ 0: infraestrutura moderna gratuita que prova que a tecnologia pode ser democrática.',
  'Foco nos 7 Ambientes: da floresta tropical densa ao ambiente recifal costeiro-marinho.',
  'Aprendizado ativo: calculadora de carbono e gincana para envolver alunos e comunidade.',
];

export function Idea() {
  return (
    <section id="ideia" className="section bg-[#131A16] border-b border-[#222D25] overflow-hidden relative">
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="badge-360">
              <Sparkles size={12} className="text-[#789B7C]" />
              <span>A Nossa Proposta</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#DCE5DD] tracking-tight leading-tight">
              A Ponte entre os Satélites e a Sala de Aula.
            </h2>

            <p className="text-base text-[#A7B3A9] leading-relaxed">
              O <strong className="text-[#DCE5DD] font-semibold">EcoMind 360°</strong> nasceu de um grupo de estudantes
              do Colégio Paulo de Tarso. Em vez de apenas lamentar o desmatamento, unimos engenharia de software,
              design e geografia para criar um centro de inteligência ambiental que qualquer pessoa pode acessar no celular.
            </p>

            <ul className="space-y-3 pt-1">
              {HIGHLIGHTS.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#DCE5DD]">
                  <CheckCircle2 size={15} className="text-[#83A989] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Link
                href="/mapa"
                className="btn-primary !py-2.5 !px-5 text-xs font-semibold"
              >
                <span>Acessar o Mapa 360°</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/metodologia"
                className="btn-secondary !py-2.5 !px-5 text-xs font-medium"
              >
                <span>Metodologia & Dados</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="p-8 rounded-[14px] bg-[#171F1A] border border-[#29362D] text-center space-y-5 max-w-sm w-full">
              <div className="relative mx-auto h-24 w-24">
                <Image
                  src="/brand/icon-ecomind.png"
                  alt="EcoMind 360 Logo"
                  fill
                  className="object-contain"
                />
              </div>

              <div>
                <span className="font-display text-2xl font-semibold text-[#DCE5DD]">
                  EcoMind <span className="text-[#91A88F]">360°</span>
                </span>
                <p className="text-xs text-[#78877D] mt-1">
                  Inteligência Territorial & Educação Ambiental
                </p>
              </div>

              <div className="pt-4 border-t border-[#222D25] grid grid-cols-2 gap-3 text-left text-xs">
                <div className="p-3 rounded-[7px] bg-[#1D2821] border border-[#29362D]">
                  <span className="text-[#78877D] block text-[10px] uppercase font-mono">Iniciativa</span>
                  <span className="font-medium text-[#DCE5DD] mt-0.5 block">Paulo de Tarso</span>
                </div>
                <div className="p-3 rounded-[7px] bg-[#1D2821] border border-[#29362D]">
                  <span className="text-[#78877D] block text-[10px] uppercase font-mono">Custo de API</span>
                  <span className="font-mono font-medium text-[#83A989] mt-0.5 block">R$ 0,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
