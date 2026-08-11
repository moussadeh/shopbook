"use client";

import type { EmprunteurRow } from "@/lib/data/emprunteurs";
import { statusStyle } from "@/lib/donnes/emprunteurs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RowActions from "@/components/custom/dashboard/composants/row-actions";

type Props = {
  emprunteurs: EmprunteurRow[];
  onDetail: (e: EmprunteurRow) => void;
  onEdit: (e: EmprunteurRow) => void;
  onDelete: (e: EmprunteurRow) => void;
};

export default function EmprunteursTable({ emprunteurs, onDetail, onEdit, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50/60">
          <TableHead>Client</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Crédits</TableHead>
          <TableHead>Total dû</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Dernière activité</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {emprunteurs.map((e) => (
          <TableRow key={e.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {e.initials}
                </div>
                <p className="font-semibold text-gray-800">{e.name}</p>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{e.telephone || "—"}</TableCell>
            <TableCell>
              <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
                {e.creditCount} crédit{e.creditCount > 1 ? "s" : ""}
              </span>
            </TableCell>
            <TableCell className="font-semibold text-gray-800">{e.creditTotal}</TableCell>
            <TableCell>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(e.statut)}`}>
                {e.statut}
              </span>
            </TableCell>
            <TableCell className="text-muted-foreground text-xs">{e.lastActivity}</TableCell>
            <TableCell>
              <RowActions
                onDetail={() => onDetail(e)}
                onEdit={() => onEdit(e)}
                onDelete={() => onDelete(e)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}