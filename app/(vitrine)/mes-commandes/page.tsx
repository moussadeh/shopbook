import { getMesCommandes } from "@/lib/data/mes-commandes";
import MesCommandesView from "./mes-commandes-view";
import { redirect } from "next/navigation";
import { getUtilisateurActuel } from "@/lib/auth/auth";

export const metadata = { title: "Mes commandes · ShopBook" };

export default async function MesCommandesPage() {
  const [commandes, utilisateur] = await Promise.all([
    getMesCommandes(),
    getUtilisateurActuel(),
  ]);

  if (commandes === null || !utilisateur) redirect("/");

  const nom = `${utilisateur.prenom} ${utilisateur.nom}`;
  return <MesCommandesView commandes={commandes} nom={nom} />;
}