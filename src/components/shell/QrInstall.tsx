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

  if (!url) return <div className="bg-[#1D2821] h-48 w-48 rounded-[10px] animate-pulse" />;

  return (
    <div className="flex flex-col items-center gap-3">
      <Image
        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&bgcolor=171F1A&color=DCE5DD`}
        alt="QR code para abrir a EcoMind"
        width={200}
        height={200}
        unoptimized
        className="rounded-[10px] border border-[#29362D]"
      />
      <p className="text-center text-xs text-[#A7B3A9]">
        Escaneie para abrir no celular
      </p>
    </div>
  );
}
