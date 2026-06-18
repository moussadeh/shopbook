import { getCredits, getCreditsStats, getClientsOptions } from "@/lib/data/credits";
import CreditsView from "./credits-view";

export default async function CreditsPage() {
  const [credits, stats, clients] = await Promise.all([
    getCredits(),
    getCreditsStats(),
    getClientsOptions(),
  ]);

  return <CreditsView credits={credits} stats={stats} clients={clients} />;
}