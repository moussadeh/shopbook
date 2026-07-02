import { getMaBoutique } from "@/lib/data/boutique";
import MaBoutiqueView from "./ma-boutique-view";

export default async function MaBoutiquePage() {
  const boutique = await getMaBoutique();
  return <MaBoutiqueView boutique={boutique} />;
}