import DashboardHeader from "@/components/custom/dashboard/dashboard-header";
import Sidebar from "@/components/custom/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
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