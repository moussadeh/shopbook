"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, CreditCard } from "lucide-react";

const liens = [
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/abonnements", label: "Abonnements", icon: CreditCard },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 text-sm">
      {liens.map(({ href, label, icon: Icon }) => {
        const actif = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              actif ? "text-orange" : "text-gray-700 hover:bg-muted"
            }`}
          >
            <Icon size={15} />
            <span className="hidden md:block">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
