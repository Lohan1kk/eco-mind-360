"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";

function subscribeOrigin() {
  return () => {};
}

function getOrigin() {
  return window.location.origin;
}

export function QrInstall() {
  const url = useSyncExternalStore(subscribeOrigin, getOrigin, () => "");

  if (!url) return <div className="skeleton h-48 w-48 rounded-xl" />;

  return (
    <div className="flex flex-col items-center gap-3">
      <Image
        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&bgcolor=f7fcf8&color=1b5e3b`}
        alt="QR code para abrir a EcoMind"
        width={200}
        height={200}
        unoptimized
        className="rounded-xl border border-forest/10"
      />
      <p className="text-center text-xs text-ash">
        Escaneie para abrir no celular
      </p>
    </div>
  );
}
