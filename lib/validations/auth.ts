import { z } from "zod";

export const registerSchema = z.object({
  prenom:      z.string().trim().min(1, "Le prénom est requis"),
  nom:         z.string().trim().min(1, "Le nom est requis"),
  nomBoutique: z.string().trim().min(1, "Le nom de la boutique est requis"),
  telephone:   z.string().trim().min(8, "Numéro de téléphone invalide"),
  email:       z.string().trim().email("Email invalide"),
  ville:       z.string().trim().min(1, "La ville est requise"),
  quartier:    z.string().trim().min(1, "Le quartier est requis"),
  pays:        z.string().trim().min(1),
  motDePasse:  z.string().min(6, "Au moins 6 caractères"),
});

export const loginSchema = z.object({
  // email:      z.string().trim().email("Email invalide"),
  telephone:   z.string().trim().min(8, "Numéro de téléphone invalide"),
  motDePasse: z.string().min(1, "Mot de passe requis"),
});