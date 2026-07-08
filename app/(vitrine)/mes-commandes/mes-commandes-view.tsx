"use client";

import Link from "next/link";
import { useState } from "react";
import { Truck, ShoppingBag, ChevronDown, Package, PackageCheck, Store } from "lucide-react";
import type { MaCommande } from "@/lib/data/mes-commandes";
import { statutLabel, statutStyle, paiementLabel, formatMRU } from "@/lib/donnes/commandes";

export default function MesCommandesView({ commandes }: { commandes: MaCommande[] }) {
  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* En-tête simple */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">
            <span className="text-vert-foncee">Shop</span><span className="text-orange">Book</span>
          </Link>
          <span className="text-sm font-semibold text-gray-700">Mes commandes</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 space-y-3">
        {commandes.length === 0 ? (
          <div className="bg-white rounded-2xl border py-16 text-center">
            <Package size={40} className="mx-auto text-muted-foreground opacity-40 mb-3" />
            <p className="text-sm text-muted-foreground">Vous n&apos;avez pas encore de commande.</p>
            <Link href="/" className="inline-block mt-4 text-sm font-semibold text-vert-foncee hover:underline">
              Retour à l&apos;accueil
            </Link>
          </div>
        ) : (
          commandes.map((c) => <CommandeItem key={c.id} commande={c} />)
        )}
      </div>
    </div>
  );
}

function CommandeItem({ commande }: { commande: MaCommande }) {
  const [ouvert, setOuvert] = useState(false);
  const finie = ["RECUPEREE", "LIVREE"].includes(commande.statut);
  const annulee = ["REFUSEE", "ANNULEE"].includes(commande.statut);

  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      {/* En-tête */}
      <button onClick={() => setOuvert((v) => !v)} className="w-full text-left p-4 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${finie ? "bg-green-50 text-vert-foncee" : "bg-gray-100 text-gray-500"}`}>
          {finie ? <PackageCheck size={20} /> : <Package size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{commande.boutiqueNom}</p>
          <p className="text-xs text-muted-foreground">#{commande.id} · {commande.date}</p>
        </div>
        <div className="text-right shrink-0">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statutStyle[commande.statut]}`}>
            {statutLabel[commande.statut]}
          </span>
        </div>
        <ChevronDown size={16} className={`text-muted-foreground transition ${ouvert ? "rotate-180" : ""}`} />
      </button>

      {/* Détail */}
      {ouvert && (
        <div className="px-4 pb-4 space-y-4 border-t pt-4">
          {/* Mode */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            {commande.mode === "LIVRAISON" ? <Truck size={15} className="text-vert-foncee" /> : <ShoppingBag size={15} className="text-vert-foncee" />}
            {commande.mode === "LIVRAISON" ? "Livraison" : "Retrait en boutique"}
            {commande.mode === "LIVRAISON" && commande.adresse && <span className="text-muted-foreground">· {commande.adresse}</span>}
          </div>

          {/* Timeline (sauf si annulée) */}
          {!annulee && <Timeline statut={commande.statut} mode={commande.mode} />}

          {/* Articles */}
          <div className="space-y-1.5">
            {commande.lignes.map((l, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">{l.quantite}× {l.nom}</span>
                <span className="font-medium">{formatMRU(l.prixUnitaire * l.quantite)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t pt-1.5 font-bold">
              <span>Total</span><span>{formatMRU(commande.total)}</span>
            </div>
          </div>

          {/* Paiement */}
          <div className="flex items-center justify-between text-sm bg-gray-50 rounded-xl p-3">
            {commande.boutiqueSlug && (
            <Link
                href={`/boutique/${commande.boutiqueSlug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-vert-foncee hover:underline"
            >
                <Store size={14} /> Revoir la boutique
            </Link>
            )}
            <span className={`font-semibold ${commande.statutPaiement === "PAYEE" ? "text-green-600" : "text-amber-600"}`}>
              {commande.statutPaiement === "PAYEE" ? "Payée" : "À payer à la réception"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Timeline de suivi adaptée au mode
function Timeline({ statut, mode }: { statut: string; mode: string }) {
  const etapes =
    mode === "LIVRAISON"
      ? [
          { cle: "NOUVELLE", label: "Reçue" },
          { cle: "EN_PREPARATION", label: "En préparation" },
          { cle: "EN_LIVRAISON", label: "En livraison" },
          { cle: "LIVREE", label: "Livrée" },
        ]
      : [
          { cle: "NOUVELLE", label: "Reçue" },
          { cle: "EN_PREPARATION", label: "En préparation" },
          { cle: "PRETE", label: "Prête" },
          { cle: "RECUPEREE", label: "Récupérée" },
        ];

  const ordre = etapes.map((e) => e.cle);
  const indexActuel = ordre.indexOf(statut);

  return (
    <div className="flex items-center">
      {etapes.map((e, i) => {
        const atteint = i <= indexActuel;
        return (
          <div key={e.cle} className="flex-1 flex flex-col items-center relative">
            {/* ligne */}
            {i > 0 && (
              <div className={`absolute right-1/2 top-2 h-0.5 w-full -z-0 ${i <= indexActuel ? "bg-vert-foncee" : "bg-gray-200"}`} />
            )}
            <div className={`w-4 h-4 rounded-full z-10 ${atteint ? "bg-vert-foncee" : "bg-gray-200"}`} />
            <span className={`text-[10px] mt-1.5 text-center ${atteint ? "text-gray-800 font-medium" : "text-muted-foreground"}`}>
              {e.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}