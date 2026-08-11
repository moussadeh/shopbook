"use client";

import { useState } from "react";
import { buildEmprunteursStats, STATUTS } from "@/lib/donnes/emprunteurs";
import type { EmprunteurRow, EmprunteursStats } from "@/lib/data/emprunteurs";
import { deleteEmprunteur } from "./actions";
import StatsCards from "@/components/custom/dashboard/stats-cards";
import SearchBar from "@/components/custom/dashboard/composants/search-bar";
import { DesktopPagination, MobilePagination } from "@/components/custom/dashboard/composants/table-pagination";

import EmprunteursTable from "./emprunteurs-table";
import EmprunteursCards from "./emprunteurs-cards";
import EmprunteurFormDialog from "./emprunteur-form-dialog";
import EmprunteurDetailDialog from "./emprunteur-detail-dialog";

const ITEMS_PER_PAGE = 5;

export default function EmprunteursView({
  emprunteurs,
  stats,
}: {
  emprunteurs: EmprunteurRow[];
  stats: EmprunteursStats;
}) {
  const statCards = buildEmprunteursStats(stats);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<EmprunteurRow | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<EmprunteurRow | null>(null);

  const handleSearch = (v: string) => { setSearch(v); setCurrentPage(1); };
  const handleFilter = (v: string) => { setFilter(v); setCurrentPage(1); };

  const openNew    = () => { setSelected(null); setFormOpen(true); };
  const openEdit   = (e: EmprunteurRow) => { setSelected(e); setFormOpen(true); };
  const openDetail = (e: EmprunteurRow) => { setDetail(e); setDetailOpen(true); };

  const handleDelete = async (e: EmprunteurRow) => {
    const msg = e.creditCount > 0
      ? `Supprimer ${e.name} ? Ses ${e.creditCount} crédit(s) et leurs paiements seront aussi effacés.`
      : `Supprimer ${e.name} ?`;
    if (!confirm(msg)) return;
    await deleteEmprunteur(e.id);
  };

  const filtered = emprunteurs.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) || e.telephone.includes(search);
    const matchFilter = filter === "Tous" || e.statut === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="px-4 md:px-6 py-5 space-y-5 max-w-7xl mx-auto">
        <StatsCards stats={statCards} />

        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Rechercher un client..."
          filters={STATUTS}
          activeFilter={filter}
          onFilterChange={handleFilter}
          onNew={openNew}
          newLabel="Nouveau client"
        />

        {/* Desktop */}
        <div className="hidden md:block bg-white rounded-2xl border overflow-hidden">
          <EmprunteursTable
            emprunteurs={paginated}
            onDetail={openDetail}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">Aucun client trouvé</div>
          )}
          <DesktopPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemLabel="clients"
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-3">
          <EmprunteursCards emprunteurs={paginated} onDetail={openDetail} onEdit={openEdit} onDelete={handleDelete} />
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm bg-white rounded-2xl border">
              Aucun client trouvé
            </div>
          )}
          <MobilePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      <EmprunteurFormDialog open={formOpen} onOpenChange={setFormOpen} emprunteur={selected} />
      <EmprunteurDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        emprunteur={detail}
        onEdit={(e) => { setDetailOpen(false); openEdit(e); }}
      />
    </div>
  );
}