import { getCommandes, getCommandesStats } from "@/lib/data/commandes";
import CommandesView from "./commandes-view";

export default async function CommandesPage() {
  const [commandes, stats] = await Promise.all([getCommandes(), getCommandesStats()]);
  return <CommandesView commandes={commandes} stats={stats} />;
}