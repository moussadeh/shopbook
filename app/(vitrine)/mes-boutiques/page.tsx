import { getMesBoutiques } from "@/lib/data/mes-boutiques";
import { getUtilisateurActuel } from "@/lib/auth/auth";
import MesBoutiquesView from "./mes-boutiques-view";
import { redirect } from "next/navigation";

export const metadata = { title: "Mes boutiques · ShopBook" };

export default async function MesBoutiquesPage() {
  const [boutiques, utilisateur] = await Promise.all([
    getMesBoutiques(),
    getUtilisateurActuel(),
  ]);

  if (boutiques === null || !utilisateur) redirect("/");

  const nom = `${utilisateur.prenom} ${utilisateur.nom}`;
  return <MesBoutiquesView boutiques={boutiques} nom={nom} />;
}