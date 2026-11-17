"use client";

import React, { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ThemeProvider } from "@/components/layout/ThemeContext";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const isMap = pathname === "/mapa" || pathname === "/alerta-queimadas";
  const isHome = pathname === "/";

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
        <Header />
        <motion.main
          key={pathname}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className={`flex-1 ${
            isHome
              ? "pb-16 md:pb-0"
              : isMap
                ? "pt-16 pb-16 md:pb-0 flex flex-col"
                : "pt-20 md:pt-24 pb-24 md:pb-20"
          }`}
        >
          {children}
        </motion.main>
        {!isMap && <Footer />}
        <BottomNav />
      </div>
    </ThemeProvider>
  );
}
