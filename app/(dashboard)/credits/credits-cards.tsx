"use client";

import { TrendingDown, ChevronRight } from "lucide-react";
import type { ClientCreditRow } from "@/lib/data/credits";
import { statusStyle, statutCreditLabel, formatMRU } from "@/lib/donnes/credits";
import { Button } from "@/components/ui/button";

type Props = {
  clients: ClientCreditRow[];
  onDetail: (c: ClientCreditRow) => void;
  onPaiement: (c: ClientCreditRow) => void;
};

export default function CreditsCards({ clients, onDetail, onPaiement }: Props) {
  return (
    <>
      {clients.map((c) => (
        <div key={c.clientId} className="bg-white rounded-2xl border p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">
                {c.clientInitials}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{c.clientName}</p>
                <p className="text-xs text-muted-foreground">
                  {c.nbCredits} crédit{c.nbCredits > 1 ? "s" : ""} · {c.derniereActivite}
                </p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ml-2 ${statusStyle(statutCreditLabel[c.statutGlobal])}`}>
              {statutCreditLabel[c.statutGlobal]}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t pt-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-bold text-gray-900">{formatMRU(c.montantTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payé</p>
              <p className="text-sm font-bold text-green-600">{formatMRU(c.montantPaye)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Reste</p>
              <p className="text-sm font-bold text-orange-600">{formatMRU(c.montantRestant)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-2">
            <button onClick={() => onDetail(c)} className="text-xs font-semibold text-vert-foncee flex items-center">
              Voir les détails <ChevronRight size={14} className="ml-0.5" />
            </button>
            {c.statutGlobal !== "PAYE" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPaiement(c)}
                className="text-xs font-semibold text-vert-foncee border-vert-foncee hover:bg-green-50 flex items-center gap-1.5"
              >
                <TrendingDown size={13} /> Paiement
              </Button>
            )}
          </div>
        </div>
      ))}
    </>
  );
}


// "use client";

// import { TrendingDown, MoreVertical } from "lucide-react";
// import type { CreditRow } from "@/lib/data/credits";
// import { statusStyle, statutCreditLabel, formatMRU } from "@/lib/donnes/credits";
// import { Button } from "@/components/ui/button";
// import RowActions from "@/components/custom/dashboard/composants/row-actions";

// type Props = {
//   credits: CreditRow[];
//   onDetail: (c: CreditRow) => void;
//   onEdit: (c: CreditRow) => void;
//   onDelete: (c: CreditRow) => void;
//   onPaiement: (c: CreditRow) => void;
// };

// export default function CreditsCards({ credits, onDetail, onEdit, onDelete, onPaiement }: Props) {
//   return (
//     <>
//       {credits.map((c) => (
//         <div key={c.id} className="bg-white rounded-2xl border p-4 space-y-3">
//           <div className="flex items-start justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">
//                 {c.clientInitials}
//               </div>
//               <div>
//                 <p className="font-semibold text-gray-800">{c.clientName}</p>
//                 <p className="text-xs text-muted-foreground">{c.description}</p>
//               </div>
//             </div>
//             <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ml-2 ${statusStyle(statutCreditLabel[c.statut])}`}>
//               {statutCreditLabel[c.statut]}
//             </span>
//           </div>

//           <div className="grid grid-cols-3 gap-2 border-t pt-3 text-center">
//             <div>
//               <p className="text-xs text-muted-foreground">Total</p>
//               <p className="text-sm font-bold text-gray-900">{formatMRU(c.montantTotal)}</p>
//             </div>
//             <div>
//               <p className="text-xs text-muted-foreground">Payé</p>
//               <p className="text-sm font-bold text-green-600">{formatMRU(c.montantPaye)}</p>
//             </div>
//             <div>
//               <p className="text-xs text-muted-foreground">Restant</p>
//               <p className="text-sm font-bold text-orange-600">{formatMRU(c.montantRestant)}</p>
//             </div>
//           </div>

//           <div className="flex items-center justify-between border-t pt-2">
//             <p className="text-xs text-muted-foreground">{c.date}</p>
//             <div className="flex items-center gap-1.5">
//               {c.statut !== "PAYE" && (
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() => onPaiement(c)}
//                   className="text-xs font-semibold text-vert-foncee border-vert-foncee hover:bg-green-50 flex items-center gap-1.5"
//                 >
//                   <TrendingDown size={13} /> Paiement
//                 </Button>
//               )}
//               <RowActions
//                 onDetail={() => onDetail(c)}
//                 onEdit={() => onEdit(c)}
//                 onDelete={() => onDelete(c)}
//               />
//             </div>
//           </div>
//         </div>
//       ))}
//     </>
//   );
// }