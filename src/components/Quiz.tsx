"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { QUIZ_QUESTIONS } from "@/data/quiz";

export function Quiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const reduce = useReducedMotion();

  const question = QUIZ_QUESTIONS[current];
  const progress = finished
    ? 100
    : ((current + (selected !== null ? 0.5 : 0)) / QUIZ_QUESTIONS.length) * 100;

  function handleAnswer(index: number) {
    if (selected !== null) return;
    setSelected(index);
    if (index === question.correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (current < QUIZ_QUESTIONS.length - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
      }
    }, 1200);
  }

  function reset() {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    const title =
      pct >= 80
        ? "Excelente!"
        : pct >= 50
          ? "Bom trabalho!"
          : "Continue aprendendo!";

    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] px-8 py-10">
          <p className="text-xs font-mono uppercase tracking-wider text-[#91A88F]">
            Resultado
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[#DCE5DD]">
            {title}
          </h2>
          <p className="mt-3 text-[#A7B3A9]">
            Você acertou{" "}
            <strong className="text-[#DCE5DD]">
              {score} de {QUIZ_QUESTIONS.length}
            </strong>{" "}
            ({pct}%)
          </p>
          <div className="mx-auto mt-6 h-2 max-w-xs overflow-hidden rounded-full bg-[#131A16] border border-[#222D25]">
            <motion.div
              className="h-full rounded-full bg-[#789B7C]"
              animate={{ width: `${pct}%` }}
              transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="mt-6 text-sm leading-relaxed text-[#A7B3A9]">
            Compartilhe a EcoMind e ajude mais pessoas a entender o impacto das
            escolhas do dia a dia.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={reset}
              className="btn-primary cursor-pointer"
            >
              Jogar novamente
            </button>
            <Link href="/calculadora" className="btn-secondary">
              Calcular pegada
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs font-mono text-[#78877D]">
          <span>
            Pergunta {current + 1} de {QUIZ_QUESTIONS.length}
          </span>
          <span className="text-[#91A88F]">{score} acertos</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#131A16] border border-[#222D25]">
          <motion.div
            className="h-full rounded-full bg-[#789B7C]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <div
        key={question.q}
        className="rounded-[10px] border border-[#29362D] bg-[#171F1A] px-6 py-7 sm:px-8 sm:py-8"
      >
        <h2 className="font-display text-lg font-semibold text-[#DCE5DD] sm:text-xl">
          {question.q}
        </h2>
        <div className="mt-6 grid gap-3">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correct;
            const isSelected = i === selected;
            let cls =
              "border-[#29362D] bg-[#131A16] hover:border-[#789B7C]/50 hover:bg-[#1D2821] text-[#DCE5DD]";
            if (selected !== null) {
              if (isCorrect)
                cls = "border-[#83A989] bg-[#294C35]/45 text-[#DCE5DD]";
              else if (isSelected)
                cls = "border-[#A77D78] bg-[#A77D78]/15 text-[#DCE5DD]";
              else
                cls = "border-[#222D25] bg-[#131A16]/50 text-[#78877D] opacity-60";
            }

            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className={`flex cursor-pointer items-center gap-3 rounded-[7px] border px-4 py-3.5 text-left text-sm font-medium transition sm:text-base ${cls}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] bg-[#1D2821] border border-[#29362D] text-xs font-mono font-semibold text-[#91A88F]">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null ? (
          <p className="mt-5 rounded-[7px] border border-[#222D25] bg-[#131A16] px-4 py-3 text-sm leading-relaxed text-[#A7B3A9]">
            {question.feedback}
          </p>
        ) : null}
      </div>
    </div>
  );
}
