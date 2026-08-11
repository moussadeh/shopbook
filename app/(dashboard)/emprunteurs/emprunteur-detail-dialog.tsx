"use client";

import { Pencil, Phone } from "lucide-react";
import type { EmprunteurRow } from "@/lib/data/emprunteurs";
import { statusStyle } from "@/lib/donnes/emprunteurs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function EmprunteurDetailDialog({
  open, onOpenChange, emprunteur, onEdit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emprunteur: EmprunteurRow | null;
  onEdit: (e: EmprunteurRow) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du client</DialogTitle>
        </DialogHeader>

        {emprunteur && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-vert-foncee text-white text-lg font-bold flex items-center justify-center shrink-0">
                {emprunteur.initials}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{emprunteur.name}</p>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(emprunteur.statut)}`}>
                  {emprunteur.statut}
                </span>
              </div>
            </div>

            <div className="space-y-3 border rounded-2xl p-4 bg-gray-50/60">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Téléphone</p>
                {emprunteur.telephone ? (
                  <a href={`tel:${emprunteur.telephone}`} className="text-sm font-semibold text-vert-foncee flex items-center gap-1">
                    <Phone size={13} /> {emprunteur.telephone}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">Non renseigné</p>
                )}
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <p className="text-xs text-muted-foreground">Dernière activité</p>
                <p className="text-sm font-semibold">{emprunteur.lastActivity}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-2xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Total dû</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{emprunteur.creditTotal}</p>
              </div>
              <div className="border rounded-2xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Crédits</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {emprunteur.creditCount} crédit{emprunteur.creditCount > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Fermer</Button>
              <Button className="flex-1 bg-vert-foncee text-white hover:opacity-90" onClick={() => onEdit(emprunteur)}>
                <Pencil size={14} className="mr-2" /> Modifier
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}