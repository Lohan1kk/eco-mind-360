"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer, staggerItem } from "@/components/motion";

export function PageIntro({
  eyebrow,
  title,
  children,
  eyebrowClassName,
  titleClassName,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  eyebrowClassName?: string;
  titleClassName?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={staggerContainer}
      initial={reduce ? false : "hidden"}
      animate="visible"
    >
      <motion.p
        className={eyebrowClassName ?? "eyebrow text-[#91A88F]"}
        variants={staggerItem}
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        className={
          titleClassName ??
          "font-display font-semibold tracking-tight mt-2 text-3xl text-[#DCE5DD] md:text-4xl"
        }
        variants={staggerItem}
      >
        {title}
      </motion.h1>
      {children ? (
        <motion.div variants={staggerItem}>{children}</motion.div>
      ) : null}
    </motion.div>
  );
}
