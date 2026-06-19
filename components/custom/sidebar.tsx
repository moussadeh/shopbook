"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  Gift,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clients",         href: "/clients",    icon: Users },
  // { label: "Produits",        href: "/produits",   icon: Package },
  { label: "Crédits",         href: "/credits",    icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Bloquer le scroll du body quand le drawer est ouvert
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* ── TOPBAR MOBILE ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-b px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logos/logo/ShopBook.png" alt="Logo" width={28} height={28} className="object-contain rounded" />
          <span>
            <span className="font-bold tracking-tight text-lg text-vert-foncee">Shop</span>
            <span className="font-bold tracking-tight text-lg text-orange">Book</span>
          </span>
        </Link>
        <button
          onClick={toggle}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-vert-foncee"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* ── OVERLAY ── */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />

      {/* ── DRAWER MOBILE ── */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white border-r shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header du drawer */}
        <div className="flex items-center justify-between px-4 h-14 border-b">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logos/logo/ShopBook.png" alt="Logo" width={28} height={28} className="object-contain rounded" />
            <span>
              <span className="font-bold tracking-tight text-lg text-vert-foncee">Shop</span>
              <span className="font-bold tracking-tight text-lg text-orange">Book</span>
            </span>
          </Link>
          <button
            onClick={close}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav + banner */}
        <div className="flex flex-col justify-between h-[calc(100%-3.5rem)] overflow-y-auto px-4 py-6">
          <nav className="flex flex-col gap-1">
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  pathname === href
                    ? "bg-vert-claire text-vert-foncee border"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="rounded-2xl p-4 text-center space-y-2 bg-secondary border">
            <div className="flex justify-center text-vert-foncee"><Gift size={28} /></div>
            <p className="text-sm font-bold leading-tight text-vert-foncee">Profitez de toutes les fonctionnalités</p>
            <p className="text-xs text-muted-foreground">Passez au plan supérieur et développez votre activité.</p>
            <Link href="/#pricing" onClick={close}>
              <button className="cursor-pointer mt-1 w-full rounded-xl py-2 text-sm font-semibold text-white transition hover:opacity-90 bg-vert-foncee">
                Découvrir les plans
              </button>
            </Link>
          </div>
        </div>
      </aside>

      {/* ── SIDEBAR DESKTOP ── */}
      <aside className="hidden lg:flex flex-col justify-between w-64 h-screen sticky top-0 border-r bg-white px-4 py-6 shrink-0 overflow-y-auto">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2 px-2">
            <Image src="/logos/logo/ShopBook.png" alt="Logo" width={32} height={32} className="object-contain rounded" />
            <span>
              <span className="font-bold tracking-tight text-xl text-vert-foncee">Shop</span>
              <span className="font-bold tracking-tight text-xl text-orange">Book</span>
            </span>
          </Link>

          <nav className="flex flex-col gap-1">
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  pathname === href
                    ? "bg-vert-claire text-vert-foncee border"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="rounded-2xl p-4 text-center space-y-2 bg-secondary border">
          <div className="flex justify-center text-vert-foncee"><Gift size={28} /></div>
          <p className="text-sm font-bold leading-tight text-vert-foncee">Profitez de toutes les fonctionnalités</p>
          <p className="text-xs text-muted-foreground">Passez au plan supérieur et développez votre activité.</p>
          <Link href="/#pricing">
            <button className="cursor-pointer mt-1 w-full rounded-xl py-2 text-sm font-semibold text-white transition hover:opacity-90 bg-vert-foncee">
              Découvrir les plans
            </button>
          </Link>
        </div>
      </aside>

      {/* ── SPACER MOBILE (compense la topbar fixe) ── */}
      <div className="lg:hidden h-14 shrink-0" />
    </>
  );
}