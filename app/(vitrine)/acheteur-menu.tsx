"use client";

import { useState, useTransition } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { logoutAcheteur } from "@/app/(vitrine)/acheteur-actions";
import { useRouter } from "next/navigation";

export default function AcheteurMenu({ nom }: { nom: string }) {
  const [ouvert, setOuvert] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const initiale = nom.trim()[0]?.toUpperCase() ?? "?";
  const prenom = nom.split(" ")[0];

  const deconnexion = () => {
    startTransition(async () => {
      await logoutAcheteur();
      router.refresh(); // recharge la page en mode non connecté
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOuvert((v) => !v)}
        className="flex items-center gap-2 h-10 pl-1.5 pr-2.5 rounded-xl border hover:bg-muted transition"
      >
        <span className="w-7 h-7 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center">
          {initiale}
        </span>
        <span className="text-sm font-semibold text-gray-800 max-w-[100px] truncate">{prenom}</span>
        <ChevronDown size={14} className="text-muted-foreground" />
      </button>

      {ouvert && (
        <>
          {/* clic à l'extérieur pour fermer */}
          <div className="fixed inset-0 z-40" onClick={() => setOuvert(false)} />
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-semibold text-gray-900 truncate">{nom}</p>
              <p className="text-xs text-muted-foreground">Connecté</p>
            </div>
            <button
              onClick={deconnexion}
              disabled={isPending}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={15} /> {isPending ? "Déconnexion…" : "Se déconnecter"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}