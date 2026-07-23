"use client";

import { Package, Pencil } from "lucide-react";
import type { ProduitRow } from "@/lib/data/produits";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produit: ProduitRow | null;
  onEdit: (p: ProduitRow) => void;
};

export default function ProduitDetailDialog({ open, onOpenChange, produit, onEdit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails du produit</DialogTitle>
        </DialogHeader>

        {produit && (
          <div className="space-y-5">
            {/* Galerie */}
            {produit.images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {produit.images.map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={produit.nom} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 rounded-2xl bg-green-50 text-vert-foncee flex items-center justify-center">
                <Package size={40} />
              </div>
            )}

            <div>
              <p className="text-lg font-bold text-gray-900">{produit.nom}</p>
              {produit.description && (
                <p className="text-sm text-muted-foreground mt-1">{produit.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-2xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Prix</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{produit.prix} MRU</p>
              </div>
              <div className="border rounded-2xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Statut</p>
                <p className={`text-sm font-bold mt-2 ${produit.disponible ? "text-green-600" : "text-gray-500"}`}>
                  {produit.disponible ? "Disponible" : "Indisponible"}
                </p>
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