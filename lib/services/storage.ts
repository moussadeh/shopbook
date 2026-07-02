import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const BUCKET = "preuves-paiement";

// Upload une capture, renvoie le CHEMIN interne (pas l'URL publique, car bucket privé)
export async function uploadCapture(file: File, commercantId: number): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const chemin = `commercant-${commercantId}/${Date.now()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(chemin, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[uploadCapture] échec:", error);
    throw new Error("Échec de l'upload de la capture.");
  }

  return chemin; // ex: "commercant-1/1719...jpg"
}

// Génère un lien temporaire signé (pour que l'admin voie la capture)
export async function getCaptureUrl(chemin: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(chemin, 60 * 60); // valable 1h

  if (error) {
    console.error("[getCaptureUrl] échec:", error);
    return null;
  }
  return data.signedUrl;
}

export async function uploadImageProduit(file: File, produitId: number): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const chemin = `produit-${produitId}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("produits")
    .upload(chemin, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[uploadImageProduit] échec:", error);
    throw new Error("Échec de l'upload de l'image.");
  }

  // bucket public → URL directe
  const { data } = supabase.storage.from("produits").getPublicUrl(chemin);
  return data.publicUrl;
}



// import "server-only";

// export async function uploadCapture(file: File, commercantId: number): Promise<string> {
//   console.log("[uploadCapture] capture reçue :", {
//     commercantId,
//     nom: file.name,
//     taille: `${(file.size / 1024).toFixed(1)} Ko`,
//     type: file.type,
//   });

//   const fakeUrl = `placeholder://captures/${commercantId}-${Date.now()}-${file.name}`;
//   console.log("[uploadCapture] URL factice enregistrée :", fakeUrl);
//   return fakeUrl;
// }