import { z } from "zod";

export const contactSchema = z.object({
  prenom:  z.string().trim().min(1, "Le prénom est requis"),
  nom:     z.string().trim().min(1, "Le nom est requis"),
  email:   z.email("Email invalide"),
  sujet:   z.string().trim().min(1, "Le sujet est requis"),
  message: z.string().trim().min(5, "Votre message est trop court"),
});