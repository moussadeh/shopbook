"use client";

import { useState } from "react";
import { buildCreditsStats, STATUTS_CREDIT, statutCreditLabel } from "@/lib/donnes/credits";
import type { EmprunteurCreditRow, CreditRow, CreditsStats, EmprunteurOption } from "@/lib/data/credits";
import { deleteCredit, annulerDernierPaiement } from "./actions";
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
  emprunteurs,
}: {
  credits: EmprunteurCreditRow[];
  stats: CreditsStats;
  emprunteurs: EmprunteurOption[];
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<CreditRow | null>(null);
  const [preselection, setPreselection] = useState<number | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<EmprunteurCreditRow | null>(null);

  const [paiementOpen, setPaiementOpen] = useState(false);
  const [paiementCible, setPaiementCible] = useState<EmprunteurCreditRow | null>(null);

  const statCards = buildCreditsStats(stats);

  const handleSearch = (v: string) => { setSearch(v); setCurrentPage(1); };
  const handleFilter = (v: string) => { setFilter(v); setCurrentPage(1); };

  const openDetail   = (c: EmprunteurCreditRow) => { setDetail(c); setDetailOpen(true); };
  const openPaiement = (c: EmprunteurCreditRow) => { setPaiementCible(c); setPaiementOpen(true); };

  const openNew = () => { setSelected(null); setPreselection(null); setFormOpen(true); };

  const openNouveauCreditPour = (c: EmprunteurCreditRow) => {
    setSelected(null);
    setPreselection(c.emprunteurId);
    setFormOpen(true);
  };

  const openEditCredit = (c: CreditRow) => {
    setDetailOpen(false);
    setSelected(c);
    setPreselection(null);
    setFormOpen(true);
  };

  const openNouveauCreditDepuisDetail = () => {
    if (detail) setPreselection(detail.emprunteurId);
    setDetailOpen(false);
    setSelected(null);
    setFormOpen(true);
  };

  const handleDeleteCredit = async (c: CreditRow) => {
    if (!confirm(`Supprimer ce crédit de ${c.emprunteurNom} (${c.date}) ?`)) return;
    await deleteCredit(c.id);
    setDetailOpen(false);
  };

  const handleAnnulerPaiement = async (emprunteurId: number) => {
    if (!confirm("Annuler le dernier paiement de ce client ? Le montant sera retiré.")) return;
    await annulerDernierPaiement(emprunteurId);
    setDetailOpen(false);
  };

  const filtered = credits.filter((c) => {
    const matchSearch = c.emprunteurNom.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Tous" || statutCreditLabel[c.statutGlobal] === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="px-4 md:px-6 py-5 space-y-5 max-w-7xl mx-auto">
        <StatsCards stats={statCards} />

        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Rechercher un client..."
          filters={STATUTS_CREDIT}
          activeFilter={filter}
          onFilterChange={handleFilter}
          onNew={openNew}
          newLabel="Nouveau crédit"
        />

        {/* Desktop */}
        <div className="hidden md:block bg-white rounded-2xl border overflow-hidden">
          <CreditsTable
            emprunteurs={paginated}
            onDetail={openDetail}
            onPaiement={openPaiement}
            onNouveauCreditPour={openNouveauCreditPour}
          />
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">Aucun crédit trouvé</div>
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
          <CreditsCards
            emprunteurs={paginated}
            onDetail={openDetail}
            onPaiement={openPaiement}
            onNouveauCreditPour={openNouveauCreditPour}
          />
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm bg-white rounded-2xl border">Aucun crédit trouvé</div>
          )}
          <MobilePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      <CreditFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        credit={selected}
        emprunteurs={emprunteurs}
        emprunteurPreselection={preselection}
      />
      <CreditDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        emprunteur={detail}
        onEditCredit={openEditCredit}
        onDeleteCredit={handleDeleteCredit}
        onNouveauCredit={openNouveauCreditDepuisDetail}
        onAnnulerDernierPaiement={handleAnnulerPaiement}
      />
      <PaiementDialog open={paiementOpen} onOpenChange={setPaiementOpen} emprunteur={paiementCible} />
    </div>
  );
}