"use client";

import { Package, Pencil } from "lucide-react";
import type { ProduitRow } from "@/lib/data/produits";
import { uniteLabel, STOCK_BAS_SEUIL, categorieLabel } from "@/lib/donnes/produits";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produit: ProduitRow | null;
  maxVendu: number;
  onEdit: (p: ProduitRow) => void;
};

export default function ProduitDetailDialog({ open, onOpenChange, produit, maxVendu, onEdit }: Props) {
  const pct = produit ? Math.round((produit.vendu / maxVendu) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du produit</DialogTitle>
        </DialogHeader>

        {produit && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
                <Package size={28} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{produit.nom}</p>
                <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">{categorieLabel[produit.categorie]}</span>
              </div>
            </div>

            <div className="space-y-3 border rounded-2xl p-4 bg-gray-50/60">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Prix unitaire</p>
                <p className="text-sm font-bold text-gray-900">{produit.prixUnitaire} MRU</p>
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <p className="text-xs text-muted-foreground">Unité</p>
                <p className="text-sm font-semibold">{uniteLabel[produit.unite]}</p>
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <p className="text-xs text-muted-foreground">Stock actuel</p>
                <p className={`text-sm font-bold ${produit.stock < STOCK_BAS_SEUIL ? "text-red-600" : "text-gray-900"}`}>
                  {produit.stock}
                  {produit.stock < STOCK_BAS_SEUIL && <span className="ml-1 text-xs font-normal text-red-400">(bas)</span>}
                </p>
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <p className="text-xs text-muted-foreground">Total vendu</p>
                <p className="text-sm font-bold text-vert-foncee">{produit.vendu}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Popularité</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-vert-foncee rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Fermer</Button>
              <Button className="flex-1 bg-vert-foncee text-white hover:opacity-90" onClick={() => onEdit(produit)}>
                <Pencil size={14} className="mr-2" /> Modifier
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}