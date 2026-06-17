import type { getClients } from "@/lib/actions/clients";

export type ClientRow = Awaited<ReturnType<typeof getClients>>[number];