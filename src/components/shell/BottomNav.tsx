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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#222D25] bg-[#131A16]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-center justify-around py-2">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium transition ${
                  active ? 'text-[#91A88F]' : 'text-[#78877D] hover:text-[#DCE5DD]'
                }`}
              >
                <Icon size={17} className={active ? 'text-[#789B7C]' : 'text-[#78877D]'} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
