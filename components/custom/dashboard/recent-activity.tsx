import { Clock, CreditCard, Download, Link, UserPlus } from "lucide-react";

const recentActivity = [
  {
    type: "payment",
    icon: Download,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Paiement reçu de",
    name: "Mohamed Ahmed",
    time: "Il y a 10 min",
    amount: "+5,000 MRU",
    amountColor: "text-green-600",
  },
  {
    type: "credit",
    icon: CreditCard,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Nouveau crédit pour",
    name: "Sidi Kane",
    time: "Il y a 1 heure",
    amount: "+8,500 MRU",
    amountColor: "text-green-600",
  },
  {
    type: "payment",
    icon: Download,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Paiement reçu de",
    name: "Aminata Mint Ali",
    time: "Il y a 2 heures",
    amount: "+2,500 MRU",
    amountColor: "text-green-600",
  },
  {
    type: "late",
    icon: Clock,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    title: "Crédit en retard –",
    name: "Moussa Diop",
    time: "Il y a 3 heures",
    amount: "-1,500 MRU",
    amountColor: "text-red-500",
  },
  {
    type: "new_client",
    icon: UserPlus,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    title: "Nouveau client ajouté",
    name: "Abdoulaye Ould",
    time: "Il y a 5 heures",
    amount: "",
    amountColor: "",
  },
];

const donutSegments = [
  { label: "En cours",          pct: 65, amount: "81,575 MRU", color: "#166534" },
  { label: "Partiellement payé", pct: 20, amount: "25,100 MRU", color: "#f59e0b" },
  { label: "Payé",              pct: 10, amount: "12,550 MRU", color: "#fcd34d" },
  { label: "En retard",         pct:  5, amount:  "6,275 MRU", color: "#1f2937" },
];

function DonutChart() {
  const r = 80;
  const cx = 110;
  const cy = 110;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  const segments = donutSegments.map((seg) => {
    const dash = (seg.pct / 100) * circumference;
    const gap  = circumference - dash;
    const el = (
      <circle
        key={seg.label}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={seg.color}
        strokeWidth={36}
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        strokeLinecap="butt"
      />
    );
    // eslint-disable-next-line react-hooks/immutability
    offset += dash;
    return el;
  });

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative flex items-center justify-center">
        <svg width={220} height={220} viewBox="0 0 220 220">
          {segments}
          <text x={cx} y={cy - 8} textAnchor="middle" fontSize="18" fontWeight="700" fill="#166534">
            125,500
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fontSize="12" fill="#6b7280">
            MRU
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full">
        {donutSegments.map((seg) => (
          <div key={seg.label} className="flex items-start gap-2">
            <span
              className="mt-1 w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <div>
              <p className="text-xs font-semibold text-gray-700">{seg.label}</p>
              <p className="text-xs text-muted-foreground">{seg.pct}% ({seg.amount})</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RecentActivity() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Activité récente */}
          <div className="bg-white rounded-2xl border p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900">Activité récente</h2>
            </div>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}>
                    <item.icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {item.title} <span className="font-bold">{item.name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  {item.amount && (
                    <span className={`text-xs font-bold shrink-0 ${item.amountColor}`}>
                      {item.amount}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <Link href="/activite">
              <button className="mt-4 w-full text-xs font-semibold text-vert-foncee hover:underline py-1">
                Voir toute l&apos;activité →
              </button>
            </Link>
          </div>

          {/* Répartition des crédits */}
          <div className="bg-white rounded-2xl border p-4 md:p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Répartition des crédits</h2>
            <DonutChart />
          </div>
        </div>
    );
}