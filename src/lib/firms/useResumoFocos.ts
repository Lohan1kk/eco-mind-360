"use client";

import { useCallback, useEffect, useState } from "react";
import type { PeriodoFocos, ResumoFocos } from "./types";

interface UseResumoFocosResult {
  resumo: ResumoFocos | null;
  loading: boolean;
  error: string | null;
  refresh: (force?: boolean) => Promise<void>;
}

let sharedResumo24hCache: { data: ResumoFocos; ts: number } | null = null;
let sharedResumo24hPromise: Promise<ResumoFocos> | null = null;

export function useResumoFocos(
  periodo: PeriodoFocos = "24h",
  initialData?: ResumoFocos | null,
): UseResumoFocosResult {
  const [resumo, setResumo] = useState<ResumoFocos | null>(() => {
    if (initialData) return initialData;
    if (periodo === "24h" && sharedResumo24hCache && Date.now() - sharedResumo24hCache.ts < 300000) {
      return sharedResumo24hCache.data;
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(!resumo);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (force = false) => {
      setLoading(true);
      setError(null);
      try {
        if (!force && periodo === "24h") {
          if (sharedResumo24hCache && Date.now() - sharedResumo24hCache.ts < 300000) {
            setResumo(sharedResumo24hCache.data);
            setLoading(false);
            return;
          }
          if (!sharedResumo24hPromise) {
            sharedResumo24hPromise = fetch(`/api/focos?periodo=24h&resumo=1`)
              .then(async (res) => {
                if (!res.ok) throw new Error("Falha ao carregar resumo de focos");
                const json = (await res.json()) as { resumo: ResumoFocos };
                sharedResumo24hCache = { data: json.resumo, ts: Date.now() };
                return json.resumo;
              })
              .finally(() => {
                sharedResumo24hPromise = null;
              });
          }
          const r = await sharedResumo24hPromise;
          setResumo(r);
          setLoading(false);
          return;
        }

        const url = `/api/focos?periodo=${periodo}&resumo=1${force ? "&refresh=1" : ""}`;
        const res = await fetch(url, force ? { cache: "no-store" } : undefined);
        if (!res.ok) {
          throw new Error("Não foi possível carregar o resumo de focos.");
        }
        const json = (await res.json()) as { resumo: ResumoFocos };
        if (periodo === "24h") {
          sharedResumo24hCache = { data: json.resumo, ts: Date.now() };
        }
        setResumo(json.resumo);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao buscar resumo de focos.");
      } finally {
        setLoading(false);
      }
    },
    [periodo],
  );

  useEffect(() => {
    if (!initialData) {
      void load(false);
    }
  }, [initialData, load]);

  return {
    resumo,
    loading,
    error,
    refresh: load,
  };
}
