import { getBoutiquePublique } from "@/lib/data/boutique-publique";
import BoutiqueFermee from "./boutique-fermee";
import VitrineView from "./vitrine-view";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const res = await getBoutiquePublique(slug);
  if (res && res.active) {
    return { title: `${res.vitrine.nom} · ShopBook` };
  }
  return { title: "Boutique · ShopBook" };
}

export default async function BoutiquePage({ params }: Props) {
  const { slug } = await params;
  const res = await getBoutiquePublique(slug);

  if (!res) notFound();              // slug inexistant → 404
  if (!res.active) return <BoutiqueFermee />; // boutique hors ligne → page douce

  return <VitrineView vitrine={res.vitrine} />;
}