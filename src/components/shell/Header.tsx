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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
        isSolid
          ? 'border-b border-[#222D25] bg-[#131A16]/90 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        {/* Logo EcoMind 360 */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative h-8 w-8">
            <Image
              src="/brand/icon-ecomind.png"
              alt="EcoMind 360 Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain opacity-95 group-hover:opacity-100 transition-opacity"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-semibold tracking-tight text-[#DCE5DD]">
              EcoMind
            </span>
            <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded-[5px] bg-[#1D2821] text-[#91A88F] border border-[#29362D]">
              360°
            </span>
          </div>
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-[7px] text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[#1D2821] text-[#91A88F] border border-[#29362D]'
                    : 'text-[#A7B3A9] hover:text-[#DCE5DD] hover:bg-[#171F1A]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="h-4 w-px bg-[#222D25] mx-2" />

          <Link
            href="/mapa"
            className="btn-primary !py-1.5 !px-3.5 text-xs font-medium inline-flex items-center gap-1.5"
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
          className="flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-xs font-medium transition xl:hidden bg-[#171F1A] text-[#DCE5DD] border border-[#29362D] hover:bg-[#1D2821]"
        >
          {open ? <X size={15} /> : <Menu size={15} />}
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
            transition={{ duration: 0.2 }}
            className="border-b border-[#29362D] bg-[#131A16] px-5 py-4 shadow-2xl xl:hidden"
          >
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => {
                const active =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-[7px] px-3 py-2 text-xs font-medium transition ${
                      active
                        ? 'bg-[#1D2821] text-[#91A88F] border border-[#29362D]'
                        : 'text-[#A7B3A9] hover:bg-[#171F1A] hover:text-[#DCE5DD]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-2 mt-2 border-t border-[#222D25]">
                <Link
                  href="/mapa"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full text-center text-xs font-medium justify-center"
                >
                  <MapPin size={14} />
                  <span>Abrir Mapa Orbital 360°</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
