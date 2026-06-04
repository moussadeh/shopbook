import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

export interface StatCard {
  label:    string;
  value:    string;
  unit?:    string;
  icon:     LucideIcon;
  trend?:   string;
  trendUp?: boolean;
  sub?:     string;
}

interface StatsCardsProps {
  stats: StatCard[];
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map(({ label, value, unit, icon: Icon, trend, trendUp, sub }) => (
        <div key={label} className="bg-white rounded-2xl border p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <div className="p-2 rounded-xl bg-green-50 text-vert-foncee shrink-0">
              <Icon size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xl md:text-2xl font-bold text-gray-900">
              {value}
              {unit && <span className="text-sm font-semibold text-muted-foreground ml-1">{unit}</span>}
            </p>
            {trend && (
              <p className={`text-xs font-medium flex items-center gap-0.5 ${trendUp ? "text-green-600" : "text-red-500"}`}>
                {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {trend}
              </p>
            )}
            {sub && !trend && (
              <p className="text-xs text-muted-foreground">{sub}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}