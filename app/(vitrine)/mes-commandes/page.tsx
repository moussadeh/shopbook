import { getMesCommandes } from "@/lib/data/mes-commandes";
import MesCommandesView from "./mes-commandes-view";
import { redirect } from "next/navigation";

export const metadata = { title: "Mes commandes · ShopBook" };

export default async function MesCommandesPage() {
  const commandes = await getMesCommandes();
  if (commandes === null) redirect("/"); // non connecté → accueil
  return <MesCommandesView commandes={commandes} />;
}