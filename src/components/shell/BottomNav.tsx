'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Map as MapIcon, Trees, AlertTriangle } from 'lucide-react';

const ITEMS = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/mapa', label: 'Mapa', icon: MapIcon },
  { href: '/biomas', label: 'Biomas', icon: Trees },
  { href: '/alertas', label: 'Alertas', icon: AlertTriangle },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação móvel"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-mist/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden shadow-lg"
    >
      <ul className="mx-auto flex max-w-md items-center justify-around py-2">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1 text-[10px] font-bold transition ${
                  active ? 'text-forest' : 'text-ash hover:text-forest'
                }`}
              >
                <Icon size={18} className={active ? 'text-forest' : 'text-ash'} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
