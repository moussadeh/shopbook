"use client";

import StatsCards from "@/components/custom/dashboard/stats-cards";
import RecentActivity from "@/components/custom/dashboard/recent-activity";
import ClientsTable from "@/components/custom/dashboard/clients-table";
import ProductsList from "@/components/custom/dashboard/products-list";
import DashboardHeader from "@/components/custom/dashboard/dashboard-header";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50/60">
      <DashboardHeader />
      <div className="px-4 md:px-6 py-5 space-y-5 max-w-7xl mx-auto">
        <StatsCards />
        <RecentActivity />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ClientsTable />
          <ProductsList />
        </div>
      </div>
    </div>
  );
}