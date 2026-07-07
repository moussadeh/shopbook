import { Package, Plus, Minus } from "lucide-react";
import type { VitrineProduit } from "@/lib/data/boutique-publique";

type Props = {
  produit: VitrineProduit;
  qte: number;
  onAdd: () => void;
  onChange: (id: number, delta: number) => void;
};

export default function ProduitCard({ produit, qte, onAdd, onChange }: Props) {
  const indispo = !produit.disponible;

  return (
    <div className={`bg-white rounded-xl border overflow-hidden flex flex-col ${indispo ? "opacity-60" : ""}`}>
      <div className="aspect-square bg-vert-claire-2 text-vert-foncee flex items-center justify-center relative">
        {produit.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={produit.image} alt={produit.nom} className="w-full h-full object-cover" />
        ) : (
          <Package size={26} />
        )}
        {indispo && (
          <span className="absolute top-1.5 left-1.5 text-[9px] font-semibold bg-gray-900/80 text-white px-1.5 py-0.5 rounded-full">
            Épuisé
          </span>
        )}
      </div>

      <div className="p-2 flex flex-col flex-1">
        <p className="font-semibold text-gray-800 text-xs leading-snug line-clamp-2">{produit.nom}</p>
        {produit.description && (
          <p className="text-[10px] text-muted-foreground line-clamp-1">{produit.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-1.5">
          <span className="font-bold text-gray-900 text-xs">{produit.prix} MRU</span>

          {indispo ? (
            <span className="text-[10px] text-muted-foreground">—</span>
          ) : qte === 0 ? (
            <button onClick={onAdd} className="w-7 h-7 rounded-lg bg-vert-foncee text-white flex items-center justify-center hover:opacity-90 transition" aria-label="Ajouter">
              <Plus size={15} />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button onClick={() => onChange(produit.id, -1)} className="w-6 h-6 rounded-md border flex items-center justify-center" aria-label="Moins">
                <Minus size={12} />
              </button>
              <span className="text-xs font-bold w-4 text-center">{qte}</span>
              <button onClick={() => onChange(produit.id, 1)} className="w-6 h-6 rounded-md bg-vert-foncee text-white flex items-center justify-center" aria-label="Plus">
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}