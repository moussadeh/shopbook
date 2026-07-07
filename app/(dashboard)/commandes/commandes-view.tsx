"use client";

import { useState } from "react";
import { buildCommandesStats, statutLabel } from "@/lib/donnes/commandes";
import type { CommandeRow, CommandesStats } from "@/lib/data/commandes";
import StatsCards from "@/components/custom/dashboard/stats-cards";
import SearchBar from "@/components/custom/dashboard/composants/search-bar";
import { DesktopPagination, MobilePagination } from "@/components/custom/dashboard/composants/table-pagination";
import CommandesTable from "./commandes-table";
import CommandesCards from "./commandes-cards";
import CommandeDetailDialog from "./commande-detail-dialog";

const ITEMS_PER_PAGE = 8;
const FILTRES = ["Toutes", "Nouvelle", "En préparation", "Prête au retrait", "En livraison", "Récupérée", "Livrée", "Refusée", "Annulée"];

export default function CommandesView({ commandes, stats }: { commandes: CommandeRow[]; stats: CommandesStats }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Toutes");
  const [currentPage, setCurrentPage] = useState(1);
  const [detail, setDetail] = useState<CommandeRow | null>(null);

  const statCards = buildCommandesStats(stats);

  const handleSearch = (v: string) => { setSearch(v); setCurrentPage(1); };
  const handleFilter = (v: string) => { setFilter(v); setCurrentPage(1); };

  const filtered = commandes.filter((c) => {
    const matchSearch =
      c.acheteurNom.toLowerCase().includes(search.toLowerCase()) ||
      c.acheteurTel.includes(search) ||
      String(c.id).includes(search);
    const matchFilter = filter === "Toutes" || statutLabel[c.statut] === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="px-4 md:px-6 py-5 space-y-5 max-w-7xl mx-auto">
      <StatsCards stats={statCards} />

      <SearchBar
        value={search}
        onChange={handleSearch}
        placeholder="Rechercher (nom, téléphone, n°)..."
        filters={FILTRES}
        activeFilter={filter}
        onFilterChange={handleFilter}
        />

      {/* Desktop */}
      <div className="hidden md:block bg-white rounded-2xl border overflow-hidden">
        <CommandesTable commandes={paginated} onDetail={setDetail} />
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">Aucune commande</div>
        )}
        <DesktopPagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemLabel="commandes" onPageChange={setCurrentPage} />
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        <CommandesCards commandes={paginated} onDetail={setDetail} />
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm bg-white rounded-2xl border">Aucune commande</div>
        )}
        <MobilePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <CommandeDetailDialog commande={detail} open={!!detail} onOpenChange={(o) => { if (!o) setDetail(null); }} />
    </div>
  );
}