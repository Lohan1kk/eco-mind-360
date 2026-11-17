import React from "react";
import Link from "next/link";
import { Compass, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="section-inner flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
      <span className="badge-360 mb-4">Erro 404</span>
      <h1 className="font-display text-4xl sm:text-5xl text-[var(--foreground)]">
        Página não encontrada
      </h1>
      <p className="mt-3 max-w-md text-sm text-[var(--foreground-secondary)]">
        O endereço acessado não existe ou foi movido. Explore o mapa ao vivo ou volte para a página inicial.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/mapa" className="btn-primary">
          <MapPin size={15} strokeWidth={1.5} />
          <span>Abrir mapa</span>
        </Link>
        <Link href="/" className="btn-secondary">
          <Compass size={15} strokeWidth={1.5} />
          <span>Voltar ao início</span>
        </Link>
      </div>
    </div>
  );
}
