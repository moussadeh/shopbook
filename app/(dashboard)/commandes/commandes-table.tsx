"use client";

import { ChevronRight, Truck, ShoppingBag } from "lucide-react";
import type { CommandeRow } from "@/lib/data/commandes";
import { statutLabel, statutStyle, paiementLabel, formatMRU } from "@/lib/donnes/commandes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function CommandesTable({ commandes, onDetail }: { commandes: CommandeRow[]; onDetail: (c: CommandeRow) => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50/60">
          <TableHead>Client</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Paiement</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {commandes.map((c) => (
          <TableRow key={c.id} className="cursor-pointer" onClick={() => onDetail(c)}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {c.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{c.acheteurNom}</p>
                  <p className="text-xs text-muted-foreground">{c.nbArticles} article{c.nbArticles > 1 ? "s" : ""}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                {c.mode === "LIVRAISON" ? <Truck size={13} /> : <ShoppingBag size={13} />}
                {c.mode === "LIVRAISON" ? "Livraison" : "Retrait"}
              </span>
            </TableCell>
            <TableCell className="font-semibold text-gray-800">{formatMRU(c.total)}</TableCell>
            <TableCell>
              <span className={`text-xs font-semibold ${c.statutPaiement === "PAYEE" ? "text-green-600" : "text-amber-600"}`}>
                {paiementLabel(c.statutPaiement)}
              </span>
            </TableCell>
            <TableCell>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statutStyle[c.statut]}`}>
                {statutLabel[c.statut]}
              </span>
            </TableCell>
            <TableCell>
              <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onDetail(c); }} className="text-muted-foreground">
                Détails <ChevronRight size={14} className="ml-1" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}