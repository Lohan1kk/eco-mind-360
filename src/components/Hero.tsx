"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ForestAtmosphere } from "@/components/ui/forest-atmosphere";
import {
  hoverLift,
  pressTransition,
  scaleSoft,
  softEase,
  staggerHero,
  staggerItemSoft,
  tapPress,
} from "@/components/motion";
import { MapPin, LayoutDashboard, Calculator } from "lucide-react";

const HERO_SRC = "/brand/hero-ecomind-4k.jpg";

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.08 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const ambientOn = !reduce && active;

  return (
    <section
      ref={sectionRef}
      id="topo"
      className="relative min-h-[100svh] overflow-hidden bg-[#0a1610]"
    >
      <motion.div
        className={`absolute inset-0 ${ambientOn ? "will-change-transform" : ""}`}
        initial={reduce ? false : { opacity: 0.8, scale: 1.04 }}
        animate={
          ambientOn
            ? { opacity: 1, scale: [1.02, 1.045, 1.02] }
            : { opacity: 1, scale: 1.02 }
        }
        transition={
          ambientOn
            ? {
                opacity: { duration: 1.1, ease: softEase },
                scale: {
                  duration: 30,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                },
              }
            : { duration: 0.45, ease: softEase }
        }
      >
        <Image
          src={HERO_SRC}
          alt="Floresta brasileira EcoMind 360"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[52%_38%]"
        />
      </motion.div>

      {!reduce ? (
        <ForestAtmosphere intensity={active ? 0.42 : 0.2} active={active} />
      ) : null}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(105deg, rgba(10,22,16,0.72) 0%, rgba(10,22,16,0.36) 40%, rgba(10,22,16,0.1) 70%, rgba(10,22,16,0.3) 100%),
            linear-gradient(to top, rgba(10,22,16,0.68) 0%, transparent 46%)
          `,
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24 md:pt-36">
        <motion.div
          className="max-w-2xl"
          variants={staggerHero}
          initial={reduce ? false : "hidden"}
          animate="visible"
        >
          <motion.div className="mb-7" variants={scaleSoft}>
            <Image
              src="/brand/icon-ecomind.png"
              alt="EcoMind 360"
              width={120}
              height={120}
              className="h-14 w-14 object-contain drop-shadow-md md:h-16 md:w-16"
              priority
            />
            <p className="display mt-4 text-5xl text-mist md:text-7xl">
              EcoMind <span className="text-sprout font-bold">360</span>
            </p>
          </motion.div>

          <motion.h1
            className="display max-w-xl text-2xl text-sprout md:text-4xl"
            variants={staggerItemSoft}
          >
            Cada decisão é uma semente.
          </motion.h1>

          <motion.p
            className="mt-5 max-w-xl text-base leading-relaxed text-mist/90 md:text-xl"
            variants={staggerItemSoft}
          >
            Consciência ambiental + inteligência territorial aberta. Monitoramento dos 7 ambientes brasileiros, dados de desmatamento oficiais (INPE/PRODES) e mapa orbital de queimadas em tempo real.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            variants={staggerItemSoft}
          >
            <motion.div
              whileHover={reduce ? undefined : hoverLift}
              whileTap={reduce ? undefined : tapPress}
              transition={pressTransition}
            >
              <Link href="/mapa" className="btn btn-primary cursor-pointer inline-flex items-center gap-2">
                <MapPin size={16} />
                <span>Abrir mapa de queimadas</span>
              </Link>
            </motion.div>
            <motion.div
              whileHover={reduce ? undefined : hoverLift}
              whileTap={reduce ? undefined : tapPress}
              transition={pressTransition}
            >
              <Link
                href="/dashboard"
                className="btn btn-ghost cursor-pointer inline-flex items-center gap-2"
              >
                <LayoutDashboard size={16} />
                <span>Painel dos 7 Biomas</span>
              </Link>
            </motion.div>
            <motion.div
              whileHover={reduce ? undefined : hoverLift}
              whileTap={reduce ? undefined : tapPress}
              transition={pressTransition}
            >
              <Link
                href="/calculadora"
                className="btn btn-secondary cursor-pointer inline-flex items-center gap-2 text-mist border-white/20 hover:bg-white/10"
              >
                <Calculator size={16} />
                <span>Calcular pegada</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
