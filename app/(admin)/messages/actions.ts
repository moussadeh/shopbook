"use server";

import prisma from "@/prisma/prisma";
import { exigerAdmin } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";

export async function marquerLu(id: number, lu: boolean) {
  await exigerAdmin();
  await prisma.messageContact.update({
    where: { id },
    data: { lu, dateLecture: lu ? new Date() : null },
  });
  revalidatePath("/messages");
}

export async function marquerRepondu(id: number, repondu: boolean) {
  await exigerAdmin();
  await prisma.messageContact.update({
    where: { id },
    data: { repondu, dateReponse: repondu ? new Date() : null },
  });
  revalidatePath("/messages");
}