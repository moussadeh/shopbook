"use client";

import { useActionState, useEffect } from "react";
import type { EmprunteurCreditRow } from "@/lib/data/credits";
import { payerClient, type PaiementClientState } from "./actions";
import { formatMRU } from "@/lib/donnes/credits";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const initial: PaiementClientState = {};

function PaiementForm({
  emprunteur, onSuccess, onCancel,
}: {
  emprunteur: EmprunteurCreditRow;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, isPending] = useActionState(payerClient, initial);

  useEffect(() => { if (state.success) onSuccess(); }, [state.success, onSuccess]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Enregistrer un paiement</DialogTitle>
        <DialogDescription>
          {emprunteur.emprunteurNom} — reste à payer : {formatMRU(emprunteur.montantRestant)}
        </DialogDescription>
      </DialogHeader>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="emprunteurId" value={emprunteur.emprunteurId} />

        <div className="space-y-1.5">
          <Label htmlFor="montant">Montant reçu (MRU)</Label>
          <Input id="montant" name="montant" type="number" step="any"
            max={emprunteur.montantRestant} placeholder="0" className="h-11" autoFocus />
          <p className="text-xs text-muted-foreground">
            Le montant sera imputé en commençant par le crédit le plus ancien.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="observation">Observation (optionnel)</Label>
          <Input id="observation" name="observation" placeholder="Ex: payé en espèces" className="h-11" />
        </div>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isPending}>
            Annuler
          </Button>
          <Button type="submit" className="flex-1 bg-vert-foncee text-white hover:opacity-90" disabled={isPending}>
            {isPending ? "..." : "Valider le paiement"}
          </Button>
        </div>
      </form>
    </>
  );
}

export default function PaiementDialog({
  open, onOpenChange, emprunteur,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emprunteur: EmprunteurCreditRow | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        {emprunteur && (
          <PaiementForm
            key={`${emprunteur.emprunteurId}-${open}`}
            emprunteur={emprunteur}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}