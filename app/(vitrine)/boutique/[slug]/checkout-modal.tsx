"use client";

import { useActionState, useEffect, useState } from "react";
import { X, Truck, ShoppingBag, CheckCircle2, AlertCircle } from "lucide-react";
import { registerAcheteur, loginAcheteur, type AcheteurAuthState } from "@/app/(vitrine)/acheteur-actions";
import { passerCommande } from "@/app/(vitrine)/commande-actions";
import type { LignePanier } from "@/app/(vitrine)/boutique/[slug]/vitrine-view";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Etape = "auth" | "livraison" | "succes";

type Props = {
  ouvert: boolean;
  onFermer: () => void;
  slug: string;
  lignes: LignePanier[];
  total: number;
  dejaConnecte: boolean;
  livraison: boolean;
  retrait: boolean;
  onCommandeOk: () => void; // vider le panier
};

const initAuth: AcheteurAuthState = {};

export default function CheckoutModal({
  ouvert, onFermer, slug, lignes, total, dejaConnecte, livraison, retrait, onCommandeOk,
}: Props) {
  const [etape, setEtape] = useState<Etape>(dejaConnecte ? "livraison" : "auth");

  if (!ouvert) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onFermer}>
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h3 className="font-bold text-gray-900">
            {etape === "auth" && "Connexion"}
            {etape === "livraison" && "Finaliser la commande"}
            {etape === "succes" && "Commande envoyée"}
          </h3>
          <button onClick={onFermer} className="w-8 h-8 rounded-full border flex items-center justify-center" aria-label="Fermer">
            <X size={16} />
          </button>
        </div>

        <div className="p-4">
          {etape === "auth" && <EtapeAuth onOk={() => setEtape("livraison")} />}
          {etape === "livraison" && (
            <EtapeLivraison
              slug={slug} lignes={lignes} total={total}
              livraison={livraison} retrait={retrait}
              onOk={() => { onCommandeOk(); setEtape("succes"); }}
            />
          )}
          {etape === "succes" && <EtapeSucces onFermer={onFermer} />}
        </div>
      </div>
    </div>
  );
}

/* --- Étape 1 : auth (connexion ou inscription) --- */
function EtapeAuth({ onOk }: { onOk: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const action = mode === "register" ? registerAcheteur : loginAcheteur;
  const [state, formAction, isPending] = useActionState(action, initAuth);
  const err = state.fieldErrors ?? {};

  useEffect(() => { if (state.success) onOk(); }, [state.success, onOk]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {mode === "register" ? "Créez un compte rapide pour envoyer votre commande." : "Connectez-vous pour continuer."}
      </p>

      {state.error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl p-3">
          <AlertCircle size={15} /> {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-3">
        {mode === "register" && (
          <div className="space-y-1.5">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" name="nom" placeholder="Votre nom" defaultValue={state.values?.nom ?? ""} className="h-11" />
            {err.nom && <p className="text-xs text-red-600">{err.nom}</p>}
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="telephone">Téléphone</Label>
          <Input id="telephone" name="telephone" type="tel" placeholder="+222 00 00 00 00" defaultValue={state.values?.telephone ?? ""} className="h-11" />
          {err.telephone && <p className="text-xs text-red-600">{err.telephone}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="motDePasse">Mot de passe</Label>
          <Input id="motDePasse" name="motDePasse" type="password" placeholder="••••••••" className="h-11" />
          {err.motDePasse && <p className="text-xs text-red-600">{err.motDePasse}</p>}
        </div>

        <Button type="submit" disabled={isPending} className="w-full h-11 bg-vert-foncee text-white hover:opacity-90">
          {isPending ? "..." : mode === "register" ? "Créer mon compte" : "Se connecter"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "register" ? "Déjà un compte ? " : "Pas de compte ? "}
        <button onClick={() => setMode(mode === "register" ? "login" : "register")} className="font-semibold text-vert-foncee">
          {mode === "register" ? "Se connecter" : "Créer un compte"}
        </button>
      </p>
    </div>
  );
}

/* --- Étape 2 : mode + adresse + envoi --- */
function EtapeLivraison({
  slug, lignes, total, livraison, retrait, onOk,
}: {
  slug: string; lignes: LignePanier[]; total: number;
  livraison: boolean; retrait: boolean; onOk: () => void;
}) {
  const [mode, setMode] = useState<"LIVRAISON" | "RETRAIT">(retrait ? "RETRAIT" : "LIVRAISON");
  const [adresse, setAdresse] = useState("");
  const [note, setNote] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  const valider = async () => {
    setErreur(null);
    setEnvoi(true);
    const res = await passerCommande({
      slug, mode, adresse, note,
      lignes: lignes.map((l) => ({ produitId: l.produit.id, qte: l.qte })),
    });
    setEnvoi(false);
    if (res.error) setErreur(res.error);
    else onOk();
  };

  return (
    <div className="space-y-4">
      {/* Mode */}
      <div>
        <Label>Comment récupérer votre commande ?</Label>
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          {retrait && (
            <ModeBtn actif={mode === "RETRAIT"} onClick={() => setMode("RETRAIT")} icon={<ShoppingBag size={16} />} titre="Retrait" desc="Je viens chercher" />
          )}
          {livraison && (
            <ModeBtn actif={mode === "LIVRAISON"} onClick={() => setMode("LIVRAISON")} icon={<Truck size={16} />} titre="Livraison" desc="On me livre" />
          )}
        </div>
      </div>

      {mode === "LIVRAISON" && (
        <div className="space-y-1.5">
          <Label htmlFor="adresse">Adresse de livraison</Label>
          <Input id="adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Quartier, rue, point de repère…" className="h-11" />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="note">Note (optionnel)</Label>
        <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Une précision pour le commerçant…" className="resize-none min-h-16" />
      </div>

      {/* Récap */}
      <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
        {lignes.map((l) => (
          <div key={l.produit.id} className="flex justify-between text-sm">
            <span className="text-gray-600">{l.qte} × {l.produit.nom}</span>
            <span className="font-medium">{l.produit.prix * l.qte} MRU</span>
          </div>
        ))}
        <div className="flex justify-between border-t pt-1.5 font-bold">
          <span>Total</span><span>{total} MRU</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">Vous paierez à la réception de votre commande.</p>

      {erreur && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl p-3">
          <AlertCircle size={15} /> {erreur}
        </div>
      )}

      <Button onClick={valider} disabled={envoi} className="w-full h-11 bg-vert-foncee text-white hover:opacity-90">
        {envoi ? "Envoi…" : "Envoyer la commande"}
      </Button>
    </div>
  );
}

function ModeBtn({ actif, onClick, icon, titre, desc }: { actif: boolean; onClick: () => void; icon: React.ReactNode; titre: string; desc: string }) {
  return (
    <button type="button" onClick={onClick}
      className={`text-left rounded-2xl border p-3 transition ${actif ? "border-vert-foncee bg-green-50/60" : "border-gray-200 hover:bg-muted"}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 ${actif ? "bg-vert-foncee text-white" : "bg-gray-100 text-gray-500"}`}>{icon}</div>
      <p className="text-sm font-semibold text-gray-900">{titre}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </button>
  );
}

/* --- Étape 3 : succès --- */
function EtapeSucces({ onFermer }: { onFermer: () => void }) {
  return (
    <div className="text-center space-y-4 py-4">
      <div className="w-16 h-16 rounded-full bg-green-50 text-vert-foncee flex items-center justify-center mx-auto">
        <CheckCircle2 size={32} />
      </div>
      <div>
        <p className="font-bold text-gray-900 text-lg">Commande envoyée !</p>
        <p className="text-sm text-muted-foreground mt-1">
          Le commerçant va la confirmer et vous contacter. Vous paierez à la réception.
        </p>
      </div>
      <Button onClick={onFermer} className="w-full h-11 bg-vert-foncee text-white hover:opacity-90">Terminer</Button>
    </div>
  );
}