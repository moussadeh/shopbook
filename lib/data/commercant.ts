import "server-only";

import prisma from "@/prisma/prisma";
import { getCommercantId } from "@/lib/auth/auth";

export async function getCommercant() {
    const id = await getCommercantId();
    return prisma.commercant.findUnique({
        where: { id },
        select: { prenom: true, nom: true, nomBoutique: true },
    });
}