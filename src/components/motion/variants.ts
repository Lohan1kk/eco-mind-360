import type { Transition, Variants } from "framer-motion";

/** Soft ease from EcoMind + Swiss Minimalism. */
export const softEase = [0.22, 1, 0.36, 1] as const;

export const enterTransition: Transition = {
  duration: 0.32,
  ease: softEase,
};

export const pressTransition: Transition = {
  duration: 0.18,
  ease: "easeOut",
};

export const slowEnterTransition: Transition = {
  duration: 0.4,
  ease: softEase,
};

export const brandEnterTransition: Transition = {
  duration: 0.45,
  ease: softEase,
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1 },
};

export const scaleSoft: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: brandEnterTransition,
  },
};

export type StaggerOptions = {
  staggerChildren?: number;
  delayChildren?: number;
};

export function stagger(
  staggerChildren = 0.08,
  delayChildren = 0.04,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };
}

export const staggerContainer: Variants = stagger(0.08, 0.04);
export const staggerHero: Variants = stagger(0.08, 0.15);

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: enterTransition,
  },
};

export const staggerItemSoft: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: slowEnterTransition,
  },
};

export const hoverLift = { y: -2 } as const;
export const hoverNone = {} as const;
export const tapPress = { scale: 0.98 } as const;
export const tapSoft = { scale: 0.98 } as const;

export const hoverPresets = {
  lift: {
    whileHover: hoverLift,
    whileTap: tapPress,
    transition: pressTransition,
  },
  press: {
    whileHover: hoverNone,
    whileTap: tapPress,
    transition: pressTransition,
  },
} as const;

export type RevealVariantName = "fade" | "fadeUp" | "slideUp" | "scale";

export const revealVariants: Record<RevealVariantName, Variants> = {
  fade: fadeIn,
  fadeUp: fadeUp,
  slideUp: slideUp,
  scale: scaleIn,
};

export const revealViewport = {
  once: true,
  amount: 0.15,
  margin: "0px 0px -40px 0px",
} as const;

export function revealTransition(delayMs = 0): Transition {
  return { ...enterTransition, delay: delayMs / 1000 };
}
