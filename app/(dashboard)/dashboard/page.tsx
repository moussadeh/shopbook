import { getDashboardData } from "@/lib/data/dashboard";
import { buildDashboardStats } from "@/lib/donnes/dashboard";
import StatsCards from "@/components/custom/dashboard/stats-cards";
import RecentActivity from "@/components/custom/dashboard/recent-activity";
import CreditDistribution from "@/components/custom/dashboard/credit-distribution";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="px-4 md:px-6 py-5 space-y-5 max-w-7xl mx-auto">
      <StatsCards stats={buildDashboardStats(data.stats)} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentActivity activities={data.activities} />
        <CreditDistribution segments={data.distribution.segments} total={data.distribution.total} />
      </div>
    </div>
  );
}