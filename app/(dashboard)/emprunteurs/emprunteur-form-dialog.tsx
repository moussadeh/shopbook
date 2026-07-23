"use client";

import type { EmprunteurRow } from "@/lib/data/emprunteurs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EmprunteurForm from "./emprunteur-form";

export default function EmprunteurFormDialog({
  open, onOpenChange, emprunteur,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emprunteur: EmprunteurRow | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <EmprunteurForm
          key={`${emprunteur?.id ?? "new"}-${open}`}
          emprunteur={emprunteur}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}