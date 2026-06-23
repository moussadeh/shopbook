"use client";

import { Phone, Mail, MoreVertical } from "lucide-react";
import type { ClientRow } from "@/lib/data/clients";
import { statusStyle } from "@/lib/donnes/dashboard";
import RowActions from "@/components/custom/dashboard/composants/row-actions";

type Props = {
  clients: ClientRow[];
  onDetail: (c: ClientRow) => void;
  onEdit: (c: ClientRow) => void;
  onDelete: (c: ClientRow) => void;
};

export default function ClientsCards({ clients, onDetail, onEdit, onDelete }: Props) {
  return (
    <>
      {clients.map((c) => (
        <div key={c.id} className="bg-white rounded-2xl border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-vert-foncee text-white text-sm font-bold flex items-center justify-center shrink-0">
                {c.initials}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.lastActivity}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(c.statut)}`}>
              {c.statut}
            </span>
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total dû</p>
              <p className="font-bold text-gray-900">{c.creditTotal}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl border hover:bg-muted transition text-muted-foreground">
                <Phone size={15} />
              </button>
              {c.email && (
                <button className="p-2 rounded-xl border hover:bg-muted transition text-muted-foreground">
                  <Mail size={15} />
                </button>
              )}
              <RowActions
                onDetail={() => onDetail(c)}
                onEdit={() => onEdit(c)}
                onDelete={() => onDelete(c)}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}