"use client";

import { Pencil, Trash2, Plus } from "lucide-react";
import type { ClientCreditRow, CreditRow } from "@/lib/data/credits";
import { statusStyle, statutCreditLabel, formatMRU } from "@/lib/donnes/credits";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientCreditRow | null;
  onEditCredit: (c: CreditRow) => void;
  onDeleteCredit: (c: CreditRow) => void;
  onNouveauCredit: () => void;
  // onAnnulerDernierPaiement: (clientId: number) => void;
};

export default function CreditDetailDialog({
  open, onOpenChange, client, onEditCredit, onDeleteCredit, onNouveauCredit
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crédits du client</DialogTitle>
        </DialogHeader>

        {client && (
          <div className="space-y-5">
            {/* En-tête client */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-vert-foncee text-white text-lg font-bold flex items-center justify-center shrink-0">
                {client.clientInitials}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{client.clientName}</p>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(statutCreditLabel[client.statutGlobal])}`}>
                  {statutCreditLabel[client.statutGlobal]}
                </span>
              </div>
            </div>

            {/* Totaux */}
            <div className="grid grid-cols-3 gap-3">
              <div className="border rounded-2xl p-3 text-center">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{formatMRU(client.montantTotal)}</p>
              </div>
              <div className="border rounded-2xl p-3 text-center">
                <p className="text-xs text-muted-foreground">Payé</p>
                <p className="text-sm font-bold text-green-600 mt-1">{formatMRU(client.montantPaye)}</p>
              </div>
              <div className="border rounded-2xl p-3 text-center">
                <p className="text-xs text-muted-foreground">Reste</p>
                <p className="text-sm font-bold text-orange-600 mt-1">{formatMRU(client.montantRestant)}</p>
              </div>
            </div>

            {/* Liste des crédits (lecture + corrections) */}
            <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Détail des crédits
              </p>
              {client.credits.map((credit) => (
                <div key={credit.id} className="border rounded-2xl p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{formatMRU(credit.montantTotal)}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {credit.description || "Sans description"} · {credit.date}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${statusStyle(statutCreditLabel[credit.statut])}`}>
                      {statutCreditLabel[credit.statut]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Payé : <span className="text-green-600 font-medium">{formatMRU(credit.montantPaye)}</span></span>
                    <span>Reste : <span className="text-orange-600 font-medium">{formatMRU(credit.montantRestant)}</span></span>
                  </div>

                  {/* Corrections par crédit */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <Button size="sm" variant="outline" onClick={() => onEditCredit(credit)} className="h-8 flex-1 text-xs">
                      <Pencil size={13} className="mr-1" /> Modifier
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onDeleteCredit(credit)}
                      className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={onNouveauCredit} className="w-full bg-vert-foncee text-white hover:opacity-90">
              <Plus size={15} className="mr-1.5" /> Nouveau crédit pour {client.clientName.split(" ")[0]}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}