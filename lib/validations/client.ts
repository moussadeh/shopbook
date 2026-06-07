// lib/validations/client.ts
import { z } from "zod";

export const clientSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().optional(),
  telephone: z.string().min(1, "Le téléphone est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
});

export type ClientInput = z.infer<typeof clientSchema>;