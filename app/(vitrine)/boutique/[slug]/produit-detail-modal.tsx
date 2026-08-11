"use client";

import { useState } from "react";
import { Plus, Minus, Package } from "lucide-react";
import type { VitrineProduit } from "@/lib/data/boutique-publique";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Props = {
  produit: VitrineProduit | null;
  qte: number;
  onFermer: () => void;
  onAdd: () => void;
  onChange: (id: number, delta: number) => void;
  lectureSeule?: boolean;
};

export default function ProduitDetailModal({ produit, qte, onFermer, onAdd, onChange, lectureSeule }: Props) {
  const [active, setActive] = useState(0);

  const images = produit?.images ?? [];
  const imagePrincipale = images[active] ?? null;
  const indispo = produit ? !produit.disponible : false;

  return (
    <Dialog open={!!produit} onOpenChange={(o) => { if (!o) { setActive(0); onFermer(); } }}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {produit && (
          <>
            <DialogHeader>
              <DialogTitle>{produit.nom}</DialogTitle>
              <DialogDescription className="sr-only">Détails du produit</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Image principale — taille contenue */}
              <div className="relative w-40 h-40 mx-auto rounded-2xl bg-green-50 overflow-hidden">
                {imagePrincipale ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePrincipale} alt={produit.nom} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-vert-foncee">
                    <Package size={40} />
                  </div>
                )}
                {indispo && (
                  <span className="absolute top-2 left-2 text-[10px] font-semibold bg-gray-900/80 text-white px-2 py-0.5 rounded-full">
                    Épuisé
                  </span>
                )}
              </div>

              {/* Miniatures */}
              {images.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {images.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                        i === active ? "border-vert-foncee" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Prix */}
              <p className="text-xl font-bold text-vert-foncee text-center">{produit.prix} MRU</p>

              {/* Description complète */}
              {produit.description && (
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{produit.description}</p>
              )}

              {/* Action panier */}
              {!lectureSeule && (
                <div className="pt-1">
                  {indispo ? (
                    <div className="w-full h-11 rounded-xl bg-gray-100 text-muted-foreground text-sm font-medium flex items-center justify-center">
                      Produit indisponible
                    </div>
                  ) : qte === 0 ? (
                    <button
                      onClick={onAdd}
                      className="w-full h-11 rounded-xl bg-vert-foncee text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
                    >
                      <Plus size={17} /> Ajouter au panier
                    </button>
                  ) : (
                    <div className="flex items-center justify-between gap-4 bg-green-50/60 rounded-xl p-2">
                      <span className="text-sm font-medium text-gray-700 pl-2">Dans votre panier</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => onChange(produit.id, -1)} className="w-9 h-9 rounded-lg border bg-white flex items-center justify-center" aria-label="Retirer un">
                          <Minus size={15} />
                        </button>
                        <span className="text-base font-bold w-6 text-center">{qte}</span>
                        <button onClick={() => onChange(produit.id, 1)} className="w-9 h-9 rounded-lg bg-vert-foncee text-white flex items-center justify-center" aria-label="Ajouter un">
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}