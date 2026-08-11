"use client";

import { Phone } from "lucide-react";
import type { EmprunteurRow } from "@/lib/data/emprunteurs";
import { statusStyle } from "@/lib/donnes/emprunteurs";
import RowActions from "@/components/custom/dashboard/composants/row-actions";

type Props = {
  emprunteurs: EmprunteurRow[];
  onDetail: (e: EmprunteurRow) => void;
  onEdit: (e: EmprunteurRow) => void;
  onDelete: (e: EmprunteurRow) => void;
};

export default function EmprunteursCards({ emprunteurs, onDetail, onEdit, onDelete }: Props) {
  return (
    <>
      {emprunteurs.map((e) => (
        <div key={e.id} className="bg-white rounded-2xl border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-vert-foncee text-white text-sm font-bold flex items-center justify-center shrink-0">
                {e.initials}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{e.name}</p>
                <p className="text-xs text-muted-foreground">{e.lastActivity}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(e.statut)}`}>
              {e.statut}
            </span>
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total dû</p>
              <p className="font-bold text-gray-900">{e.creditTotal}</p>
            </div>
            <div className="flex items-center gap-2">
              {e.telephone && (
                <a
                  href={`tel:${e.telephone}`}
                  className="p-2 rounded-xl border hover:bg-muted transition text-muted-foreground"
                  aria-label="Appeler"
                >
                  <Phone size={15} />
                </a>
              )}
              <RowActions
                onDetail={() => onDetail(e)}
                onEdit={() => onEdit(e)}
                onDelete={() => onDelete(e)}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}