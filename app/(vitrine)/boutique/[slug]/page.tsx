import { getBoutiquePublique } from "@/lib/data/boutique-publique";
import { getUtilisateurActuel } from "@/lib/auth/auth";
import BoutiqueFermee from "./boutique-fermee";
import VitrineView from "./vitrine-view";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const res = await getBoutiquePublique(slug);
  if (res && res.active) return { title: `${res.vitrine.nom} · ShopBook` };
  return { title: "Boutique · ShopBook" };
}

export default async function BoutiquePage({ params }: Props) {
  const { slug } = await params;
  const res = await getBoutiquePublique(slug);

  if (!res) notFound();
  if (!res.active) return <BoutiqueFermee />;

  const utilisateur = await getUtilisateurActuel();
  const estProprietaire = utilisateur?.commercant?.id === res.commercantId;
  const estCommercant = !!utilisateur?.commercant;

  const client = utilisateur
    ? { nom: `${utilisateur.prenom} ${utilisateur.nom}`, telephone: utilisateur.telephone }
    : null;

  return (
    <VitrineView
      vitrine={res.vitrine}
      slug={slug}
      client={client}
      estProprietaire={estProprietaire}
      estCommercant={estCommercant}
    />
  );
}