"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import {
  clearEvaluation,
  readEvaluation,
  saveEvaluation,
  type Evaluation,
} from "@/lib/evaluation";

const LABELS = ["Péssimo", "Ruim", "Ok", "Bom", "Excelente"] as const;

export function EvaluationSection({ compactDialog = false }: { compactDialog?: boolean }) {
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

  const content = !showForm && saved ? (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--background)] px-6 py-7 text-center">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--primary)]">
        Avaliação salva neste aparelho
      </p>
      <div
        className="mt-4 flex justify-center gap-1.5"
        aria-label={`Nota ${saved.rating} de 5`}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={22}
            strokeWidth={1.5}
            className={
              i < saved.rating
                ? "fill-[var(--primary)] text-[var(--primary)]"
                : "text-[var(--border)]"
            }
          />
        ))}
      </div>
      <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
        {LABELS[saved.rating - 1]}
      </p>
      {saved.name ? (
        <p className="mt-3 text-sm text-[var(--foreground-secondary)]">— {saved.name}</p>
      ) : null}
      {saved.comment ? (
        <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]">
          “{saved.comment}”
        </p>
      ) : null}
      <p className="mt-3 text-xs text-[var(--muted)]">
        Salva em {new Date(saved.updatedAt).toLocaleString("pt-BR")}
      </p>
      {justSaved ? (
        <p className="mt-2 text-xs font-medium text-[var(--primary)]">
          Salvo com sucesso.
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="btn-primary"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="btn-secondary"
        >
          Apagar deste aparelho
        </button>
      </div>
    </div>
  ) : (
    <form
      onSubmit={handleSubmit}
      className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <fieldset>
        <legend className="text-sm font-medium text-[var(--foreground)]">
          Nota geral (1 a 5)
        </legend>
        <div
          className="mt-3 flex gap-2"
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
                className={`flex h-11 w-11 items-center justify-center rounded-[8px] border transition ${
                  on
                    ? "border-[var(--primary)] bg-[var(--accent-soft)] text-[var(--primary)]"
                    : "border-[var(--border)] bg-[var(--background)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <Star size={18} strokeWidth={1.5} className={on ? "fill-[var(--primary)]" : ""} />
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]" aria-live="polite">
          {active ? LABELS[active - 1] : "Selecione de 1 a 5 estrelas"}
        </p>
      </fieldset>

      <label className="mt-4 block">
        <span className="text-xs font-medium text-[var(--foreground)]">
          Nome <span className="font-normal text-[var(--muted)]">(opcional)</span>
        </span>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          autoComplete="name"
          placeholder="Como quer aparecer"
          className="mt-1.5 w-full rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-medium text-[var(--foreground)]">
          Comentário <span className="font-normal text-[var(--muted)]">(opcional)</span>
        </span>
        <textarea
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={600}
          rows={3}
          placeholder="O que funcionou bem? O que melhorar?"
          className="mt-1.5 w-full resize-y rounded-[8px] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
        />
      </label>

      {error ? (
        <p className="mt-3 text-xs font-medium text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" className="btn-primary">
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
            className="btn-secondary"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );

  if (compactDialog) {
    return content;
  }

  return (
    <section id="avaliacao" className="section scroll-mt-20 border-b border-[var(--border)]">
      <div className="section-inner max-w-xl">
        <div className="space-y-2 mb-6">
          <div className="badge-360">
            <MessageSquare size={12} strokeWidth={1.5} />
            <span>Feedback do Projeto</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[var(--foreground)]">
            Avalie o EcoMind 360°
          </h2>
        </div>
        {content}
      </div>
    </section>
  );
}
