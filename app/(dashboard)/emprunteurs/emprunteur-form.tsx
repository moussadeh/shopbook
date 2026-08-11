"use client";

import { useActionState, useEffect } from "react";
import type { EmprunteurRow } from "@/lib/data/emprunteurs";
import { saveEmprunteur, type ActionState } from "./actions";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const initial: ActionState = {};

export default function EmprunteurForm({
  emprunteur, onSuccess, onCancel,
}: {
  emprunteur: EmprunteurRow | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, isPending] = useActionState(saveEmprunteur, initial);

  useEffect(() => { if (state.success) onSuccess(); }, [state.success, onSuccess]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{emprunteur ? "Modifier le client" : "Nouveau client"}</DialogTitle>
        <DialogDescription>
          {emprunteur ? `Modification de ${emprunteur.name}` : "Ajoutez un client à votre carnet."}
        </DialogDescription>
      </DialogHeader>

      <form action={formAction} className="space-y-4">
        {emprunteur && <input type="hidden" name="id" value={emprunteur.id} />}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="prenom">Prénom</Label>
            <Input id="prenom" name="prenom" placeholder="Ex: Mohamed" defaultValue={emprunteur?.prenom ?? ""} className="h-11" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" name="nom" placeholder="Ex: Ahmed" defaultValue={emprunteur?.nom ?? ""} className="h-11" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="telephone">Téléphone (optionnel)</Label>
          <Input id="telephone" name="telephone" type="tel" placeholder="+222 00 00 00 00" defaultValue={emprunteur?.telephone ?? ""} className="h-11" />
        </div>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isPending}>
            Annuler
          </Button>
          <Button type="submit" className="flex-1 bg-vert-foncee text-white hover:opacity-90" disabled={isPending}>
            {isPending ? "..." : emprunteur ? "Enregistrer" : "Créer le client"}
          </Button>
        </div>
      </form>
    </>
  );
}