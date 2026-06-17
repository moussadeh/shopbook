"use client";

import { useActionState, useEffect, useState } from "react";
import type { ProduitRow } from "@/lib/data/produits";
import { saveProduit, type ActionState } from "./actions";
import { uniteLabel, CATEGORIES, categorieLabel } from "@/lib/donnes/produits";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  produit: ProduitRow | null;
  onSuccess: () => void;
  onCancel: () => void;
};

const initial: ActionState = {};

export default function ProduitForm({ produit, onSuccess, onCancel }: Props) {
  const [state, formAction, isPending] = useActionState(saveProduit, initial);

  // Selects contrôlés → relayés via input caché
  const [unite, setUnite]         = useState<string>(produit?.unite ?? "");
  const [categorie, setCategorie] = useState<string>(produit?.categorie ?? "");

  useEffect(() => {
    if (state.success) onSuccess();
  }, [state.success, onSuccess]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{produit ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
        <DialogDescription>
          {produit ? `Modification de ${produit.nom}` : "Remplissez les informations du produit."}
        </DialogDescription>
      </DialogHeader>

      <form action={formAction} className="space-y-4">
        {produit && <input type="hidden" name="id" value={produit.id} />}
        {/* valeurs des Select relayées dans FormData */}
        <input type="hidden" name="unite" value={unite} />
        <input type="hidden" name="categorie" value={categorie} />

        <div className="space-y-1.5">
          <Label htmlFor="nom">Nom du produit</Label>
          <Input id="nom" name="nom" placeholder="Ex: Riz Parfumé 5kg" defaultValue={produit?.nom ?? ""} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="prixUnitaire">Prix unitaire (MRU)</Label>
            <Input id="prixUnitaire" name="prixUnitaire" type="number" step="any" placeholder="0" defaultValue={produit?.prixUnitaire ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" name="stock" type="number" placeholder="0" defaultValue={produit?.stock ?? ""} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Unité</Label>
          <Select value={unite} onValueChange={setUnite}>
            <SelectTrigger><SelectValue placeholder="Choisir une unité" /></SelectTrigger>
            <SelectContent>
              {Object.entries(uniteLabel).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
            <Label>Catégorie</Label>
            <Select value={categorie} onValueChange={setCategorie}>
                <SelectTrigger><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
                <SelectContent>
                    {Object.entries(categorieLabel).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isPending}>
            Annuler
          </Button>
          <Button type="submit" className="flex-1 bg-vert-foncee text-white hover:opacity-90" disabled={isPending}>
            {isPending ? "..." : produit ? "Enregistrer" : "Créer le produit"}
          </Button>
        </div>
      </form>
    </>
  );
}