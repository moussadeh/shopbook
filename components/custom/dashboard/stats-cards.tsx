import { CreditCard, Download, Package, TrendingUp, Users } from "lucide-react";

const stats = [
  {
    label: "Crédits actifs",
    value: "125,500",
    unit: "MRU",
    change: "+12.5%",
    icon: CreditCard,
  },
  {
    label: "Paiements reçus",
    value: "75,300",
    unit: "MRU",
    change: "+8.2%",
    icon: Download,
  },
  {
    label: "Clients",
    value: "248",
    unit: "",
    change: "+18.7%",
    icon: Users,
  },
  {
    label: "Produits",
    value: "320",
    unit: "",
    change: "+5.4%",
    icon: Package,
  },
];

export default function StatsCards() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map(({ label, value, unit, change, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl border p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <div className="p-2 rounded-xl bg-green-50 text-vert-foncee shrink-0">
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-gray-900">
                  {value}
                  {unit && <span className="text-sm font-semibold text-muted-foreground ml-1">{unit}</span>}
                </p>
                <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-0.5">
                  <TrendingUp size={11} />
                  {change}
                </p>
              </div>
            </div>
          ))}
        </div>
    );
}