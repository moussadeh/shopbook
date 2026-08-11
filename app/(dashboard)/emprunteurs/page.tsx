import { getEmprunteurs, getEmprunteursStats } from "@/lib/data/emprunteurs";
import EmprunteursView from "./emprunteurs-view";

export default async function EmprunteursPage() {
  const [emprunteurs, stats] = await Promise.all([getEmprunteurs(), getEmprunteursStats()]);
  return <EmprunteursView emprunteurs={emprunteurs} stats={stats} />;
}