import { Package } from "lucide-react";
import type { VitrineProduit } from "@/lib/data/boutique-publique";

export default function ProduitCard({ produit }: { produit: VitrineProduit }) {
  return (
    <div className={`bg-white rounded-2xl border overflow-hidden ${!produit.disponible ? "opacity-60" : ""}`}>
      {/* Image */}
      <div className="aspect-square bg-green-50 text-vert-foncee flex items-center justify-center relative">
        {produit.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={produit.image} alt={produit.nom} className="w-full h-full object-cover" />
        ) : (
          <Package size={40} />
        )}
        {!produit.disponible && (
          <span className="absolute top-2 left-2 text-xs font-semibold bg-gray-800/80 text-white px-2 py-0.5 rounded-full">
            Indisponible
          </span>
        )}
      </div>

      {/* Infos */}
      <div className="p-3 space-y-1">
        <p className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">{produit.nom}</p>
        {produit.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">{produit.description}</p>
        )}
        <p className="font-bold text-gray-900 text-sm pt-0.5">{produit.prix} MRU</p>
      </div>
    </div>
  );
}