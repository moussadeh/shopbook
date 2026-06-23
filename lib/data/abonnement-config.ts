export const ESSAI_JOURS = 14;
export const ABONNEMENT_JOURS = 30;
export const PRIX_ABONNEMENT = 300; // MRU

export type StatutAcces =
  | { acces: true;  raison: "essai" | "abonne"; finLe: Date; joursRestants: number }
  | { acces: false; raison: "essai_termine" }
  | { acces: false; raison: "paiement_rejete"; motif: string | null }
  | { acces: false; raison: "en_attente" };