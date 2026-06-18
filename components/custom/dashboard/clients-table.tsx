import Link from "next/link";
import type { TopClient } from "@/lib/data/dashboard";
import { statusStyle, statutCreditLabel, formatMRU } from "@/lib/donnes/credits";

export default function ClientsTable({ clients }: { clients: TopClient[] }) {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <div className="px-4 md:px-5 py-4 border-b">
        <h2 className="text-sm font-bold text-gray-900">Clients avec crédits</h2>
      </div>

      {/* desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b bg-gray-50/60">
              <th className="text-left px-5 py-2.5 font-semibold text-muted-foreground">Client</th>
              <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">Restant dû</th>
              <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">Statut</th>
              <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">Dernière activité</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {clients.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-3 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">{c.initials}</div>
                  <span className="font-semibold text-gray-800">{c.name}</span>
                </td>
                <td className="px-3 py-3 text-gray-700 font-medium">{formatMRU(c.creditTotal)}</td>
                <td className="px-3 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle(statutCreditLabel[c.statut])}`}>
                    {statutCreditLabel[c.statut]}
                  </span>
                </td>
                <td className="px-3 py-3 text-muted-foreground">{c.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile */}
      <div className="md:hidden divide-y">
        {clients.map((c) => (
          <div key={c.id} className="px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">{c.initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
              <p className="text-xs text-muted-foreground">{formatMRU(c.creditTotal)} · {c.lastActivity}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${statusStyle(statutCreditLabel[c.statut])}`}>
              {statutCreditLabel[c.statut]}
            </span>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="py-10 text-center text-muted-foreground text-sm">Aucun client avec crédit</div>
      )}

      <div className="px-4 md:px-5 py-3 border-t">
        <Link href="/clients" className="block text-center text-xs font-semibold text-vert-foncee border border-gray-200 rounded-xl py-2 hover:bg-gray-50 transition-colors">
          Voir tous les clients
        </Link>
      </div>
    </div>
  );
}