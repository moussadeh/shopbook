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



// "use client";

// import { Package } from "lucide-react";
// import type { ProduitRow } from "@/lib/data/produits";
// import { uniteLabel, STOCK_BAS_SEUIL, categorieLabel } from "@/lib/donnes/produits";
// import RowActions from "@/components/custom/dashboard/composants/row-actions";

// type Props = {
//   produits: ProduitRow[];
//   maxVendu: number;
//   onDetail: (p: ProduitRow) => void;
//   onEdit: (p: ProduitRow) => void;
//   onDelete: (p: ProduitRow) => void;
// };

// export default function ProduitsCards({ produits, maxVendu, onDetail, onEdit, onDelete }: Props) {
//   return (
//     <>
//       {produits.map((p) => {
//         const pct      = Math.round((p.vendu / maxVendu) * 100);
//         const stockBas = p.stock < STOCK_BAS_SEUIL;
//         return (
//           <div key={p.id} className="bg-white rounded-2xl border p-4 space-y-3">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
//                   <Package size={18} />
//                 </div>
//                 <div>
//                   <p className="font-semibold text-gray-800">{p.nom}</p>
//                   <p className="text-xs text-muted-foreground">{categorieLabel[p.categorie]} · {uniteLabel[p.unite]}</p>
//                 </div>
//               </div>
//               <RowActions onDetail={() => onDetail(p)} onEdit={() => onEdit(p)} onDelete={() => onDelete(p)} />
//             </div>

//             <div className="grid grid-cols-3 gap-2 border-t pt-3 text-center">
//               <div>
//                 <p className="text-xs text-muted-foreground">Prix</p>
//                 <p className="text-sm font-bold text-gray-900">{p.prixUnitaire} MRU</p>
//               </div>
//               <div>
//                 <p className="text-xs text-muted-foreground">Stock</p>
//                 <p className={`text-sm font-bold ${stockBas ? "text-red-600" : "text-gray-900"}`}>
//                   {p.stock}
//                   {stockBas && <span className="block text-xs font-normal text-red-400">stock bas</span>}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs text-muted-foreground">Vendu</p>
//                 <p className="text-sm font-bold text-vert-foncee">{p.vendu}</p>
//               </div>
//             </div>

//             <div className="space-y-1">
//               <div className="flex justify-between text-xs text-muted-foreground">
//                 <span>Popularité</span>
//                 <span>{pct}%</span>
//               </div>
//               <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                 <div className="h-full bg-vert-foncee rounded-full" style={{ width: `${pct}%` }} />
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </>
//   );
// }