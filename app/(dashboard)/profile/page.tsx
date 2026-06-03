import DashboardHeader from "@/components/custom/dashboard/dashboard-header";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50/60">
      <DashboardHeader />
      <div className="px-4 md:px-6 py-5 space-y-5 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800">Profil</h1>
      </div>
    </div>
  );
}
