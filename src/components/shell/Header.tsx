'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, MapPin } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/mapa', label: 'Mapa 360°' },
  { href: '/biomas', label: 'Os 7 Biomas' },
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
          ? 'border-b border-emerald-900/10 bg-white/90 shadow-sm backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        {/* Logo EcoMind 360 */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative h-9 w-9">
            <Image
              src="/brand/icon-ecomind.png"
              alt="EcoMind 360 Logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain group-hover:scale-105 transition-transform"
              priority
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`font-display text-xl font-black tracking-tight transition-colors ${
              isSolid ? 'text-slate-900' : 'text-white'
            }`}>
              EcoMind
            </span>
            <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 shadow-sm">
              360°
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
                className={`text-xs font-bold tracking-wide transition-colors ${
                  active
                    ? 'text-emerald-700 font-extrabold'
                    : isSolid
                      ? 'text-slate-600 hover:text-emerald-700'
                      : 'text-slate-200/90 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/mapa"
            className="btn-primary !py-2 !px-4 text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
          >
            <MapPin size={13} />
            <span>Abrir Mapa</span>
          </Link>
        </nav>

        {/* Botão Mobile */}
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition xl:hidden ${
            isSolid ? 'bg-slate-100 text-slate-800' : 'bg-white/15 text-white'
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
            className="border-b border-slate-200 bg-white/98 backdrop-blur-2xl px-5 py-5 shadow-2xl xl:hidden"
          >
            <div className="flex flex-col space-y-2.5">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                      active
                        ? 'bg-emerald-50 text-emerald-800 font-extrabold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/mapa"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 w-full text-center text-xs font-bold justify-center"
              >
                <MapPin size={14} />
                <span>Abrir Mapa Orbital 360°</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
