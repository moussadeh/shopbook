"use client";

import { TrendingDown, ChevronRight } from "lucide-react";
import type { ClientCreditRow } from "@/lib/data/credits";
import { statusStyle, statutCreditLabel, formatMRU } from "@/lib/donnes/credits";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Props = {
  clients: ClientCreditRow[];
  onDetail: (c: ClientCreditRow) => void;
  onPaiement: (c: ClientCreditRow) => void;
};

export default function CreditsTable({ clients, onDetail, onPaiement }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50/60">
          <TableHead>Client</TableHead>
          <TableHead>Crédits</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Payé</TableHead>
          <TableHead>Reste</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((c) => (
          <TableRow key={c.clientId}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {c.clientInitials}
                </div>
                <span className="font-semibold text-gray-800">{c.clientName}</span>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
                {c.nbCredits} crédit{c.nbCredits > 1 ? "s" : ""}
              </span>
            </TableCell>
            <TableCell className="font-semibold text-gray-800">{formatMRU(c.montantTotal)}</TableCell>
            <TableCell className="text-green-600 font-medium">{formatMRU(c.montantPaye)}</TableCell>
            <TableCell className="text-orange-600 font-semibold">{formatMRU(c.montantRestant)}</TableCell>
            <TableCell>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(statutCreditLabel[c.statutGlobal])}`}>
                {statutCreditLabel[c.statutGlobal]}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 justify-end">
                {c.statutGlobal !== "PAYE" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPaiement(c)}
                    className="text-xs font-semibold text-vert-foncee border-vert-foncee hover:bg-green-50"
                  >
                    <TrendingDown size={13} className="mr-1" /> Paiement
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => onDetail(c)} className="text-muted-foreground">
                  Détails <ChevronRight size={14} className="ml-0.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


// "use client";

// import { TrendingDown } from "lucide-react";
// import type { CreditRow } from "@/lib/data/credits";
// import { statusStyle, statutCreditLabel, formatMRU } from "@/lib/donnes/credits";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import RowActions from "@/components/custom/dashboard/composants/row-actions";

// type Props = {
//   credits: CreditRow[];
//   onDetail: (c: CreditRow) => void;
//   onEdit: (c: CreditRow) => void;
//   onDelete: (c: CreditRow) => void;
//   onPaiement: (c: CreditRow) => void;
// };

// export default function CreditsTable({ credits, onDetail, onEdit, onDelete, onPaiement }: Props) {
//   return (
//     <Table>
//       <TableHeader>
//         <TableRow className="bg-gray-50/60">
//           <TableHead>Client</TableHead>
//           <TableHead>Description</TableHead>
//           <TableHead>Total</TableHead>
//           <TableHead>Payé</TableHead>
//           <TableHead>Restant</TableHead>
//           <TableHead>Statut</TableHead>
//           <TableHead>Date</TableHead>
//           <TableHead />
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {credits.map((c) => (
//           <TableRow key={c.id}>
//             <TableCell>
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">
//                   {c.clientInitials}
//                 </div>
//                 <span className="font-semibold text-gray-800">{c.clientName}</span>
//               </div>
//             </TableCell>
//             <TableCell className="text-muted-foreground text-xs">{c.description}</TableCell>
//             <TableCell className="font-semibold text-gray-800">{formatMRU(c.montantTotal)}</TableCell>
//             <TableCell className="text-green-600 font-medium">{formatMRU(c.montantPaye)}</TableCell>
//             <TableCell className="text-orange-600 font-medium">{formatMRU(c.montantRestant)}</TableCell>
//             <TableCell>
//               <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(statutCreditLabel[c.statut])}`}>
//                 {statutCreditLabel[c.statut]}
//               </span>
//             </TableCell>
//             <TableCell className="text-muted-foreground text-xs">{c.date}</TableCell>
//             <TableCell>
//               <div className="flex items-center gap-1.5 justify-end">
//                 {c.statut !== "PAYE" && (
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => onPaiement(c)}
//                     className="text-xs font-semibold text-vert-foncee border-vert-foncee hover:bg-green-50"
//                   >
//                     <TrendingDown size={13} className="mr-1" /> Paiement
//                   </Button>
//                 )}
//                 <RowActions onDetail={() => onDetail(c)} onEdit={() => onEdit(c)} onDelete={() => onDelete(c)} />
//               </div>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }