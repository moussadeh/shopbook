"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const liens = [
  { href: "/messages", label: "Messages" },
  { href: "/abonnements", label: "Abonnements" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 text-sm">
      {liens.map((lien) => {
        const actif = pathname.startsWith(lien.href);
        return (
          <Link
            key={lien.href}
            href={lien.href}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              actif
                ? "text-orange"
                : "text-gray-700 hover:bg-muted"
            }`}
          >
            {lien.label}
          </Link>
        );
      })}
    </nav>
  );
}