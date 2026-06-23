"use client";

import { useState } from "react";
import { buildCreditsStats, STATUTS_CREDIT, statutCreditLabel } from "@/lib/donnes/credits";
import type { CreditRow, CreditsStats, ClientOption } from "@/lib/data/credits";
import { deleteCredit } from "./actions";
import StatsCards from "@/components/custom/dashboard/stats-cards";
import SearchBar from "@/components/custom/dashboard/composants/search-bar";
import { DesktopPagination, MobilePagination } from "@/components/custom/dashboard/composants/table-pagination";

import CreditsTable from "./credits-table";
import CreditsCards from "./credits-cards";
import CreditFormDialog from "./credit-form-dialog";
import CreditDetailDialog from "./credit-detail-dialog";
import PaiementDialog from "./paiement-dialog";

const ITEMS_PER_PAGE = 5;

export default function CreditsView({
  credits,
  stats,
  clients,
}: {
  credits: CreditRow[];
  stats: CreditsStats;
  clients: ClientOption[];
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<CreditRow | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<CreditRow | null>(null);

  const [paiementOpen, setPaiementOpen] = useState(false);
  const [paiementCible, setPaiementCible] = useState<CreditRow | null>(null);

  const statCards = buildCreditsStats(stats);

  const handleSearch = (v: string) => { setSearch(v); setCurrentPage(1); };
  const handleFilter = (v: string) => { setFilter(v); setCurrentPage(1); };

  const openNew      = () => { setSelected(null); setFormOpen(true); };
  const openEdit     = (c: CreditRow) => { setSelected(c); setFormOpen(true); };
  const openDetail   = (c: CreditRow) => { setDetail(c); setDetailOpen(true); };
  const openPaiement = (c: CreditRow) => { setPaiementCible(c); setPaiementOpen(true); };

  const handleDelete = async (c: CreditRow) => {
    if (!confirm(`Supprimer le crédit de ${c.clientName} ?`)) return;
    await deleteCredit(c.id);
  };

  const filtered = credits.filter((c) => {
    const matchSearch =
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Tous" || statutCreditLabel[c.statut] === filter;
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
          placeholder="Rechercher un crédit ou client..."
          filters={STATUTS_CREDIT}
          activeFilter={filter}
          onFilterChange={handleFilter}
          onNew={openNew}
          newLabel="Nouveau crédit"
        />

        {/* Desktop */}
        <div className="hidden md:block bg-white rounded-2xl border overflow-hidden">
          <CreditsTable
            credits={paginated}
            onDetail={openDetail}
            onEdit={openEdit}
            onDelete={handleDelete}
            onPaiement={openPaiement}
          />
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">Aucun crédit trouvé</div>
          )}
          <DesktopPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemLabel="crédits"
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-3">
          <CreditsCards credits={paginated} onDetail={openDetail} onPaiement={openPaiement} onEdit={openEdit} onDelete={handleDelete} />
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm bg-white rounded-2xl border">Aucun crédit trouvé</div>
          )}
          <MobilePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      <CreditFormDialog open={formOpen} onOpenChange={setFormOpen} credit={selected} clients={clients} />
      <CreditDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        credit={detail}
        onEdit={(c: CreditRow) => { setDetailOpen(false); openEdit(c); }}
        onPaiement={(c: CreditRow) => { setDetailOpen(false); openPaiement(c); }}
      />
      <PaiementDialog open={paiementOpen} onOpenChange={setPaiementOpen} credit={paiementCible} />
    </div>
  );
}