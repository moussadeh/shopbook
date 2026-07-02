"use client";

import { useActionState, useEffect, useState } from "react";
import { Store, Link2, Copy, Check, ExternalLink, Truck, ShoppingBag, AlertCircle, CheckCircle2 } from "lucide-react";
import type { BoutiqueRow } from "@/lib/data/boutique";
import { enregistrerBoutique, basculerActive, type BoutiqueState } from "./actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initial: BoutiqueState = {};

export default function MaBoutiqueView({ boutique }: { boutique: BoutiqueRow | null }) {
  const [state, formAction, isPending] = useActionState(enregistrerBoutique, initial);
  const [copie, setCopie] = useState(false);

  // modes (contrôlés pour l'aperçu + relais dans le form)
  const [livraison, setLivraison] = useState(boutique?.livraison ?? false);
  const [retrait, setRetrait] = useState(boutique?.retrait ?? true);

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const lienPublic = boutique ? `${base}/boutique/${boutique.slug}` : "";

  useEffect(() => {
    if (copie) {
      const t = setTimeout(() => setCopie(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copie]);

  const copier = async () => {
    await navigator.clipboard.writeText(lienPublic);
    setCopie(true);
  };

  return (
    <div className="px-4 md:px-6 py-5 space-y-5 max-w-3xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-vert-foncee text-white flex items-center justify-center shrink-0">
          <Store size={20} />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Ma boutique en ligne</h1>
          <p className="text-xs text-muted-foreground">Votre vitrine que vos clients peuvent visiter et où ils peuvent commander.</p>
        </div>
      </div>

      {/* Lien partageable — seulement si la boutique existe */}
      {boutique && (
        <div className="bg-white rounded-2xl border p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Link2 size={16} className="text-vert-foncee" /> Votre lien à partager
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 bg-gray-50 border rounded-xl px-3 py-2.5 text-sm text-gray-600 truncate">
              {lienPublic}
            </div>
            <div className="flex gap-2 items-center">
              <Button onClick={copier} variant="outline" className="flex-1 sm:flex-none gap-1.5">
                {copie ? <><Check size={15} /> Copié</> : <><Copy size={15} /> Copier</>}
              </Button>
              <a href={lienPublic} rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 rounded-xl border text-sm font-medium hover:bg-muted transition">
                <ExternalLink size={15} /> Voir
              </a>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Partagez ce lien sur WhatsApp, vos réseaux, ou en boutique.</p>
        </div>
      )}

      {/* Formulaire */}
      <div className="bg-white rounded-2xl border p-5 md:p-6">
        <h2 className="font-bold text-gray-900 mb-4">
          {boutique ? "Modifier ma boutique" : "Créer ma boutique"}
        </h2>

        {state.success && (
          <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-vert-claire" />
            <AlertDescription>Votre boutique a été enregistrée.</AlertDescription>
          </Alert>
        )}
        {state.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nom">Nom de la boutique</Label>
            <Input id="nom" name="nom" placeholder="Boutique Ahmed" defaultValue={boutique?.nom ?? ""} className="h-11" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea id="description" name="description" placeholder="Épicerie de quartier, produits frais tous les jours…"
              defaultValue={boutique?.description ?? ""} className="resize-none min-h-20" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="quartier">Quartier</Label>
              <Input id="quartier" name="quartier" placeholder="Tevragh Zeina" defaultValue={boutique?.quartier ?? ""} className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" name="telephone" type="tel" placeholder="+222 00 00 00 00" defaultValue={boutique?.telephone ?? ""} className="h-11" />
            </div>
          </div>

          {/* Modes de commande */}
          <div className="space-y-2">
            <Label>Comment vos clients récupèrent leurs commandes</Label>
            <div className="grid grid-cols-2 gap-3">
              <ModeToggle
                icon={<ShoppingBag size={18} />}
                titre="Retrait"
                desc="Le client vient chercher"
                name="retrait"
                actif={retrait}
                onToggle={() => setRetrait((v) => !v)}
              />
              <ModeToggle
                icon={<Truck size={18} />}
                titre="Livraison"
                desc="Vous livrez le client"
                name="livraison"
                actif={livraison}
                onToggle={() => setLivraison((v) => !v)}
              />
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="w-full h-11 bg-vert-foncee text-white hover:opacity-90">
            {isPending ? "Enregistrement..." : boutique ? "Enregistrer les modifications" : "Créer ma boutique"}
          </Button>
        </form>
      </div>

      {/* Activer/désactiver — seulement si elle existe */}
      {boutique && (
        <div className="bg-white rounded-2xl border p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">Boutique {boutique.active ? "en ligne" : "hors ligne"}</p>
            <p className="text-xs text-muted-foreground">
              {boutique.active ? "Vos clients peuvent voir et commander." : "Votre vitrine n'est pas accessible."}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => basculerActive(!boutique.active)}
            className={boutique.active ? "text-red-600 border-red-200 hover:bg-red-50" : "text-vert-foncee border-vert-foncee hover:bg-green-50"}
          >
            {boutique.active ? "Mettre hors ligne" : "Remettre en ligne"}
          </Button>
        </div>
      )}
    </div>
  );
}

/* Toggle de mode (retrait / livraison) avec input caché pour le form */
function ModeToggle({
  icon, titre, desc, name, actif, onToggle,
}: {
  icon: React.ReactNode; titre: string; desc: string; name: string; actif: boolean; onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`text-left rounded-2xl border p-3 transition ${
        actif ? "border-vert-foncee bg-green-50/60" : "border-gray-200 hover:bg-muted"
      }`}
    >
      {/* relais de la valeur dans FormData (checkbox cachée) */}
      <input type="checkbox" name={name} checked={actif} readOnly hidden />
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${actif ? "bg-vert-foncee text-white" : "bg-gray-100 text-gray-500"}`}>
        {icon}
      </div>
      <p className="text-sm font-semibold text-gray-900">{titre}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
      <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${actif ? "text-vert-foncee" : "text-muted-foreground"}`}>
        {actif ? <><Check size={12} /> Activé</> : "Désactivé"}
      </div>
    </button>
  );
}