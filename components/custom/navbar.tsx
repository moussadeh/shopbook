/*"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useMediaQuery } from "@/hooks/use-madia-query"; 

export default function Navbar() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = false;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logos/logo/ShopBook.png" alt="Logo" width={40} height={40} className="object-contain rounded" />
            <span>
                <span className="text-vert-foncee text-xl font-bold tracking-tight">Shop</span>
                <span className="text-orange text-xl font-bold tracking-tight">Book</span>
            </span>
          </Link>

          {isDesktop && (
            <nav className="flex items-center gap-6 text-md text-muted-foreground">
              <Link href="#welcome" className="hover:text-orange font-bold transition-colors navlink">
                Accueil
              </Link>
              <Link href="#about" className="hover:text-orange font-bold transition-colors navlink">
                À propos
              </Link>
              <Link href="#pricing" className="hover:text-orange font-bold transition-colors navlink">
                Tarifs
              </Link>
              <Link href="/contact" className="hover:text-orange font-bold transition-colors navlink">
                Contact
              </Link>
            </nav>
          )}
        </div>

        {isDesktop ? (
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button variant="ghost">Connexion</Button>
                </Link>
                <Link href="/register">
                  <Button>Inscription</Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback>AM</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Déconnexion</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        )}
      </div>

      {!isDesktop && isOpen && (
        <div className="border-t bg-white/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
            <nav className="flex flex-col gap-4 text-base">
              <Link href="#home" onClick={() => setIsOpen(false)}>
                Accueil
              </Link>
              <Link href="#about" onClick={() => setIsOpen(false)}>
                À propos
              </Link>
              <Link href="#pricing" onClick={() => setIsOpen(false)}>
                Tarifs
              </Link>
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </nav>

            <div className="flex flex-col gap-3 border-t pt-4">
              {!isAuthenticated ? (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">
                      Inscription
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Profil
                    </Button>
                  </Link>
                  <Button variant="destructive" className="w-full">
                    Déconnexion
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}*/

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
      <div className="mx-auto flex h-16 items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logos/logo/ShopBook.png" alt="Logo" width={40} height={40} className="object-contain rounded" />
            <span>
              <span className="text-vert-foncee text-xl font-bold tracking-tight">Shop</span>
              <span className="text-orange text-xl font-bold tracking-tight">Book</span>
            </span>
          </Link>

          {isDesktop && (
            <nav className="flex items-center gap-6 text-md text-muted-foreground">
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
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login"><Button variant="ghost">Connexion</Button></Link>
          <Link href="/register"><Button>Inscription</Button></Link>
        </div>

        {!isDesktop && (
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        )}
      </div>

      {!isDesktop && isOpen && (
        <div className="border-t bg-white/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
            <nav className="flex flex-col gap-4 text-base">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-bold transition-colors ${
                    activeSection === item.sectionId ? "text-orange" : "text-muted-foreground hover:text-orange"
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