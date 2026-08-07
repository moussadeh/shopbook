"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { X, ImagePlus, Trash2 } from "lucide-react";
import type { ProduitRow } from "@/lib/data/produits";
import { saveProduit, type ActionState, supprimerImageProduit } from "./actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import imageCompression from "browser-image-compression";

const initial: ActionState = {};
const MAX_IMAGES = 3;

function ProduitForm({ produit, onSuccess, onCancel }: {
  produit: ProduitRow | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, isPending] = useActionState(saveProduit, initial);
  const [disponible, setDisponible] = useState(produit?.disponible ?? true);

  // Images deja en base — état local pour pouvoir en retirer à l'écran
  const [imagesExistantes, setImagesExistantes] = useState(produit?.images ?? []);
  const [suppression, startSuppression] = useTransition();

  // Images à ajouter (création) : aperçus locaux
  const [fichiers, setFichiers] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const total = imagesExistantes.length + fichiers.length;
  const placesRestantes = MAX_IMAGES - total;

  const [traitement, setTraitement] = useState(false);
  const [erreurImage, setErreurImage] = useState<string | null>(null);

  useEffect(() => { if (state.success) onSuccess(); }, [state.success, onSuccess]);

  const TYPES_OK = ["image/jpeg", "image/png", "image/.jpg"];
  const MAX_KO_APRES = 800; // cible après compression : ~800 Ko max
  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const choisis = Array.from(e.target.files ?? []);
    e.target.value = ""; // on vide tde suite pour pouvoir re-choisir le même fichier

    setErreurImage(null);
    const erreurs: string[] = [];
    const aTraiter: File[] = [];

    // 1. Validation du type AVANT tout
    for (const f of choisis) {
      if (!TYPES_OK.includes(f.type)) {
        erreurs.push(`${f.name} : seuls JPG, PNG et WEBP sont acceptés.`);
        continue;
      }
      aTraiter.push(f);
    }

    // on ne garde que ce qui rentre dans les places restantes
    const dansLaLimite = aTraiter.slice(0, placesRestantes);

    // 2. Compression
    setTraitement(true);
    const compresses: File[] = [];
    for (const f of dansLaLimite) {
      try {
        const compresse = await imageCompression(f, {
          maxSizeMB: MAX_KO_APRES / 1024,   // ~0,78 Mo
          maxWidthOrHeight: 1200,           // on réduit les très grandes images
          useWebWorker: true,
        });
        // On garantit un vrai File (la compression peut renvoyer un Blob)
        const fichierFinal = new File([compresse], f.name, {
          type: compresse.type || f.type,
          lastModified: Date.now(),
        });
        compresses.push(fichierFinal);
      } catch {
        erreurs.push(`${f.name} : impossible de traiter cette image.`);
      }
    }
    setTraitement(false);

    // 3. On ajoute les images valides et compressées
    if (compresses.length) setFichiers((prev) => [...prev, ...compresses]);
    if (erreurs.length) setErreurImage(erreurs.join(" "));
  };

  const retirerExistante = (imageId: number) => {
    if (!confirm("Supprimer cette photo ?")) return;
    startSuppression(async () => {
      await supprimerImageProduit(imageId);
      setImagesExistantes((imgs) => imgs.filter((i) => i.id !== imageId));
    });
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
          <Label>Photos ({total}/{MAX_IMAGES})</Label>
          <div className="grid grid-cols-3 gap-2">
            {imagesExistantes.map((img) => (
              <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => retirerExistante(img.id)} disabled={suppression}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center" aria-label="Supprimer la photo">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {/* Nouveaux fichiers (aperçus locaux) */}
            {fichiers.map((f, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setFichiers((arr) => arr.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center" aria-label="Supprimer la photo">
                  <X size={13} />
                </button>
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
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/jpg" multiple className="hidden" onChange={onPick} />
          {state.error && <p className="text-sm text-red-600">{state.error}</p>}
          {traitement && (
            <p className="text-xs text-muted-foreground">Traitement des images en cours…</p>
          )}
          {erreurImage && (
            <p className="text-sm text-red-600">{erreurImage}</p>
          )}
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
