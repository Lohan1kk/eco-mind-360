"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { MessageSquare, X } from "lucide-react";
import { EvaluationSection } from "@/components/Evaluation";

export function Footer() {
  const [evalOpen, setEvalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-secondary)] py-14">
      <div className="section-inner grid grid-cols-1 gap-10 md:grid-cols-3">
        {/* Coluna 1: Identidade */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/icon-ecomind.png"
              alt="EcoMind 360°"
              width={28}
              height={28}
              sizes="28px"
              className="h-7 w-7 object-contain"
            />
            <span className="font-display text-xl text-[var(--foreground)]">
              EcoMind 360°
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[var(--muted)] max-w-xs">
            Monitoramento orbital e indicadores territoriais dos 7 ambientes brasileiros com dados públicos do INPE, NASA FIRMS, MapBiomas e IBGE.
          </p>
        </div>

        {/* Coluna 2: Acesso Rápido */}
        <nav aria-label="Links do rodapé" className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex flex-col space-y-2">
            <span className="font-medium text-[var(--foreground)]">Monitorar</span>
            <Link href="/mapa" className="hover:text-[var(--primary)] transition-colors">
              Mapa ao Vivo
            </Link>
            <Link href="/dashboard" className="hover:text-[var(--primary)] transition-colors">
              Dashboard
            </Link>
            <Link href="/biomas" className="hover:text-[var(--primary)] transition-colors">
              Os 7 Ambientes
            </Link>
            <Link href="/alertas" className="hover:text-[var(--primary)] transition-colors">
              Alertas
            </Link>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-medium text-[var(--foreground)]">Aprender e agir</span>
            <Link href="/calculadora" className="hover:text-[var(--primary)] transition-colors">
              Calculadora
            </Link>
            <Link href="/comparacao" className="hover:text-[var(--primary)] transition-colors">
              Comparador
            </Link>
            <Link href="/metodologia" className="hover:text-[var(--primary)] transition-colors">
              Metodologia
            </Link>
            <Link href="/baixar" className="hover:text-[var(--primary)] transition-colors">
              Instalar App
            </Link>
          </div>
        </nav>

        {/* Coluna 3: Projeto Escolar e Avaliação em Dialog */}
        <div className="flex flex-col items-start md:items-end justify-between gap-4 text-xs">
          <div className="md:text-right space-y-1">
            <p className="font-medium text-[var(--foreground)]">Colégio Paulo de Tarso</p>
            <p className="text-[var(--muted)]">
              Ana Flávia · André Zauli · Lucas Lohan · Gabriel Rosa
            </p>
          </div>

          <Dialog.Root open={evalOpen} onOpenChange={setEvalOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="btn-secondary !min-h-[40px] !py-2 !px-3.5 text-xs"
              >
                <MessageSquare size={14} strokeWidth={1.5} className="text-[var(--primary)]" />
                <span>Avalie o projeto</span>
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 backdrop-blur-xs" />
              <Dialog.Content
                data-lenis-prevent
                className="fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lift focus:outline-none"
              >
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
                  <Dialog.Title className="font-display text-2xl text-[var(--foreground)]">
                    Avalie o EcoMind 360°
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Fechar janela de avaliação"
                      className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                      <X size={16} strokeWidth={1.5} />
                    </button>
                  </Dialog.Close>
                </div>
                <EvaluationSection compactDialog />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      <div className="section-inner mt-10 border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--muted)]">
        <p>© {currentYear} EcoMind 360° · Todos os direitos reservados.</p>
        <p>Fontes primárias: INPE · NASA FIRMS · MapBiomas · IBGE</p>
      </div>
    </footer>
  );
}
