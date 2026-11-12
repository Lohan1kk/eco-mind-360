import L from "leaflet";
import { LEVEL_META } from "@/lib/alerts/levels";
import type { AlertLevel } from "@/lib/alerts/types";

const iconCache = new Map<AlertLevel, L.DivIcon>();

export function createPinIcon(level: AlertLevel): L.DivIcon {
  const cached = iconCache.get(level);
  if (cached) return cached;

  const color = LEVEL_META[level].color;
  const icon = L.divIcon({
    className: "fire-pin-icon",
    html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid #101512;box-shadow:0 2px 6px rgba(0,0,0,0.6);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });

  iconCache.set(level, icon);
  return icon;
}
