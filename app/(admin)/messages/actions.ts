"use server";

import prisma from "@/prisma/prisma";
import { exigerAdmin } from "@/lib/auth/abonnement";
import { revalidatePath } from "next/cache";

export async function marquerLu(id: number, lu: boolean) {
  await exigerAdmin();
  await prisma.messageContact.update({ where: { id }, data: { lu } });
  revalidatePath("/messages");
}