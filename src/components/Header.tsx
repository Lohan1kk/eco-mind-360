"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  enterTransition,
  fadeUp,
  pressTransition,
  stagger,
  staggerItemSoft,
} from "@/components/motion";

const links = [
  { href: "/#problema", label: "Problema" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/calculadora", label: "Calculadora" },
  { href: "/quiz", label: "Quiz" },
  { href: "/alerta-queimadas", label: "Mapa" },
  { href: "/#glossario", label: "Termos" },
  { href: "/#equipe", label: "Equipe" },
  { href: "/#avaliacao", label: "Avaliar" },
];

export function Header({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const isSolid = solid || scrolled || open;

  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-200 ${
        isSolid
          ? "border-b border-[#222D25] bg-[#101512]/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/brand/icon-ecomind.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-tight text-[#DCE5DD]">
            EcoMind
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-[#A7B3A9] hover:text-[#DCE5DD] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/#agir" className="btn-primary !px-4 !py-2 text-sm">
            Começar
          </Link>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="rounded-[7px] border border-[#29362D] bg-[#171F1A] px-3.5 py-2 text-xs font-medium text-[#DCE5DD] xl:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.nav
            key="mobile-nav"
            className="overflow-hidden border-t border-[#222D25] bg-[#131A16] xl:hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={reduce ? { duration: 0 } : enterTransition}
          >
            <motion.ul
              className="flex flex-col gap-3 px-5 py-5"
              variants={stagger(0.05, 0.04)}
              initial={reduce ? false : "hidden"}
              animate="visible"
            >
              {links.map((link) => (
                <motion.li key={link.href} variants={staggerItemSoft}>
                  <Link
                    href={link.href}
                    className="block py-1 text-base font-medium text-[#DCE5DD]"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={fadeUp} transition={pressTransition}>
                <Link
                  href="/#agir"
                  className="btn-primary mt-2"
                  onClick={() => setOpen(false)}
                >
                  Começar
                </Link>
              </motion.li>
            </motion.ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
