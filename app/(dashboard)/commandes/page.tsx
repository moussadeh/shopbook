import { getCommandes, getCommandesStats, getBoutiqueId } from "@/lib/data/commandes";
import CommandesView from "./commandes-view";
import AucuneBoutique from "../produits/aucune-boutique";

export default async function CommandesPage() {
  const boutiqueId = await getBoutiqueId();
  if (!boutiqueId) return <AucuneBoutique />;

  const [commandes, stats] = await Promise.all([getCommandes(), getCommandesStats()]);
  return <CommandesView commandes={commandes} stats={stats} />;
}