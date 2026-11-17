'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, MapPin, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeContext';

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/mapa', label: 'Mapa ao Vivo' },
  { href: '/biomas', label: 'Biomas' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/calculadora', label: 'Calculadora' },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border)] bg-[var(--background-secondary)]/95 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
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
            <span className="font-display text-base font-semibold tracking-tight text-[var(--foreground)]">
              EcoMind
            </span>
            <span className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded-[5px] bg-[var(--surface-elevated)] text-[var(--sage)] border border-[var(--border)]">
              360°
            </span>
          </div>
        </Link>

        {/* Navegação Desktop Enxuta */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
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
                    ? 'bg-[var(--surface-elevated)] text-[var(--sage)] border border-[var(--border)]'
                    : 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="h-4 w-px bg-[var(--border)] mx-2" />

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            className="flex h-9 w-9 items-center justify-center rounded-[7px] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <Link
            href="/mapa"
            className="btn-primary !py-1.5 !px-3.5 text-xs font-medium inline-flex items-center gap-1.5 ml-1"
          >
            <MapPin size={13} />
            <span>Abrir Mapa</span>
          </Link>
        </nav>

        {/* Ações Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            className="flex h-10 w-10 items-center justify-center rounded-[7px] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-elevated)] transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen(!open)}
            className="flex h-10 items-center gap-1.5 rounded-[7px] px-3 text-xs font-medium transition bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface-elevated)]"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
            <span>{open ? 'Fechar' : 'Menu'}</span>
          </button>
        </div>
      </div>

      {/* Menu Dropdown Mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-[var(--border)] bg-[var(--background-secondary)] px-5 py-4 shadow-2xl lg:hidden"
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
                    className={`rounded-[7px] px-3 py-2.5 text-xs font-medium transition ${
                      active
                        ? 'bg-[var(--surface-elevated)] text-[var(--sage)] border border-[var(--border)]'
                        : 'text-[var(--foreground-secondary)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-2 mt-2 border-t border-[var(--border)]">
                <Link
                  href="/mapa"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full text-center text-xs font-medium justify-center min-h-[42px]"
                >
                  <MapPin size={14} />
                  <span>Abrir Mapa ao Vivo</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
