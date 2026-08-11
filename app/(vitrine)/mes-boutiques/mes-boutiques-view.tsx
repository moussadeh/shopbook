"use client";

import Link from "next/link";
import { useState } from "react";
import { Store, MapPin, ShoppingBag, ArrowRight, Package } from "lucide-react";
import type { BoutiqueVisitee } from "@/lib/data/mes-boutiques";
import UtilisateurMenu from "../utilisateur-menu";

const LOT = 8;

export default function MesBoutiquesView({ boutiques, nom }: { boutiques: BoutiqueVisitee[]; nom: string }) {
  const [visibles, setVisibles] = useState(LOT);
  const affichees = boutiques.slice(0, visibles);
  const reste = boutiques.length - affichees.length;

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* En-tête */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">
            <span className="text-vert-foncee">Shop</span><span className="text-orange">Book</span>
          </Link>
          <UtilisateurMenu nom={nom} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Onglets Mes commandes / Mes boutiques */}
        <div className="flex gap-2">
          <Link href="/mes-commandes" className="flex-1 text-center py-2.5 rounded-xl border text-sm font-semibold text-gray-600 hover:bg-white transition">
            Mes commandes
          </Link>
          <span className="flex-1 text-center py-2.5 rounded-xl bg-vert-foncee text-white text-sm font-semibold">
            Mes boutiques
          </span>
        </div>

        {boutiques.length === 0 ? (
          <div className="bg-white rounded-2xl border py-16 text-center">
            <Store size={40} className="mx-auto text-muted-foreground opacity-40 mb-3" />
            <p className="text-sm text-muted-foreground">Vous n&apos;avez pas encore commandé dans une boutique.</p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-3">Boutiques où vous avez commandé</h2>
              <div className="space-y-3">
                {affichees.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/boutique/${b.slug}`}
                    className="block bg-white rounded-2xl border p-4 hover:border-vert-foncee transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
                        <Store size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{b.nom}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          {(b.ville || b.quartier) && (
                            <span className="flex items-center gap-1 truncate">
                              <MapPin size={12} /> {[b.quartier, b.ville].filter(Boolean).join(", ")}
                            </span>
                          )}
                          <span className="flex items-center gap-1 shrink-0">
                            <ShoppingBag size={12} /> {b.nbCommandes} commande{b.nbCommandes > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={18} className="text-muted-foreground group-hover:text-vert-foncee transition shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>

              {reste > 0 && (
                <button
                  onClick={() => setVisibles((v) => v + LOT)}
                  className="mt-4 w-full h-11 rounded-xl bg-white border text-sm font-semibold text-vert-foncee hover:bg-green-50 transition"
                >
                  Voir plus ({reste})
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}