"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-madia-query";
import { useActiveSection } from "@/hooks/use-active-section";

const navItems = [
  { label: "Accueil",  href: "#welcome", sectionId: "welcome" },
  { label: "À propos", href: "#about",   sectionId: "about"   },
  { label: "Tarifs",   href: "#pricing", sectionId: "pricing" },
  { label: "Contact",  href: "#contact", sectionId: "contact" },
];

export default function Navbar() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);
  const activeSection = useActiveSection(navItems.map((i) => i.sectionId));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logos/logo/ShopBook.png" alt="Logo" width={36} height={36} className="object-contain rounded" />
          <span>
            <span className="text-vert-foncee text-lg font-bold tracking-tight">Shop</span>
            <span className="text-orange text-lg font-bold tracking-tight">Book</span>
          </span>
        </Link>

        {/* Nav desktop */}
        {isDesktop && (
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-bold transition-colors navlink ${
                  activeSection === item.sectionId ? "text-orange" : "hover:text-orange"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Boutons desktop / Burger mobile */}
        {isDesktop ? (
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" className="cursor-pointer">Connexion</Button></Link>
            <Link href="/register"><Button className="cursor-pointer">Inscription</Button></Link>
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </Button>
        )}
      </div>

      {/* Menu mobile déroulant */}
      {!isDesktop && isOpen && (
        <div className="border-t bg-white/95 backdrop-blur-md">
          <div className="px-4 py-6 space-y-6">

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 rounded-lg font-bold text-base transition-colors ${
                    activeSection === item.sectionId
                      ? "text-orange bg-orange/5"
                      : "text-muted-foreground hover:text-orange hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 border-t pt-4">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">Connexion</Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Inscription</Button>
              </Link>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}