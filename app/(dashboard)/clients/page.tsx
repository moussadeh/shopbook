import { getClients, getClientsStats } from "@/lib/data/clients";
import ClientsView from "./clients-view";

export default async function ClientsPage() {
  const [clients, stats] = await Promise.all([getClients(), getClientsStats()]);
  return <ClientsView clients={clients} stats={stats} />;
}