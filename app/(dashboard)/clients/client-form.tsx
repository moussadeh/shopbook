"use client";

import { useActionState, useEffect } from "react";
import type { ClientRow } from "@/lib/data/clients";
import { saveClient, type ActionState } from "./actions";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Props = {
  client: ClientRow | null;
  onSuccess: () => void;
  onCancel: () => void;
};

const initial: ActionState = {};

export default function ClientForm({ client, onSuccess, onCancel }: Props) {
  const [state, formAction, isPending] = useActionState(saveClient, initial);

  // Ferme le dialog quand l'action réussit
  useEffect(() => {
    if (state.success) onSuccess();
  }, [state.success, onSuccess]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{client ? "Modifier le client" : "Nouveau client"}</DialogTitle>
        <DialogDescription>
          {client ? `Modification de ${client.name}` : "Remplissez les informations du client."}
        </DialogDescription>
      </DialogHeader>

      <form action={formAction} className="space-y-4">
        {/* id caché => saveClient comprend que c'est une modification */}
        {client && <input type="hidden" name="id" value={client.id} />}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="prenom">Prénom</Label>
            <Input id="prenom" name="prenom" placeholder="Ex: Mohamed" defaultValue={client?.prenom ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" name="nom" placeholder="Ex: Ahmed" defaultValue={client?.nom ?? ""} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="telephone">Téléphone</Label>
          <Input id="telephone" name="telephone" placeholder="+222 00 00 00 00" defaultValue={client?.telephone ?? ""} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email (optionnel)</Label>
          <Input id="email" name="email" type="email" placeholder="exemple@email.com" defaultValue={client?.email ?? ""} />
        </div>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isPending}>
            Annuler
          </Button>
          <Button type="submit" className="flex-1 bg-vert-foncee text-white hover:opacity-90" disabled={isPending}>
            {isPending ? "..." : client ? "Enregistrer" : "Créer le client"}
          </Button>
        </div>
      </form>
    </>
  );
}