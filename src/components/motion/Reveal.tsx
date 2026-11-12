"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  hoverPresets,
   type RevealVariantName,
} from "./variants";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  variant?: RevealVariantName;
  once?: boolean;
};

/**
 * Safe wrapper that guarantees content is always visible (never stuck at opacity: 0 on SSR/hydration).
 */
export function Reveal({
  children,
  className = "",
}: RevealProps) {
  return <div className={className}>{children}</div>;
}

type StaggerRevealProps = {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  once?: boolean;
};

export function StaggerReveal({
  children,
  className = "",
}: StaggerRevealProps) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  soft?: boolean;
}) {
  return <div className={className}>{children}</div>;
}

type MotionPressProps = {
  children: ReactNode;
  className?: string;
  preset?: keyof typeof hoverPresets;
};

/** Hover/tap wrapper for CTAs — gate with reduced motion. */
export function MotionPress({
  children,
  className = "",
  preset = "lift",
}: MotionPressProps) {
  const reduce = useReducedMotion();
  const p = hoverPresets[preset];

  return (
    <motion.div
      className={className}
      whileHover={reduce ? undefined : p.whileHover}
      whileTap={reduce ? undefined : p.whileTap}
      transition={p.transition}
    >
      {children}
    </motion.div>
  );
}
