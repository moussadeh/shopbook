"use client";

import { useState } from "react";
import { Check, X, ExternalLink } from "lucide-react";
import type { PaiementAboRow } from "@/lib/data/admin";
import { approuverPaiement, rejeterPaiement } from "./actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const statutBadge: Record<string, string> = {
  EN_ATTENTE: "bg-amber-100 text-amber-700",
  APPROUVE: "bg-green-100 text-green-700",
  REJETE: "bg-red-100 text-red-700",
};
const statutLabel: Record<string, string> = {
  EN_ATTENTE: "En attente",
  APPROUVE: "Approuvé",
  REJETE: "Rejeté",
};

export default function AbonnementsView({ paiements }: { paiements: PaiementAboRow[] }) {
  const [rejet, setRejet] = useState<PaiementAboRow | null>(null);
  const [motif, setMotif] = useState("");
  const enAttente = paiements.filter((p) => p.statut === "EN_ATTENTE").length;

  const confirmerRejet = async () => {
    if (!rejet || !motif.trim()) return;
    const fd = new FormData();
    fd.set("id", String(rejet.id));
    fd.set("motif", motif.trim());
    await rejeterPaiement({}, fd);
    setRejet(null);
    setMotif("");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Vérification des abonnements</h1>
        <p className="text-sm text-muted-foreground">
          {enAttente > 0 ? `${enAttente} paiement${enAttente > 1 ? "s" : ""} à vérifier` : "Aucun paiement en attente"}
        </p>
      </div>

      <div className="space-y-3">
        {paiements.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border p-3 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              {/* Commerçant */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {p.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.boutique}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.commercantNom} · {p.telephone}</p>
                </div>
              </div>

              {/* Infos paiement */}
              <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 shrink-0">
                <div className="md:text-right">
                  <p className="text-sm font-bold text-gray-900">{p.montant.toLocaleString("fr-FR")} MRU</p>
                  <p className="text-xs text-muted-foreground">{p.methode} · {p.date}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${statutBadge[p.statut]}`}>
                  {statutLabel[p.statut]}
                </span>
              </div>
            </div>

            {/* Actions — seulement si en attente ou rejeté */}
            {(p.statut === "EN_ATTENTE" || (p.statut === "REJETE" && p.motifRejet)) && (
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t">
                <a
                  href={p.captureUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-vert-foncee hover:underline"
                >
                  <ExternalLink size={12} /> Voir la capture
                </a>

                {p.statut === "EN_ATTENTE" && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRejet(p)}
                      className="h-8 gap-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X size={14} /> Rejeter
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => approuverPaiement(p.id)}
                      className="h-8 gap-1 bg-vert-foncee text-white hover:opacity-90"
                    >
                      <Check size={14} /> Approuver
                    </Button>
                  </div>
                )}

                {p.statut === "REJETE" && p.motifRejet && (
                  <p className="text-xs text-red-600">Motif : {p.motifRejet}</p>
                )}
              </div>
            )}
          </div>
        ))}

        {paiements.length === 0 && (
          <div className="bg-white rounded-2xl border py-14 text-center text-muted-foreground text-sm">
            Aucun paiement soumis pour le moment
          </div>
        )}
      </div>

      {/* Dialog motif de rejet */}
      <Dialog open={!!rejet} onOpenChange={(o) => { if (!o) { setRejet(null); setMotif(""); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rejeter le paiement</DialogTitle>
            <DialogDescription>
              {rejet && `${rejet.boutique} — l'accès sera coupé immédiatement.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="motif">Motif du rejet</Label>
              <Textarea
                id="motif"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                placeholder="Ex: Paiement non reçu sur le compte Bankily."
                className="resize-none min-h-24"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setRejet(null); setMotif(""); }}>
                Annuler
              </Button>
              <Button
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
                onClick={confirmerRejet}
                disabled={!motif.trim()}
              >
                Confirmer le rejet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}