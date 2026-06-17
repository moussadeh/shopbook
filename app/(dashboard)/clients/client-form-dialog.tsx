"use client";

import type { ClientRow } from "@/lib/data/clients";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ClientForm from "./client-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientRow | null;
};

export default function ClientFormDialog({ open, onOpenChange, client }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* key => le formulaire se réinitialise (champs + état) à chaque ouverture */}
        <ClientForm
          key={`${client?.id ?? "new"}-${open}`}
          client={client}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}