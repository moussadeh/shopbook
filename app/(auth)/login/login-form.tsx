"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { loginAction, type AuthState } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PasswordInput from "@/components/custom/auth/password-input";

const initial: AuthState = {};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initial);

  return (
    <div className="bg-white rounded-3xl border p-6 sm:p-8 shadow-sm">
      <div className="space-y-1.5 mb-6">
        <h2 className="text-2xl font-bold text-vert-foncee">Content de vous revoir</h2>
        <p className="text-sm text-muted-foreground">Connectez-vous pour accéder à votre boutique.</p>
      </div>

      {state.error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <form action={formAction} className="space-y-4">
        {/* <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="vous@exemple.com" className="h-11"
            aria-invalid={!!state.fieldErrors?.email} />
          {state.fieldErrors?.email && <p className="text-xs text-red-600">{state.fieldErrors.email}</p>}
        </div> */}

        <div className="space-y-1.5">
          <Label htmlFor="telephone">Téléphone</Label>
          <Input id="telephone" name="telephone" type="tel" placeholder="+222 00 00 00 00" className="h-11"
            aria-invalid={!!state.fieldErrors?.telephone} />
          {state.fieldErrors?.telephone && <p className="text-xs text-red-600">{state.fieldErrors.telephone}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="motDePasse">Mot de passe</Label>
            {/* <Link href="/mot-de-passe-oublie" className="text-xs font-medium text-vert-foncee hover:underline">Oublié ?</Link> */}
          </div>
          <PasswordInput id="motDePasse" name="motDePasse" placeholder="••••••••"
            aria-invalid={!!state.fieldErrors?.motDePasse} />
          {state.fieldErrors?.motDePasse && <p className="text-xs text-red-600">{state.fieldErrors.motDePasse}</p>}
        </div>

        <Button type="submit" disabled={isPending} className="w-full h-11 bg-vert-foncee text-white hover:opacity-90">
          {isPending ? "Connexion..." : "Se connecter"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-semibold text-vert-foncee hover:underline">Créer un compte</Link>
      </p>
    </div>
  );
}