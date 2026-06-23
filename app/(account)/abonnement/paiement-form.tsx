"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { soumettrePaiement, type AboState } from "./actions";
import { PRIX_ABONNEMENT } from "@/lib/data/abonnement-config";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActionState } from "react";

const initial: AboState = {};
const methodes = [
  { value: "BANKILY", label: "Bankily" },
  { value: "MASRVI",  label: "Masrvi" },
  { value: "SEDAD",   label: "Sedad" },
  { value: "AUTRE",   label: "Autre" },
];

export default function PaiementForm() {
  const [state, formAction, isPending] = useActionState(soumettrePaiement, initial);
  const [methode, setMethode] = useState("");

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">S&apos;abonner</h2>
        <p className="text-sm text-muted-foreground">
          Montant : <span className="font-semibold text-gray-800">{PRIX_ABONNEMENT} MRU</span> / mois.
          Envoyez le paiement, puis joignez la capture.
        </p>
      </div>

      {state.success ? (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="space-y-3">
            <p>Paiement soumis, votre accès est réactivé. Nous vérifions la réception sous peu.</p>
            <Link href="/dashboard" className="inline-block font-semibold text-vert-foncee hover:underline">
              Aller au tableau de bord →
            </Link>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {state.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="methode" value={methode} />

            <div className="space-y-1.5">
              <Label>Méthode de paiement</Label>
              <Select value={methode} onValueChange={setMethode}>
                <SelectTrigger><SelectValue placeholder="Choisir une méthode" /></SelectTrigger>
                <SelectContent>
                  {methodes.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="capture">Capture du paiement</Label>
              <Input id="capture" name="capture" type="file" accept="image/*" className="cursor-pointer" />
            </div>

            <Button type="submit" disabled={isPending} className="w-full h-11 bg-vert-foncee text-white hover:opacity-90">
              {isPending ? "Envoi..." : "J'ai payé, soumettre"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}