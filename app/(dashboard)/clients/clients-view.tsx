"use client";

import { useState } from "react";
import { buildClientsStats, STATUTS } from "@/lib/donnes/clients";
import type { ClientRow, ClientsStats } from "@/lib/data/clients";
import { deleteClient } from "./actions";
import StatsCards from "@/components/custom/dashboard/stats-cards";
import SearchBar from "@/components/custom/dashboard/composants/search-bar";
import {
  DesktopPagination, MobilePagination,
} from "@/components/custom/dashboard/composants/table-pagination";

import ClientsTable from "./clients-table";
import ClientsCards from "./clients-cards";
import ClientFormDialog from "./client-form-dialog";
import ClientDetailDialog from "./client-detail-dialog";

const ITEMS_PER_PAGE = 5;

export default function ClientsView({ clients, stats }: { clients: ClientRow[]; stats: ClientsStats }) {
  const statCards = buildClientsStats(stats);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<ClientRow | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<ClientRow | null>(null);

  const handleSearch = (v: string) => { setSearch(v); setCurrentPage(1); };
  const handleFilter = (v: string) => { setFilter(v); setCurrentPage(1); };

  const openNew    = () => { setSelected(null); setFormOpen(true); };
  const openEdit   = (c: ClientRow) => { setSelected(c); setFormOpen(true); };
  const openDetail = (c: ClientRow) => { setDetail(c); setDetailOpen(true); };

  const handleDelete = async (c: ClientRow) => {
    if (!confirm(`Supprimer ${c.name} ?`)) return;
    await deleteClient(c.id);
  };

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) || c.telephone.includes(search);
    const matchFilter = filter === "Tous" || c.statut === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
          <ClientsTable
            clients={paginated}
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
          <ClientsCards clients={paginated} onDetail={openDetail} />
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm bg-white rounded-2xl border">
              Aucun client trouvé
            </div>
          )}
          <MobilePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <ClientFormDialog open={formOpen} onOpenChange={setFormOpen} client={selected} />
      <ClientDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        client={detail}
        onEdit={(c) => { setDetailOpen(false); openEdit(c); }}
      />
    </div>
  );
}