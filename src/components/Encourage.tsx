"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

export function Encourage() {
  return (
    <section
      id="agir"
      className="py-20 bg-[var(--accent-soft)]/45 border-b border-[var(--border)]"
    >
      <div className="section-inner flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <h2 className="font-display text-3xl sm:text-4xl text-[var(--foreground)] max-w-xl">
          Explore os focos de calor em tempo real nos 7 ambientes brasileiros.
        </h2>

        <Link href="/mapa" className="btn-primary shrink-0">
          <MapPin size={16} strokeWidth={1.5} />
          <span>Abrir mapa</span>
        </Link>
      </div>
    </section>
  );
}
