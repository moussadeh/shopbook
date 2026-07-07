"use client";

import { Truck, ShoppingBag, ChevronRight } from "lucide-react";
import type { CommandeRow } from "@/lib/data/commandes";
import { statutLabel, statutStyle, paiementLabel, formatMRU } from "@/lib/donnes/commandes";

export default function CommandesCards({ commandes, onDetail }: { commandes: CommandeRow[]; onDetail: (c: CommandeRow) => void }) {
  return (
    <>
      {commandes.map((c) => (
        <button key={c.id} onClick={() => onDetail(c)} className="w-full text-left bg-white rounded-2xl border p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">
                {c.initials}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{c.acheteurNom}</p>
                <p className="text-xs text-muted-foreground">#{c.id} · {c.nbArticles} article{c.nbArticles > 1 ? "s" : ""}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${statutStyle[c.statut]}`}>
              {statutLabel[c.statut]}
            </span>
          </div>

          <div className="flex items-center justify-between border-t pt-2 text-sm">
            <span className="inline-flex items-center gap-1 text-xs text-gray-600">
              {c.mode === "LIVRAISON" ? <Truck size={13} /> : <ShoppingBag size={13} />}
              {c.mode === "LIVRAISON" ? "Livraison" : "Retrait"}
            </span>
            <span className="font-bold text-gray-900">{formatMRU(c.total)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${c.statutPaiement === "PAYEE" ? "text-green-600" : "text-amber-600"}`}>
              {paiementLabel(c.statutPaiement)}
            </span>
            <span className="text-xs font-semibold text-vert-foncee flex items-center">
              Détails <ChevronRight size={14} />
            </span>
          </div>
        </button>
      ))}
    </>
  );
}