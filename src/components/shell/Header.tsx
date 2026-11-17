"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  BookOpenCheck,
  Calculator,
  ChevronDown,
  Compass,
  GitCompare,
  LayoutDashboard,
  MapPin,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "@/components/layout/ThemeContext";
import { BIOMES_LIST } from "@/data/biomes";

const MONITORAR_LINKS = [
  {
    href: "/mapa",
    label: "Mapa ao Vivo",
    desc: "Focos de calor orbitais do INPE e NASA FIRMS",
    icon: MapPin,
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    desc: "Indicadores consolidados dos 7 ambientes",
    icon: LayoutDashboard,
  },
  {
    href: "/alertas",
    label: "Alertas",
    desc: "Ocorrências térmicas e alertas DETER",
    icon: AlertTriangle,
  },
  {
    href: "/biomas",
    label: "Os 7 Ambientes",
    desc: "Fichas territoriais do IBGE e MapBiomas",
    icon: Compass,
  },
];

const APRENDER_LINKS = [
  {
    href: "/calculadora",
    label: "Calculadora de Carbono",
    desc: "Estime sua emissão anual em kg de CO₂e",
    icon: Calculator,
  },
  {
    href: "/comparacao",
    label: "Comparador de Ambientes",
    desc: "Confronte dois ambientes lado a lado",
    icon: GitCompare,
  },
  {
    href: "/metodologia",
    label: "Metodologia e Fontes",
    desc: "Sensores, critérios de FRP e bases oficiais",
    icon: BookOpenCheck,
  },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openGroup, setOpenGroup] = useState<"monitorar" | "aprender" | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const commandItems = useMemo(() => {
    const pages = [
      ...MONITORAR_LINKS.map((l) => ({
        href: l.href,
        title: l.label,
        subtitle: l.desc,
        group: "Monitorar",
      })),
      ...APRENDER_LINKS.map((l) => ({
        href: l.href,
        title: l.label,
        subtitle: l.desc,
        group: "Aprender e agir",
      })),
    ];

    const ambientes = BIOMES_LIST.map((b) => ({
      href: `/biomas/${b.id}`,
      title: b.name,
      subtitle: `${b.category} · ${b.percentageBrazil}% do território`,
      group: "Os 7 Ambientes",
    }));

    const all = [...pages, ...ambientes];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const isMonitorarActive = MONITORAR_LINKS.some((l) => pathname.startsWith(l.href));
  const isAprenderActive = APRENDER_LINKS.some((l) => pathname.startsWith(l.href));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
          scrolled || pathname.startsWith("/mapa")
            ? "border-b border-[var(--border)] bg-[var(--background)]/92 backdrop-blur-md"
            : "border-b border-transparent bg-[var(--background)]/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-6 md:px-10">
          {/* Identidade EcoMind 360° */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8">
              <Image
                src="/brand/icon-ecomind.png"
                alt="EcoMind 360°"
                width={32}
                height={32}
                sizes="32px"
                className="h-8 w-8 object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl tracking-tight text-[var(--foreground)]">
                EcoMind
              </span>
              <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--primary)]">
                360°
              </span>
            </div>
          </Link>

          {/* Navegação Desktop em 2 Grupos: "Monitorar" e "Aprender e agir" */}
          <nav className="hidden items-center gap-2 lg:flex" aria-label="Navegação principal">
            {/* Grupo 1: Monitorar */}
            <Popover.Root
              open={openGroup === "monitorar"}
              onOpenChange={(o) => setOpenGroup(o ? "monitorar" : null)}
            >
              <Popover.Trigger asChild>
                <button
                  type="button"
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-[8px] px-3.5 py-2 text-sm font-medium transition-colors ${
                    isMonitorarActive
                      ? "bg-[var(--accent-soft)]/60 text-[var(--primary)]"
                      : "text-[var(--foreground-secondary)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span>Monitorar</span>
                  <ChevronDown size={14} strokeWidth={1.5} />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  align="start"
                  sideOffset={8}
                  className="z-50 w-80 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lift focus:outline-none"
                >
                  <div className="grid gap-1">
                    {MONITORAR_LINKS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenGroup(null)}
                          className="flex items-start gap-3 rounded-[8px] p-2.5 transition-colors hover:bg-[var(--surface-hover)]"
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--accent-soft)] text-[var(--primary)]">
                            <Icon size={16} strokeWidth={1.5} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[var(--foreground)]">
                              {item.label}
                            </div>
                            <div className="text-xs text-[var(--muted)]">{item.desc}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            {/* Grupo 2: Aprender e agir */}
            <Popover.Root
              open={openGroup === "aprender"}
              onOpenChange={(o) => setOpenGroup(o ? "aprender" : null)}
            >
              <Popover.Trigger asChild>
                <button
                  type="button"
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-[8px] px-3.5 py-2 text-sm font-medium transition-colors ${
                    isAprenderActive
                      ? "bg-[var(--accent-soft)]/60 text-[var(--primary)]"
                      : "text-[var(--foreground-secondary)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span>Aprender e agir</span>
                  <ChevronDown size={14} strokeWidth={1.5} />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  align="start"
                  sideOffset={8}
                  className="z-50 w-80 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lift focus:outline-none"
                >
                  <div className="grid gap-1">
                    {APRENDER_LINKS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenGroup(null)}
                          className="flex items-start gap-3 rounded-[8px] p-2.5 transition-colors hover:bg-[var(--surface-hover)]"
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--accent-soft)] text-[var(--primary)]">
                            <Icon size={16} strokeWidth={1.5} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[var(--foreground)]">
                              {item.label}
                            </div>
                            <div className="text-xs text-[var(--muted)]">{item.desc}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </nav>

          {/* Ações à Direita: Busca Ctrl+K, Tema e Único CTA "Abrir mapa" */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              aria-label="Buscar páginas e ambientes (Ctrl+K)"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent-action)] hover:text-[var(--foreground)]"
            >
              <Search size={14} strokeWidth={1.5} />
              <span className="hidden sm:inline">Buscar...</span>
              <kbd className="hidden sm:inline-block rounded bg-[var(--background)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted)] border border-[var(--border)]">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
              title={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
              className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-secondary)] transition-colors hover:border-[var(--accent-action)] hover:text-[var(--foreground)]"
            >
              {theme === "dark" ? (
                <Sun size={16} strokeWidth={1.5} />
              ) : (
                <Moon size={16} strokeWidth={1.5} />
              )}
            </button>

            <Link
              href="/mapa"
              className="hidden sm:inline-flex btn-primary !min-h-[40px] !py-2 !px-4 text-xs"
            >
              <span>Abrir mapa</span>
            </Link>

            {/* Gatilho Mobile Sheet */}
            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-label="Abrir menu de navegação"
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] lg:hidden"
            >
              <Menu size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Sheet Mobile em Tela Cheia */}
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <AnimatePresence>
          {mobileOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs lg:hidden"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  data-lenis-prevent
                  initial={{ opacity: 0, x: "100%" }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: "100%" }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed inset-0 z-50 flex flex-col bg-[var(--background)] p-6 overflow-y-auto lg:hidden"
                >
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                    <Dialog.Title className="font-display text-2xl text-[var(--foreground)]">
                      EcoMind 360°
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Fechar menu"
                        className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]"
                      >
                        <X size={18} strokeWidth={1.5} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="mt-6 flex-1 space-y-8">
                    <div className="space-y-3">
                      <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                        Monitorar
                      </p>
                      <div className="grid gap-2">
                        {MONITORAR_LINKS.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-3.5"
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--accent-soft)] text-[var(--primary)]">
                                <Icon size={17} strokeWidth={1.5} />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-[var(--foreground)]">
                                  {item.label}
                                </div>
                                <div className="text-xs text-[var(--muted)]">{item.desc}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                        Aprender e agir
                      </p>
                      <div className="grid gap-2">
                        {APRENDER_LINKS.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-3.5"
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--accent-soft)] text-[var(--primary)]">
                                <Icon size={17} strokeWidth={1.5} />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-[var(--foreground)]">
                                  {item.label}
                                </div>
                                <div className="text-xs text-[var(--muted)]">{item.desc}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[var(--border)]">
                    <Link
                      href="/mapa"
                      onClick={() => setMobileOpen(false)}
                      className="btn-primary w-full justify-center"
                    >
                      <span>Abrir mapa</span>
                    </Link>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* Command Palette (Ctrl/Cmd + K) para Busca Rápida */}
      <Dialog.Root open={commandOpen} onOpenChange={setCommandOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 backdrop-blur-xs" />
          <Dialog.Content
            data-lenis-prevent
            className="fixed left-1/2 top-[15%] z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-lift focus:outline-none"
          >
            <Dialog.Title className="sr-only">
              Buscar páginas e ambientes brasileiros
            </Dialog.Title>
            <div className="flex items-center gap-2.5 border-b border-[var(--border)] px-2 pb-2.5">
              <Search size={16} strokeWidth={1.5} className="text-[var(--muted)]" />
              <input
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar páginas ou ambientes (ex.: Amazônia, Mapa, Calculadora)..."
                className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
              />
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Fechar busca"
                  className="rounded px-1.5 py-0.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  ESC
                </button>
              </Dialog.Close>
            </div>

            <div className="mt-2 max-h-72 overflow-y-auto space-y-1">
              {commandItems.length === 0 ? (
                <p className="py-6 text-center text-xs text-[var(--muted)]">
                  Nenhum resultado encontrado.
                </p>
              ) : (
                commandItems.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      setCommandOpen(false);
                      setSearchQuery("");
                      router.push(item.href);
                    }}
                    className="flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left transition-colors hover:bg-[var(--surface-hover)]"
                  >
                    <div>
                      <div className="text-sm font-medium text-[var(--foreground)]">
                        {item.title}
                      </div>
                      <div className="text-xs text-[var(--muted)]">{item.subtitle}</div>
                    </div>
                    <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--primary)]">
                      {item.group}
                    </span>
                  </button>
                ))
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
