import { getStatutAcces } from "@/lib/auth/abonnement";
import PaiementForm from "./paiement-form"; // client, useActionState + upload

export default async function AbonnementPage() {
  const statut = await getStatutAcces();

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      {statut.acces ? (
        <div className="rounded-2xl border bg-green-50 text-green-800 p-5">
          <p className="font-semibold">
            {statut.raison === "essai"
              ? `Essai gratuit — ${statut.joursRestants} jour(s) restant(s)`
              : `Abonnement actif jusqu'au ${statut.finLe.toLocaleDateString("fr-FR")}`}
          </p>
          <p className="text-sm mt-1">Vous pouvez renouveler à tout moment ci-dessous.</p>
        </div>
      ) : statut.raison === "paiement_rejete" ? (
        <div className="rounded-2xl border bg-red-50 text-red-800 p-5">
          <p className="font-semibold">Votre dernier paiement n&apos;a pas été reçu</p>
          <p className="text-sm mt-1">{statut.motif ?? "Merci de renouveler votre paiement pour réactiver votre boutique."}</p>
        </div>
      ) : (
        <div className="rounded-2xl border bg-amber-50 text-amber-800 p-5">
          <p className="font-semibold">Accès restreint</p>
          <p className="text-sm mt-1">Abonnez-vous pour continuer à utiliser ShopBook.</p>
        </div>
      )}

      <PaiementForm />
    </div>
  );
}