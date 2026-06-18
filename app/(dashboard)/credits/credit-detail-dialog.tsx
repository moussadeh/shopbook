"use client";

import { Pencil, TrendingDown } from "lucide-react";
import type { CreditRow } from "@/lib/data/credits";
import { statusStyle, statutCreditLabel, formatMRU } from "@/lib/donnes/credits";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credit: CreditRow | null;
  onEdit: (c: CreditRow) => void;
  onPaiement: (c: CreditRow) => void;
};

export default function CreditDetailDialog({ open, onOpenChange, credit, onEdit, onPaiement }: Props) {
  const pct = credit && credit.montantTotal > 0
    ? Math.round((credit.montantPaye / credit.montantTotal) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du crédit</DialogTitle>
        </DialogHeader>

        {credit && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-vert-foncee text-white text-lg font-bold flex items-center justify-center shrink-0">
                {credit.clientInitials}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{credit.clientName}</p>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(statutCreditLabel[credit.statut])}`}>
                  {statutCreditLabel[credit.statut]}
                </span>
              </div>
            </div>

            <div className="space-y-3 border rounded-2xl p-4 bg-gray-50/60">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm font-semibold">{credit.description || "—"}</p>
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-semibold">{credit.date}</p>
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <p className="text-xs text-muted-foreground">Produits</p>
                <p className="text-sm font-semibold">{credit.produits} produit{credit.produits > 1 ? "s" : ""}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="border rounded-2xl p-3 text-center">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{formatMRU(credit.montantTotal)}</p>
              </div>
              <div className="border rounded-2xl p-3 text-center">
                <p className="text-xs text-muted-foreground">Payé</p>
                <p className="text-sm font-bold text-green-600 mt-1">{formatMRU(credit.montantPaye)}</p>
              </div>
              <div className="border rounded-2xl p-3 text-center">
                <p className="text-xs text-muted-foreground">Restant</p>
                <p className="text-sm font-bold text-orange-600 mt-1">{formatMRU(credit.montantRestant)}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progression du paiement</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-vert-foncee rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              {credit.statut !== "PAYE" && (
                <Button
                  variant="outline"
                  className="flex-1 text-vert-foncee border-vert-foncee hover:bg-green-50"
                  onClick={() => onPaiement(credit)}
                >
                  <TrendingDown size={14} className="mr-2" /> Paiement
                </Button>
              )}
              <Button className="flex-1 bg-vert-foncee text-white hover:opacity-90" onClick={() => onEdit(credit)}>
                <Pencil size={14} className="mr-2" /> Modifier
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}