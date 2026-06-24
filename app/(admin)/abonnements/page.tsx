import { getPaiementsAbo } from "@/lib/data/admin";
import AbonnementsView from "./abonnements-view";

export default async function AbonnementsPage() {
  const paiements = await getPaiementsAbo();
  return <AbonnementsView paiements={paiements} />;
}