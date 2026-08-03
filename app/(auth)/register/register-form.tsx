"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AlertCircle, Check } from "lucide-react";
import { registerAction, type AuthState } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PasswordInput from "@/components/custom/auth/password-input";
import TelephoneInput from "@/components/custom/auth/telephone-input";

const initial: AuthState = {};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initial);
  const [profil, setProfil] = useState<"COMMERCANT" | "CLIENT">("COMMERCANT");
  const err = state.fieldErrors ?? {};

  return (
    <div className="bg-white rounded-3xl border p-5 sm:p-8 shadow-sm">
      <div className="space-y-1.5 mb-6">
        <h2 className="text-2xl font-bold text-vert-foncee">Bienvenue parmi nous</h2>
        <p className="text-sm text-muted-foreground">Quelques infos et votre compte est prêt.</p>
      </div>

      {state.error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <form action={formAction} className="space-y-4">
        {/* le choix est relayé dans FormData */}
        <input type="hidden" name="profil" value={profil} />

        {/* Choix du profil */}
        <div className="space-y-2">
          <Label>Vous êtes</Label>
          <div className="grid grid-cols-2 gap-3">
            <ProfilTuile
              actif={profil === "COMMERCANT"}
              onClick={() => setProfil("COMMERCANT")}
              //icon={<Store size={18} />}
              titre="Commerçant"
              desc="Je gère mes crédits et ma boutique"
            />
            <ProfilTuile
              actif={profil === "CLIENT"}
              onClick={() => setProfil("CLIENT")}
              //icon={<ShoppingBag size={18} />}
              titre="Client"
              desc="Je commande chez les commerçants"
            />
          </div>
          {err.profil && <p className="text-xs text-red-600">{err.profil}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="prenom">Prénom</Label>
            <Input id="prenom" name="prenom" placeholder="Mohamed" className="h-11"
              defaultValue={state.values?.prenom ?? ""} aria-invalid={!!err.prenom} />
            {err.prenom && <p className="text-xs text-red-600">{err.prenom}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" name="nom" placeholder="Ahmed" className="h-11"
              defaultValue={state.values?.nom ?? ""} aria-invalid={!!err.nom} />
            {err.nom && <p className="text-xs text-red-600">{err.nom}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="telephone">Téléphone</Label>
          <TelephoneInput id="telephone" name="telephone" defaultValue={state.values?.telephone} invalid={!!state.fieldErrors?.telephone} />
          {err.telephone && <p className="text-xs text-red-600">{err.telephone}</p>}
          <p className="text-xs text-muted-foreground">C&apos;est avec ce numéro que vous vous connecterez.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="ville">Ville</Label>
            <Input id="ville" name="ville" placeholder="Nouakchott" className="h-11"
              defaultValue={state.values?.ville ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quartier">Quartier</Label>
            <Input id="quartier" name="quartier" placeholder="Tevragh Zeina" className="h-11"
              defaultValue={state.values?.quartier ?? ""} />
          </div>
        </div>

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

function ProfilTuile({
  actif, onClick, titre, desc,
}: {
  actif: boolean; onClick: () => void; titre: string; desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-2xl border p-3 transition ${
        actif ? "border-vert-foncee bg-green-50/60" : "border-gray-200 hover:bg-muted"
      }`}
    >
      {/* <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
        actif ? "bg-vert-foncee text-white" : "bg-gray-100 text-gray-500"
      }`}>
        {icon}
      </div> */}
      <p className="text-sm font-semibold text-gray-900">{titre}</p>
      {/* <p className="text-xs text-muted-foreground leading-snug">{desc}</p> */}
      {actif && (
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-vert-foncee">
          <Check size={12} /> Sélectionné
        </span>
      )}
    </button>
  );
}
