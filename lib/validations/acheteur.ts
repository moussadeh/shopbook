import { z } from "zod";

export const registerAcheteurSchema = z.object({
  nom:        z.string().trim().min(1, "Votre nom est requis"),
  telephone:  z.string().trim().min(8, "Numéro de téléphone invalide"),
  motDePasse: z.string().min(6, "Au moins 6 caractères"),
});

export const loginAcheteurSchema = z.object({
  telephone:  z.string().trim().min(8, "Numéro invalide"),
  motDePasse: z.string().min(1, "Mot de passe requis"),
});