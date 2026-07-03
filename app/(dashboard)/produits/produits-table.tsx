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



// "use client";

// import { Package } from "lucide-react";
// import type { ProduitRow } from "@/lib/data/produits";
// import { uniteLabel, STOCK_BAS_SEUIL, categorieLabel } from "@/lib/donnes/produits";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import RowActions from "@/components/custom/dashboard/composants/row-actions";

// type Props = {
//   produits: ProduitRow[];
//   maxVendu: number;
//   onDetail: (p: ProduitRow) => void;
//   onEdit: (p: ProduitRow) => void;
//   onDelete: (p: ProduitRow) => void;
// };

// export default function ProduitsTable({ produits, maxVendu, onDetail, onEdit, onDelete }: Props) {
//   return (
//     <Table>
//       <TableHeader>
//         <TableRow className="bg-gray-50/60">
//           <TableHead>Produit</TableHead>
//           <TableHead>Catégorie</TableHead>
//           <TableHead>Prix unitaire</TableHead>
//           <TableHead>Unité</TableHead>
//           <TableHead>Stock</TableHead>
//           <TableHead>Popularité</TableHead>
//           <TableHead />
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {produits.map((p) => {
//           const pct      = Math.round((p.vendu / maxVendu) * 100);
//           const stockBas = p.stock < STOCK_BAS_SEUIL;
//           return (
//             <TableRow key={p.id}>
//               <TableCell>
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-xl bg-green-50 text-vert-foncee flex items-center justify-center shrink-0">
//                     <Package size={15} />
//                   </div>
//                   <span className="font-semibold text-gray-800">{p.nom}</span>
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">{categorieLabel[p.categorie]}</span>
//               </TableCell>
//               <TableCell className="font-semibold text-gray-800">{p.prixUnitaire} MRU</TableCell>
//               <TableCell className="text-muted-foreground text-xs">{uniteLabel[p.unite]}</TableCell>
//               <TableCell>
//                 <span className={`text-sm font-semibold ${stockBas ? "text-red-600" : "text-gray-800"}`}>
//                   {p.stock}
//                   {stockBas && <span className="ml-1 text-xs font-normal text-red-400">(bas)</span>}
//                 </span>
//               </TableCell>
//               <TableCell>
//                 <div className="flex items-center gap-2">
//                   <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                     <div className="h-full bg-vert-foncee rounded-full" style={{ width: `${pct}%` }} />
//                   </div>
//                   <span className="text-sm font-semibold text-gray-700 shrink-0">{p.vendu}</span>
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <RowActions onDetail={() => onDetail(p)} onEdit={() => onEdit(p)} onDelete={() => onDelete(p)} />
//               </TableCell>
//             </TableRow>
//           );
//         })}
//       </TableBody>
//     </Table>
//   );
// }