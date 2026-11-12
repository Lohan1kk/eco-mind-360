"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { enterTransition, scaleIn, softEase } from "@/components/motion";
import { ALERT_LEVELS, LEVEL_META } from "@/lib/alerts/levels";
import type { AlertLevel } from "@/lib/alerts/types";

interface ReportFireModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    lat: number;
    lng: number;
    level: AlertLevel;
    description?: string;
  }) => Promise<void>;
  coords: { lat: number; lng: number } | null;
  pickMode: boolean;
  onStartPickMode: () => void;
  onCancelPickMode: () => void;
  onUseGeolocation: () => void;
  submitting: boolean;
  error: string | null;
}

export function ReportFireModal({
  open,
  onClose,
  onSubmit,
  coords,
  pickMode,
  onStartPickMode,
  onCancelPickMode,
  onUseGeolocation,
  submitting,
  error,
}: ReportFireModalProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (pickMode) onCancelPickMode();
        else onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pickMode, onCancelPickMode, onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!coords) return;

    const form = e.currentTarget;
    const level = (form.elements.namedItem("level") as HTMLSelectElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;

    if (!ALERT_LEVELS.includes(level as AlertLevel)) return;

    await onSubmit({
      lat: coords.lat,
      lng: coords.lng,
      level: level as AlertLevel,
      description: description.trim() || undefined,
    });
  }

  if (open && pickMode) {
    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1200] flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-[10px] border border-[#29362D] bg-[#171F1A]/95 px-4 py-3 shadow-lift backdrop-blur-md">
          <p className="flex-1 text-xs font-medium text-[#DCE5DD]">
            Toque no mapa para marcar o foco
          </p>
          <button
            type="button"
            onClick={onCancelPickMode}
            className="rounded-[7px] bg-[#1D2821] border border-[#29362D] px-3 py-1.5 text-xs font-medium text-[#DCE5DD] hover:bg-[#243129]"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="report-modal"
          className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/70 backdrop-blur-sm p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-title"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.25, ease: softEase }}
        >
          <motion.div
            className="w-full max-w-md rounded-[14px] border border-[#29362D] bg-[#171F1A] p-6 shadow-lift"
            variants={scaleIn}
            initial={reduce ? false : "hidden"}
            animate="visible"
            exit={reduce ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={reduce ? { duration: 0 } : enterTransition}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#222D25] pb-4">
              <div>
                <h2
                  id="report-title"
                  className="font-display text-lg font-semibold text-[#DCE5DD]"
                >
                  Reportar queimada
                </h2>
                <p className="mt-1 text-xs text-[#78877D]">
                  O reporte fica salvo neste aparelho (não sincroniza na nuvem).
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-[7px] px-2 py-1 text-xs text-[#78877D] hover:bg-[#1D2821] hover:text-[#DCE5DD]"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium text-[#DCE5DD]">Localização</p>
                {coords ? (
                  <p className="mt-1 text-xs font-mono text-[#91A88F]">
                    {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-[#A9A17A]">
                    Escolha uma forma de definir o local.
                  </p>
                )}
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={onStartPickMode}
                    className="btn-secondary !py-1.5 !px-3 text-xs"
                  >
                    Marcar no mapa
                  </button>
                  <button
                    type="button"
                    onClick={onUseGeolocation}
                    className="btn-secondary !py-1.5 !px-3 text-xs"
                  >
                    Usar minha localização
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="level"
                  className="block text-xs font-medium text-[#DCE5DD]"
                >
                  Nível de alerta
                </label>
                <select
                  id="level"
                  name="level"
                  defaultValue="medio"
                  className="mt-1.5 w-full rounded-[7px] border border-[#29362D] bg-[#131A16] px-3 py-2 text-xs text-[#DCE5DD] outline-none focus:border-[#789B7C]"
                >
                  {ALERT_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {LEVEL_META[level].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-medium text-[#DCE5DD]"
                >
                  Descrição (opcional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  maxLength={500}
                  placeholder="Ex.: fumaça visível, área de mata..."
                  className="mt-1.5 w-full resize-y rounded-[7px] border border-[#29362D] bg-[#131A16] px-3 py-2 text-xs text-[#DCE5DD] placeholder:text-[#78877D] outline-none focus:border-[#789B7C]"
                />
              </div>

              {error ? (
                <p role="alert" className="text-xs font-medium text-[#A77D78]">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={!coords || submitting}
                className="w-full btn-primary !py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Salvando..." : "Salvar neste aparelho"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
