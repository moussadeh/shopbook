"use client";

import { Pencil } from "lucide-react";
import type { ClientRow } from "@/lib/data/clients";
import { statusStyle } from "@/lib/donnes/dashboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientRow | null;
  onEdit: (c: ClientRow) => void;
};

export default function ClientDetailDialog({ open, onOpenChange, client, onEdit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du client</DialogTitle>
        </DialogHeader>

        {client && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-vert-foncee text-white text-lg font-bold flex items-center justify-center shrink-0">
                {client.initials}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{client.name}</p>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(client.statut)}`}>
                  {client.statut}
                </span>
              </div>
            </div>

            <div className="space-y-3 border rounded-2xl p-4 bg-gray-50/60">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Téléphone</p>
                <p className="text-sm font-semibold">{client.telephone}</p>
              </div>
              {client.email && (
                <div className="flex items-center justify-between border-t pt-3">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-semibold">{client.email}</p>
                </div>
              )}
              <div className="flex items-center justify-between border-t pt-3">
                <p className="text-xs text-muted-foreground">Dernière activité</p>
                <p className="text-sm font-semibold">{client.lastActivity}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-2xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Total dû</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{client.creditTotal}</p>
              </div>
              <div className="border rounded-2xl p-4 text-center">
                <p className="text-xs text-muted-foreground">Crédits</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {client.creditCount} crédit{client.creditCount > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Fermer
              </Button>
              <Button
                className="flex-1 bg-vert-foncee text-white hover:opacity-90"
                onClick={() => onEdit(client)}
              >
                <Pencil size={14} className="mr-2" /> Modifier
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}