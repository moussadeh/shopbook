import type { DonutSegment } from "@/lib/data/dashboard";
import { donutColor } from "@/lib/donnes/dashboard";
import { statutCreditLabel } from "@/lib/donnes/credits";

export default function DonutChart({ segments, total }: { segments: DonutSegment[]; total: number }) {
  const r = 80, cx = 110, cy = 110;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <svg width={220} height={220} viewBox="0 0 220 220">
        {segments.map((seg) => {
          const dash = (seg.pct / 100) * circ;
          const el = (
            <circle
              key={seg.statut}
              cx={cx} cy={cy} r={r} fill="none"
              stroke={donutColor[seg.statut]} strokeWidth={36}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
          offset += dash;
          return el;
        })}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="18" fontWeight="700" fill="#166534">
          {total.toLocaleString("fr-FR")}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="12" fill="#6b7280">MRU</text>
      </svg>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full">
        {segments.map((seg) => (
          <div key={seg.statut} className="flex items-start gap-2">
            <span className="mt-1 w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: donutColor[seg.statut] }} />
            <div>
              <p className="text-xs font-semibold text-gray-700">{statutCreditLabel[seg.statut]}</p>
              <p className="text-xs text-muted-foreground">{seg.pct}% ({seg.montant.toLocaleString("fr-FR")} MRU)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}