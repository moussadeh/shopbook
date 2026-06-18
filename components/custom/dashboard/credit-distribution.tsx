import type { DonutSegment } from "@/lib/data/dashboard";
import DonutChart from "./donut-chart";

export default function CreditDistribution({ segments, total }: { segments: DonutSegment[]; total: number }) {
  return (
    <div className="bg-white rounded-2xl border p-4 md:p-5">
      <h2 className="text-sm font-bold text-gray-900 mb-4">Répartition des crédits</h2>
      {total === 0 ? (
        <p className="text-xs text-muted-foreground py-6 text-center">Aucun crédit pour le moment</p>
      ) : (
        <DonutChart segments={segments} total={total} />
      )}
    </div>
  );
}