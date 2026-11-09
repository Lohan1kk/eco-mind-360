'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/mapa', label: 'Mapa' },
  { href: '/biomas', label: '7 Biomas' },
  { href: '/alertas', label: 'Alertas' },
  { href: '/calculadora', label: 'Calculadora' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/comparacao', label: 'Comparador' },
  { href: '/metodologia', label: 'Metodologia' },
];

export function Header({ solid = false }: { solid?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isHome = pathname === '/';
  const isSolid = solid || scrolled || open || !isHome;

  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [solid]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isSolid
          ? 'border-b border-line bg-mist/95 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-9">
            <Image
              src="/brand/icon-ecomind.png"
              alt="EcoMind 360"
              width={36}
              height={36}
              className="h-9 w-9 object-contain group-hover:scale-105 transition-transform"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className={`font-display text-lg font-bold tracking-tight transition-colors ${
              isSolid ? 'text-forest' : 'text-mist'
            }`}>
              EcoMind <span className="text-sprout-deep">360</span>
            </span>
          </div>
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden items-center gap-6 xl:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  active
                    ? 'text-forest font-bold'
                    : isSolid
                      ? 'text-ash hover:text-forest'
                      : 'text-mist/85 hover:text-mist'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/mapa"
            className="btn btn-primary !px-4 !py-2 text-xs font-bold shadow-sm"
          >
            Abrir Mapa
          </Link>
        </nav>

        {/* Botão Mobile */}
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition xl:hidden ${
            isSolid ? 'bg-forest/10 text-forest' : 'bg-white/20 text-mist'
          }`}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
          <span>{open ? 'Fechar' : 'Menu'}</span>
        </button>
      </div>

      {/* Menu Dropdown Mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-line bg-mist px-5 py-5 shadow-lg xl:hidden"
          >
            <div className="flex flex-col space-y-3">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? 'bg-sprout text-forest font-bold'
                        : 'text-ink/80 hover:bg-mist-soft hover:text-forest'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/mapa"
                onClick={() => setOpen(false)}
                className="btn btn-primary mt-2 w-full text-center text-sm font-bold"
              >
                Abrir Mapa de Queimadas
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
