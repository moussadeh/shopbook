"use client";

import { Package } from "lucide-react";
import { useOptimistic, startTransition } from "react";
import type { ProduitRow } from "@/lib/data/produits";
import { toggleDisponible } from "./actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import RowActions from "@/components/custom/dashboard/composants/row-actions";

type Props = {
  produits: ProduitRow[];
  onDetail: (p: ProduitRow) => void;
  onEdit: (p: ProduitRow) => void;
  onDelete: (p: ProduitRow) => void;
};

export default function ProduitsTable({ produits, onDetail, onEdit, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50/60">
          <TableHead>Produit</TableHead>
          <TableHead>Prix</TableHead>
          <TableHead>Disponible</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {produits.map((p) => (
          <LigneProduit key={p.id} produit={p} onDetail={onDetail} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </TableBody>
    </Table>
  );
}

function LigneProduit({
  produit, onDetail, onEdit, onDelete,
}: {
  produit: ProduitRow;
  onDetail: (p: ProduitRow) => void;
  onEdit: (p: ProduitRow) => void;
  onDelete: (p: ProduitRow) => void;
}) {
  // affichage optimiste de la disponibilité
  const [dispoOptimiste, setDispoOptimiste] = useOptimistic(produit.disponible);

  const basculer = (v: boolean) => {
    startTransition(async () => {
      setDispoOptimiste(v);              // change l'affichage TOUT DE SUITE
      await toggleDisponible(produit.id, v); // puis part au serveur
    });
  };

  return (
    <TableRow className="cursor-pointer" onClick={() => onDetail(produit)}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
            {produit.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={produit.image} alt={produit.nom} className="w-full h-full object-cover" />
            ) : (
              <Package size={16} />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800">{produit.nom}</p>
            {produit.description && <p className="text-xs text-muted-foreground truncate max-w-xs">{produit.description}</p>}
          </div>
        </div>
      </TableCell>
      <TableCell className="font-semibold text-gray-800">{produit.prix} MRU</TableCell>
      <TableCell>
        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
          <Switch
            checked={dispoOptimiste}
            onCheckedChange={basculer}
            aria-label="Basculer la disponibilité"
          />
          <span className={`text-xs font-medium ${dispoOptimiste ? "text-green-700" : "text-muted-foreground"}`}>
            {dispoOptimiste ? "Oui" : "Non"}
          </span>
        </div>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <RowActions onDetail={() => onDetail(produit)} onEdit={() => onEdit(produit)} onDelete={() => onDelete(produit)} />
      </TableCell>
    </TableRow>
  );
}