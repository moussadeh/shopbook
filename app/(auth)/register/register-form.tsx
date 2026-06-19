"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { registerAction, type AuthState } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PasswordInput from "@/components/custom/auth/password-input";

const initial: AuthState = {};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initial);
  const err = state.fieldErrors ?? {};

  return (
    <div className="bg-white rounded-3xl border p-6 sm:p-8 shadow-sm">
      <div className="space-y-1.5 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Créer votre compte</h2>
        <p className="text-sm text-muted-foreground">Quelques infos et votre boutique est prête.</p>
      </div>

      {state.error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="prenom">Prénom</Label>
            <Input id="prenom" name="prenom" placeholder="Mohamed" className="h-11" aria-invalid={!!err.prenom} />
            {err.prenom && <p className="text-xs text-red-600">{err.prenom}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" name="nom" placeholder="Ahmed" className="h-11" aria-invalid={!!err.nom} />
            {err.nom && <p className="text-xs text-red-600">{err.nom}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="nomBoutique">Nom de la boutique</Label>
          <Input id="nomBoutique" name="nomBoutique" placeholder="Boutique Ahmed" className="h-11" aria-invalid={!!err.nomBoutique} />
          {err.nomBoutique && <p className="text-xs text-red-600">{err.nomBoutique}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="telephone">Téléphone</Label>
          <Input id="telephone" name="telephone" type="tel" placeholder="+222 00 00 00 00" className="h-11" aria-invalid={!!err.telephone} />
          {err.telephone && <p className="text-xs text-red-600">{err.telephone}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="vous@exemple.com" className="h-11" aria-invalid={!!err.email} />
          {err.email && <p className="text-xs text-red-600">{err.email}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="ville">Ville</Label>
            <Input id="ville" name="ville" placeholder="Nouakchott" className="h-11" aria-invalid={!!err.ville} />
            {err.ville && <p className="text-xs text-red-600">{err.ville}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quartier">Quartier</Label>
            <Input id="quartier" name="quartier" placeholder="Tevragh Zeina" className="h-11" aria-invalid={!!err.quartier} />
            {err.quartier && <p className="text-xs text-red-600">{err.quartier}</p>}
          </div>
        </div>

        <input type="hidden" name="pays" value="Mauritanie" />

        <div className="space-y-1.5">
          <Label htmlFor="motDePasse">Mot de passe</Label>
          <PasswordInput id="motDePasse" name="motDePasse" placeholder="••••••••" aria-invalid={!!err.motDePasse} />
          {err.motDePasse && <p className="text-xs text-red-600">{err.motDePasse}</p>}
        </div>

        <Button type="submit" disabled={isPending} className="w-full h-11 bg-vert-foncee text-white hover:opacity-90">
          {isPending ? "Création..." : "Créer mon compte"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Déjà un compte ?{" "}
        <Link href="/login" className="font-semibold text-vert-foncee hover:underline">Se connecter</Link>
      </p>
    </div>
  );
}