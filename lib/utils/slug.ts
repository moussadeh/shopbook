import "server-only";
import prisma from "@/prisma/prisma";

// Transforme un texte en slug : minuscules, sans accents, tirets
export function slugify(texte: string): string {
  return texte
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // enlève les accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")  // tout ce qui n'est pas lettre/chiffre → tiret
    .replace(/^-+|-+$/g, "");      // pas de tiret au début/fin
}

// Génère un slug unique (ajoute -2, -3… si déjà pris)
export async function genererSlugUnique(nom: string, boutiqueIdActuelle?: number): Promise<string> {
  const base = slugify(nom) || "boutique";
  let slug = base;
  let n = 1;

  while (true) {
    const existe = await prisma.boutique.findUnique({
      where: { slug },
      select: { id: true },
    });
    // libre, ou c'est la boutique qu'on est en train de modifier
    if (!existe || existe.id === boutiqueIdActuelle) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}