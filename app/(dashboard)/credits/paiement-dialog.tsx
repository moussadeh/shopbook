"use client";

import { useActionState, useEffect } from "react";
import type { ClientCreditRow } from "@/lib/data/credits";
import { payerClient, type PaiementClientState } from "./actions";
import { formatMRU } from "@/lib/donnes/credits";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const initial: PaiementClientState = {};

function PaiementForm({
  client,
  onSuccess,
  onCancel,
}: {
  client: ClientCreditRow;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, isPending] = useActionState(payerClient, initial);

  useEffect(() => { if (state.success) onSuccess(); }, [state.success, onSuccess]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Enregistrer un paiement</DialogTitle>
        <DialogDescription>
          {client.clientName} — reste à payer : {formatMRU(client.montantRestant)}
        </DialogDescription>
      </DialogHeader>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="clientId" value={client.clientId} />

        <div className="space-y-1.5">
          <Label htmlFor="montant">Montant reçu (MRU)</Label>
          <Input
            id="montant"
            name="montant"
            type="number"
            step="any"
            max={client.montantRestant}
            placeholder="0"
            autoFocus
          />
          <p className="text-xs text-muted-foreground">
            Le montant sera imputé en commençant par le crédit le plus ancien.
          </p>
        </div>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isPending}>
            Annuler
          </Button>
          <Button type="submit" className="flex-1 bg-vert-foncee text-white hover:opacity-90" disabled={isPending}>
            {isPending ? "..." : "Valider le paiement"}
          </Button>
        </div>
      </form>
    </>
  );
}

export default function PaiementDialog({
  open,
  onOpenChange,
  client,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientCreditRow | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        {client && (
          <PaiementForm
            key={`${client.clientId}-${open}`}
            client={client}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}


// "use client";

// import { useActionState, useEffect } from "react";
// import type { CreditRow } from "@/lib/data/credits";
// import { addPaiement, type ActionState } from "./actions";
// import { formatMRU } from "@/lib/donnes/credits";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

// const initial: ActionState = {};

// function PaiementForm({
//   credit,
//   onSuccess,
//   onCancel,
// }: {
//   credit: CreditRow;
//   onSuccess: () => void;
//   onCancel: () => void;
// }) {
//   const [state, formAction, isPending] = useActionState(addPaiement, initial);
//   useEffect(() => { if (state.success) onSuccess(); }, [state.success, onSuccess]);

//   return (
//     <>
//       <DialogHeader>
//         <DialogTitle>Enregistrer un paiement</DialogTitle>
//         <DialogDescription>
//           {credit.clientName} — restant : {formatMRU(credit.montantRestant)}
//         </DialogDescription>
//       </DialogHeader>

//       <form action={formAction} className="space-y-4">
//         <input type="hidden" name="creditId" value={credit.id} />
//         <div className="space-y-1.5">
//           <Label htmlFor="montant">Montant reçu (MRU)</Label>
//           <Input id="montant" name="montant" type="number" step="any" placeholder="0" autoFocus />
//         </div>
//         {state.error && <p className="text-sm text-red-600">{state.error}</p>}
//         <div className="flex gap-3 pt-2">
//           <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isPending}>Annuler</Button>
//           <Button type="submit" className="flex-1 bg-vert-foncee text-white hover:opacity-90" disabled={isPending}>
//             {isPending ? "..." : "Valider le paiement"}
//           </Button>
//         </div>
//       </form>
//     </>
//   );
// }

// export default function PaiementDialog({
//   open,
//   onOpenChange,
//   credit,
// }: {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   credit: CreditRow | null;
// }) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-sm">
//         {credit && (
//           <PaiementForm
//             key={`${credit.id}-${open}`}
//             credit={credit}
//             onSuccess={() => onOpenChange(false)}
//             onCancel={() => onOpenChange(false)}
//           />
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }