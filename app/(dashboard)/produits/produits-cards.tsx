"use client";

import { Package } from "lucide-react";
import type { ProduitRow } from "@/lib/data/produits";
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
        <div key={p.id} className="bg-white rounded-2xl border p-4 flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt={p.nom} className="w-full h-full object-cover" />
            ) : (
              <Package size={22} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 truncate">{p.nom}</p>
            <p className="text-sm font-bold text-gray-900">{p.prix} MRU</p>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${p.disponible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {p.disponible ? "Disponible" : "Indisponible"}
            </span>
          </div>
          <RowActions onDetail={() => onDetail(p)} onEdit={() => onEdit(p)} onDelete={() => onDelete(p)} />
        </div>
      ))}
    </>
  );
}
