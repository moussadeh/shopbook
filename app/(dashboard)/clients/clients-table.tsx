"use client";

import type { ClientRow } from "@/lib/data/clients";
import { statusStyle } from "@/lib/donnes/dashboard";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import RowActions from "@/components/custom/dashboard/composants/row-actions";

type Props = {
  clients: ClientRow[];
  onDetail: (c: ClientRow) => void;
  onEdit: (c: ClientRow) => void;
  onDelete: (c: ClientRow) => void;
};

export default function ClientsTable({ clients, onDetail, onEdit, onDelete }: Props) {
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
        {clients.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {c.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{c.name}</p>
                  {c.email && <p className="text-xs text-muted-foreground">{c.email}</p>}
                </div>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{c.telephone}</TableCell>
            <TableCell>
              <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
                {c.creditCount} crédit{c.creditCount > 1 ? "s" : ""}
              </span>
            </TableCell>
            <TableCell className="font-semibold text-gray-800">{c.creditTotal}</TableCell>
            <TableCell>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(c.statut)}`}>
                {c.statut}
              </span>
            </TableCell>
            <TableCell className="text-muted-foreground text-xs">{c.lastActivity}</TableCell>
            <TableCell>
              <RowActions
                onDetail={() => onDetail(c)}
                onEdit={() => onEdit(c)}
                onDelete={() => onDelete(c)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}