"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import {
  clearEvaluation,
  readEvaluation,
  saveEvaluation,
  type Evaluation,
} from "@/lib/evaluation";

const LABELS = ["Péssimo", "Ruim", "Ok", "Bom", "Excelente"] as const;

export function EvaluationSection() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState<Evaluation | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    const existing = readEvaluation();
    if (existing) {
      setSaved(existing);
      setRating(existing.rating);
      setName(existing.name);
      setComment(existing.comment);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError("Escolha uma nota de 1 a 5.");
      return;
    }
    try {
      const next = saveEvaluation({ rating, name, comment });
      setSaved(next);
      setEditing(false);
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 2500);
    } catch {
      setError("Não foi possível salvar neste aparelho.");
    }
  }

  function handleClear() {
    clearEvaluation();
    setSaved(null);
    setRating(0);
    setName("");
    setComment("");
    setEditing(false);
    setError(null);
  }

  const showForm = !saved || editing;
  const active = hover || rating;

  return (
    <section
      id="avaliacao"
      className="section scroll-mt-20 relative overflow-hidden bg-[#131A16] border-b border-[#222D25]"
    >
      <div className="section-inner">
        <div className="max-w-2xl space-y-3">
          <div className="badge-360">
            <MessageSquare size={12} className="text-[#789B7C]" />
            <span>Feedback do Projeto</span>
          </div>
          <h2 className="font-display font-semibold tracking-tight text-3xl text-[#DCE5DD] sm:text-4xl">
            Avalie o EcoMind 360°
          </h2>
          <p className="text-base text-[#A7B3A9] leading-relaxed">
            Sua avaliação fica salva localmente neste navegador para registro durante a apresentação escolar.
          </p>
        </div>

        <div className="mt-10 max-w-lg">
          {!showForm && saved ? (
            <div className="rounded-[10px] border border-[#29362D] bg-[#171F1A] px-6 py-8 text-center sm:px-8">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-[#91A88F]">
                Avaliação salva neste aparelho
              </p>
              <div
                className="mt-4 flex justify-center gap-1.5"
                aria-label={`Nota ${saved.rating} de 5`}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${
                      i < saved.rating ? "text-[#91A88F]" : "text-[#29362D]"
                    }`}
                    aria-hidden
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm font-medium text-[#DCE5DD]">
                {LABELS[saved.rating - 1]}
              </p>
              {saved.name ? (
                <p className="mt-4 text-sm text-[#A7B3A9]">
                  — {saved.name}
                </p>
              ) : null}
              {saved.comment ? (
                <p className="mt-3 text-sm leading-relaxed text-[#DCE5DD]">
                  “{saved.comment}”
                </p>
              ) : null}
              <p className="mt-4 text-[11px] font-mono text-[#78877D]">
                Salva em{" "}
                {new Date(saved.updatedAt).toLocaleString("pt-BR")}
              </p>
              {justSaved ? (
                <p className="mt-3 text-sm font-medium text-[#83A989]">
                  Salvo neste aparelho.
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="btn-primary cursor-pointer"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn-secondary cursor-pointer"
                >
                  Apagar deste aparelho
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-[10px] border border-[#29362D] bg-[#171F1A] px-6 py-8 sm:px-8"
            >
              <fieldset>
                <legend className="text-sm font-medium text-[#DCE5DD]">
                  Nota geral (1 a 5 estrelas)
                </legend>
                <div
                  className="mt-4 flex gap-2"
                  onMouseLeave={() => setHover(0)}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const value = i + 1;
                    const on = value <= active;
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-label={`${value} estrela${value > 1 ? "s" : ""} — ${LABELS[i]}`}
                        aria-pressed={rating === value}
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHover(value)}
                        onFocus={() => setHover(value)}
                        className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-[7px] text-2xl transition touch-manipulation ${
                          on
                            ? "text-[#91A88F] bg-[#294C35] border border-[#365C40]"
                            : "text-[#78877D] hover:text-[#DCE5DD] bg-[#131A16] border border-[#29362D]"
                        }`}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-[#A7B3A9]" aria-live="polite">
                  {active ? LABELS[active - 1] : "Selecione de 1 a 5 estrelas"}
                </p>
              </fieldset>

              <label className="mt-6 block">
                <span className="text-xs font-medium text-[#DCE5DD]">
                  Nome{" "}
                  <span className="font-normal text-[#78877D]">(opcional)</span>
                </span>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  autoComplete="name"
                  placeholder="Como quer aparecer"
                  className="mt-2 w-full rounded-[7px] border border-[#29362D] bg-[#131A16] px-3 py-2 text-sm text-[#DCE5DD] outline-none placeholder:text-[#78877D] focus:border-[#789B7C]"
                />
              </label>

              <label className="mt-4 block">
                <span className="text-xs font-medium text-[#DCE5DD]">
                  Comentário{" "}
                  <span className="font-normal text-[#78877D]">(opcional)</span>
                </span>
                <textarea
                  name="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={600}
                  rows={3}
                  placeholder="O que funcionou bem? O que melhorar?"
                  className="mt-2 w-full resize-y rounded-[7px] border border-[#29362D] bg-[#131A16] px-3 py-2 text-sm text-[#DCE5DD] outline-none placeholder:text-[#78877D] focus:border-[#789B7C]"
                />
              </label>

              {error ? (
                <p className="mt-3 text-xs font-medium text-[#A77D78]" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="btn-primary cursor-pointer"
                >
                  {saved ? "Atualizar avaliação" : "Salvar avaliação"}
                </button>
                {editing ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      if (saved) {
                        setRating(saved.rating);
                        setName(saved.name);
                        setComment(saved.comment);
                      }
                      setError(null);
                    }}
                    className="btn-secondary cursor-pointer"
                  >
                    Cancelar
                  </button>
                ) : null}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
