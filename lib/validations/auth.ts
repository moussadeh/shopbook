import { z } from "zod";

export const PROFILS = ["COMMERCANT", "CLIENT"] as const;

export const registerSchema = z.object({
  profil:     z.enum(PROFILS, { message: "Choisissez votre profil" }),
  prenom:     z.string().trim().min(1, "Le prénom est requis"),
  nom:        z.string().trim().min(1, "Le nom est requis"),
  telephone: z.string().regex(/^\+222\d{8}$/, "Numéro invalide (8 chiffres)"),
  motDePasse: z.string().min(6, "Au moins 6 caractères"),
  ville:      z.string().trim().optional(),
  quartier:   z.string().trim().optional(),
});

export const loginSchema = z.object({
  telephone: z.string().regex(/^\+222\d{8}$/, "Numéro invalide (8 chiffres)"),
  motDePasse: z.string().min(1, "Mot de passe requis"),
});
