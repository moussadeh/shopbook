"use client";

import { useActionState, useEffect, useState } from "react";
import type { CreditRow, EmprunteurOption } from "@/lib/data/credits";
import { saveCredit, type ActionState } from "./actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initial: ActionState = {};

function CreditForm({
  credit,
  emprunteurs,
  emprunteurPreselection,
  onSuccess,
  onCancel,
}: {
  credit: CreditRow | null;
  emprunteurs: EmprunteurOption[];
  emprunteurPreselection?: number | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, isPending] = useActionState(saveCredit, initial);
  const [emprunteurId, setEmprunteurId] = useState<string>(
    credit ? String(credit.emprunteurId) : emprunteurPreselection ? String(emprunteurPreselection) : ""
  );

  useEffect(() => { if (state.success) onSuccess(); }, [state.success, onSuccess]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{credit ? "Modifier le crédit" : "Nouveau crédit"}</DialogTitle>
        <DialogDescription>
          {credit ? `Modification du crédit de ${credit.emprunteurNom}` : "Remplissez les informations du crédit."}
        </DialogDescription>
      </DialogHeader>

      <form action={formAction} className="space-y-4">
        {credit && <input type="hidden" name="id" value={credit.id} />}
        <input type="hidden" name="emprunteurId" value={emprunteurId} />

        <div className="space-y-1.5">
          <Label>Client</Label>
          <Select value={emprunteurId} onValueChange={setEmprunteurId}>
            <SelectTrigger className="h-11"><SelectValue placeholder="Choisir un client" /></SelectTrigger>
            <SelectContent>
              {emprunteurs.map((e) => (
                <SelectItem key={e.id} value={String(e.id)}>{e.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" placeholder="Ex: Achat riz et sucre"
            defaultValue={credit?.description ?? ""} className="h-11" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="montantTotal">Montant total (MRU)</Label>
          <Input id="montantTotal" name="montantTotal" type="number" step="any" placeholder="0"
            defaultValue={credit?.montantTotal ?? ""} className="h-11" />
        </div>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isPending}>Annuler</Button>
          <Button type="submit" className="flex-1 bg-vert-foncee text-white hover:opacity-90" disabled={isPending}>
            {isPending ? "..." : credit ? "Enregistrer" : "Créer le crédit"}
          </Button>
        </div>
      </form>
    </>
  );
}

export default function CreditFormDialog({
  open, onOpenChange, credit, emprunteurs, emprunteurPreselection,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credit: CreditRow | null;
  emprunteurs: EmprunteurOption[];
  emprunteurPreselection?: number | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <CreditForm
          key={`${credit?.id ?? "new"}-${emprunteurPreselection ?? ""}-${open}`}
          credit={credit}
          emprunteurs={emprunteurs}
          emprunteurPreselection={emprunteurPreselection}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}