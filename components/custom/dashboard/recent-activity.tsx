import Link from "next/link";
import { CreditCard, Download, UserPlus } from "lucide-react";
import type { ActivityItem } from "@/lib/data/dashboard";

const conf = {
  payment:    { icon: Download,   bg: "bg-green-100",  color: "text-green-600",  titre: "Paiement reçu de" },
  credit:     { icon: CreditCard, bg: "bg-blue-100",   color: "text-blue-600",   titre: "Nouveau crédit pour" },
  new_client: { icon: UserPlus,   bg: "bg-orange-100", color: "text-orange-500", titre: "Nouveau client ajouté" },
} as const;

export default function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="bg-white rounded-2xl border p-4 md:p-5">
      <h2 className="text-sm font-bold text-gray-900 mb-4">Activité récente</h2>

      {activities.length === 0 ? (
        <p className="text-xs text-muted-foreground py-6 text-center">Aucune activité pour le moment</p>
      ) : (
        <div className="space-y-3">
          {activities.map((item) => {
            const c = conf[item.type];
            const Icon = c.icon;
            return (
              <div key={item.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl ${c.bg} ${c.color} flex items-center justify-center shrink-0`}>
                  <Icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {c.titre} <span className="font-bold">{item.name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                {item.amount && (
                  <span className={`text-xs font-bold shrink-0 ${item.amountPositive ? "text-green-600" : "text-red-500"}`}>
                    {item.amount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Link href="/activite" className="block mt-4 text-center text-xs font-semibold text-vert-foncee hover:underline py-1">
        Voir toute l&apos;activité →
      </Link>
    </div>
  );
}