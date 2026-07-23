export const ESSAI_JOURS = 7;
export const ABONNEMENT_JOURS = 30;
export const PRIX_ABONNEMENT = 500;

export function dateFinEssai(): Date {
  return new Date(Date.now() + ESSAI_JOURS * 24 * 60 * 60 * 1000);
}

export type StatutAcces =
  | { acces: true; raison: "essai" | "abonne"; finLe: Date; joursRestants: number }
  | { acces: false; raison: "essai_termine" }
  | { acces: false; raison: "paiement_rejete"; motif: string | null };