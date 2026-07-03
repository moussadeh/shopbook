"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { X, ImagePlus } from "lucide-react";
import type { ProduitRow } from "@/lib/data/produits";
import { saveProduit, type ActionState } from "./actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const initial: ActionState = {};
const MAX_IMAGES = 3;

function ProduitForm({ produit, onSuccess, onCancel }: {
  produit: ProduitRow | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, isPending] = useActionState(saveProduit, initial);
  const [disponible, setDisponible] = useState(produit?.disponible ?? true);

  // Images à ajouter (création) : aperçus locaux
  const [fichiers, setFichiers] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const dejaLa = produit?.images.length ?? 0;
  const placesRestantes = MAX_IMAGES - dejaLa - fichiers.length;

  useEffect(() => { if (state.success) onSuccess(); }, [state.success, onSuccess]);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nouveaux = Array.from(e.target.files ?? []).slice(0, placesRestantes);
    setFichiers((f) => [...f, ...nouveaux]);
    e.target.value = "";
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{produit ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
        <DialogDescription>
          {produit ? `Modification de ${produit.nom}` : "Ajoutez un produit à votre catalogue."}
        </DialogDescription>
      </DialogHeader>

      <form action={formAction} className="space-y-4">
        {produit && <input type="hidden" name="id" value={produit.id} />}
        <input type="hidden" name="disponible" value={disponible ? "true" : "false"} />

        <div className="space-y-1.5">
          <Label htmlFor="nom">Nom du produit</Label>
          <Input id="nom" name="nom" placeholder="Ex: Riz parfumé 5kg" defaultValue={produit?.nom ?? ""} className="h-11" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="prix">Prix (MRU)</Label>
          <Input id="prix" name="prix" type="number" step="any" placeholder="0" defaultValue={produit?.prix ?? ""} className="h-11" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description (optionnel)</Label>
          <Textarea id="description" name="description" placeholder="Ex: sac de 5kg, marque locale…"
            defaultValue={produit?.description ?? ""} className="resize-none min-h-16" />
        </div>

        {/* Disponibilité */}
        <div className="flex items-center justify-between border rounded-2xl p-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">Disponible</p>
            <p className="text-xs text-muted-foreground">Le produit est en vente</p>
          </div>
          <button type="button" onClick={() => setDisponible((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition shrink-0 ${disponible ? "bg-vert-foncee" : "bg-gray-300"}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition ${disponible ? "translate-x-5" : ""}`} />
          </button>
        </div>

        {/* Images (surtout à la création) */}
        <div className="space-y-2">
          <Label>Photos ({dejaLa + fichiers.length}/{MAX_IMAGES})</Label>
          <div className="grid grid-cols-3 gap-2">
            {fichiers.map((f, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setFichiers((arr) => arr.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">
                  <X size={13} />
                </button>
                {/* le File est relayé au form via un input caché */}
                <input type="file" name="images" hidden ref={(el) => { if (el) attachFile(el, f); }} />
              </div>
            ))}
            {placesRestantes > 0 && (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-muted-foreground hover:border-vert-foncee hover:text-vert-foncee transition">
                <ImagePlus size={18} /><span className="text-[10px] mt-0.5">Ajouter</span>
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onPick} />
          {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isPending}>Annuler</Button>
          <Button type="submit" className="flex-1 bg-vert-foncee text-white hover:opacity-90" disabled={isPending}>
            {isPending ? "..." : produit ? "Enregistrer" : "Créer le produit"}
          </Button>
        </div>
      </form>
    </>
  );
}

// Relaie un File choisi vers un <input type=file caché> pour qu'il parte dans FormData
function attachFile(input: HTMLInputElement, file: File) {
  const dt = new DataTransfer();
  dt.items.add(file);
  input.files = dt.files;
}

export default function ProduitFormDialog({ open, onOpenChange, produit }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produit: ProduitRow | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <ProduitForm
          key={`${produit?.id ?? "new"}-${open}`}
          produit={produit}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}



// "use client";

// import type { ProduitRow } from "@/lib/data/produits";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import ProduitForm from "./produit-form";

// type Props = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   produit: ProduitRow | null;
// };

// export default function ProduitFormDialog({ open, onOpenChange, produit }: Props) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <ProduitForm
//           key={`${produit?.id ?? "new"}-${open}`}
//           produit={produit}
//           onSuccess={() => onOpenChange(false)}
//           onCancel={() => onOpenChange(false)}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }