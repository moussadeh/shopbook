"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { demanderCode, verifierCode, definirNouveauMotDePasse, type ResetState } from "../reset-actions";
import TelephoneInput from "@/components/custom/auth/telephone-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/custom/auth/password-input";

const init: ResetState = {};

export default function MotDePasseOubliePage() {
  const [etape, setEtape] = useState<1 | 2 | 3>(1);
  const [telephone, setTelephone] = useState("");
  const [code, setCode] = useState("");

  return (
    <div className="bg-white rounded-3xl border p-6 sm:p-8 shadow-sm">
      <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-vert-foncee mb-4">
        <ArrowLeft size={15} /> Retour à la connexion
      </Link>

      {etape === 1 && (
        <EtapeTelephone
          onOk={(tel) => { setTelephone(tel); setEtape(2); }}
        />
      )}
      {etape === 2 && (
        <EtapeCode
          telephone={telephone}
          onOk={(c) => { setCode(c); setEtape(3); }}
          onRetour={() => setEtape(1)}
        />
      )}
      {etape === 3 && (
        <EtapeMotDePasse telephone={telephone} code={code} />
      )}
    </div>
  );
}

/* Étape 1 */
function EtapeTelephone({ onOk }: { onOk: (tel: string) => void }) {
  const [state, formAction, pending] = useActionState(demanderCode, init);
  useEffect(() => { if (state.success && state.telephone) onOk(state.telephone); }, [state, onOk]);

  return (
    <>
      <h2 className="text-xl font-bold text-vert-foncee mb-1">Mot de passe oublié</h2>
      <p className="text-sm text-muted-foreground mb-5">Saisissez votre numéro : nous vous enverrons un code par SMS.</p>

      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="telephone">Téléphone</Label>
          <TelephoneInput id="telephone" name="telephone" invalid={!!state.fieldErrors?.telephone} />
          {state.fieldErrors?.telephone && <p className="text-xs text-red-600">{state.fieldErrors.telephone}</p>}
        </div>
        <Button type="submit" disabled={pending} className="w-full h-11 bg-vert-foncee text-white hover:opacity-90">
          {pending ? "Envoi..." : "Envoyer le code"}
        </Button>
      </form>
    </>
  );
}

/* Étape 2 */
function EtapeCode({ telephone, onOk, onRetour }: { telephone: string; onOk: (code: string) => void; onRetour: () => void }) {
  const [state, formAction, pending] = useActionState(verifierCode, init);
  const [codeLocal, setCodeLocal] = useState("");
  useEffect(() => { if (state.success) onOk(codeLocal); }, [state.success, codeLocal, onOk]);

  return (
    <>
      <h2 className="text-xl font-bold text-vert-foncee mb-1">Code de vérification</h2>
      <p className="text-sm text-muted-foreground mb-5">
        Un code a été envoyé au {telephone.replace("+222", "+222 ")}. Saisissez-le ci-dessous.
      </p>

      {state.error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl p-3 mb-4">
          <AlertCircle size={15} /> {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="telephone" value={telephone} />
        <div className="space-y-1.5">
          <Label htmlFor="code">Code à 6 chiffres</Label>
          <Input
            id="code" name="code" inputMode="numeric" maxLength={6}
            value={codeLocal}
            onChange={(e) => setCodeLocal(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            className="h-11 text-center text-lg tracking-[0.4em] font-bold"
        />
          {state.fieldErrors?.code && <p className="text-xs text-red-600">{state.fieldErrors.code}</p>}
        </div>
        <Button type="submit" disabled={pending} className="w-full h-11 bg-vert-foncee text-white hover:opacity-90">
          {pending ? "Vérification..." : "Vérifier"}
        </Button>
        <button type="button" onClick={onRetour} className="w-full text-sm text-muted-foreground hover:text-vert-foncee">
          Changer de numéro
        </button>
      </form>
    </>
  );
}

/* Étape 3 */
function EtapeMotDePasse({ telephone, code }: { telephone: string; code: string }) {
  const [state, formAction, pending] = useActionState(definirNouveauMotDePasse, init);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      // redirigé vers login, sans connexion auto
      router.push("/login?reinitialise=1");
    }
  }, [state.success, router]);

  return (
    <>
      <h2 className="text-xl font-bold text-vert-foncee mb-1">Nouveau mot de passe</h2>
      <p className="text-sm text-muted-foreground mb-5">Choisissez un nouveau mot de passe pour votre compte.</p>

      {state.error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl p-3 mb-4">
          <AlertCircle size={15} /> {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="telephone" value={telephone} />
        <input type="hidden" name="code" value={code} />

        <div className="space-y-1.5">
          <Label htmlFor="motDePasse">Nouveau mot de passe</Label>
          <PasswordInput id="motDePasse" name="motDePasse" placeholder="••••••••" />
          {state.fieldErrors?.motDePasse && <p className="text-xs text-red-600">{state.fieldErrors.motDePasse}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmation">Confirmer</Label>
          <PasswordInput id="confirmation" name="confirmation" placeholder="••••••••" />
          {state.fieldErrors?.confirmation && <p className="text-xs text-red-600">{state.fieldErrors.confirmation}</p>}
        </div>

        <Button type="submit" disabled={pending} className="w-full h-11 bg-vert-foncee text-white hover:opacity-90">
          {pending ? "Enregistrement..." : "Changer mon mot de passe"}
        </Button>
      </form>
    </>
  );
}