"use client";

import { useTransition } from "react";
import { Truck, ShoppingBag, Phone, MapPin, Check, X, Package } from "lucide-react";
import type { CommandeRow } from "@/lib/data/commandes";
import { statutLabel, statutStyle, formatMRU } from "@/lib/donnes/commandes";
import { changerStatutCommande, validerPaiementCommande } from "./actions";
import { StatutCommande } from "@/app/generated/prisma/enums";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  commande: CommandeRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CommandeDetailDialog({ commande, open, onOpenChange }: Props) {
  const [isPending, start] = useTransition();
  if (!commande) return null;

  const avancer = (s: StatutCommande) => start(() => { changerStatutCommande(commande.id, s); onOpenChange(false); });
  const payer = () => start(() => { validerPaiementCommande(commande.id); onOpenChange(false); });

  // actions selon l'état + le mode
  const actions: { label: string; statut: StatutCommande; variant?: "danger" }[] = [];
  if (commande.statut === "NOUVELLE") {
    actions.push({ label: "Prendre en charge", statut: StatutCommande.EN_PREPARATION });
    actions.push({ label: "Refuser", statut: StatutCommande.REFUSEE, variant: "danger" });
  } else if (commande.statut === "EN_PREPARATION") {
    if (commande.mode === "RETRAIT") actions.push({ label: "Marquer prête", statut: StatutCommande.PRETE });
    else actions.push({ label: "Mettre en livraison", statut: StatutCommande.EN_LIVRAISON });
  } else if (commande.statut === "PRETE") {
    actions.push({ label: "Marquer récupérée", statut: StatutCommande.RECUPEREE });
  } else if (commande.statut === "EN_LIVRAISON") {
    actions.push({ label: "Marquer livrée", statut: StatutCommande.LIVREE });
  }

  const remise = commande.statut === "RECUPEREE" || commande.statut === "LIVREE";
  const nonPayee = commande.statutPaiement === "EN_ATTENTE";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Commande #{commande.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Client */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-vert-foncee text-white font-bold flex items-center justify-center shrink-0">
              {commande.initials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900">{commande.acheteurNom}</p>
              <a href={`tel:${commande.acheteurTel}`} className="text-sm text-vert-foncee flex items-center gap-1">
                <Phone size={13} /> {commande.acheteurTel}
              </a>
            </div>
            <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-semibold ${statutStyle[commande.statut]}`}>
              {statutLabel[commande.statut]}
            </span>
          </div>

          {/* Mode + adresse */}
          <div className="border rounded-2xl p-3 space-y-2 bg-gray-50/60">
            <div className="flex items-center gap-2 text-sm">
              {commande.mode === "LIVRAISON" ? <Truck size={15} className="text-vert-foncee" /> : <ShoppingBag size={15} className="text-vert-foncee" />}
              <span className="font-semibold">{commande.mode === "LIVRAISON" ? "Livraison" : "Retrait en boutique"}</span>
            </div>
            {commande.mode === "LIVRAISON" && commande.adresse && (
              <p className="text-sm text-gray-600 flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /> {commande.adresse}</p>
            )}
            {commande.note && <p className="text-xs text-muted-foreground italic">« {commande.note} »</p>}
            <p className="text-xs text-muted-foreground">{commande.date}</p>
          </div>

          {/* Articles */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Articles</p>
            <div className="space-y-2">
              {commande.lignes.map((l, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700"><span className="font-semibold">{l.quantite}×</span> {l.nom}</span>
                  <span className="font-medium">{formatMRU(l.prixUnitaire * l.quantite)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t pt-2 font-bold">
                <span>Total</span><span>{formatMRU(commande.total)}</span>
              </div>
            </div>
          </div>

          {/* Paiement à la remise */}
          {remise && nonPayee && (
            <Button onClick={payer} disabled={isPending} className="w-full bg-vert-foncee text-white hover:opacity-90">
              <Check size={15} className="mr-1.5" /> Confirmer le paiement reçu
            </Button>
          )}
          {commande.statutPaiement === "PAYEE" && (
            <div className="text-center text-sm font-semibold text-green-600 flex items-center justify-center gap-1">
              <Check size={15} /> Paiement encaissé
            </div>
          )}

          {/* Actions de statut */}
          {actions.length > 0 && (
            <div className="flex flex-col gap-2 pt-1">
              {actions.map((a) => (
                <Button
                  key={a.statut}
                  onClick={() => avancer(a.statut)}
                  disabled={isPending}
                  variant={a.variant === "danger" ? "outline" : "default"}
                  className={a.variant === "danger"
                    ? "text-red-600 border-red-200 hover:bg-red-50"
                    : "bg-vert-foncee text-white hover:opacity-90"}
                >
                  {a.variant === "danger" ? <X size={15} className="mr-1.5" /> : <Package size={15} className="mr-1.5" />}
                  {a.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}