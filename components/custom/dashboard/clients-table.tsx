import { Link, MoreVertical } from "lucide-react";

const clients = [
  { initials: "MA", name: "Mohamed Ahmed", credit: "4 500 MRU", status: "Partiellement payé", date: "18 Mai 2025" },
  { initials: "SK", name: "Sidi Kane",      credit: "8 500 MRU", status: "En cours",           date: "18 Mai 2025" },
  { initials: "MM", name: "Moussa Diop",    credit: "12 300 MRU",status: "En retard",           date: "17 Mai 2025" },
  { initials: "AM", name: "Aminata Mint Ali",credit:"2 500 MRU", status: "Payé",               date: "16 Mai 2025" },
  { initials: "BA", name: "Baba Ahmed",     credit: "5 800 MRU", status: "En cours",           date: "15 Mai 2025" },
];

function statusStyle(status: string) {
  switch (status) {
    case "En cours":           return "bg-green-100 text-green-700";
    case "Partiellement payé": return "bg-orange-100 text-orange-600";
    case "En retard":          return "bg-red-100 text-red-600";
    case "Payé":               return "bg-gray-100 text-gray-600";
    default:                   return "bg-gray-100 text-gray-600";
  }
}

export default function ClientsTable() {
    return (
        <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="px-4 md:px-5 py-4 border-b">
              <h2 className="text-sm font-bold text-gray-900">Clients avec crédits</h2>
            </div>

            {/* Table desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-gray-50/60">
                    <th className="text-left px-5 py-2.5 font-semibold text-muted-foreground">Client</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">Crédit total</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">Statut</th>
                    <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">Dernière activité</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {clients.map((c) => (
                    <tr key={c.name} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {c.initials}
                        </div>
                        <span className="font-semibold text-gray-800">{c.name}</span>
                      </td>
                      <td className="px-3 py-3 text-gray-700 font-medium">{c.credit}</td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{c.date}</td>
                      <td className="px-3 py-3">
                        <button className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground">
                          <MoreVertical size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Liste mobile */}
            <div className="md:hidden divide-y">
              {clients.map((c) => (
                <div key={c.name} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-vert-foncee text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.credit} · {c.date}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${statusStyle(c.status)}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-4 md:px-5 py-3 border-t">
              <Link href="/clients">
                <button className="w-full text-xs font-semibold text-vert-foncee border border-gray-200 rounded-xl py-2 hover:bg-gray-50 transition-colors">
                  Voir tous les clients
                </button>
              </Link>
            </div>
          </div>
    );
}