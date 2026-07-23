"use client";

import { Package } from "lucide-react";
import type { ProduitRow } from "@/lib/data/produits";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
          <TableHead>Statut</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {produits.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.nom} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={16} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800">{p.nom}</p>
                  {p.description && <p className="text-xs text-muted-foreground truncate max-w-xs">{p.description}</p>}
                </div>
              </div>
            </TableCell>
            <TableCell className="font-semibold text-gray-800">{p.prix} MRU</TableCell>
            <TableCell>
              {p.disponible ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Disponible</span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Indisponible</span>
              )}
            </TableCell>
            <TableCell>
              <RowActions onDetail={() => onDetail(p)} onEdit={() => onEdit(p)} onDelete={() => onDelete(p)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
