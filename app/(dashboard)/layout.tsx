import DashboardHeader from "@/components/custom/dashboard/dashboard-header";
import Sidebar from "@/components/custom/sidebar";
import { exigerAcces } from "@/lib/auth/abonnement";
import { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await exigerAcces(); // bloque l'accès si essai fini & pas d'abonnement actif
  
  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <DashboardHeader />
        {children}
      </main>
    </div>
  );
}