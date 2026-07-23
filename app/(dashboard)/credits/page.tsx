import { getCredits, getCreditsStats, getEmprunteursOptions } from "@/lib/data/credits";
import CreditsView from "./credits-view";

export default async function CreditsPage() {
  const [credits, stats, emprunteurs] = await Promise.all([
    getCredits(),
    getCreditsStats(),
    getEmprunteursOptions(),
  ]);

  return <CreditsView credits={credits} stats={stats} emprunteurs={emprunteurs} />;
}