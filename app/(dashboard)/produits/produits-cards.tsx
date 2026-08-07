"use client";

import { Package } from "lucide-react";
import { useOptimistic, startTransition } from "react";
import type { ProduitRow } from "@/lib/data/produits";
import { toggleDisponible } from "./actions";
import { Switch } from "@/components/ui/switch";
import RowActions from "@/components/custom/dashboard/composants/row-actions";

type Props = {
  produits: ProduitRow[];
  onDetail: (p: ProduitRow) => void;
  onEdit: (p: ProduitRow) => void;
  onDelete: (p: ProduitRow) => void;
};

export default function ProduitsCards({ produits, onDetail, onEdit, onDelete }: Props) {
  return (
    <>
      {produits.map((p) => (
        <CarteProduit key={p.id} produit={p} onDetail={onDetail} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </>
  );
}

function CarteProduit({
  produit, onDetail, onEdit, onDelete,
}: {
  produit: ProduitRow;
  onDetail: (p: ProduitRow) => void;
  onEdit: (p: ProduitRow) => void;
  onDelete: (p: ProduitRow) => void;
}) {
  const [dispoOptimiste, setDispoOptimiste] = useOptimistic(produit.disponible);

  const basculer = (v: boolean) => {
    startTransition(async () => {
      setDispoOptimiste(v);
      await toggleDisponible(produit.id, v);
    });
  };

  return (
    <div onClick={() => onDetail(produit)} className="bg-white rounded-2xl border p-4 flex items-center gap-3 cursor-pointer">
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
        {produit.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={produit.image} alt={produit.nom} className="w-full h-full object-cover" />
        ) : (
          <Package size={22} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{produit.nom}</p>
        <p className="text-sm font-bold text-gray-900">{produit.prix} MRU</p>

        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 mt-1.5">
          <Switch
            checked={dispoOptimiste}
            onCheckedChange={basculer}
            aria-label="Basculer la disponibilité"
          />
          <span className={`text-xs font-medium ${dispoOptimiste ? "text-green-700" : "text-muted-foreground"}`}>
            {dispoOptimiste ? "Disponible" : "Indisponible"}
          </span>
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <RowActions onDetail={() => onDetail(produit)} onEdit={() => onEdit(produit)} onDelete={() => onDelete(produit)} />
      </div>
    </div>
  );
}