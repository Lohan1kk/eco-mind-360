"use client";

import { useState } from "react";
import { FolkloreQuiz } from "@/components/FolkloreQuiz";
import { PageIntro } from "@/components/PageIntro";
import { Quiz } from "@/components/Quiz";

type Mode = "select" | "eco" | "folklore";

export function QuizPageClient() {
  const [mode, setMode] = useState<Mode>("select");

  return (
    <div className="section-inner">
      <PageIntro
        eyebrow="Educar"
        title={
          mode === "folklore"
            ? "Gincana do Folclore"
            : mode === "eco"
              ? "Quanto você sabe sobre a EcoMind?"
              : "Escolha seu desafio"
        }
        eyebrowClassName="eyebrow text-[#789B7C]"
        titleClassName="display mt-3 text-3xl text-[#DCE5DD] md:text-4xl font-semibold"
      >
        <p className="mt-3 max-w-xl text-sm sm:text-base text-[#A7B3A9] leading-relaxed">
          {mode === "folklore"
            ? "Desafio com timer, combo e imagem velada: descubra Curupira, Caipora, Boitatá e mais — e o que ensinam sobre floresta, rios e fogo."
            : mode === "eco"
              ? "Dez perguntas baseadas nos textos e dados do site — com feedback imediato após cada resposta."
              : "Teste o que você sabe sobre o site ou explore a mata encantada do folclore brasileiro."}
        </p>
      </PageIntro>

      <div className="mt-10">
        {mode === "select" ? (
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode("eco")}
              className="rounded-[10px] border border-[#29362D] bg-[#171F1A] cursor-pointer p-6 text-left transition hover:border-[#789B7C]/50 hover:bg-[#1D2821]"
            >
              <p className="text-xs font-mono uppercase tracking-wider text-[#91A88F]">
                Modo 01
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-[#DCE5DD]">
                Quiz EcoMind
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#A7B3A9]">
                Desmatamento, ferramentas do app e dados do clima — o conteúdo do
                site.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode("folklore")}
              className="rounded-[10px] border border-[#29362D] bg-[#171F1A] cursor-pointer p-6 text-left transition hover:border-[#789B7C]/50 hover:bg-[#1D2821]"
            >
              <p className="text-xs font-mono uppercase tracking-wider text-[#91A88F]">
                Modo 02
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-[#DCE5DD]">
                Gincana do Folclore
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#A7B3A9]">
                Imagem velada, timer e combo — lore do folclore com laço
                ambiental.
              </p>
            </button>
          </div>
        ) : null}

        {mode === "eco" ? (
          <div>
            <div className="mb-6 flex justify-end">
              <button
                type="button"
                onClick={() => setMode("select")}
                className="text-xs font-medium text-[#91A88F] hover:text-[#DCE5DD] underline-offset-4 hover:underline"
              >
                ← Trocar modo
              </button>
            </div>
            <Quiz />
          </div>
        ) : null}

        {mode === "folklore" ? (
          <div>
            <div className="mb-6 flex justify-end">
              <button
                type="button"
                onClick={() => setMode("select")}
                className="text-xs font-medium text-[#91A88F] hover:text-[#DCE5DD] underline-offset-4 hover:underline"
              >
                ← Trocar modo
              </button>
            </div>
            <FolkloreQuiz onChangeMode={() => setMode("select")} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
